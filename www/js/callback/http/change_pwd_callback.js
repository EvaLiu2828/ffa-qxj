// JavaScript Document
var change_pwd_code_info = "0";
function change_pwd_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	//alert("data.msgInfo="+data.msgInfo);
	//alert("data.codeInfo"+data.codeInfo);
	//console.log(server_success_info);
	if(server_code_info!=null&&change_pwd_code_info==server_code_info){
		change_pwd_success_callback(data);	
	}else{
		change_pwd_other_callback(server_success_info);
	}
}
/**修改密码成功*/
function change_pwd_success_callback(data){
	$(".chg-passwordSuccess").removeClass("ndis");
	$(".chg-alt3,.chg-alt4,.chg-alt5").addClass("ndis");
	put(user_uuid,"");
}
function change_pwd_other_callback(server_success_info){
	$(".chg-alt3,.chg-alt4,.chg-alt5").addClass("ndis");
	$(".chg-passwordFail").removeClass("ndis");
	$(".chg-passwordFail-words").text(server_success_info);
	
}

