// JavaScript Document
var HeaderCrop=function(){
	var HeaderCrop = this;
	var header_crop_code = "0";
	this.header_crop_result=function(data){
		var server_code_info = data.codeInfo;
		var server_success_info = data.msgInfo;
		if(server_code_info!=null&&header_crop_code==server_code_info){
			this.header_crop_result_callback(data);
		}
	}
	this.header_crop_result_callback=function(data){
		var header_url = data.photoURL;
		if(header_url!=null&&header_url.length>0){
			put(header_crop_url,header_url);
			var photo_name=get(header_crop_photo_name);
			put(header_crop_photo_name,"");
			removeLocalPic(photo_name);//删除图片
				var cellInfo = new CellInfoDao();
				cellInfo.init(function(){
					cellInfo.deleteHotData(function(){
						history.go(-1);//提交成功返回上一个页面			
					});
				});
			
		}
	}	
}