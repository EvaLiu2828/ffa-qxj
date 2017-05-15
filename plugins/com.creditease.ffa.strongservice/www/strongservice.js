
		var exec = require('cordova/exec'),
			cordova = require('cordova');
		function StrongService() {};

		StrongService.prototype.startStrongService = function(successCallback, errorCallback) {
			exec(successCallback, errorCallback, "StrongService", "startStrongService", []);
		};

		module.exports=new StrongService();
