/**
 * Created by v-yuxinliu on 16/10/31.
 */
/**
 * Created by apple on 16/10/19.
 */
// 防止穿透
$(function () {
    FastClick.attach(document.body);
});


(function (FFA) {
    var Frame = FFA.namespace("Frame");
    var ExhibitionPage = FFA.namespace('Frame.ExhibitionPage');

    //轮播图初始化方法
    ExhibitionPage.initBanner = (function () {
        var banner = null;

        function init(){
            var bullets = document.getElementById('position').getElementsByTagName('li');
            banner = Swipe(document.getElementById('mySwipe'), {
                auto: 2000,
                continuous: true,
                disableScroll: false,
                callback: function (pos) {
                    var i = bullets.length;
                    while (i--) {
                        bullets[i].className = ' ';
                    }
                    bullets[pos].className = 'cur';
                }
            });
        }

        return function () {
            if (banner) {
                banner.kill();
                init();
            }else{
                init();
            }
        };
    })();

    ExhibitionPage.initBanner();

    /** 下拉刷新 */
    var QiangCustomerPage = FFA.namespace('Frame.QiangCustomerPage'),
        QiangCustomer = FFA.namespace('QiangCustomer');
    var qiangCustomerModel = QiangCustomer.customerModel;

    QiangCustomerPage._initPageScrollPlugin = function () {
        //下拉刷新控件初始化
        var customerPullToRefresh = initPullToRefresh(function () {
            qiangCustomerModel.refresh();
        }, function () {
            console.log("上拉刷新！！！");
        }, null, null, 'customers-wrapper');
        qiangCustomerModel.setPtoRObject(customerPullToRefresh);    //将customerPullToRefresh对象传入controller

    };

    QiangCustomerPage.init = function () {
        if (!this.inited) {
            this.inited = true;
            qiangCustomerModel.setContainer($('#contacters-container'));    //内容容器设定
            var container = $('#contacters-container');
            this._initPageScrollPlugin();

            qiangCustomerModel.init("page-customer");
        }
    };
    QiangCustomerPage.init();
})(FFA);

/**事件注册*/
$(function(){
    var QiangCustomer = FFA.namespace('QiangCustomer'),
        Customer = FFA.namespace('Customer'),
        Utils = FFA.namespace("Utils"),
        Components = FFA.namespace('Components'),
        confirm = null,
        loading = null,
        alert = null;

    /*客户热点*/
    var frame_hot_query = 1;
    function frame_hot_query_timer() {
        frame_hot_query = frame_hot_query - 1;
        if (frame_hot_query < 0) {
            hot_spot_query2();
            window.clearInterval(ti);
        }
    }
    var ti = window.setInterval(frame_hot_query_timer, 500);
    $(".js-photo-touched").bind('click', function () {
        var n = $(this).attr("id");
        put('choose_hot', n);
        var news_id= get(n);
        if(news_id){
            window.location = "../exhibit/qsj_hotactive_none.html";
        }
    });

    var spot_version = get(spot_query_version);
    console.log("log" + spot_version);
    if (!isEmpty(spot_version)) {
        query_version_equals2(true, null);//如果当前有数据直接查询
    }

    var qiangCustomerController = QiangCustomer.controller;
    var qiangCustomerPage = $("#page-customer");

    //跳转到详情
    qiangCustomerPage.on('tap','.js-cus-info',function(){
        Utils.stopEvent(event);
        var NicheId = $(this).parent().data('nicheid');
        var nicheId = localStorage.setItem("nicheId",NicheId);
        console.log(nicheId);
        var cus_price  = $('.q-code').text();
        var _cus_price = localStorage.setItem("cusPrice",cus_price);

        qiangCustomerController.toDetail(NicheId);
    });

    //跳转积分页面
    qiangCustomerPage.on('tap','.js-qiang-mark',function(event){
        Utils.stopEvent(event);
        console.log('跳转积分页面');
        window.location.href = '../setting/coin.html?flag=1'
    });

    /**
     * 返回逻辑
     */
    $(".js-back-btn").on("tap", back);

    function back() {
        Utils.stopEvent(event);
        console.log('fanhui');
        window.location.href = "../frame.html";
        // window.location.href =  '../team/customer.html';
        // history.back();
    }

    var qiangCustomerPage = $("#page-customer");

    //抢购
    var resultData;
    qiangCustomerPage.on('click','.js-qiang-btn',function(event){
        Utils.stopEvent(event);
        console.log("抢");
        console.log($(this).parents('.js-contacter-info'));
        var _this_NicheId = $(this).parents('.js-contacter-info').data('nicheid');
        var _this_nicheId = localStorage.setItem("_thisNicheId",_this_NicheId);
        var params ={};

        if(qiangBtn == true){
            loading = Components.Popup.Loading('A', {
                withMask: 'A'   //蒙层类型
            });
            var current_price = $(this).prev('.discount-num').children('.business-num2').children('.current-price');
            var cus_price  = $('.q-code').text();

            if(parseInt(cus_price) >= parseInt(current_price.text())){
                console.log('gou');

                qiangCusService.getGNicheInfo(params,
                    function(data){
                        console.log(data);
                        loading.remove();
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
                loading.remove();
                Components.Popup.Toast('B', {
                    content: '指尖币不足！做任务可获取更多指尖币。',
                    width: 220,
                    duration: 2000
                });
            }
        }

    });
});


