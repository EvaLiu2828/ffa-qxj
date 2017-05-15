// JavaScript Document
var HeadCropUpload = function() {
	var headCrop = this;
    this.loading = null;
    this.photoUpload = function(cropzoom,headerImage,screen_width,screen_height) {
        headCrop.loading = null;
        headCrop.showDialog({withMask: 'A'});
		var params = cropzoom.getPhotoParams({});
		var x = params.selectorX;
		var y = params.selectorY;
		var w = params.selectorW;
		var h = params.selectorH;
		var image = new Image();
		//获取Canvas对象(画布)
		var canvas = document.getElementById("myCanvas");
		if (canvas.getContext) {
			//获取对应的CanvasRenderingContext2D对象(画笔)
			var ctx = canvas.getContext("2d");
			//创建新的图片对象
			var img = new Image();
			//指定图片的URL
			img.src = headerImage;
			//浏览器加载图片完毕后再绘制图片
			img.onload = function() {

				//以Canvas画布上的坐标(10,10)为起始点，绘制图像
				var scale_w = (img.width / screen_width);
				var scale_h = (img.height / screen_height);
				x = x * scale_w;
				y = y * scale_h;
				w = w * scale_w;
				h = h * scale_h;
				canvas.width = w;
				canvas.height = h;
				//ctx.drawImage(img, 0, 0, 400, 300); 
				var crm = ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
				//var vData = canvas.toDataURL("image/png");
				var platform = device.platform;
                var android = "Android";
                var phoneNumber ="";
                if(android==platform){
                    headCrop.saveLocalUpload(canvas);
        		}else{
                    headCrop.saveImage(canvas);
                      
                }
			}
		}
    }
    this.saveLocalUpload=function(canvas) {
        window.canvas2ImagePlugin.saveImageDataToLibrary(
                    function(msg){//msg 返回的是图片的路径
                        headCrop.zipPhoto(msg,200, function() {
                                console.log('压缩结束'+msg);
                                var photo_name =getImgName(msg);
                                console.log("imgPath"+photo_name);
                                removeCropPhoto(photo_name);//压缩结束后删除本地的文件
                            },function (base64) {
                               headCrop.upload(base64.split(',')[1]);
                            });
                    },
                    function(err){
                        console.log(err);
                        
                    },
                    canvas);				
	}
    this.saveImage = function(canvas) { //getResults();
       var data = canvas.toDataURL();
        // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
        /*data = data.split(',')[1];
        data = window.atob(data);
        var ia = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i);
        };
        // canvas.toDataURL 返回的默认格式就是 image/png
        var blob = new Blob([ia], {
            type: "image/png"
        });*/
		//对图片的压缩处理
		 headCrop.zipPhoto(data,200, function() {
                               
                            },function (base64) {
                               headCrop.upload(base64.split(',')[1]);
                            });
      
    }
	/*获取图片的宽高*/
    this.drawImage = function(ImgD, w, h) {
        var image = new Image();
        var data_array = new Array();
        image.src = ImgD.src;
        if (image.width > 0 && image.height > 0) {
            //flag=true;
            if ((image.width / image.height) >= w / h) {
                if (image.width > w) {
                    data_array[0] = w;
                    data_array[1] = (image.height * w) / image.width;
                } else {
                    data_array[0] = image.width;
                    data_array[1] = image.height;
                }
            } else {
                if (image.height > h) {
                    data_array[1] = h;
                    data_array[0] = (image.width * h) / image.height;
                } else {
                    data_array[0] = image.width;
                    data_array[1] = image.height;
                }
            }
            return data_array;
        }
        return data_array;
    }
    this.upload = function(strBase64) {
        //var strBase64 = encodeURIComponent(vDate);
        var hashMap = new HashMap();
        var deviceUUID = getDeviceUUID();
        var userID = localStorage.getItem(user_uuid); //get(user_uuid);
        hashMap.put(userUUID, userID);
        hashMap.put(devUUID, deviceUUID);
        hashMap.put("myfiles",strBase64); //strBase64 strBase64 strBase64.split(',')[1]
        var json_str = getJsonStr(hashMap);
        http_post(upload_user_photo_interface, getJsonStr(hashMap),
        header_crop_success,header_crop_fail);
    }
	this.zipPhoto=function(data,width,zipAlwarys,zipDone){
        lrz(data, {
            quality: 0.7,
            width: width
        }).then(function (results) {
            zipAlwarys();
            zipDone(results.base64);
        });
		 /*lrz(data, {
            quality: 0.7,
            width: width,
            before: function() {
                console.log('压缩开始');
            },
            fail: function(err) {
                console.error(err);
            },
            always: function() {
				zipAlwarys();	
			},
            done: function(results) {
				zipDone(results.base64);
               //headCrop.upload(results.base64.split(',')[1]);
            }
        });*/
	}
	this.showDialog=function(options){
		//$(".pasOut").show();
		//$(".pasInner").show();
        options = options || {};

        var Components = FFA.namespace('Components');
        headCrop.loading = Components.Popup.Loading('A',options);

    }
	this.hideDialog = function(){
		//$(".pasOut").hide();
		//$(".pasInner").hide();
        var loading = headCrop.loading;
        if (loading) loading.remove();
	}
}