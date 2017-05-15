var exit_code_info = "0";
function exit_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	//console.log("data.msgInfo="+data.msgInfo);
	//console.log("data.codeInfo"+data.codeInfo);	
	if(server_code_info!=null&&exit_code_info==server_code_info){
		mine_exit_success_callback(data);

	}else{
		mine_exit_fail_callback(server_success_info);
		
	}
}
/*退出成功*/
function mine_exit_success_callback(data){
	console.log("退出成功");
	
}
/*退出失败*/
function mine_exit_fail_callback(server_success_info){
	console.log("server_success_info--->"+server_success_info);
	console.log("退出失败");
}