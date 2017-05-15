function PopUpContainer(){
	document.addEventListener("deviceready", onDeviceReady, false);
	var pictureSource; //  getPicture:数据来源参数的一个常量  
	var destinationType; // getPicture中：设置getPicture的结果类型  
	function onDeviceReady() {  
		 pictureSource = navigator.camera.PictureSourceType;  
		destinationType = navigator.camera.DestinationType;  
	}  
	var pickUrl;

	this.fromCamera = function(source){
		navigator.camera.getPicture(function(imageURI){  
				console.log("url: "+imageURI);
				var imageList= getImageList();
				imageList.push(imageURI);
				localStorage.setItem(new_Idea_Image_List, JSON.stringify(imageList));
				refresh(imageList);
			}, function(){
				if(source==pictureSource.CAMERA)  
					console.log('加载照相机出错!');
				else  
					console.log('加载相册出错!');  
			}, {  
				quality : 50,   
				destinationType : destinationType.FILE_URI,  
				sourceType : source  
		});  
	} 
	this.container_crop_hide=function(){
		$(".popup_container_background").hide();
		$(".popup_container").hide();
	}
	this.container_crop_photo_library=function(){
		this.container_crop_hide();
		this.fromCamera(navigator.camera.PictureSourceType.PHOTOLIBRARY);
	}
	this.container_crop_camera=function(){
		this.container_crop_hide();
		this.fromCamera(navigator.camera.PictureSourceType.CAMERA);
	}
	this.click_container_show=function(){
		$(".popup_container_background").show();
		$(".popup_container").show();
	}

}
