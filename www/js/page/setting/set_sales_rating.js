 /**
 * @fileoverview 普惠金融师数据处理
 * @author qianliu36@creditease.cn
 * @license Copyright 201507270168 on 2016/4/28.
 */


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

 $(function () {
     FastClick.attach(document.body);
 });

 var rateInfoDao = new RateInfoDao();
 // 请求普惠金融家评级的URL
 var mine_rate = function(mine_rate_get_success_before, mine_rate_get_fail){
     // 从后台获取数据
     var hashMap = new HashMap();
     hashMap.put(userUUID, get(user_uuid));
     hashMap.put(devUUID, getDeviceUUID());

     http_post(mine_rate_interface, getJsonStr(hashMap), mine_rate_get_success_before, mine_rate_get_fail);
 };

 var mine_rate_get_success_before = function(data){
     //console.log('普惠金融师从后台获取的数据：');
     var rateInfoDao = new RateInfoDao();
     // 从IndexedDB里查数据
     rateInfoDao.init(function(){
         //console.log('数据库初始化成功');
         rateInfoDao.queryData(data.usercode, function(result){
             //console.log('查库');
             if (result) {
                 rateInfoDao.updateData(data.usercode, data, mine_rate_get_success(data));
             } else {
                 rateInfoDao.insertData(data, mine_rate_get_success(data));
             }
         });
     });
 };
 /**
  * 普惠金融家获取信息请求服务器成功
  * */
 var mine_rate_get_success = function(data){
     //$(".me_loading").addClass("ndis");
     console.log("普惠金融家  获取信息请求服务器成功");

     $.when(mine_rate_response_result(data)).done(function(reData){
         //localStorage_flag = get("localStorage_rate_flag");
         //localStorage_levelName = get("localStorage_rate_LevelName");
         //localStorage_level = get("localStorage_rate_Level");
         //localStorage_info = get("localStorage_rate_info");


         //普惠金融家内容及样式显示
         var cusRateInfoBuffer = ''; //数据缓存字符串 避免单条打印影响渲染速度,客户基本资料
         var cusRateInfoContainer = $("#rateInfoContainer");
         var cusRateInfoTemplate = _.template($('#rateInfoContent').html(), {variable: 'rateInfoData'});

         var localStorage_flag = reData.localStorage_rate_flag;//get("localStorage_rate_flag");
         var localStorage_levelName = reData.localStorage_rate_LevelName;
         var localStorage_level = reData.localStorage_rate_Level;
         var localStorage_info = reData.localStorage_rate_info;

         /**
          * 创建一个rateObj对象，并将localStorage中的信息存进去
          * @param rateObj 对象
          * @param rateFlag 等级标记flag
          * @param rateLevelName 普惠金融家等级名称
          * @param rateLevel 普惠金融家等级
          * @param rateInfo 信息
          * */
         var rateObj = {
             rateFlag : localStorage_flag,
             rateLevelName : localStorage_levelName,
             rateLevel : localStorage_level,
             rateInfo : localStorage_info
         };



         /*普惠金融家基本信息*/
         cusRateInfoBuffer += cusRateInfoTemplate(rateObj);
         cusRateInfoContainer.append(cusRateInfoBuffer);

         // 显示申请按钮
         if (localStorage_flag == 3){
             $(".js-apply-btn").css("display", "inline-block");
         }
         //渲染头像，职位和提示信息
         if(localStorage_flag == "0" || localStorage_flag == "3"){
             $(".js-rate-photo").addClass("bag"+localStorage_level);
         }
         $(".localStorage_rate_Level").text(localStorage_levelName);
         $(".localStorage_rate_info").text(localStorage_info);

     }).fail(function(msg){
         console.log(msg);
     });
 };

 /**
  * 普惠金融家获取信息请求服务器失败
  * */
 var mine_rate_get_fail = function(){
     console.log("普惠金融家 获取信息请求服务器失败");
 };
$(function(){
    //普惠金融家数据请求
    mine_rate(mine_rate_get_success_before, mine_rate_get_fail);

    /**
     * 向后台发送申请请求
     */
    //console.log("***************************");
    //console.log($(".js-apply-btn"));
    $(".js-apply-btn").live("click",function() {
        console.log("点击申请按钮，评级申请开始");
        var hashMap = new HashMap();
        hashMap.put(userUUID, get(user_uuid));
        hashMap.put(devUUID,getDeviceUUID());

        // 显示加载中...
        var Components = FFA.namespace('Components');
        var loading = Components.Popup.Loading('A',{withMask: 'A'});

        http_post(rate_apply_interface, getJsonStr(hashMap), function(data){
            $(".js-apply-btn").css("display", "none");
            // 删除加载中...
            loading.remove();

            var rate_apply_info = data.msgInfo;
            $(".localStorage_rate_info").text(rate_apply_info);

            //改变indexedDB的flag和msgInfo的值
            rateInfoDao.init(function(){
                console.log('*********申请********');
                rateInfoDao.updateData(get(user_uuid),{
                    flag: 0,
                    msgInfo: rate_apply_info
                });
            });
        }, function() {
            console.log('请求失败！！！');
        });

    });

    //QA
    $(".js-rate-list-nav li").live("tap",function(e){
        e.preventDefault();
        var n = $(this).attr("id").substr(7);
        //console.log("n="+n);
        put("salesQueId",n);
        $("#salesQue").load("sales_rating_q.html");
        $("#salesQue").css({
            width:'100%'
        });
    });
});





