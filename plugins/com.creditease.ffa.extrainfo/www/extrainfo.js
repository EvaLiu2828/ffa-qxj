
		var exec = require('cordova/exec'),
			cordova = require('cordova');
		function ExtraInfo() {};
		
		ExtraInfo.prototype.getImei = function(successCallback, errorCallback) {
			exec(successCallback, errorCallback, "ExtraInfo", "getImei", []);
		};

		ExtraInfo.prototype.getSim1Number = function(successCallback, errorCallback) {
			exec(successCallback, errorCallback, "ExtraInfo", "getSim1Number", []);
		};

		module.exports=new ExtraInfo();
