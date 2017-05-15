// JavaScript Document
// JavaScript Document
var hot_spot_query_info = "0";
function login_response_result(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	//console.log("json"+JSON.stringify(data));
	if(server_code_info!=null&&hot_spot_query_info==server_code_info){
		hot_spot_query_callback(data);
	}else{
		hot_spot_query_other_callback(data);
	}
}
/**注册成功页面跳转*/
function hot_spot_query_callback(data){
	var currentVersion = get(spot_query_version);
	var serverVersion = data.version;
	console.log("currentVersion"+currentVersion);
	console.log("serverVersion"+serverVersion);
	if(serverVersion==currentVersion){
		query_version_equals(true,data);
	}else{
		hot_spot_query_i=0;
		query_version_equals(false,data);
	}
	
}
// var hot_spot_query_info = "0";
//---start by lyx 20161206---
/**抢商机成功**/
function login_response_result2(data){
	var server_code_info = data.codeInfo;
	var server_success_info = data.msgInfo;
	//console.log("json"+JSON.stringify(data));
	if(server_code_info!=null&&server_code_info === '0'){
		qsj_hot_spot_query_callback(data);
	}else{
		hot_spot_query_other_callback(data);
	}
}
/**抢商机成功页面跳转*/
function qsj_hot_spot_query_callback(data){
	var currentVersion = get(spot_query_version);
	var serverVersion = data.version;
	console.log("currentVersion"+currentVersion);
	console.log("serverVersion"+serverVersion);
	if(serverVersion==currentVersion){
		query_version_equals2(true,data);
	}else{
		hot_spot_query_i=0;
		query_version_equals2(false,data);
	}

}
//---end by lyx 20161206---
function hot_spot_query_other_callback(data){
}
/**展业失败**/
function query_version_equals(versionIsEquals,data){
	var hotQuery = new HotQuery();
	if(versionIsEquals){
		hotQuery.init(function (){
			queryCallback();
		});
	}else{
		var serverVersion = data.version;
		put(spot_query_version,serverVersion);
		hotQuery.init(function (){
			hotQuery.deleteHotData();//删除接口
			hotQuery.insertData(data,queryCallback);//添加接口
		});
	}
	function queryCallback(){
		var time0 = 1;
		function time() {
			time0 = time0 - 1;
			if (time0 < 0) {
				hotQuery.queryHotdata();
				window.clearInterval(ti);
			};
		}
		var ti = window.setInterval(time, 100);	
	}	
}
//---start by lyx 20161206---
/**抢商机失败**/
function query_version_equals2(versionIsEquals,data){

	var hotQuery = new HotQuery(indexedDB_config.qsjHotQuerName);
	if(versionIsEquals){
		hotQuery.init(function (){
			queryCallback();
		});
	}else{
		var serverVersion = data.version;
		put(spot_query_version,serverVersion);
		hotQuery.init(function (){
			hotQuery.deleteHotData();//删除接口
			hotQuery.insertData(data,queryCallback);//添加接口
		});
	}
	function queryCallback(){
		var time0 = 1;
		function time() {
			time0 = time0 - 1;
			if (time0 < 0) {
				hotQuery.queryHotdata();
				window.clearInterval(ti);
			};
		}
		var ti = window.setInterval(time, 100);
	}
}
//---end by lyx 20161206---
function hot_spot_query_callback1(){
	var data = {};
	data.isUpdate = true;
	data.version ="2"
	data.add = hot_query_data;
	hot_spot_query_callback(data);
}
var hot_spot_query_i=0;
/*加载本地的图片*/
function hot_spot_query_callback2(value){
	var  swipeId="swipe" + hot_spot_query_i;
	put(swipeId,value.newsid);
	console.log(value.title);
	if(value.image!=null&&value.image.length>0){
		var imageName = getImgName(value.image);
		localFile(imageName,value.image,swipeId,true);
		hot_spot_query_i++;
	}

}
/*删除本地的图片*/
function delte_object_callback(value){
	if(value.image!=null&&value.image.length>0){
		var imageName = getImgName(value.image);
		removeLocalPic(imageName);
	}
}
