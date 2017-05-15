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
        Customer = FFA.namespace('Customer'),
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

        var inputInfoContainer = $("#inputInfoContainer");
        var inputInfoTemplate = _.template($('#inputTemplate').html(), {variable: 'data'});

        var chooseInfoContainer = $("#chooseInfoContainer");
        var pageHeight = window.screen.availHeight,
            headerHeight = $(".header").height(),
            divHeight = pageHeight - headerHeight;

        chooseInfoContainer.css("height",divHeight + 'px');
        inputInfoContainer.css("height",divHeight + 'px');

        var chooseInfoTemplate = _.template($('#chooseInfoTemplate').html(), {variable: 'chooseData'});

        /**
         * 获取输入框页面的数据，并打印到页面模板
         * */
        var getPageInputJson = function (i) {
            $.getJSON('../../js/json/customerInputData.json', function (data) {
                var inputInfoBuffer = '';//数据缓存字符串 避免单条打印影响渲染速度，输入框
                inputInfoBuffer += inputInfoTemplate(data[i]);
                inputInfoContainer.html(inputInfoBuffer);

                //console.log('inputInfoBuffer' + inputInfoBuffer);

                // 初始化input组件
                Components.emptiableInput.init($(".js-emptiableinput-wrapper", inputInfoContainer));
            });


        }

        /**
         * 获取选择框页面的数据，并打印到页面模板
         * */
        var getPageChooseJson = function (i) {
            $.getJSON('../../js/json/customerChooseData.json', function (data) {
                var chooseInfoBuffer = '';//数据缓存字符串 避免单条打印影响渲染速度，选择框
                chooseInfoBuffer += chooseInfoTemplate(data[i]);
                chooseInfoContainer.html(chooseInfoBuffer);
            });
        }

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



