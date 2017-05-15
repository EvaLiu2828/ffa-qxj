function Header(){
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
               console.log("url"+imageURI);
			   /**控制页面的跳转*/
			   put("header_local_url",imageURI);
			   window.location.href='setting/header_crop.html';
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
	this.head_crop_hide=function(){
		$(".head_choose_background").hide();
		$(".head_choose_contain").hide();
	}
	this.head_crop_photo_library=function(){
		this.head_crop_hide();
		this.fromCamera(navigator.camera.PictureSourceType.PHOTOLIBRARY);
	}
	this.click_head_show=function(){
		$(".head_choose_background").show();
		$(".head_choose_contain").show();
	}
}
