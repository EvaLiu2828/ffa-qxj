/**
 * Created by 201504095248 on 2016/1/6.
 */
Array.prototype.remove=function(dx) 
{
	if(dx<0||dx>this.length){return false;} 
	for(var i=0,n=0;i<this.length;i++)
	{
		if(i!=dx)
		{
			var tmp=this[i];
			this[n]=tmp;
			n++;
		}
	}
	this.length-=1;
}
String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
}
function getImageList(){
	var strList=localStorage.getItem(new_Idea_Image_List);
	console.log("getImageList strList:" +strList);
	var imageList = new Array();
	if(strList==null||strList==""||strList=="[]"){
	}else{
		imageList = strList.split(",");
		for(var i=0;i<imageList.length;i++){
			imageList[i]=imageList[i].replace("[","");
			imageList[i]=imageList[i].replaceAll("\"","");
			imageList[i]=imageList[i].replace("]",'');
		}
	}
	return imageList;
}
function refresh(srcList){
	$(".ideaImageUl").empty();
	for(var i=0;i<srcList.length;i++){
		var imageDiv = '<li id = "item'+i+'" data-item-number=\''+i+'\' class="js-image-item'+i+'" ><div class="" style="background-image:url(\''+srcList[i]+'\'); background-size:100% 100%;"><span class=""></span><img class="ideaImg" src="../../images/del.png"></div><p></p></li>';
		$(".ideaImageUl").append(imageDiv);
		if(i==4){
			$('#item4').css("margin-right",0);
		}
		$(".js-image-item"+i).click(function () {
			var tmp = $(this).data('item-number');
			console.log('the removed item number is:' + tmp);
			srcList.remove(tmp);
			localStorage.setItem(new_Idea_Image_List,JSON.stringify(srcList));
			refresh(srcList);
		});
	}
	var cameraItem = '<li id = "camera-item"><div class=""><span class="icon-camera js-icon-camera"></span><img class="" src=""></div><p>添加图片</p></li>';
	if(srcList.length < 5){
		$(".ideaImageUl").append(cameraItem);
		$('#camera-item').css("margin-right",0);
	}
	$(".js-icon-camera").click(function () {
		var container = new PopUpContainer();
		container.click_container_show();
	});
}