//        tabBtns.on('tap', function (event) {
//            var event = event || window.event;
//            Utils.stopEvent(event);
//            if (swipe.getPos() !== $(this).index())
//                swipe.next();
//        });
        $(document).on('tap', ".js-record", function (event) {
            var phoneNumber = $(this).data('phonenumber');
            var inputtime = $(this).data('inputtime');
            var content = $(this).data('content');
            var category = $(this).data('category');
            var createTime = $(this).data('createtime');
            console.log("createTime"+createTime);
            sessionStorage.setItem("customerIndex", 2);//默认设置第二个页面
            window.location.href = "checkRecord.html?phonenumber=" + phoneNumber +"&createTime=" + createTime + "&inputtime=" + inputtime + "&content=" + content + "&category=" + category;
        });
        /**
         * 获取phonenumber
         * */
        var phonenumber = Utils.urlArgs()['phonenumber'];
        if (!phonenumber) {
            backFlag = true;
            alert = Components.Popup.Alert('A', {
                content: "电话号码获取失败",  //显示内容
                withMask: 'A'   //蒙层类型
            });
        }


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
            $.when(customerDetailController.queryCustomerDetail(phonenumber))
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
            if ($(".js-customerInfo").hasClass('modify') || backFlag) {
              //  var cusCount = get("team-customer-count") || '';
                if (get(user_level_flag) == team_level_flag) {
                    window.location.href = '../team/customer.html';
                } else {
                    window.location.href = '../frame.html';
                }
             //   history.back();

            }else{
                $(".js-customerInfo").addClass('modify').siblings().removeClass('modify');
                $("#title").text(localStorage.getItem("customerPageTitle"));
            }
        }

        //返回
        $(".js-back").on("click", back);
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

        $("#id-input").trigger("focus");

        /**
         * 判断输入框是否只是数字，不支持小数点
         * */
        var inputJudgment = function (minValue, maxValue) {
            var inputObj = $("#id-input");
            var val = inputObj.val();
            if (!/^[1-9]\d?\d*$/.test(val)) {
                var inputString = /^[1-9]\d?\d*/.exec(inputObj.val());
                inputObj.val(inputString);
            }
            if (inputObj.val()) {
                if (parseFloat(inputObj.val()) > maxValue) {
                    inputObj.val(maxValue);
                } else if (parseFloat(inputObj.val()) < minValue) {
                    inputObj.val(minValue);
                }
            }
        }

        /**
         * 判断输入框是否只是数字，且支持小数点后一位
         * */
        var inputJudgmentWithDot = function (minValue, maxValue) {
            var inputObj = $("#id-input");
            var val = inputObj.val();
            if (!/^[1-9]\d*[.]?\d*$/.test(val)) {
                var inputString = /^[1-9]\d*[.]?\d*/.exec(inputObj.val());
                inputObj.val(inputString);
            }
            var sp = inputObj.val();
            if (sp) {
                var inputArray = sp.split('.');
                if (inputArray.length > 1) {
                    var number = inputArray[1];
                    if (number.length > 1) {
                        sp = inputArray[0] + "." + number.substr(0, 1);
                        inputObj.val(sp);
                    }
                }
            }
            if (inputObj.val()) {
                if (parseFloat(inputObj.val()) > maxValue) {
                    inputObj.val(maxValue);
                } else if (parseFloat(inputObj.val()) < minValue) {
                    inputObj.val(minValue);
                }
            }
        }

        /**
         * 页面切换
         * */
        $(document).on("click", ".js-modifiable", function (event) {
            console.log('page change');
            var evt = event || window.event,
                that = this;
            var occupyFlag = document.getElementById("idNumber").innerHTML;
            var divs = $(".customerDetailFrame > div");
            if (that.id === 'reName') {
                getPageInputJson(0);
                var name = localStorage.getItem("customerPageTitle");

                divs.removeClass("modify");
             //   inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');

                //inputInfoContainer.addClass('modify').siblings().removeClass('modify');
                $("#title").text('姓名');
                setTimeout(function () {
                    $("#id-input").val(name);
                }, 200);
            } else if (that.id === 'reRemarks') {
                getPageInputJson(1);
                var remark = localStorage.getItem("remarks");
              //  $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                divs.removeClass("modify");
               // inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
                $("#title").text('备注');
                if(remark && (remark != null || remark != "null")){
                    setTimeout(function () {
                        $("#id-input").val(remark);
                    }, 200);
                }
            } else if (that.id === 'reGender') {
                getPageChooseJson(0);
            //    $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                divs.removeClass("modify");
                //chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
                $("#title").text('性别');
            } else if (evt.target.id === 'rephone' || evt.target.parentNode.id === 'rephone') {
                getPageInputJson(2);
                divs.removeClass("modify");
               // inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
             //   $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('手机号');
            } else if (that.id === 'reIdNumber' && occupyFlag === '') {
                console.log('reIdNumber exit');
                getPageInputJson(3);
                divs.removeClass("modify");
               // inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
           //     $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('占坑');
            } else if (that.id === 'fundDemand') {
                getPageInputJson(4);
                divs.removeClass("modify");
               // inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
               // $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('资金需求');
                console.log("max length----"+123456);
                $(document).on('input', ".js-fundDemandClass", function () {
                    inputJudgment(1, 9999);
                });
            } else if (that.id === 'carHouseGarage') {
                getPageChooseJson(1);
                divs.removeClass("modify");
                //chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
               // $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('车房情况');
            } else if (that.id === 'jobType') {
                getPageChooseJson(2);
                divs.removeClass("modify");
                //chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
             //   $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('职业类型');
            } else if (that.id === 'payrollInfo') {
                getPageChooseJson(3);
                divs.removeClass("modify");
               // chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
            //    $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('工资发放形式');
            } else if (that.id === 'intentProduct') {
                getPageChooseJson(4);
                divs.removeClass("modify");
              //  chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
              //  $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('意向产品');
            } else if (that.id === 'paymentTime') {
                getPageChooseJson(5);
                divs.removeClass("modify");
               // chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
              //  $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('用款时间');
            } else if (that.id === 'isLoans') {
                getPageChooseJson(6);
                divs.removeClass("modify");
               // chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
           //     $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('是否办理过贷款');
            } else if (that.id === 'isCreditCard') {
                getPageChooseJson(7);
                divs.removeClass("modify");
                //chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
               // $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('是否有信用卡');
            } else if (that.id === 'carAppraisal') {
                getPageInputJson(5);
                divs.removeClass("modify");
               // inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');

              //  $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('车辆自估价');
                $(document).on('input', ".js-carAppraisalClass", function () {
                    inputJudgmentWithDot(1, 9999);
                });
            } else if (that.id === 'isMortgageCar') {
                getPageChooseJson(8);
                divs.removeClass("modify");
               // chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
              //  $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('是否接受押车');
            } else if (that.id === 'houseAppraisal') {
                getPageInputJson(6);
                divs.removeClass("modify");
              //  inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
              //  $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('房屋自估价');
                $(document).on('input', ".js-houseAppraisalClass", function () {
                    inputJudgmentWithDot(1, 99999);
                });
            } else if (that.id === 'houseMortgage') {
                getPageChooseJson(9);

                divs.removeClass("modify");
               // chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
             //   $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('房屋抵押情况');
            } else if (that.id === 'firstLoanAmount') {
                getPageInputJson(7);

                divs.removeClass("modify");
              //  inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');

              //  $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('一抵贷款金额');
                $(document).on('input', ".js-firstLoanAmountClass", function () {
                    inputJudgmentWithDot(1, 99999);
                });
            } else if (that.id === 'creditCardLimit') {
                getPageInputJson(8);
                divs.removeClass("modify");
                //inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
              //  $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('信用卡额度');
                console.log("jjjjjj");
                $(document).on('input', ".js-creditCardLimitClass", function () {
                    inputJudgment(1, 99999);
                });
            } else if (that.id === 'isMarried') {
                getPageChooseJson(10);

                divs.removeClass("modify");
              //  chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
               // $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('是否已婚');
            } else if (that.id === 'isHaveChildren') {
                getPageChooseJson(11);

                divs.removeClass("modify");
               // chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
               // $("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('是否有孩子');
            } else if (that.id === 'cusAge') {
                getPageInputJson(9);
                divs.removeClass("modify");
               // inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
             //   $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('年龄');
                $(document).on('input', ".js-cusAgeClass", function () {
                    inputJudgment(1, 99);
                });
            } else if (that.id === 'annualIncome') {
                getPageInputJson(10);
                divs.removeClass("modify");
              //  inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
               // $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('年收入');
                $(document).on('input', ".js-annualIncomeClass", function () {
                    inputJudgment(1, 9999);
                });
            } else if (that.id === 'acptMonPayment') {
                getPageInputJson(11);
                divs.removeClass("modify");
              //  inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
               // $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('可接受月还款');
                $(document).on('input', ".js-acptMonPaymentClass", function () {
                    inputJudgment(1, 99999);
                });
            } else if (that.id === 'cusEducation') {
                getPageChooseJson(12);
                divs.removeClass("modify");
             //   chooseInfoContainer.siblings().removeClass('modify');
                chooseInfoContainer.addClass('modify');
                //$("#chooseInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('学历');
            } else if (that.id === 'position') {
                getPageInputJson(12);
                divs.removeClass("modify");
               // inputInfoContainer.siblings().removeClass('modify');
                inputInfoContainer.addClass('modify');
              //  $("#inputInfoContainer").addClass('modify').siblings().removeClass('modify');
                $("#title").text('城市');
            }
        });

        /**
         * 输入框模板页的输入框清空
         * */
        //inputInfoContainer.on('input', '.js-emptiableinput-wrapper', function () {
        //    var len = $("#id-input").val().length;
        //    if (len > 0) {
        //        $(this).removeClass("empty");
        //    } else {
        //        $(this).addClass("empty");
        //    }
        //});
        ////点击叉号事件处理
        //inputInfoContainer.on('click', 'span', function (evt) {
        //    evt = evt || window.event;
        //    var target = evt.target,
        //        parent = target.parentNode,
        //        input = target.previousElementSibling;
        //    $(parent).addClass('empty');
        //    $(input).val('');
        //});

        /**
         * 通话确认弹出框
         * */
        var callNumber;     //保存要打的电话
        $(document).on("click", ".js-callbtn", function () {
            callNumber = $(this).children('span').text();
            console.log(callNumber);
            confirm = Components.Popup.Confirm('A', {
                content: '呼叫' + localStorage.getItem("customerPageTitle") + '?',  //显示内容
                withMask: 'A'   //蒙层类型
            }, function () {
                console.log('打电话取消');
            }, function () {
                location.href = 'tel:' + callNumber;	//调用打电话功能
                var commtionTime = new Date().getTime().toString();
                customerDetailController.updateCommtionTime(commtionTime)
                    .done(function () {
                        customerDetails();
                    })
                    .fail();
            });
        });

        /**
         * 删除联系人弹窗
         * */
        var initDelPopWindow = (function () {
            var deleteCustomerForm,
                rightButton;
            return function () {
                confirm = Components.Popup.Confirm('B', {
                    content: $("#deleteCustomerPopupContent").html(),  //显示内容
                    withMask: 'A'   //蒙层类型
                }, function () {
                    console.log('删除取消');
                    rightButton && rightButton.removeAttribute("disabled");

                }, function () {
                    console.log('删除确认');
                    rightButton && rightButton.removeAttribute("disabled");
                    var reason = "";
                    for(var i = 0; i < deleteCustomerForm.deleteReason.length; i++){
                        if(deleteCustomerForm.deleteReason[i].checked){
                            reason = deleteCustomerForm.deleteReason[i].value;
                        }
                    }

                    if (reason === "other") {
                        reason = deleteCustomerForm.otherReason.value;
                    }
                    customerDetailController.deleteCustomer(reason)
                        .done(function (errCode, data) {
                            if (!errCode) {
                                back();
                            } else {
                                //popup.hideDelPopup();
                                alert = Components.Popup.Alert('A', {
                                    content: data.msgInfo,  //显示内容
                                    withMask: 'A'   //蒙层类型
                                });
                            }
                        })
                        .fail(function () {
                            //popup.hideDelPopup();
                            alert = Components.Popup.Alert('A', {
                                content: strings.del_customer_err,  //显示内容
                                withMask: 'A'   //蒙层类型
                            });
                        });
                });

                if (!(deleteCustomerForm && rightButton)) {
                    deleteCustomerForm = document.deleteCustomerForm;
                    rightButton = confirm.rightButton;

                    //TODO 加JS才能实现？ 默认点击事件和阻止幽灵点击方法冲突 二选其一
                    $(document).on("change", "[name=deleteReason]", function () {
                        rightButton.removeAttribute("disabled");
                    });

                    $(document).on("focus", ".js-otherReasonInput", function () {
                        rightButton.removeAttribute("disabled");
                        this.previousElementSibling.previousElementSibling.click();
                    });
                }
            };

        })();

        /**
         * 删除客户和点击查询
         * */
        customerInfoContainer.on('click', '#delbtn', function () {
            console.log("delete customer");
            initDelPopWindow();
        });

        customerInfoContainer.on('click', '#querybtn', function () {
            console.log("delete query");
            customerDetailController.queryProgress(phonenumber)
                .done(function (code, data) {
                    //查询成功
                    var stateObj = Customer.controller.processStateData(data);
                    _(stateObj).mapObject(function () {
                        sessionStorage.setItem(arguments[1], arguments[0]);
                    });
                    console.log("code="+code);
                    switch (code) {
                        case 1:
                            // 弹框，不跳转
                            alert = Components.Popup.Alert('A', {
                                content: data.msgInfo,  //显示内容
                                withMask: 'A' //蒙层类型
                            }, function () {
                               // customerDetailController.toState();
                            }.bind(this));
                            break;
                        case 2:
                            //不弹框 跳转,弹toast
                            customerDetailController.toState(data.msgInfo);
                            break;
                        case 3:
                            //不弹框 跳转
                            customerDetailController.toState();
                            break;
                    }
                })
                .fail(function (code, data) {
                    //查询失败
                    var msg = code == 1 ? data.msgInfo : '请求失败！';
                    alert = Components.Popup.Alert('A', {
                        //content: data.msgInfo,  //显示内容
                        content: msg,
                        withMask: 'A' //蒙层类型
                    }, function () {

                    }.bind(this));

                });
        });


        /**
         * 提交逻辑
         */
        var sub = function (event) {
            var resolveFun = function (code, data) {

                console.log("code:--------" + code);

                if (!code) {
                    console.log(data.msgInfo);
                    back();
                    customerDetails();
                } else {
                    alert = Components.Popup.Alert('A', {
                        content: data.msgInfo,  //显示内容
                        withMask: 'A'   //蒙层类型
                    }, function () {
                        back();
                        customerDetails();
                    });
                }
            };

            var rejectFun = function (errMsg) {
                alert = Components.Popup.Alert('A', {
                    content: errMsg + '!',  //显示内容
                    withMask: 'A'   //蒙层类型
                });
            };

            var val;
            if (inputInfoContainer.hasClass('modify')) {
                //提交输入框模板页面的修改内容
                var changePageTitle = $("#title").html();//获取页面title
                console.log("修改信息的页面title:   " + changePageTitle);
                val = $("#inputInfoContainer").find('#id-input').val();
                console.log("input value" + val);
                if (val === '') {
                    alert = Components.Popup.Alert('A', {
                        content: '输入不能为空!',  //显示内容
                        withMask: 'A'   //蒙层类型
                    });
                    return;
                }
                var changeFieldName;
                if (changePageTitle === '姓名') {
                    changeFieldName = "cusName";
                } else if (changePageTitle === '备注') {
                    changeFieldName = "remarks";
                } else if (changePageTitle === '手机号') {
                    changeFieldName = "phonenumber";
                } else if (changePageTitle === '占坑') {
                    changeFieldName = "idnumber";
                } else if (changePageTitle === '资金需求') {
                    changeFieldName = "fundDemand";
                } else if (changePageTitle === '车辆自估价') {
                    changeFieldName = "carAppraisal";
                    more_flag = true;
                } else if (changePageTitle === '房屋自估价') {
                    changeFieldName = "houseAppraisal";
                    more_flag = true;
                } else if (changePageTitle === '一抵贷款金额') {
                    changeFieldName = "firstLoanAmount";
                    more_flag = true;
                } else if (changePageTitle === '信用卡额度') {
                    changeFieldName = "creditCardLimit";
                    more_flag = true;
                } else if (changePageTitle === '年龄') {
                    changeFieldName = "cusAge";
                    more_flag = true;
                } else if (changePageTitle === '年收入') {
                    changeFieldName = "annualIncome";
                    more_flag = true;
                } else if (changePageTitle === '可接受月还款') {
                    changeFieldName = "acptMonPayment";
                    more_flag = true;
                } else if (changePageTitle === '城市') {
                    changeFieldName = "position";
                    more_flag = true;
                }
                console.log("修改信息的页面title222222:   " + changePageTitle);
                console.log("修改的信息名称:   " + changeFieldName);

                if (changeFieldName === "phonenumber") {
                    //添加手机号
                    val = $('#id-input').val().trim();
                    if (val === '') {
                        alert = Components.Popup.Alert('A', {
                            content: '电话号码不能为空!',  //显示内容
                            //button: 'Confirm',   //按钮内容
                            withMask: 'A'   //蒙层类型
                        });
                        return;
                    } else if (!isMobile(val)) {
                        alert = Components.Popup.Alert('A', {
                            content: '电话号码格式错误!',  //显示内容
                            withMask: 'A'   //蒙层类型
                        });
                        return;
                    }
                    $.when(customerDetailController.addPhone(val))
                        .done(resolveFun)
                        .fail(function (code, e) {
                            rejectFun(strings.add_phone_err);
                        });
                } else if (changeFieldName === "idnumber") {
                    //占坑
                    val = $('#id-input').val().trim();
                    var idCard = new Utils.IDCard(val);
                    //身份证校验
                    if (val === '') {
                        alert = Components.Popup.Alert('A', {
                            content: '身份证号码不能为空!',  //显示内容
                            withMask: 'A'   //蒙层类型
                        });
                        return;
                    } else if (!idCard.IsValid()) {
                        $('.js-cdetail-tip-id').addClass('red').html(getString('id_card_err'));
                        return;
                    }
                    $.when(customerDetailController.occupyCustomer(val))
                        .done(function (code, data) {
                            alert = Components.Popup.Alert('A', {
                                content: data.msgInfo,  //显示内容
                                withMask: 'A'   //蒙层类型
                            }, function () {
                                back();
                                customerDetails();
                            });
                        })
                        .fail(function (code, e) {
                            rejectFun(strings.modify_id_err);
                        });
                } else {
                    $.when(customerDetailController.updateInfo(changeFieldName, val))
                        .done(resolveFun)
                        .fail(function (errCode, data) {
                            rejectFun(strings.modify_err);
                        });
                }
            }
        };
        //提交
        inputInfoContainer.on('tap', '.js-customer-sub-btn', sub);


        //选择列表提交修改

        chooseInfoContainer.on('tap', 'li', function () {

            $(this).addClass('checked').siblings().removeClass('checked');
            var fieldName = [];
            //修改性别
            var value = this.dataset.gender;
            var chooseValue = [];
            var choosePageTitle = $("#title").html();//获取页面title
            console.log("选择页面标题:........" + choosePageTitle);
            if (choosePageTitle === '性别') {
                fieldName = "gender";
                chooseValue = value;
            } else if (choosePageTitle === '车房情况') {
                fieldName[0] = "houseGarage";
                fieldName[1] = "carGarage";
                if (value === "01") {//有车有房
                    chooseValue[0] = "01";
                    chooseValue[1] = "01";
                } else if (value === "02") {//有车
                    chooseValue[0] = "02";
                    chooseValue[1] = "01";
                } else if (value === "03") {//有房
                    chooseValue[0] = "01";
                    chooseValue[1] = "02";
                } else if (value === "04") {//无房无车
                    chooseValue[0] = "02";
                    chooseValue[1] = "02";
                } else {
                    chooseValue[0] = "";
                    chooseValue[1] = "";
                }
            } else if (choosePageTitle === '职业类型') {
                fieldName = "jobType";
                chooseValue = value;
            } else if (choosePageTitle === '工资发放形式') {
                fieldName = "payrollInfo";
                chooseValue = value;
            } else if (choosePageTitle === '意向产品') {
                fieldName = "intentProduct";
                chooseValue = value;
            } else if (choosePageTitle === '用款时间') {
                fieldName = "paymentTime";
                chooseValue = value;
            } else if (choosePageTitle === '是否办理过贷款') {
                fieldName = "isLoans";
                chooseValue = value;
            } else if (choosePageTitle === '是否有信用卡') {
                fieldName = "isCreditCard";
                chooseValue = value;
            } else if (choosePageTitle === '是否接受押车') {
                fieldName = "isMortgageCar";
                chooseValue = value;
                more_flag = true;
            } else if (choosePageTitle === '房屋抵押情况') {
                fieldName = "houseMortgage";
                chooseValue = value;
                more_flag = true;
            } else if (choosePageTitle === '是否已婚') {
                fieldName = "isMarried";
                chooseValue = value;
                more_flag = true;
            } else if (choosePageTitle === '是否有孩子') {
                fieldName = "isHaveChildren";
                chooseValue = value;
                more_flag = true;
            } else if (choosePageTitle === '学历') {
                fieldName = "cusEducation";
                chooseValue = value;
                more_flag = true;
            }

            console.log("选择页面修改的FieldName:......" + fieldName);
            console.log("选择列表的值:........" + value);
            customerDetailController.updateInfo(fieldName, chooseValue)
                .done(function () {
                    back();
                    customerDetails();
                })
                .fail(function () {
                    alert = Components.Popup.Alert('A', {
                        content: '修改失败!',  //显示内容
                        withMask: 'A'   //蒙层类型
                    });
                });
        });

        $("#record-add").on("click", function () {
            window.location.href = "nfRecord.html?phonenumber=" + Utils.urlArgs()['phonenumber'];
        });
    });
})(FFA);