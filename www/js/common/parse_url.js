// JavaScript Document
/**解析url获取员工的id*/
var ParseUrl=function(){
	this.spliteURL = function(url) {
		 return splParams(url,true);
	};
	this.unDecodeUriParams=function(url,isDecode){
		return splParams(url,isDecode);
	};
	function splParams(url,isDecode){
//		alert('isDecode')
		var hashMap = new HashMap();
		var sHref = url;
		var args = sHref.split("?");
		var retval = "";
		/*参数为空*/
		if (args[0] == sHref){
			return retval;
		}
		var str = args[1];
		args = str.split("&");
		for (var i = 0; i < args.length; i++){str = args[i];
			var arg = str.split("=");
			if (arg.length <= 1) {
				continue;
			} else {
				if(isDecode){
					hashMap.put(arg[0],decodeURI(arg[1]));
				}else{
					hashMap.put(arg[0],arg[1]);
				}

			}
		}
		return hashMap;
	}
	this.spliteUrlLink=function(url){
		var sHref = url; //"Untitled-2.html?id=2"
		var args = sHref.split("?");
		return args[0];
	}
}
