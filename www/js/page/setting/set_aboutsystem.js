$(function () {
    $("#ab-current-ver").text(getString("version_info_show"));
});
function checkLatest() {
    $(function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var Components = FFA.namespace('Components');
            var loading = Components.Popup.Loading('A');
            var hashMap = new HashMap();
            var deviceUUID = getDeviceUUID();
            var userID = localStorage.getItem(user_uuid);//get(user_uuid);
            var myPhoneNumber = localStorage.getItem(me_phonenumber);
            var platform_flag = "";
            if (equalsIgnoreCase(device.platform, "Android")) {
                platform_flag = "1";
            } else if (equalsIgnoreCase(device.platform, "ios")) {
                platform_flag = "2";
            } else {
            }
            var versionInfo = getString("version_info");
            hashMap.put(userUUID, userID);
            hashMap.put(devUUID, deviceUUID);
            hashMap.put(phoneNumber, myPhoneNumber);
            hashMap.put(flag, platform_flag);
            hashMap.put(version, versionInfo);
            http_post(check_version_interface, getJsonStr(hashMap), function (data) {
                loading.remove();
                var code_info = data.codeInfo;
                var msg_info = data.msgInfo;
                //var msg_info = "Version:1.0.0, Url:http://www.baidu.com";
                var ser_version = msg_info.substring(msg_info.indexOf("Version:")+"Version:".length,msg_info.indexOf(",Url"));

                console.log("msg_info = " + msg_info);
                console.log("code_info = " + code_info);
                console.log("ser_version = " + ser_version);
                console.log("local_version = "+ getString("version_info"));

                if (getString("version_info") == ser_version) {
                    $("#ab-icon-update").css("display", "none");
                    $("#ab-version-latest").text("已是最新版本！");

                } else {
                    var url = msg_info.substring(msg_info.lastIndexOf('Url:') + "Url:".length);
                    navigator.notification.confirm('检测到新版本，立即下载后安装，新版本的精彩功能等你来体验！', showConfirm, '系统提示', '进入下载,取消');
                    function showConfirm(button) {
                        if (button == 1) {
                            cordova.InAppBrowser.open(url, "_system", "location=yes");
                        }
                    }
                }
            }, check_version_fail);
        }
    });
}