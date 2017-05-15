// JavaScript Document
var customerfeedback_code_info = "0";
function customerfeedback_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	//alert("data.codeInfo="+data.codeInfo);
	//alert("data.msgInfo="+data.msgInfo);
	//console.log("用户反馈:"+JSON.stringify(data));
	console.log(server_success_info);
	if(server_code_info!=null&&customerfeedback_code_info==server_code_info){
		customerfeedback_success_callback(data);	
	}else if(server_code_info!=null&&"11"==server_code_info){
		//输入项包含特殊字符
		$(".cfb_loading").addClass("ndis");
		$(".cfb_specialChar").removeClass("ndis");
		$(".cfb-special-word").text(server_success_info);

	}else{
		customerfeedback_other_callback(server_success_info);
	}
}
/**反馈完成*/
function customerfeedback_success_callback(data){
	$(".cfb_loading").addClass("ndis");
	$(".cfb_success").removeClass("ndis");
	
}
function customerfeedback_other_callback(server_success_info){
	$(".cfb_loading").addClass("ndis");
	//$(".cfb-alert,.cfb-alert2").removeClass("ndis");
}

