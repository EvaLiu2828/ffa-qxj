/**
 * Created by apple on 16/10/26.
 */
// 防止穿透
$(function () {
    FastClick.attach(document.body);
});
(function (FFA){
    var Components = FFA.namespace('Components'),
        QiangCustomer = FFA.namespace('QiangCustomer'),

        Utils = FFA.namespace("Utils"),
        confirm = null,
        loading = null,
        alert = null;
    var CusBaseInfoContainer,
        CreditContainer;

    $(function () {
        /**
         * 获取phonenumber
         * */
        var nicheId = Utils.urlArgs()['nicheId'];
        var cusPrice = localStorage.getItem("cusPrice");
        console.log(cusPrice);
        if (!nicheId) {
            backFlag = true;
            alert = Components.Popup.Alert('A', {
                content: "单号获取失败",  //显示内容
                withMask: 'A'   //蒙层类型
            });
        } else {
            customerDetails();
        }

        /**
         * 查询客户详情
         */
        function customerDetails() {
            var params ={};
            $('.cus-info-list').css('display','none');       //容器先不显示
            qiangCusService.getQCustomerInfo(params,
                function(data){
                    console.log(data.data);

                    if(data.codeInfo == '0'){

                        var cusApply = data.data;  //基本信息
                        if(cusApply.nicheAttr != undefined){
                            var CustomerBaseInfo = cusApply.nicheAttr.customerBaseInfo;
                            var CreditCertificate = cusApply.nicheAttr.creditCertificate;

                            $('.cus-info-list').css('display','block');     //容器显示

                            $("#title").text(cusApply.customerName);

                            var buffer = "";
                            //简析
                            var qcusInfoContainer = $("#customerInfoContainer");
                            var qcusInfoContent = $('#customerInfoContent').html();
                            var customerInfoTemplate = _.template(qcusInfoContent, {variable: 'cusApply'});
                            buffer = customerInfoTemplate(cusApply);

                            //客户基本信息
                            var cusBaseInfoBuffer = '';
                            CusBaseInfoContainer = $("#customer-base-info");
                            var cusBaseTempStr = $('#customerBaseInfo').html();
                            if(cusBaseTempStr){
                                var cusBaseInfoListTmpl = _.template(cusBaseTempStr, {variable: 'CustomerBaseInfo'});
                            }
                            if(CustomerBaseInfo.length != 0){
                                for (var i = 0, l = CustomerBaseInfo.length; i < l; i++) {
                                    cusBaseInfoBuffer += cusBaseInfoListTmpl(CustomerBaseInfo[i]);
                                }
                            } else {
                                $('.base_info').css('display','none');
                            }
                            //资质
                            var creditBuffer = '';
                            CreditContainer = $("#credit-certificate");
                            var creditTempStr = $('#creditCertificate').html();
                            if(creditTempStr){
                                var creditListTmpl = _.template(creditTempStr, {variable: 'CreditCertificate'});
                            }
                            if(CreditCertificate.length != 0){
                                for (var i = 0, l = CreditCertificate.length; i < l; i++) {
                                    creditBuffer += creditListTmpl(CreditCertificate[i]);
                                }
                            } else {
                                $('.certificate').css('display','none');
                            }
                            qcusInfoContainer.append(buffer);                   //简析
                            CusBaseInfoContainer.append(cusBaseInfoBuffer);     //客户基本信息
                            CreditContainer.append(creditBuffer);               //资质

                            // var _cusInfoSwipe = $('.cus-info').height();
                            // $('.cus_info_swipe').css('marginTop',_cusInfoSwipe);

                            var QiangTimetab = QiangCustomer.timetab;
                            QiangTimetab.toGo.setTime(data.nowTime,cusApply.distributeTime,cusApply.validTime,cusApply.preheatTime,'0');

                            console.log(cusApply.nicheId);
                            var _this_NicheId = cusApply.nicheId;
                            var _this_nicheId = localStorage.setItem("_thisNicheId",_this_NicheId);
                        }
                    } else {
                        loading = Components.Popup.Loading('A', {
                            //withMask: 'A'   //蒙层类型
                        });
                    }
                },
                function(e){
                    console.log(e);
                    loading = Components.Popup.Loading('A', {
                        //withMask: 'A'   //蒙层类型
                    });

                });
        }

        /**
         * 返回逻辑
         */
        $(".js-back-btn").on("tap", back);

        function back(){
            Utils.stopEvent(event);
            window.location.href =  'grab_opportunities.html';
        }

        var qiangCustomerPage = $("#page-customer");
        qiangCustomerPage.on('click','.js-qiang-btn', function(){
            console.log('抢');
            Utils.stopEvent(event);

            var params ={};
            // loading = Components.Popup.Loading('A', {
            //     withMask: 'A'   //蒙层类型
            // });
            var current_price = $(this).prev('.cus-info-top').find('.current-price');
            if(parseInt(cusPrice) >= parseInt(current_price.text())){
                console.log('gou');
                qiangCusService.getGNicheInfo(params,
                    function(data){
                        console.log(data);
                        // loading.remove();
                        resultData = data.data;
                        if(data.codeInfo == '0'){
                            if(resultData.action == '0'){
                                console.log(resultData.phoneNumber);
                                var phonenumber = resultData.phoneNumber;
                                confirm = Components.Popup.Confirm('A', {
                                    content: resultData.message,  //显示内容
                                    leftButton: '客户详情',   //左按钮内容
                                    rightButton: '继续抢客户',  //右按钮内容
                                    withMask: 'A'   //蒙层类型
                                });
                                var alertTab = $('.com-popup-confirm-a');
                                alertTab.addClass('seccessTab');
                                var firstButton = alertTab.children('button').eq(0);
                                var lastButton = alertTab.children('button').eq(1);
                                $(firstButton).on('tap', function(){
                                    Utils.stopEvent(event);
                                    window.location.href = '../customer/customerInfo.html?phonenumber=' + phonenumber;
                                });
                                $(lastButton).on('tap', function(){
                                    Utils.stopEvent(event);
                                    window.location.href = './grab_opportunities.html';
                                });
                            } else if(resultData.action == '4') {
                                Components.Popup.Toast('B', {
                                    content: resultData.message,
                                    width: 220,
                                    duration: 2000
                                });
                            } else {
                                console.log(resultData.nicheId);
                                alert = Components.Popup.Alert('A', {
                                    content: resultData.message,  //显示内容
                                    button: '继续抢客户',   //按钮内容
                                    withMask: 'A'   //蒙层类型
                                });

                                var alertTab = $('.com-popup-alert-a');
                                alertTab.addClass('errTab');
                                var btn = alertTab.children('button');
                                $(btn).on('tap', function(){
                                    Utils.stopEvent(event);
                                    window.location.href = './grab_opportunities.html';
                                });
                            }
                        }
                    },
                    function(e){
                        console.log(e);
                    });

            } else {
                console.log('bugou');
                // loading.remove();
                Components.Popup.Toast('B', {
                    content: '指尖币不足！做任务 可获取更多指尖币。',
                    width: 220,
                    duration: 2000
                });
            }


        });

    });
})(FFA);