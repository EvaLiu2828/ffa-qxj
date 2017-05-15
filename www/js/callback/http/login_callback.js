// JavaScript Document
var login_code_info = "0";
function login_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	if(server_code_info!=null&&login_code_info==server_code_info){
		login_success_callback(data);	
	}else{
		login_other_callback(server_success_info);
	}
}
/**注册成功页面跳转*/
function login_success_callback(data){
	var login_user_uuid=data.userUUID;
	var login_phone_number= $(".lgNum").val();
	var local_phonenumber = get(me_phonenumber);
	if(local_phonenumber!=null&&local_phonenumber.length>0){
		if(!(local_phonenumber==login_phone_number)){
			put(spot_query_version,"");
		}
	}
	put(user_uuid,login_user_uuid);//存放user_uuid
	put(me_phonenumber,login_phone_number);//存放手机号
	setUserLevel(data.position);

	redirect("");
}
function login_other_callback(server_success_info){
	//alert("alert");
	$(".show_error_dialog .alt").show();
	$(".show_error_dialog .altW").show();
	$(".show_error_dialog .altW").find("p").text(server_success_info);
	//$(".show_error_dialog .altInner .p1").text(server_success_info);	
}