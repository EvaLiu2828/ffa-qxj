
// JavaScript Document

var hasForegroundAlert = false;

function http_get(url,json,success,fail) {
	//console.log("statistics_interface"+success);
		$.ajax({
			timeout:60000,
			type: "get",
			url: url,
			data: json,
			dataType: "json",
			success:success,
			error: fail
		});
}
function http_post(url,json,success,fail){
	$.ajax({
			timeout:60000,
			type: "POST",
			url: url,
			data: json,
			dataType: "json",
			contentType:  "application/json; charset=utf-8",
			success: function(data){
				var server_codeInfo=data.codeInfo;
				//console.log(JSON.stringify(data));
				var check_version_key = "checkVerAndUpOptTimeController/checkVerAndUpOptTime";
				if(server_codeInfo!='20'){
                    if(server_codeInfo=='1' && (url.indexOf(check_version_key) == -1)){
                        if (!hasForegroundAlert) {
                            navigator.notification.alert(data.msgInfo, function(){
                                hasForegroundAlert = false;
                                var exit = new SystemExit();
                                exit.exit(true,function(){
                                    console.log('exit success');
                                },false);
                            }, '系统提示', '确定');
                            hasForegroundAlert = true;
                        }
                    }else{
						if (server_codeInfo == '28'){
                            navigator.notification.alert(data.msgInfo, function(){
									console.log('Receive error message from server, back to last page');
									//navigator.app.backHistory();
									history.go(-1);
                            }, '系统提示', '确定');
						} else if (server_codeInfo == '18') { // 该设备操作过于频繁，请不要重复操作
							navigator.notification.alert(data.msgInfo, function(){
								console.log('Receive error message from server, back to last page');
								//navigator.app.backHistory();
								//history.go(-1);
							}, '系统提示', '确定');
						} else {
							success(data);
						}
                    }

                }

				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				console.log("fail");
				console.log("textStatus: "+textStatus);
				console.log("XMLHttpRequest: "+XMLHttpRequest.readyState);

				fail();
			}
		});
}

function http_post_sync(url,json,success,fail){
	$.ajax({
			timeout:60000,
			type: "POST",
			url: url,
			async : false,
			data: json,
			dataType: "json",
			contentType:  "application/json; charset=utf-8",
			success: function(data){
						success(data);
				
			},
			error: function(){
				console.log("fail"); 
				fail();
			}
		});
}
