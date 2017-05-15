// JavaScript Documenty
//var https_url="https://10.100.129.97/FFA-before/userOptController/findPassword
var https_url = "http://ffa.yixin.com/ffa/";
//----start by lyx ---
var https_url3 = "http://10.100.60.150:8080/FFA-before/";
var https_url2 = "http://10.143.32.111:8080/arena_service/api/BizGateway/";   //weitong
//----end by lyx ---
//var https_url = "https://puhui.yixin.com/ffa/";//https://puhui.yixin.com/ffa/

// 2016/07/25 by xuluning 追加（此路径固定，测试时可不用变，目前只为下载页面用）  start
var https_url_nginx = "https://download.yixin.com/look/";
// 2016/07/25 by xuluning 追加  end
/*
 * 线上：https://puhui.yixin.com/ffa/
 * 测试库： http://10.100.33.89/FFA/
 * 准生产库：http://ffa.yixin.com/--已没有此环境
 * 灰度发布：http://test-puhui.yixin.com/
 * uat: http://ffa.yixin.com/ffa/
 * 红瑞：http://10.100.60.218:8080/FFA/
 * 孙璇：http://10.100.60.131:8080/FFA-before/
 * 周玉缓：http://10.100.60.65:8080/FFA-before/
 * 杨浩龙：http://10.100.60.231:8080/FFA-before/
 * 王蔚熙：http://10.100.60.111:8080/FFA-before/
 * 魏桐：http://10.100.60.145:9090/server/api/BizGateway/
 * */
var devUUID = "devUUID"; //将imei修改成deviceUUID
var userUUID = "userUUID";//将uuid修改成userUUID
var timestamp = "timestamp";
var identifying = "identifying";
var phoneNumber = "phoneNumber";
var password = "password";
var passwordCheck = "passwordCheck";
var captcha = "captcha";
var version = "version";//版本号
var tgroup = "tgroup";//模板组别
var type = "type";//计数分类
var salerid ="salerid";//销售员的id
var templateid ="templateid";//模板的id
var newsid = "newsid";//热点的id
var phone ="phone";//手机号
var applyname = "applyname";//申请人姓名 
var type = "type";//计数的类型
var oldPassWrod="oldPassWrod";//旧密码
var newPassWord="newPassWord";//新密码
var flag="flag";//修改密码与用户反馈标识符
var userFeedback="userFeedback";//用户反馈
var compno="compno";//员工编号
var templateidList="templateidList";//模版ID数组
var versionInfo="versionInfo";//软件版本号信息
var cusName = "cusName";//新建客户姓名
var gender = "gender";//新建客户性别
var phonenumber = "phonenumber";//新建客户电话
var idnumber = "idnumber";//新建客户的身份证号
var remarks = "remarks";//新建客户备注
var optFlag = "optFlag";//标识
var deviceplatform = "deviceplatform"; //手机平台名字，Android 或者 IOS
var devicemodel = "devicemodel";
var templateOptReqList = "templateOptReqList";//模版组
var consultType = "consultType"; //咨询类型
var category = "category";//跟进类别
var inputTime = "inputTime";//录入时间
var content = "content";//内容
var createTime = "createTime";// chuang jian

var dataSource = "dataSource";//数据源

var redDot = "redDot";//小红点标识

//客户详情页面新增
var fundDemand = "fundDemand";   //资金需求
var houseGarage = "houseGarage"; //房屋情况
var carGarage = "carGarage";     //车情况
var jobType = "jobType";         //职业类型
var payrollInfo = "payrollInfo"; //工资发放方式
var intentProduct = "intentProduct";//意向产品
var paymentTime = "paymentTime"; //用款时间
var isLoans = "isLoans";         //是否办理过贷款
var isCreditCard = "isCreditCard";//是否有信用卡
var carAppraisal = "carAppraisal";//车辆自估价
var isMortgageCar = "isMortgageCar";//是否接受押车
var houseAppraisal = "houseAppraisal";//房屋自估价
var houseMortgage = "houseMortgage";//房屋抵押情况
var firstLoanAmount = "firstLoanAmount";//一抵贷款金额
var creditCardLimit = "creditCardLimit";//信用卡额度
var isMarried = "isMarried";     //是否已婚
var isHaveChildren = "isHaveChildren";//是否有孩子
var cusAge = "cusAge";           //年龄
var annualIncome = "annualIncome";//年收入
var acptMonPayment = "acptMonPayment";//可接受月还款
var cusEducation = "cusEducation";//学历
var position = "position";        //城市
var customerPageTile = "customerPageTile";//客户详情页面title
var phoneNumberListContent = "phoneNumberListContent";//客户手机号码列表

