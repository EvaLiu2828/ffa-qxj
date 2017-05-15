var HeaderPhotoDownload=function(){
	this.header_download_pic=function(headerParameter){
		var photoName=get(header_crop_photo_name);
		if(photoName==null||photoName.length==0){
			photoName=new Date().getTime()+getImgName(headerParameter.headPath);
			put(header_crop_photo_name,photoName);
		}
		localFile(photoName,headerParameter.headPath,headerParameter.photoShowId,headerParameter.isBackground);
	//	$(".change_header").css("background-image",'url('+data.headPath+'?id='+Math.random()+')');
		put(header_crop_url,headerParameter.headPath);
	}
}
