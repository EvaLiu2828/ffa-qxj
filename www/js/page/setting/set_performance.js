/**
 * @fileoverview 绩效查询数据处理
 * @license Copyright 201507270184 on 2016/6/21.
 */
;(function (FFA) {
    //页面跳转太快时会触发下一个页面相同位置上的点击事件
    /*var lastClickTime = new Date().getTime();
    var clickTime;
    document.addEventListener('click', function (e) {
        clickTime = e['timeStamp'];
        if (clickTime && (clickTime - lastClickTime) < 500) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
        //lastClickTime = clickTime;
    }, true);*/

    //返回逻辑
    var backFun = function(){
        var title = $(".js-header-title");
        if($(".js-perform-instructions").hasClass("performDisplayBlock")){
            $(".js-perform").addClass("performDisplayBlock").siblings().removeClass("performDisplayBlock");
            title.text("绩效查询");
        }else{
            window.location.href = "../frame.html";
        }
    };


    //渲染页面
    var renderPerformance = function(data){
        var flag = data.flag;
        if(flag == 2){
            //console.log("服务器返回数据"+JSON.stringify(data));
            $('.js-perform').addClass('performDisplayBlock').siblings().removeClass('performDisplayBlock');
            var performInfoContainer = $("#performInfoContainer");
            var performInfoTemplate = _.template($('#performInfoContent').html(), {variable: 'performInfoData'});
            performInfoContainer.html(performInfoTemplate(data));

            //控制总绩效数字的样式
            var performPay = $(".js-perform-pay");
            var sum = performPay.text();
            //var newSum = sum.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
            //performPay.text(newSum);
            //控制总绩效数字的颜色
            if(sum.substr(0,1) == "-"){
                performPay.addClass("negative");
            }


            //获取各项绩效的值
            $(".js-perform-list-nav li").each(function(i){
                var blockRight = $(".block-right", $(this));
                var value = blockRight.text();
                var sign = value.substr(0,1);
                //控制数字的颜色
                if(sign == "-"){
                    blockRight.addClass("negative");
                }
                //控制数字的样式
                //var newVal = value.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                //blockRight.text(newVal);
            });

            //渲染QA页面
            var instructionsContainer = $("#instructionsContainer");
            var instructionsTemplate = _.template($('#instructionsContent').html(), {variable: 'performInfoData'});
            instructionsContainer.html(instructionsTemplate(data));

        } else if((flag == 0) || (flag == 1) || (flag == 4)){
            //没有权限查看绩效
            console.log("没有权限查看绩效");
            $('.js-no-perform').addClass('performDisplayBlock').siblings().removeClass('performDisplayBlock');
            var noPerformContainer = $("#noPerformContainer");
            var noPerformTemplate = _.template($('#noPerformContent').html(), {variable: 'performInfoData'});
            noPerformContainer.html(noPerformTemplate(data));

        } else {
            //系统异常
            console.log(data.msgInfo);
        }
    };

    var performInfoDao = new PerformInfoDao();

    //DOM加载完成准备工作
    $(function(){

        // 去小红点
        //put("perform_redDot", 1);   // 小红点的状态

        var loading;
        loading = FFA.Components.Popup.Loading('A', {
            //withMask: 'A'   //蒙层类型
        });

        //向后台发送绩效查询请求
        var hashMap = new HashMap();
        hashMap.put(userUUID, get(user_uuid));
        hashMap.put(devUUID, getDeviceUUID());

        //后台请求成功
        var perform_query_success = function(data){

            var codeInfo = data.codeInfo;
            if(codeInfo != null && 0 ==codeInfo){
                console.log("绩效查询请求成功");
                performInfoDao.init(function(){
                    performInfoDao.insertData(data,renderPerformance(data));
                });
            } else {
                console.log("绩效查询请求失败");
                //从indexedDB里获取数据
                performInfoDao.init(function(){
                    performInfoDao.queryData(get(user_uuid),function(result){
                        renderPerformance(result);
                    });
                });
            }
            loading.remove();
        };
        //后台请求失败
        var perform_query_fail = function(){
            console.log("绩效查询请求失败");
            //从indexedDB里获取数据
            performInfoDao.init(function(){
                performInfoDao.queryData(get(user_uuid),function(result){
                    renderPerformance(result);
                });
            });
            loading.remove();
        };

        http_post(perform_query_interface,getJsonStr(hashMap),perform_query_success,perform_query_fail);


        //header取消按钮
        $(".js-back").on('click',backFun);

        //显示QA页面
        $(".perform-title").live('click',function(){
            var title = $(".js-header-title");
            $('.js-perform-instructions').addClass('performDisplayBlock').siblings().removeClass('performDisplayBlock');
            title.text('绩效说明');

        });



    });
})(FFA);

