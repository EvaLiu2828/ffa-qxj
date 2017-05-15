
function checkVersionUpdate() {
			//TalkingData.init('4DF2173677F6F588BDA1FAA353F601E4','TalkingData');//进行注册
			var hashMap = new HashMap();
			var deviceUUID=getDeviceUUID();
			var userID=localStorage.getItem(user_uuid);//get(user_uuid);
			var myPhoneNumber=localStorage.getItem(me_phonenumber);
			var platform_flag = "";
			//start 2015-7-7 wangjunbao update
			if(equalsIgnoreCase(device.platform, "Android")) {
				platform_flag = "1";
			} else if(equalsIgnoreCase(device.platform, "ios")){
				platform_flag = "2";
			} else {
			}
			//end 2015-7-7 wangjunbao update
			console.log("checkVersionUpdate devicePlatform:" + device.platform);
			var versionInfo = getString("version_info");
 			hashMap.put(userUUID,userID);
	 		hashMap.put(devUUID,deviceUUID);
	 		hashMap.put(phoneNumber,myPhoneNumber);
			hashMap.put(flag, platform_flag);
	 		hashMap.put(version,versionInfo);
			//console.log("checkVersionUpdate check_version_interface:" + check_version_interface);
			//console.log("checkVersionUpdate JsonStr:" + getJsonStr(hashMap));
			http_post(check_version_interface,getJsonStr(hashMap),check_version_success,check_version_fail);
			//console.log("checkVersionUpdate post check version request");
}

var resumeObj = {
	// Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener("resume", this.onResume, false);
		document.addEventListener('jpush.openNotification', this.onOpenNotification, false);
	},

	onResume: function() {
		//从后台切换到前台的时候，检测版本号是否已经更新
		if(window.plugins.jPushPlugin.isPlatformIOS()){
			console.log("reset Application Icon Badge Number for IOS platform");
			window.plugins.jPushPlugin.resetBadge();
			window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
		}
		setTimeout("checkVersionUpdate()", 500);
		var toBackgroundTime = getToBackgroundTime();
		var curTime = new Date().getTime();
		var days = (curTime - toBackgroundTime)/(24*3600*1000);
		console.log("checkRelogin 距离上次使用时间为：-----> " + days + "天");
		if(days >= 30) {
			var exit = new SystemExit();
			exit.exit(true,function(){
                console.log('exit success');
            },false);
		} /* else {
			document.addEventListener('jpush.openNotification', function(evt){
				if(typeof evt['cn.jpush.android.EXTRA'].key != 'undefined') {
					var value = evt['cn.jpush.android.EXTRA'].key;
					if (value == 0) {
						redirect("customer");
					}
				}
			}, false);
		} */
	},
	onOpenNotification: function(evt) {
		if(window.plugins.jPushPlugin.isPlatformIOS()){
			 if(evt != null && evt != "" && typeof evt.key!= 'undefined') {
				 if (evt.key == 0) {
					 redirect("customer");
				 }
			 }
		}else{
			if(evt != null && evt != "" && typeof evt['cn.jpush.android.EXTRA'].key != 'undefined') {
				var value = evt['cn.jpush.android.EXTRA'].key;
				if (value == 0) {
					redirect("customer");
				}
			}
		}
	}

};

resumeObj.initialize();
