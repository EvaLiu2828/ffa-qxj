/**
 * @fileoverview 普惠金融师数据请求
 * @author qianliu36@creditease.cn
 * @license Copyright 201507270168 on 2016/4/28.
 */
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
    //console.log(data);
    var rateInfoDao = new RateInfoDao();
    // 从IndexedDB里查数据
    //console.log('------------');
    rateInfoDao.init(function(){
        //console.log('数据库初始化成功');
        rateInfoDao.queryData(data.usercode, function(result){
            //console.log('查库');
            if (result) {
                // 时间不相等 ，进行更新indexedDB里的数据result.createTime != data.createTime
                //if (result.createTime != data.createTime) {
                //    // 先删	// 后插
                //    //console.log('从indexedDB里更新数据');
                //    data.rate_redDot = 0; // 0，表示未读
                    rateInfoDao.updateData(data.usercode, data, mine_rate_get_success(data));
                //} else {
                //    //console.log('从indexedDB里获取');
                //    //console.log(result);
                //    mine_rate_get_success(result);
                //}
            } else {
             //   data.rate_redDot = 0; // 0，表示未读
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

    mine_rate_response_result(data);
};

/**
 * 普惠金融家获取信息请求服务器失败
 * */
var mine_rate_get_fail = function(){

    console.log("普惠金融家 获取信息请求服务器失败");

};

$(function () {
    //普惠金融家数据请求
    mine_rate(mine_rate_get_success_before, mine_rate_get_fail);

    // 普惠金融师的级别或职位
    //$(".js-rate-level").text(get("localStorage_rate_LevelName"));
    //// 小红点的显示
    //var rate_redDot = get("rate_redDot"), server_rate_flag = get("localStorage_rate_flag");
    //if (server_rate_flag == '3' && rate_redDot != 1) {
    //    console.log("显示小红点："+server_rate_flag);
    //    $(".js-show-dot-sale").addClass("rate-red-circle");
    //}
});