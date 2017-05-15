// JavaScript Document
var new_pwd_code_info = "0";
function new_pwd_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	if(server_code_info!=null&&new_pwd_code_info==server_code_info){
		new_pwd_success_callback(data);	
	}else{
		new_pwd_other_callback(server_success_info);
	}
}
/**设置新密码成功页面跳转*/
function new_pwd_success_callback(data){
	window.location.replace('../login/login.html');//跳转到登录页面重新登录
	//redirect();
}
function new_pwd_other_callback(server_success_info){
	//alert("alert");
	$(".show_error_dialog .alt").show();
	$(".show_error_dialog .altW").show();
	$(".show_error_dialog .altInner .p1").text(server_success_info);
	//$(".show_error_dialog .altInner .p1").text(server_success_info);	
}