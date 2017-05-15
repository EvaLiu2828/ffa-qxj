var offline_flag = false;   
var offlineObj = {
	// Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener("offline", this.onOffline, false);
	},

	// app-infomation Event Handler 
	onOffline : function(){
/*
		var extraInfo = cordova.require('com.creditease.ffa.extrainfo.ExtraInfo');
		extraInfo.getImei(onSuccess, onError);
		//window.ExtraInfo.getImei(onSuccess, onError);
		
		function onSuccess(data){
			alert('手机IMEI号码是：' + data);
		}

		function onError(err){
			alert('没有获取到手机IMEI号' + err);
		}

		extraInfo.getSim1Number(onSuccess1, onError1);
		
		function onSuccess1(data){
			alert('SIM1 的电话号码是：' + data);
		}

		function onError1(err){
			alert('没有获取到电话号码！！！' + err);
		}
*/
		if(!offline_flag){
			offline_flag = true;
			navigator.notification.alert('您的网络连接已经断开', function(){
				offline_flag = false;
			}, '系统提示', '确定');
		}
	}
};

offlineObj.initialize();
