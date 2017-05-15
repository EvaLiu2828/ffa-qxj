/**
 * @fileoverview 绩效查询数据请求
 * @license Copyright 201507270184 on 2016/6/21.
 */
// 请求绩效查询小红点的URL
var mine_perform_dot = function(mine_perform_dot_get_success,mine_perform_dot_get_fail){
    //从后台获取数据
    var hashMap = new HashMap();
    hashMap.put(userUUID, get(user_uuid));
    hashMap.put(devUUID, getDeviceUUID());
    hashMap.put(redDot,"2");//小红点来源标识--绩效查询
    //red_dot_interface获取小红点的url
    http_post(red_dot_interface, getJsonStr(hashMap), mine_perform_dot_get_success,mine_perform_dot_get_fail);
};

//绩效查询请求服务器成功
var mine_perform_dot_get_success = function(data){
    //console.log('绩效小红点从后台获取的数据');
    //console.log(JSON.stringify(data));
    var codeInfo = data.codeInfo;
    if(codeInfo != null && 0 == codeInfo){
        put("perform_redDot",data.code);//小红点显示标识，0显示小红点，1不显示小红点
        if(data.code == 0){
            console.log("绩效查询显示小红点：");
            $(".js-perform-dot").addClass("rate-red-circle");
        } else {
            $(".js-perform-dot").removeClass("rate-red-circle");
        }
    } else {
        console.log('绩效查询请求服务器失败');
    }
};

//绩效查询请求服务器失败
var mine_perform_dot_get_fail = function(){
    console.log('绩效查询请求服务器失败');
};


$(function () {

    // 小红点的显示
    var perform_redDot = get("perform_redDot");
    if(perform_redDot == 0){
        console.log("绩效查询显示小红点：");
        $(".js-perform-dot").addClass("rate-red-circle");
    } else {
        $(".js-perform-dot").removeClass("rate-red-circle");
    }

});