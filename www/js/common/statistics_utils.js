var Statistics = function(){
	/**模板统计 ID|年月日|类目名称|模板ID|模板名称|转发渠道|用户ID*/
	var spec = "##";
	this.templateStatistics=function(data){
		
		var templateParams={
			time:data.time,
			category_name:data.category_name,
			template_id:data.template_id,
			template_name:data.template_name,
			share_channel:data.share_channel,
			user_id:data.user_id,
			template_list:this.templateListToString(data)
		};
		TalkingData.onEventWithExtraData('template_share', '模板转发', templateParams);
	};
	this.templateListToString=function(data){
		var template_list;
		template_list=data.id+spec+data.time+spec+data.category_name+spec+data.template_id+spec+data.template_name+spec+data.share_channel+spec+data.user_id;
		console.log(template_list);
		return template_list;
	};
	/*ID|年月日|模块名称|用户ID**/
	this.moduleStatistics=function(data){
		var moduleParams={
			time:data.time,
			module_name:data.module_name,
			user_id:data.user_id,
			module_list:this.moduleListToString(data)
		};
		TalkingData.onEventWithExtraData('module_click', '模块点击', moduleParams);
	};
	this.moduleListToString=function(data){
		var template_list;
		template_list=data.id+spec+data.time+spec+data.module_name+spec+data.user_id;
		console.log(template_list);
		return template_list;
	};
	/**ID|年月日|类目名称|用户ID 展业类目点击量统计*/
	this.categoryStatistics=function(data){
		var moduleParams={
			time:data.time,
			category_name:data.category_name,
			user_id:data.user_id,
			category_list:this.categoryListToString(data)
		};
		TalkingData.onEventWithExtraData('category_click', '类目点击', moduleParams);
	};
	this.categoryListToString=function(data){
		var template_list;
		template_list=data.id+spec+data.time+spec+data.category_name+spec+data.user_id;
		console.log(template_list);
		return template_list;
	};
	/*ID|年月日|转发渠道|用户ID 微店转发量统计*/
	this.microShopStatistics=function(data){
		var moduleParams={
			time:data.time,
			share_channel:data.share_channel,
			user_id:data.user_id,
			category_list:this.microShopListToString(data)
		};
		TalkingData.onEventWithExtraData('micro_shop_share', '微店转发', moduleParams);
	};
	this.microShopListToString=function(data){
		var template_list;
		template_list=data.id+spec+data.time+spec+data.share_channel+spec+data.user_id;
		console.log(template_list);
		return template_list;
	};
	/*微店二维码下载量统计 ID|年月日|用户ID*/
	this.microShopQcodeDownloadStatistics=function(data){
		var moduleParams={
			time:data.time,
			user_id:data.user_id,
			micro_shop_download_list:this.microShopQcodeDownloadListToString(data)
		};
		TalkingData.onEventWithExtraData('micro_qcode_shop_download', '微店二维码下载', moduleParams);
	};
	this.microShopQcodeDownloadListToString=function(data){
		var template_list;
		template_list=data.id+spec+data.time+spec+data.user_id;
		console.log(template_list);
		return template_list;
	};
    /**转发计数的接口*/
    this.shopStatistics = function (statisticsType, userID) {
        $.ajax({
            url: microShopCount_interface,
            type: 'get',
            data: {
                'type':statisticsType,
                'userUUID':userID
            },
            success: function (result, status) {
                console.log("success");
            }
        });
    };
};
