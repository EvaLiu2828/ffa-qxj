// JavaScript Document
var statistics_code_info="0";
function statistics_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	if(server_code_info!=null&&statistics_code_info==server_code_info){
		statistics_success_callback(data);	
	}else{
		statistics_other_callback(server_success_info);
	}
}
/**注册成功页面跳转*/
function statistics_success_callback(data){
	
}
function statistics_other_callback(server_success_info){
	//alert("alert");
}