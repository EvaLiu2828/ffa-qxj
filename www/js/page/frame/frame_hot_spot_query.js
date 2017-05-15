// JavaScript Document
function hot_spot_query(){
	var hashMap = new HashMap();
	var hot_query_devUUID = getDeviceUUID();//"device_id";
	var hot_query_userID = get(user_uuid);
	var spot_version =  get(spot_query_version);
	hashMap.put(devUUID,hot_query_devUUID);
	hashMap.put(userUUID,hot_query_userID);
	hashMap.put(version,spot_version);
	console.log("getJsonStr(hashMap)"+getJsonStr(hashMap));
	http_post(hot_spot_query_index,getJsonStr(hashMap),hot_spot_query_success,hot_spot_query_fail);//请求网路服务
}
//start by lyx 20161206
function hot_spot_query2(){
	var hashMap = new HashMap();
	var hot_query_devUUID = getDeviceUUID();//"device_id";
	var hot_query_userID = get(user_uuid);
	var spot_version =  get(qsj_spot_query_version);
	hashMap.put(devUUID,hot_query_devUUID);
	hashMap.put(userUUID,hot_query_userID);
	hashMap.put(version,spot_version);
	console.log("getJsonStr(hashMap)"+getJsonStr(hashMap));
	http_post(hot_spot_query_index2,getJsonStr(hashMap),hot_spot_query_success2,hot_spot_query_fail2);//请求网路服务
}
//end by lyx 20161206
//原来的mine函数，在判断有缓存后，就不向后台请求了
/*function mine(mine_get_success,mine_get_fail,isQcodePage,showCellInfo){
		var cellInfoDao =new CellInfoDao();                //  新建一个数据库对象
		cellInfoDao.init(function(){
			cellInfoDao.queryHotdata(get(me_phonenumber),function(result){
				if(result){
					if(isQcodePage){
						showCellInfo(result);
					}else{
						mine_get_success_callback(result);
					}
				}else{
					var hashMap = new HashMap();
					var me_deviceUUID=getDeviceUUID();
					var me_userID=get(user_uuid);
					hashMap.put(userUUID,me_userID);
					hashMap.put(devUUID,me_deviceUUID);
					http_post(mine_interface,getJsonStr(hashMap),mine_get_success,mine_get_fail);
				}
			});
		});
}*/

//新的mine函数，会直接请求后台
function mine(mine_get_success,mine_get_fail,isQcodePage,showCellInfo){

				var hashMap = new HashMap();
				var me_deviceUUID=getDeviceUUID();
				var me_userID=get(user_uuid);
				hashMap.put(userUUID,me_userID);
				hashMap.put(devUUID,me_deviceUUID);
				http_post(mine_interface,getJsonStr(hashMap),mine_get_success,mine_get_fail);
}

//请求微店的url
function reponse_shop_url(){
	var hashMap = new HashMap();
	var shop_deviceUUID=getDeviceUUID();
	var shop_userID=get(user_uuid);
	hashMap.put(userUUID,shop_userID);
	hashMap.put(devUUID,shop_deviceUUID);
	http_post(mine_micro_shop_interface,getJsonStr(hashMap),mine_micro_shop_success,mine_micro_shop_fail);
}
		
	
