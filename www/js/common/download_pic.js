// JavaScript Document
var downloadPath ="file_mobile";
/**下载图片*/
function downloadPic(sourceUrl, targetUrl, picId,isBackground) {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(sourceUrl);
   
    fileTransfer.download(uri, targetUrl,
    function(entry) {
        var smallImage = document.getElementById(picId);
        
        var showImageURL = entry.toURL();
        console.log("entry.fullPath-----> " + entry.toURL());
       	if(isBackground){
       		smallImage.style.backgroundImage="url("+showImageURL+")";//"#0070DC"
       	}else{
       		smallImage.style.display = 'block';
       		smallImage.src = showImageURL; // entry.fullPath; 
       	}
      
    },
    function(error) {
        console.log("下载网络图片出现错误");
    });
}
/*加载本地的图片*/
function localFile(image_name,url,imgId,isBackground) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
    function(fileSystem) {
        //创建目录
        fileSystem.root.getDirectory(downloadPath, {
            create: true
        },
        function(fileEntry) {
            console.log("创建目录成功");
        },
        function() {
            console.log("创建目录失败");
        });
        var _localFile = downloadPath+"/"+image_name;//图片的存储运行
        var _url = url; 
        //查找文件
        fileSystem.root.getFile(_localFile, null,
			function(fileEntry) {
				//文件存在就直接显示
				var smallImage = document.getElementById(imgId);
					if(isBackground){
						// console.log("back"+fileEntry.toURL());//fileEntry.toURL();
			       		smallImage.style.backgroundImage="url("+fileEntry.toURL()+")";//"#0070DC"  //test
			       	}else{
			       		smallImage.style.display = 'block';
			       		//smallImage.src = fileEntry.toURL(); // entry.fullPath; 
			       	}
				smallImage.src = fileEntry.toURL();
				
			},
			function() {
				//否则就到网络下载图片!
				fileSystem.root.getFile(_localFile, {
					create: true
				},
				function(fileEntry) {
					var targetURL = fileEntry.toURL();
					console.log("url" + targetURL);
					downloadPic(_url,targetURL,imgId,isBackground);
				},
				function() {
					console.log('下载图片出错');
				});
			});
    },
    function(evt) {
        console.log("加载文件系统出现错误");
    });
}

function removeLocalPic(imageName){
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
    function(fileSystem) {
        //创建目录
        fileSystem.root.getDirectory(downloadPath, {
            create: true
        },
        function(fileEntry) {
            console.log("创建目录成功");
        },
        function() {
            console.log("创建目录失败");
        });
        var _localFile = downloadPath+"/"+imageName;//图片的存储运行
        //查找文件
        fileSystem.root.getFile(_localFile, null,
			function(fileEntry) {
				//文件存在就直接显示
				var imagePath = fileEntry.toURL();
				if(fileEntry.isFile){
					fileEntry.remove();//删除文件
					console.log("remove"+fileEntry.toURL());
				}else{
				}
			},
			function() {
				//否则就到网络下载图片!
				fileSystem.root.getFile(_localFile, {
					create: false
				},
				function(fileEntry) {
					
				},
				function() {
					console.log('删除图片出错');
				});
			});
    },
    function(evt) {
        console.log("加载文件系统出现错误");
    });
}

function removeCropPhoto(localPath) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
   	function(fileSystem) {
			
		fileSystem.root.getDirectory('Pictures', {
            create: true
        },
        function(fileEntry) {
            console.log("创建目录成功");
        },
        function() {
            console.log("创建目录失败");
        });
		 var _localFile = 'Pictures'+"/"+localPath;//图片的存储运行
        //查找文件
        fileSystem.root.getFile(_localFile, null,
			function(fileEntry) {
				//文件存在就直接显示
				var imagePath = fileEntry.toURL();
				if (fileEntry.isFile) {
					fileEntry.remove(); //删除文件
				} 
			},
        function() {
			console.log("file not found");
            //否则就到网络下载图片
        });
    },
    function(evt) {
        console.log("加载文件系统出现错误");
    });
}
