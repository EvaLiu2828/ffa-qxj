/**
 * @fileoverview 指尖币数据处理
 * @license Copyright 201507270184 on 2016/10/31.
 */
$(function () {
    FastClick.attach(document.body);

});

;(function (FFA) {

    var Utils = FFA.namespace("Utils");
    var title = $(".js-header-title");
    var rightBtn = $(".js-header-right-btn");

    //获取url参数
    var flag = Utils.urlArgs()['flag'];//0入口为“我的”，1入口为“抢商机”

    /**
     * 返回逻辑
     */
    var backFun = function(){
        if($(".js-coin-detail").hasClass("coinDisplayBlock")||$(".js-coin-instruction").hasClass("coinDisplayBlock")){
            $(".js-coin-info").addClass("coinDisplayBlock").siblings().removeClass("coinDisplayBlock");
            title.text("指尖币");
            rightBtn.show();
        }else{
            if(flag == "0"){
                //跳转到“我的”页面
                window.location.href = "../frame.html";
            }else{
                //跳转到“抢商机”页面
                window.location.href = "../grab_opportunities/grab_opportunities.html";
            }

        }
    };

    //弹框逻辑


    /**
     * 指尖币页面渲染
     * @param data
     */
    var renderCoin = function(data){
        //指尖币首页

        var coinInfoContainer = $("#coinInfoContainer");
        var coinInfoTemplate = _.template($('#coinInfoContent').html(), {variable: 'coinInfoData'});
        coinInfoContainer.html(coinInfoTemplate(data));

        //每日任务列表是否显示已完成
        $(".js-daily-tasks li").each(function(i){
            var mark = $(this).data('mark');
            var num = $(".right-num", $(this));
            var text = $(".right-text", $(this));
            if(mark == "1"){
                num.removeClass("rightDisplayBlock");
                text.addClass("rightDisplayBlock");
            } else {
                text.removeClass("rightDisplayBlock");
                num.addClass("rightDisplayBlock");
            }

        });

        //客户进件、放款列表是否显示已完成
        $(".js-customer-tasks li").each(function(i){
            var blockRight = $(".block-right", $(this));
            var stampText = $(".stamp-text", $(this)).text();
            if(stampText == ""){
                blockRight.removeClass("rightDisplayBlock");
            } else {
                blockRight.addClass("rightDisplayBlock");
            }

        });

    };

    /**
     * 指尖币交易明细页面渲染
     * @param data
     */
    var renderCoinDetail = function(data){
        //指尖币交易明细页-收入
        var coinIncomeContainer = $("#coinIncomeContainer");
        var coinIncomeTemplate = _.template($('#coinIncomeContent').html(), {variable: 'coinIncomeData'});
        coinIncomeContainer.html(coinIncomeTemplate(data.incomeIntegralMsg));

        //指尖币交易明细页-消费
        var coinConsumeContainer = $("#coinConsumeContainer");
        var coinConsumeTemplate = _.template($('#coinConsumeContent').html(), {variable: 'coinConsumeData'});
        coinConsumeContainer.html(coinConsumeTemplate(data.consumeIntegralMsg));
    };

    /**
     *指尖币数据请求参数
     * @returns {*}
     */
     var coinGetParams = function(){
        var hashMap = new HashMap();
        hashMap.put(userUUID, get(user_uuid));
        hashMap.put(devUUID, getDeviceUUID());
        return getJsonStr(hashMap);
     };
    /**
     *指尖币明细数据请求参数
     * @returns {*}
     */
    var coinDetailGetParams = function(){
        var hashMap = new HashMap();
        hashMap.put(userUUID, get(user_uuid));
        hashMap.put(devUUID, getDeviceUUID());
        hashMap.put("operation","0");//0代表APP，1代表PC
        return getJsonStr(hashMap);
    };

    var coinInfoDao = new CoinInfoDao();

    //DOM加载完成准备工作
    $(function(){
        //热气球加载图片
        var loading1;
        loading1 = FFA.Components.Popup.Loading('A', {
            //withMask: 'A'   //蒙层类型
        });
        coinInfoDao.init(function(){
            coinInfoDao.queryData(get(user_uuid),function(result){
                if((result != null)&&(result.length != 0)){
                    console.log("数据库不为空");
                    renderCoin(result);
                    loading1.remove();
                    http_post(coin_query_interface,coinGetParams(),coin_query_success,coin_query_fail);
                } else {
                    console.log("数据库为空");
                    http_post(coin_query_interface,coinGetParams(),coin_query_success,coin_query_fail);
                }
            })
        });

        //后台请求成功
        var coin_query_success = function(data){

            var codeInfo = data.codeInfo;
            if(codeInfo != null && 0 ==codeInfo){
                console.log("指尖币请求成功"+JSON.stringify(data));
                renderCoin(data);
                loading1.remove();
                coinInfoDao.insertData(data,function(){
                    console.log("数据库更新成功");
                });
                //更新localStorage
                localStorage.setItem("localStorage_coin",data.integralCount);
            } else {
                console.log("指尖币请求失败");
            }
        };
        //后台请求失败
        var coin_query_fail = function(){
            loading1.remove();
            console.log("指尖币请求失败");
        };

        //header取消按钮
        $(".js-back").on('click',backFun);

        //显示指尖币说明页面
        $(".coin-title").live('click',function(){
            $('.js-coin-instruction').addClass('coinDisplayBlock').siblings().removeClass('coinDisplayBlock');
            title.text('指尖币说明');
            rightBtn.hide();

        });

        //点击header右侧按钮
        $(".js-header-right-btn").on('click',function(){
            $(".js-coin-detail").addClass("coinDisplayBlock").siblings().removeClass('coinDisplayBlock');
            title.text('指尖币交易明细');
            rightBtn.hide();
            rightBtn.css("background-color","#4591ff");


            //热气球加载图片
            var loading2;
            loading2 = FFA.Components.Popup.Loading('A', {
                //withMask: 'A'   //蒙层类型
            });


            //后台请求成功
            var coin_detail_query_success = function(data){

                var codeInfo = data.codeInfo;
                if(codeInfo != null && 0 ==codeInfo){
                    console.log("指尖币明细请求成功"+JSON.stringify(data));
                    renderCoinDetail(data);
                } else {
                    console.log("指尖币明细请求失败");
                }
                loading2.remove();
            };
            //后台请求失败
            var coin_detail_query_fail = function(){
                console.log("指尖币明细请求失败");
                loading2.remove();
            };

            http_post(coin_detail_query_interface,coinDetailGetParams(),coin_detail_query_success,coin_detail_query_fail);
        });

        /**
         * 滑动页面start
         * */
        var tabBtns = $(".js-tab-btn");
        var swipeIndex = parseInt(sessionStorage.getItem("coinIndex")) || 0;
        tabBtns.eq(swipeIndex).addClass("actived");

        var swipe = Swipe(document.getElementById('swipe-container'), {
            bounce: false,
            continuous: false,
            callback: function (index, elem) {
                tabBtns.removeClass("actived").eq(index).addClass("actived");
                sessionStorage.setItem("coinIndex", index);
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
            sessionStorage.setItem("coinIndex", index);

            var event = event || window.event;
            Utils.stopEvent(event);
            if (swipe.getPos() !== index)
                swipe.next();
        });
        /*******滑动页面end**********/

    });
})(FFA);