var ideaName = "ideaName";
var ideaContent = "ideaContent";
var ideaPhotoFiles = "ideaPhotoFiles";


/* 营业部/团队经理的字段标识 */

var dep_level_flag = 3;       // 营业部
var team_level_flag = 2;      // 团队
var customer_level_falg = 1; // 客户

//请求服务器的接口
var register_interface=https_url+"userOptController/register";
var login_interface=https_url+"userOptController/login";
var newpwd_interface=https_url+"userOptController/findPassword";
var changepwdAndFeedBack_interface=https_url+"customerController/upPswdAndUsrFeedback";//修改密码用户反馈
var mine_interface=https_url+"userOptController/queryUserInfo";//我的
var mine_rate_interface=https_url+"applyratingController/ratingInfo";//我的 普惠金融家
var rate_apply_interface=https_url+"applyratingController/ratingApply";//我的 普惠金融家 评级申请

var red_dot_interface=https_url+"performanceController/getRedDotInfo";//小红点
var perform_query_interface=https_url+"performanceController/getPerformanceInfo";//绩效查询

//---start by ly 20161110---
var coin_query_interface="http://10.143.32.111:8080/arena_service/api/CoinGateway/myIntegralManage";//指尖币
var coin_detail_query_interface="http://10.143.32.111:8080/arena_service/api/CoinGateway/detailManage";//指尖币交易明细
//---end by ly 20161110---

var statistics_interface =https_url+"countController/statistics";
var hot_spot_query_index=https_url+"exhibitionController/hotSpotQuery";//展业热点
//---start by lyx 20161206---
var hot_spot_query_index2=https_url+"exhibitionController/qsjHotSpotQuery";//抢商机热点
//---end by lyx 20161206---
var exit_interface=https_url+"userOptController/logOut";//退出登录
var mine_micro_shop_interface = https_url+"userOptController/myMicroShop";//我的微店
var upload_user_photo_interface=https_url+"userOptController/UploadUserPhoto";//上传头像

var get_customerlist_interface = https_url+"customerController/getCustList";//客户 获取
var update_customer_interface = https_url+"customerController/updateCust";//客户 修改
var add_phonenumber_interface = https_url+"customerController/addPhoneNumber";	//客户 添加
var query_customerdetail_interface = https_url+"customerController/queryCusDetail";	//客户 查询详情
var post_occupation_interface =https_url+"customerController/postOccupation";	//客户 占坑
var query_progress_interface =https_url+"customerController/queryCustomerInfo";	//客户 查询


var zy_list_interface=https_url+"exhibitionController/templateQuery";//展业列表
var zy_list_count_interface=https_url+"countController/querystatistics";//展业列表计数
var check_version_interface=https_url+"checkVerAndUpOptTimeController/checkVerAndUpOptTime";
var upload_newidea_interface=https_url+"upLoadNewIdeaController/uploadNewIdea";

var zy_list_menu_interface = https_url+"exhibitionController/categoryQuery";// 展业列表菜单
var honor_rank_interface = https_url+"countController/honorCount";//荣誉排行接口

var upload_deviceinfo_interface=https_url+"checkVerAndUpOptTimeController/savePhoneInfo";//上传机型接口
var addCustomer_add_interface=https_url+"customerController/updateCust";//新建客户接口
var frame_progress_interface = https_url+"ScheduleController/progressDetails";//进度接口
var frame_progress_team_interface = https_url+"ScheduleController/teamManagerProgress";//进度团队经理接口
var frame_un_read_templete=https_url+"exhibitionController/unReadTemplete";//未读模板的接口
var addCustomerRule_interface = https_url + "customerController/queryOccupationDetail";//占坑规则显示
var createFollowRecord_interface= https_url +"customerController/createFollowRecord";//创建和删除跟踪记录
var microShopCount_interface = https_url+"countController/microShopCount";//微店计数接口
var dailyReport_interface=https_url+"dailyPaperController/dailyPaperInfo";//日报接口
var dailyReport_reply_interface=https_url+"dailyPaperController/replyPaperInfo";//日报回复接口
var download_url_address="static/download.html";
var download_url_share_icon="static/iconImage.jpg";
var weibo_share_icon="static/weiboImage.jpg";