;(function (FFA) {
	var Components = FFA.namespace('Components'),
		Utils = FFA.namespace("Utils"),
		confirm = null,
		loading = null,
		alert = null;
	var newIdea_loading = null;
	var is_uploading = false;
	$(function (){
		/**
		 * 限制textarea的文字输入长度
		 * */
		$(".js-ideaText").bind('input', function() {
			var MAX_LENGTH = 3000;
			var ideaText = $(".js-ideaText");
			var content = ideaText.val().trim();
			var length = content.length;
			// 截取字符串
			if (length >= MAX_LENGTH) {
				content = content.substr(0, MAX_LENGTH);
			}
			ideaText.val(content);
			localStorage.setItem(new_Idea_Content, content);
			setUploadButtonAttribute();
		});

		$(".js-input-name").bind('input', function() {
			var ideaName = $(".js-input-name");
			var content = ideaName.val();
			localStorage.setItem(new_Idea_Name, content);
			setUploadButtonAttribute();
		});

		$(".js-input-delete").tap(function () {
			console.log("js-input-delete click");
			$(".js-input-name").val('');
			localStorage.setItem(new_Idea_Name, '');
			setUploadButtonAttribute();
		});

		init();

		var container = new PopUpContainer();
		$(".js-icon-camera").click(function () {
			container.click_container_show();
		});

		//拍照
		$(".item_select_camera").click(function () {
			container.container_crop_camera();
		});
		//触摸开始事件
		$(".item_select_camera").bind("touchstart", function () {
			$(".item_select_camera").find("p").css("color", "#dcdcdc");
		});
		//触摸结束事件
		$(".item_select_camera").bind("touchend", function () {
			$(".item_select_camera").find("p").css("color", "#000000");
		});

		//从本地相册选取
		$(".item_select_album").click(function () {
			container.container_crop_photo_library();
		});
		//触摸开始事件
		$(".item_select_album").bind("touchstart", function () {
			$(".item_select_album").find("p").css("color", "#dcdcdc");
		});
		//触摸结束事件
		$(".item_select_album").bind("touchend", function () {
			$(".item_select_album").find("p").css("color", "#000000");
		});

		//取消
		$(".item_select_cancel").click(function () {
			container.container_crop_hide();
		});

		//上传
		$(".js-upload-button").click(function () {
			console.log("click");
			if($(".js-upload-button").hasClass("disabled")){
				return;
			}
			if(!is_uploading){
				is_uploading = true;
				uploadNewIdea( $(".js-input-name").val(), $(".js-ideaText").val(), getImageList());
			}
			
		});

		//点击浮层弹出框消失
		$(".js_click_mask").click(function () {
			console.log("click mask");
			$(".popup_container_background").hide();
			$(".popup_container").hide();
		});

	});
	function init() {
		$(".js-input-name").val(localStorage.getItem(new_Idea_Name));
		$(".js-ideaText").val(localStorage.getItem(new_Idea_Content));
		setUploadButtonAttribute();
		var imageList = getImageList();
		refresh(imageList);
	}
	function uploadNewIdea(name, content, photoFiles) {
		newIdea_loading = Components.Popup.Loading('C', {
			//withMask: 'C'   //蒙层类型
			content: "上传中，请稍后..."
		});
		var map = {};
		map[devUUID] = device.uuid;
		map[userUUID] = localStorage.getItem(user_uuid);
		map[phonenumber] = localStorage.getItem(me_phonenumber);
		map[ideaName] = name; //Utils.htmlEncodeByRegExp(name);   //html转码
		map[ideaContent] = content; //Utils.htmlEncodeByRegExp(content);//html转码
		var baseCode = [];
		var count = 0;
		var image = new Image();
		var compressWidth;
		if(photoFiles.length == 0){
			map[ideaPhotoFiles] = baseCode;
			console.log("upload new idea content:"+JSON.stringify(map));
			http_post(upload_newidea_interface, JSON.stringify(map), upload_newidea_success, upload_newidea_fail);
		}else {
			for(var i=0;i<photoFiles.length;i++){
				image.src = photoFiles[i];
				if(image.width > 1186){
					compressWidth = 1186;
				}else{
					compressWidth = image.width;
				}
				console.log("The image.width is:" +image.width);
				console.log("The compressWidth is:" +compressWidth);
				lrz(photoFiles[i], {
					quality: 0.7,
					width: compressWidth
				}).then(function (results) {
					count++;
					baseCode.push(results.base64);
					if(count == photoFiles.length){
						map[ideaPhotoFiles] = baseCode;
						console.log("upload new idea content:"+JSON.stringify(map));
						console.log("upload new idea upload_newidea_interface:"+upload_newidea_interface);
						http_post(upload_newidea_interface, JSON.stringify(map), upload_newidea_success, upload_newidea_fail);
					}
				});
			}
		}
	}
	function upload_newidea_success(data) {
		is_uploading = false;
		if(newIdea_loading!=null){
			newIdea_loading.remove();
		}
		if (data.codeInfo != 0) {
			Components.Popup.Alert('A', {
				content: data.msgInfo,  //显示内容
				button: '确定',   //按钮内容
				withMask: 'A'   //蒙层类型
			}, function(){

			});
		} else {
			console.log("upload newidea success");

			localStorage.setItem(new_Idea_Name,"");
			localStorage.setItem(new_Idea_Content,"");
			localStorage.setItem(new_Idea_Image_List,"");
			setTimeout(function(){
				history.back(-1);
			},1000);
			var toast = new ToastUtils();
			toast.showToast('上传成功', 1000);
		}




	}
	function upload_newidea_fail(data){
		console.log("upload newidea fail");
		is_uploading = false;
		if(newIdea_loading!=null){
			newIdea_loading.remove();
		}
		var toast = new ToastUtils();
		toast.showToast('上传失败', 3000);
	}
	function setUploadButtonAttribute(){
		if($(".js-ideaText").val().length > 0 && $(".js-input-name").val().length > 0){
		//	$(".js-upload-button").css("background-color", "#4591ff");
			$(".js-upload-button").removeClass("disabled");
		}else{
		//	$(".js-upload-button").css("background-color", "#e0e0e0");
			$(".js-upload-button").addClass("disabled");
		}
	}
})(FFA);

