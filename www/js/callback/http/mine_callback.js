// JavaScript Document
var mine_code_info = "0";
function mine_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	var server_me_Name = data.userName;
	var server_me_deptName = data.deptname;
	var server_me_phonenumber = data.phonenumber;
	var server_me_workaddr = data.workaddr;
	//alert("data.codeInfo="+data.codeInfo);
	//alert("data.msgInfo="+data.msgInfo);
	//console.log(server_success_info);
	//console.log("server_me_Name------>"+server_me_Name);
	if(server_code_info!=null&&mine_code_info==server_code_info){
		var cellInfo = new CellInfoDao();
		cellInfo.init(function(){
			cellInfo.insertData(data,function(){
		
			});
		});
		mine_get_success_callback(data);
		
	}else{
		mine_get_other_callback(server_success_info);
			
	}
}

/**获取信息成功*/
function mine_get_success_callback(data){
	$(".me_loading").addClass("ndis");
	var server_me_Name = data.userName;
	var server_me_deptName = data.deptname;
	var server_me_phonenumber = data.phonenumber;
	var server_me_workaddr = data.workaddr;
	//新增，获取职位信息和是否显示日报信息
	var server_me_position=data.position;
	var server_me_showPaper =data.dailypaperFlag;
	//---start by ly 20161031---
	//获取指尖币数量
	var server_me_coin = data.coins;
	//---end by ly 20161031---
	$(".localStorage-name").text(server_me_Name);
	$(".localStorage-city").text(server_me_workaddr+" -");
	$(".localStorage-number").text(server_me_phonenumber);
	$(".localStorage-department").text(server_me_deptName);
	//---start by ly 20161031---
	//指尖币数量渲染页面
	$(".localStorage-coin").text(server_me_coin);
	//---end by ly 20161031---
	//判断是否显示日报
	if (server_me_showPaper =="1"){
		$(".dailyPaper").css("display","block");
	}else{
		$(".dailyPaper").css("display","none");
	}
	//background: url(../images/icon.png) top center no-repeat;
	if(data.headPath!=null&&data.headPath.length>0){
		var headerPhotoDownload = new HeaderPhotoDownload();
		var headerParameter={
			headPath:data.headPath,
			photoShowId:"js-header-photo",
			isBackground:true
		}
		headerPhotoDownload.header_download_pic(headerParameter);
	}
	//alert("server_me_Name"+server_me_Name);

	var personal_information=new Array();
	var localStorage_name=$(".localStorage-name").text();
	var localStorage_city=$(".localStorage-city").text();
	var localStorage_number=$(".localStorage-number").text();
	var localStorage_department=$(".localStorage-department").text();
	personal_information=[localStorage_name,localStorage_city,localStorage_number,localStorage_department];
	//console.log(personal_information);
	//localStorage.setItem("personal_information",personal_information);
	localStorage.setItem("localStorage_name",localStorage_name);
	localStorage.setItem("localStorage_city",localStorage_city);
	localStorage.setItem("localStorage_number",localStorage_number);
	localStorage.setItem("localStorage_department",localStorage_department);
	localStorage.setItem("localStorage_position",server_me_position);
	localStorage.setItem("localStorage_showPaperFlag",server_me_showPaper);
	//---start by ly 20161031---
	localStorage.setItem("localStorage_coin",server_me_coin);
	//---end by ly 20161031---

	// 设置用户级别
	setUserLevel(server_me_position);



	//console.log(localStorage_name);
}
function mine_get_other_callback(server_success_info){
	console.log(server_success_info);
}