/*  团队经理的接口 */
var get_teamData_interface = https_url + "teamCusController/getTeamCusList";         // 团队经理
var get_departmentData_interface = https_url + "teamCusController/getTeamCusList";  // 营业部经理

/* 团队经理查看客户经理的客户接口 */
var get_salerCustList_interface = https_url+"teamCusController/getSalerCustList";//客户 获取

/*---start by lyx 20161103---*/
/* 抢商机列表接口 */
var get_allNicheList_interface = https_url2+"AllNicheList";//抢商机 获取
/* 抢商机列表接口 */
var get_nicheInfo_interface = https_url2+"NicheDetails";//客户 获取
/* 抢商机列表接口 */
var get_grabNiche_interface = https_url2+"GrabNiche";//客户 获取
/*---end by lyx 20161103--*/

function hideLoadingA(){
	$(".com-popup-loading-a").remove();
}

/**注册成功*/
var register_success=function(data){
	hideLoadingA();
	register_hide();
	$(".zc").removeClass("a2");
	register_response_result(data);
};
/**注册失败*/
var register_fail=function(){
	//redirect();
	$(".zc").removeClass("a2");
	timeOut();
	register_hide();
};
/**隐藏注册的对话框*/
function register_hide(){
	$(".regOut").hide();
	$(".regInner").hide();
		
}
/**获取验证码成功*/
var get_verification_code_success=function(data){
	hideLoadingA();
	//console.log("data->"+data.msgInfo);
	register_hide();
	verfication_response_result(data);
};
/**获取验证码失败*/
var get_verification_code_fail = function(){
	//verfication_success_callback();
	timeOut();
	controller_ui(true);
};
/**登陆成功*/
var login_success=function(data){
	hideLoadingA();
	//新增，获取职位信息并且存储进localStorage
	var server_me_position=data.position;
	localStorage.setItem("localStorage_position",server_me_position);

	loginHide();
	login_response_result(data);
	console.log("login_success -> last_login_time: "+last_login_time);
	localStorage.setItem(last_login_time, new Date().getTime());
	var hashMap = new HashMap();
	var deviceUUID=getDeviceUUID();
	var userID=localStorage.getItem(user_uuid);//get(user_uuid);
	var myPhoneNumber=localStorage.getItem(me_phonenumber);
	var platform_flag = device.platform;
	var device_mode = device.model.replace(/-/g, "##");
	device_mode = device_mode.replace(/,/g, "&&");
	hashMap.put(devUUID,deviceUUID);
	hashMap.put(userUUID,userID);
	hashMap.put(phonenumber,myPhoneNumber);
	hashMap.put(deviceplatform, platform_flag);
	hashMap.put(devicemodel, device_mode);
	console.log("uploadDeviceInfo upload_deviceinfo_interface:" + upload_deviceinfo_interface);
	console.log("uploadDeviceInfo JsonStr:" + getJsonStr(hashMap));
	http_post_sync(upload_deviceinfo_interface, getJsonStr(hashMap), upload_deviceinfo_success, upload_deviceinfo_fail);
};
/**登陆失败*/
var login_fail=function(){
	loginHide();
	timeOut();
};
/**上传机型信息成功*/
var upload_deviceinfo_success=function(data){
	console.log("upload deviceinfo success msgInfo:" +data.msgInfo);
};

/**上传机型信息失败*/
var upload_deviceinfo_fail=function(){
	console.log("upload deviceinfo fail");
};

