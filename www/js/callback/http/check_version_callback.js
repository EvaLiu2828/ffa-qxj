// JavaScript Document
function check_version_response_result(data){
	var code_info = data.codeInfo;
	var msg_info = data.msgInfo;
	var consultNum = data.consultCon;
	var updateFlag = data.updateFlag;
	console.log("updateFlag:");
	console.log(updateFlag);
	//var msg_info = "Version:1.0.0, Url:http://www.baidu.com";
	console.log("check_version_response_result, code_info:" +code_info);
	console.log("check_version_response_result, msg_info:" +msg_info);
	console.log("check_version_response_result, data:" +JSON.stringify(data));
	if (isNum(consultNum)) {
		localStorage.setItem(consult_num, consultNum);
	}
	if(code_info == "0") {

	} else {
		var url = msg_info.substring(msg_info.lastIndexOf('Url:') + "Url:".length);
		console.log("check_version_response_result, url:" +url);
		showConfirm(url,updateFlag);
	}
}

function showConfirm(url,updateFlag) {
	var btn = '进入下载,退出系统';
	if (updateFlag == 0) {
		btn = '进入下载,取消';
	}
	navigator.notification.confirm(
		'检测到新版本，立即下载后安装，新版本的精彩功能等你来体验！',
		onConfirm = function(button){
			//alert('You selected button ' + button + url);
			// if (button == "1") {
			// 	cordova.InAppBrowser.open(url, "_system", "location=yes");
			// }

			// button: 0,没有点按钮，不操作  1，进入下载  2，退出系统
			if (button == "2") {
				// updateFlag: 0, 非强制更新；1，强制更新
				if (updateFlag == 1) {
					var exit = new SystemExit();
					exit.exit(false,function(){
						console.log('exit success');
					},true);
				}
			} else {
				cordova.InAppBrowser.open(url, "_system", "location=yes");
			}
		},
		'系统提示',
		btn
	);
 }
/* 判断是否是正整数 */
function isNum(s)
{
    if(s!=null){
        var r,re;
        re = /\d*/i; //\d表示数字,*表示匹配多个数字
        r = s.match(re);
        return (r==s)?true:false;
    }
    return false;
}