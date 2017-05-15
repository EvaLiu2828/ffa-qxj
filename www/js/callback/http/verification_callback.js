// JavaScript Document
var verfication_code_info = "0";
function verfication_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	console.log("server_success_info"+server_success_info);
	console.log("code_info"+server_code_info);
	console.log("code_info"+data.captcha);
	if(server_code_info!=null&&verfication_code_info==server_code_info){
		//register_other_callback(server_success_info);
		verfication_success_callback(data);	
	}else{
			controller_ui(true);//还原ui
		verfication_other_callback(server_success_info);
	}
}
/**获取验证码页面*/
function verfication_success_callback(data){
	$(this).addClass("a2");
	$(".regOut").hide().css("opacity", "0.65");
	$(".regInner").hide();
	$(".success_notice .alt").show();
	$(".success_notice .altW").show();
	$(".success_notice .altW").find("p").text(data.msgInfo);	
		var time0=2;  
		function time(){
			time0=time0-1;  
			if (time0<0) {
			$(".success_notice .alt").hide();
			$(".success_notice .altW").hide();
			window.clearInterval(ti);
			};   
		}
		var ti=window.setInterval(time,1000);
}
function verfication_other_callback(server_success_info){
	$(".show_error_dialog .alt").show();
	$(".show_error_dialog .altW").show();
	$(".show_error_dialog .altW").find("p").text(server_success_info);
}
