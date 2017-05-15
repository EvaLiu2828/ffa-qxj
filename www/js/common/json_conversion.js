// JavaScript Document
/**从服务器添加*/
function getHashMap(){
	var personaldata = window.JsAndJavaCommon.getJsAndJavaCommon();
    if(personaldata)
    {
		var hashMap = new HashMap();
		hashMap.put("key",personaldata.getImei());
		hashMap.put("phone",personaldata.getPhoneNumber());
		return hashMap ;
	}
}
/**获取设备的UUID*/
function getDeviceUUID(){
	var deviceUUID;
	deviceUUID = localStorage.getItem("phone_uuid");
	if(deviceUUID){
		return deviceUUID;
	}else{
		deviceUUID = device.uuid;
		localStorage.setItem("phone_uuid",deviceUUID);
		return deviceUUID;
	}
}
/**获取设别的手机号*/
function getPhoneNumber(){
	var platform = device.platform;
	var android = "Android";
	var phoneNumber ="";
	if(android==platform){
		var extraInfo = cordova.require('com.creditease.ffa.extrainfo.ExtraInfo');
    	if(extraInfo!=null)
    	{
			extraInfo.getSim1Number(onSuccess, onError);
			function onSuccess(data){
				phoneNumber = data;
			}
	
			function onError(err){
				phoneNumber = "";
			}
		}	
	}
	return phoneNumber;
}
/**生成json的数据*/
function getJsonStr(hashMap){
	var keySet = hashMap.keySet();
	var left="{";
	var right="}";
	var sp = "\""
	var json=left;
	var length = hashMap.size();
	for(var i in keySet){
		var key=keySet[i];
		var value = hashMap.get(key);
		if(i<(length-1)){
            if(value!=null&&value.length>0){
               var firstChar= value.substr(0,1);
                if(firstChar==="["){
                    json+=sp+key+sp+":"+value+",";
                }else{
                    json+=sp+key+sp+":"+sp+value+sp+",";
                }
            }else{
                json+=sp+key+sp+":"+sp+value+sp+",";
            }
		}else{
            if(value!=null&&value.length>0){
                var firstChar= value.substr(0,1);
                if(firstChar==="["){
                    json+=sp+key+sp+":"+value;
                }else{
                    json+=sp+key+sp+":"+sp+value+sp;
                }
            }else{
                json+=sp+key+sp+":"+sp+value+sp;
            }
			//json+=sp+key+sp+":"+sp+value+sp;
		}
	}
	json=json+right;
	return json;
}