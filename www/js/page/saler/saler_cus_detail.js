/**
 * Created by 201504095248 on 2015/12/4.
 */
//页面跳转太快时会触发下一个页面相同位置上的点击事件
//暂用详情页测试
/*(function () {
    var lastClickTime = new Date().getTime();
    var clickTime;
    document.addEventListener('click', function (e) {
        clickTime = e['timeStamp'];
        if (clickTime && (clickTime - lastClickTime) < 500) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
        //lastClickTime = clickTime;
    }, true);
})();*/

$(function () {
    FastClick.attach(document.body);

});

;
(function (FFA) {
    var Components = FFA.namespace('Components'),
        SalerCustomer = FFA.namespace('SalerCustomer'),
        Utils = FFA.namespace("Utils"),
        confirm = null,
        loading = null,
        alert = null;
    var more_flag = false,
        more_btn_click_flag = false;

    //ajax请求前触发loading
    $(document).on('ajaxBeforeSend', function (e, xhr, options) {
        //不想触发loading的请求在这里过滤
        if(!options.url.match('json') || !options.url.match('getCustList')){
        		loading = Components.Popup.Loading('A', {
                //withMask: 'A'   //蒙层类型
            });
        }
    });

    $(document).on('ajaxComplete', function (e, xhr, options) {
        if (loading) {
            loading.remove();
        }
    });

    $(document).on('ajaxSuccess', function (e, xhr, options) {
        if (loading){
            loading.remove();
        }
    });

    $(document).on('ajaxError', function (e, xhr, options) {
        if (loading){
            loading.remove();
        }
        
    });



    $(function () {
        var backFlag = false;

        var customerInfoBuffer = ''; //数据缓存字符串 避免单条打印影响渲染速度,客户基本资料
        var customerInfoContainer = $("#customerInfoContainer");
        var customerInfoTemplate = _.template($('#customerInfoContent').html(), {variable: 'customerData'});

        var customerDetailInfoBuffer = '';//数据缓存字符串 避免单条打印影响渲染速度，客户详细资料
        var customerDetailInfoContainer = $("#customerDetailInfoContainer");
        var customerDetailInfoTemplate = _.template($('#customerDetailInfoContent').html(), {variable: 'customerDetailData'});

        var customerRecordBuffer = '';//数据缓存字符串 避免单条打印影响渲染速度，跟踪记录
        var customerRecordContainer = $("#customerRecordUl");
        var customerRecordTemplate = _.template($('#customerRecordContent').html(), {variable: 'customerRecordData'});


        var pageHeight = window.screen.availHeight,
            headerHeight = $(".header").height(),
            divHeight = pageHeight - headerHeight;

        /**
         * 滑动页面
         * */
        var tabBtns = $(".js-tab-btn");
        var swipeIndex = parseInt(sessionStorage.getItem("customerIndex")) || 0;
        tabBtns.eq(swipeIndex).addClass("actived");

        var swipe = Swipe(document.getElementById('swipe-container'), {
            bounce: false,
            continuous: false,
            callback: function (index, elem) {
                tabBtns.removeClass("actived").eq(index).addClass("actived");
                sessionStorage.setItem("customerIndex", index);
            }
        });

        if (swipeIndex) {
            swipe.slide(swipeIndex);
            $("#swipe-container").css("opacity","0");
            setTimeout(function(){
                $("#swipe-container").css("opacity","1");
            },300);
        }


        tabBtns.on('tap', function (event) {
            var index = parseInt($(this).index());
            swipe.slide(index);
            sessionStorage.setItem("customerIndex", index);

            var event = event || window.event;
            Utils.stopEvent(event);
            if (swipe.getPos() !== index)
                swipe.next();
        });



        //$(document).on('tap', ".js-record", function (event) {
        //    var phoneNumber = $(this).data('phonenumber');
        //    var inputtime = $(this).data('inputtime');
        //    var content = $(this).data('content');
        //    var category = $(this).data('category');
        //    var createTime = $(this).data('createtime');
        //    console.log("createTime"+createTime);
        //    sessionStorage.setItem("customerIndex", 2);//默认设置第二个页面
        //    window.location.href = "checkRecord.html?phonenumber=" + phoneNumber +"&createTime=" + createTime + "&inputtime=" + inputtime + "&content=" + content + "&category=" + category;
        //});
        /**
         * 获取phonenumber
         * */
        var args = Utils.urlArgs();
        var phonenumber = args['phonenumber'];
        if (!phonenumber) {
            backFlag = true;
            alert = Components.Popup.Alert('A', {
                content: "电话号码获取失败",  //显示内容
                withMask: 'A'   //蒙层类型
            });
        }

        /**
         * 获取managerId
         * */
       // var managerId =args['managerId'];
       // console.log(managerId);
        var managerId = get("customer-sublevel-managerId") || '';
        var cusCount = get("customer-sublevel-cusCount");

        /**
         * 查询客户详情
         */
        var customerDetails = function () {
            /**
             * 获取客户的信息
             */
            customerInfoContainer.empty();
            customerDetailInfoContainer.empty();
            customerRecordContainer.empty();
            customerInfoBuffer = '';
            customerDetailInfoBuffer = '';
            customerRecordBuffer = '';
            $.when(salerCustomerDetailController.queryCustomerDetail(phonenumber, managerId))
                .done(function (code, data) {
                    var customerInfo = data.customerApply;
                    var phoneNumberList = data.phonenumberList;     //电话列表
                    var recordList = data.followrecordList;         //跟进记录列表

                    /*客户基本信息*/
                    customerInfoBuffer += customerInfoTemplate(customerInfo);
                    customerInfoContainer.append(customerInfoBuffer);

                    /*客户详情信息*/
                    customerDetailInfoBuffer += customerDetailInfoTemplate(customerInfo);
                    customerDetailInfoContainer.append(customerDetailInfoBuffer);
                    if(more_flag || more_btn_click_flag){
                        showMoreInfo();
                    }

                    /*客户跟进记录*/
                    if(recordList && recordList.length > 0){
                        $("#customerRecordUl").css("display","block");
                        for (var recordIndex in recordList) {
                            var record = recordList[recordIndex];
                            customerRecordBuffer += customerRecordTemplate(record);
                        }
                        customerRecordContainer.append(customerRecordBuffer);
                    }else{
                        $("#customerRecordUl").css("display","none");
                    }

                    /**
                     * 添加手机号
                     * */
                    //重置电话列表
                    var phoneList = $(".js-modifiable.js-phonenumber");
                    phoneList.siblings('.js-phonenumber').remove();

                    var i;
                    //电话展示
                    if (phoneNumberList && phoneNumberList.length > 0) {
                        var phoneListArr = [];      //存放所有电话号码

                        //放入第一个加入的号码
                        phoneListArr.push(phoneNumberList[0].firstPhone);

                        //将号码存入phoneListArr
                        for (i = 0; i < phoneNumberList.length; i++) {
                            phoneListArr.push(phoneNumberList[i].newPhone); //保存
                        }

                        var length = phoneListArr.length;    //电话数量

                        //如果数量大于10 电话不可添加
                        if (length >= 10) {
                            var rephone = $('#rephone');
                            rephone.siblings('.icon-arrow').eq(0).remove();
                            rephone.remove();
                        }

                        //先放入最后一只手机号
                        $('.js-label').text('手机' + length);    //label
                        $('.js-phone').text(phoneListArr[length - 1]); //电话号码

                        //循环添加第一只手机号码
                        for (i = phoneListArr.length - 2; i >= 0; i--) { //遍历数组打印电话
                            $('.js-phonenumber:first').before(
                                '<li class="js-phonenumber top-border phone-item">' +
                                '<span class="block-left block-left-width">' +
                                '<label class="js-label">手机' + (i + 1) + '</label>' +
                                '</span>' +
                                '<span class="float-middle js-callbtn callbtn">' +
                                '<span>' + phoneListArr[i] + '</span>' +
                                '<span class="icon icon-tel"></span>' +
                                ' </span>' +
                                '</li>');
                        }
                    } else {
                        $('.js-phone').text(customerInfo.phonenumber);	//客户电话号码
                    }

                    var customerTile = customerInfo.cusName;
                    localStorage.setItem("customerPageTitle", customerInfo.cusName);
                    localStorage.setItem("remarks", customerInfo.remarks ? customerInfo.remarks : '');
                    console.log("cache remarks = " + customerInfo.remarks);
                    console.log("customer name" + customerTile);
                    $("#title").text(customerTile);
                })
                .fail(function (c, d) {
                    console.log('customerInfo' + c);
                    console.log('customerInfo' + d);
                });
        }

        /**
         * 返回逻辑
         */
        function back() {
            sessionStorage.setItem("customerIndex", 0); // 重置tab的index
            //强制关闭键盘
            cordova.plugins.Keyboard.close();
           // window.location.href = '../team/salerCustomer.html?cuscount='+cusCount+"&managerid="+managerId;
            history.back();
        }
        $(".js-back-saler").on("click", back);


        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            console.log("onDeviceRead");
            customerDetails();
            document.addEventListener("backbutton", back, false);
        }

        /**
         * 点击更多，显示更多信息
         * */
        $(document).on("click", ".js-more-btn", function () {
            more_btn_click_flag = true;
            $(".js-customer-detail-info li").removeClass("displayNone");
            $(".js-more-btn").hide();
        });

        /**
         * 如果修改更多里面的信息，拉取客户详情后调用此方法，将所有内容显示出来
         * */
        var showMoreInfo = function(){
            $(".js-customer-detail-info li").removeClass("displayNone");
            $(".js-more-btn").hide();
        }



    });
})(FFA);