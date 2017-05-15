// JavaScript Document
var register_code_info = "0";
function register_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	
	console.log(server_success_info);
	if(server_code_info!=null&&register_code_info==server_code_info){
		//register_other_callback(server_success_info);
		register_success_callback(data);	
	}else if(server_code_info!=null&&"6"==server_code_info){
		//注册密码强度不够
		$(".register_password_fail .alt").show();
		$(".register_password_fail .altW").show();
		$(".register_password_fail .altW").find("p").text(data.msgInfo);
	}
	else{
		register_other_callback(server_success_info);
	}
}
/**注册成功页面跳转*/
function register_success_callback(data){
	var register_user_uuid=data.userUUID;
	var register_phone_number= $(".phone").val();
	var local_phonenumber = get(me_phonenumber);
	if(local_phonenumber!=null&&local_phonenumber.length>0){
		if(!(local_phonenumber==register_phone_number)){
			put(spot_query_version,"");
		}
	}
	put(user_uuid,register_user_uuid);//存放user_uuid
	put(me_phonenumber,register_phone_number);//存放手机号
	$(".success_notice .alt").show();
	$(".success_notice .altW").show();//欢迎入住，恭候多时啦！
	$(".success_notice .altW").find("p").text(data.msgInfo);	
	var time0=2;  
	//启动定时的方法显示信息成功，返回成功的数据
	function time(){
		time0=time0-1;  
		if (time0<0) {
		//----start:input login page  wangjunbao 2015-7-8 update 
		//redirect();
		$(".lgNum").val('');//手机号拦截
		login_show_login_page();
		//----end:input login page wangjunbao 2015-7-8 update 
		$(".success_notice .alt").hide();
		$(".success_notice .altW").hide();
		window.clearInterval(ti);
		$(this).addClass("a2");
		$(".regOut").hide().css("opacity", "0.65");
		$(".regInner").hide();
	};   
	}
	var ti=window.setInterval(time,1000);
}
/*返回注册非成功的code*/
function register_other_callback(server_success_info){
	//alert("alert");
	$(".show_error_dialog .alt").show();
	$(".show_error_dialog .altW").show();
	$(".show_error_dialog .altW").find("p").text(server_success_info);	
}