var QCodeCellInfo=function(){
	this.showCellInfo=function(data){
		$(".sale_name").text(data.userName);
		$(".sale_position").text(data.positionName);
		if(data.headPath!=null&&data.headPath.length>0){
			var headerPhotoDownload = new HeaderPhotoDownload();
			var headerParameter={
				headPath:data.headPath,
				photoShowId:"js-header-photo",
				isBackground:true
			}
			headerPhotoDownload.header_download_pic(headerParameter);
		}	
	}
	
}