/**隐藏对话框*/
function loginHide(){
	$(".logOut").hide();
	$(".logInner").hide();
	$(".log").removeClass("a2");
}
function timeOut(){
	hideLoadingA();
	$(".show_error_dialog .alt").show();
	$(".show_error_dialog .altW").show();
	$(".show_error_dialog .altInner").find("p").text("超时，请注意…超时，请注意…超时，请注意…");	
}
/**设置新密码成功*/
var new_pwd_success=function(data){
	alert("new_pwd_success"+data.msgInfo);
	newPwdHide();
	new_pwd_response_result(data);	
};
/**设置新密码失败*/
var new_pwd_fail=function(){
	alert("new_pwd_fail");
	newPwdHide();
};
/**隐藏对话框*/
function newPwdHide(){
	$(".pasOut").hide();
	$(".pasInner").hide();
}
/*修改密码成功*/
function change_pwd_success(data){
	//$(".chg-passwordSuccess").removeClass("ndis");
	
	change_pwd_response_result(data);
}
/*修改密码失败*/
function change_pwd_fail(){
	$(".chg_loading").addClass("ndis");
	$(".chg_noNet").removeClass("ndis");
	//alert("chucuole");
	//$(".chg-passWordold").css("visibility","visible");	//alert("chucuole");
}
/*调用计数的接口*/
var statistics_success=function(data){
	
};
var statistics_fail = function(){
};
//反馈信息请求服务器成功
var customerfeedback_success=function(data){
	hideLoadingA();
	//$(".cfb-alert,.cfb-alert2").removeClass("ndis");
	customerfeedback_response_result(data);
};
//反馈信息请求服务器失败
var  customerfeedback_fail=function(){
	//$(".cfb-alert,.cfb-alert2").removeClass("ndis");
	$(".cfb_loading").addClass("ndis")
	$(".cfb_noNet").removeClass("ndis");
};
/*热点查询成功*/
var hot_spot_query_success = function (data){
	console.log("success");
	login_response_result(data);
};
/**热点查询失败*/
var hot_spot_query_fail = function(){
	console.log("fail");
	var hotQuery = new HotQuery();
	query_version_equals(true,null);//如果失败，直接查询
};
//----start for lyx 20161206 -----
/**抢商机热点查询成功**/
var hot_spot_query_success2 = function (data){
	console.log("success");
	login_response_result2(data);
};
/**抢商机热点查询失败*/
var hot_spot_query_fail2 = function(){
	console.log("fail");
	var hotQuery = new HotQuery();
	query_version_equals2(true,null);//如果失败，直接查询
};
//----end for lyx 20161206 -----
/**我获取信息请求服务器成功*/
var mine_get_success=function(data){
	$(".me_loading").addClass("ndis");
	mine_response_result(data);
};
/**我获取信息请求服务器失败*/
var mine_get_fail=function(){
	$(".me_loading").addClass("ndis");
	console.log("我获取信息请求服务器失败");

};

/**退出登录请求服务器成功*/
var mine_exit_success=function(data){
	exit_response_result(data);
};
/**退出登录请求服务器失败*/
var mine_exit_fail=function(){
	console.log("mine_exit_fail_error!");
	put(user_uuid,"");
};
/**展业模板列表请求服务器成功*/
var zy_list_success=function(data){
    zy_list_response_result(data);//回调
};
/**展业模板列表请求服务器失败*/
var zy_list_fail=function(){
	console.log("展业列表error!,,");
    zy_list_error_callback();
};

/**展业模板列表计数请求服务器成功*/
var zy_list_counts_success=function(data){
//alert("计数请求成功"+JSON.stringify(data.dataMap));
};
/**展业模板列表计数请求服务器失败*/
var zy_list_counts_fail=function(){
	//alert("计数请求失败error!,,");
};

/**检查软件版本号请求服务器成功*/
var check_version_success=function(data){
	check_version_response_result(data);
};
/**检查软件版本号请求服务器失败*/
var check_version_fail=function(){
	//xhr,e
	//console.log(e);
	//console.log(xhr);
};
/**我的微店成功*/
var mine_micro_shop_success=function(data){
	var mine_micro_shop=new MineMicroShop();
	mine_micro_shop.mine_micro_shop_result(data);
};
/**我的微店失败*/
var mine_micro_shop_fail=function(){

};
var header_crop_success=function(data){
	var header_crop = new HeaderCrop();
	header_crop.header_crop_result(data);
	back_up_page();
};
var header_crop_fail=function(){
	back_up_page();
};
function back_up_page(){
	$(".pasOut").hide();
     $(".pasInner").hide();
}

// 刷新延迟秒杀
var refreshDelay = 2000;

/**
 * 延迟动画效果
 * @param oScroll 对象
 * @param stime 触发的开始时间
 * @param delay 延迟的时间
 */
function iscrollRefresh(oScroll, stime, delay) {
    var _diff  = ((new Date()).getTime()) - stime;
    console.log('*****间隔时间：' + _diff);
    if ( _diff < refreshDelay ) delay = refreshDelay;
    setTimeout(function(){ oScroll.refresh(); },delay);
}

/**
 * 设置用户级别
 * @param level_code
 */
function setUserLevel(level_code) {
	level_code = parseInt(level_code) || customer_level_falg; // 用户级别，3，营业部经理；2，团队经理；1，客户经理(默认)
	// TODO: 此处代码是防止出现“团队经理”和“客户经理”以外的级别，导致出现错误。
	if (level_code != team_level_flag) level_code = customer_level_falg;
	put(user_level_flag, level_code);
}

