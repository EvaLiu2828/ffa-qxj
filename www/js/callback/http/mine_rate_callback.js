
// 普惠金融家请求成功数据处理
var mine_rate_response_result =function(data){
	var deferred = $.Deferred();
	var server_code_info = data.codeInfo;
	var server_rate_flag = data.flag;      // 申请状态
	var server_rate_info = data.msgInfo;
	var server_rate_LevelName = data.curLevelName;   // 当前等级对应等级名称
	var server_rate_Position = data.position;   // 员工职位


	// 普惠金融师级别显示和小红点的处理
	var rate_name = '';
	if (server_code_info == 0) {
		//console.log("!!!!!!!!!!flag="+server_rate_flag);
		if (server_rate_flag == '0' || server_rate_flag == '3') {
			//console.log("可申请！！！！");
			$(".js-rate-level").text(server_rate_LevelName);
			rate_name = server_rate_LevelName;
			//$(".js-show-dot-sale").removeClass("rate-red-circle");
            //
			//// 显示小红点
			//if (server_rate_flag == '3' && data.rate_redDot != 1) {
			//	console.log('显示小红点');
			//	$(".js-show-dot-sale").addClass("rate-red-circle");
			//}
		} else {
			//console.log("不可申请！！！！！");
			rate_name = server_rate_Position;
			$(".js-rate-level").text(server_rate_Position); // 员工职位
			//$(".js-show-dot-sale").removeClass("rate-red-circle");

		}
		//put("localStorage_rate_LevelName", rate_name);           // 评级名称或者职位
		//put("localStorage_rate_flag", server_rate_flag);         // 申请状态flag
		//put("localStorage_rate_Level", (data.curLevel || 0));            // 当前级别
		//put("localStorage_rate_info", data.msgInfo);              // 消息信息
	//	put("rate_redDot", data.rate_redDot);   // 小红点的状态

		var returnData = {
			localStorage_rate_LevelName: rate_name,
			localStorage_rate_flag: server_rate_flag,
			localStorage_rate_Level: (data.curLevel || 0),
			localStorage_rate_info: data.msgInfo
		}

		deferred.resolve(returnData);
	}else{
		mine_rate_get_other_callback(server_rate_info);
		deferred.reject(server_rate_info);
	}

	return deferred.promise();
};

var mine_rate_get_other_callback = function(server_rate_info){
	console.log(server_rate_info);
};
