// JavaScript Document
//2015-7-7
//添加退出的js文件
function SystemExit(){
	this.exit=function(flag,deleteDbSuccess,isSaveUserId){
        var hashMap = this.clearCache(flag,deleteDbSuccess,true,isSaveUserId); // 清除所有的缓存
	 	http_post(exit_interface,getJsonStr(hashMap),mine_exit_success,mine_exit_fail);
	};
    /**
     * clearCache               清除缓存
     * @param flag             判断是否退出应用
     * @param deleteDbSuccess  删库成功后的回调函数
     * @param isExit           判断是否退出应用,(主要针对1.5版本的bug修复)
     */
    this.clearCache = function(flag,deleteDbSuccess,isExit,isSaveUserId) {
        isExit = isExit; // 是否退出应用，默认是true;
        console.log("isExit"+isExit);
        // 设置userid 和 UUID
        var hashMap = new HashMap();
        hashMap.put(userUUID,get(user_uuid));
        hashMap.put(devUUID,getDeviceUUID());

        //清空图片缓存的数据
        clearDirectoryPhoto();

        // 清库
        var indexedDB = window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;

        var db; //数据库对象
        var DBName = indexedDB_config.DBName; //数据库名称
        if(db){
            console.log("db对象已存在!");
            clearDBAndOtherData(db, flag, deleteDbSuccess,isExit,isSaveUserId);
        }else{
            var req = indexedDB.open(DBName);
            req.onsuccess = function(evt) {
                db = req.result;
                clearDBAndOtherData(db, flag, deleteDbSuccess,isExit,isSaveUserId);
            };
            req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
        }


        // 设置初始值
        localStorage.setItem("localStorage_name","");
        localStorage.setItem("localStorage_city","");
        localStorage.setItem("localStorage_number","");
        localStorage.setItem("localStorage_department","");
        sessionStorage.setItem("pageName", "exhibition");
        //---------start by ly
        localStorage.setItem("localStorage_coin","");
        //----------end by ly

        // Android 系统，进行clearCache和clearHistory处理
        if(equalsIgnoreCase(device.platform, "Android")) {
            navigator.app.clearCache();
            navigator.app.clearHistory();
        }

        window.plugins.jPushPlugin.setAlias("");

        return hashMap;
    };

	function clearDBAndOtherData(db, flag, deleteDbSuccess,isExit,isSaveUserId) {
        // 删除 版本库，客户表， 模板表，热点表，个人信息
        var tx = db.transaction([indexedDB_config.verStorageName,
                indexedDB_config.cusStorageName,
                indexedDB_config.tmplStorageName,
                indexedDB_config.hotQueryName,
                indexedDB_config.cellInfoName,
                indexedDB_config.rateInfoName,
                indexedDB_config.performInfoName,
                indexedDB_config.salerCustomerStorage,
                indexedDB_config.verSalerCustomerStorage,
                indexedDB_config.teamCustomerStorage,
                indexedDB_config.customerProgressStorage,
                indexedDB_config.teamProgressStorage,
                indexedDB_config.teamProgressSalerStorage,
                //start by ly
                indexedDB_config.coinInfoName,
                //end by ly
                //start by lyx
                indexedDB_config.qsjHotQuerName],'readwrite');
                //end by lyx
            //,indexedDB_config.noReadFrameTmplate
            tx.objectStore(indexedDB_config.verStorageName).clear();
            tx.objectStore(indexedDB_config.cusStorageName).clear();
            tx.objectStore(indexedDB_config.tmplStorageName).clear();
            tx.objectStore(indexedDB_config.hotQueryName).clear();
            tx.objectStore(indexedDB_config.cellInfoName).clear();
            tx.objectStore(indexedDB_config.rateInfoName).clear();  // 清除普惠金融师的数据
            tx.objectStore(indexedDB_config.performInfoName).clear();  // 清除绩效查询的数据
            tx.objectStore(indexedDB_config.salerCustomerStorage).clear();
            tx.objectStore(indexedDB_config.verSalerCustomerStorage).clear();
            tx.objectStore(indexedDB_config.teamCustomerStorage).clear();

            tx.objectStore(indexedDB_config.customerProgressStorage).clear();  // 清除客户经理进度的数据
            tx.objectStore(indexedDB_config.teamProgressStorage).clear();  // 清除团队经理进度的数据
            tx.objectStore(indexedDB_config.teamProgressSalerStorage).clear();  // 清除团队经理进度-销售列表的数据
            //start by ly
            tx.objectStore(indexedDB_config.coinInfoName).clear();  // 清除指尖币的数据
            //end by ly
            //start by lyx
            tx.objectStore(indexedDB_config.qsjHotQuerName).clear();
            //end by lyx
		   //tx.objectStore(indexedDB_config.noReadFrameTmplate).clear();

			tx.oncomplete = function(){
                // 临时保存 手机号码，版本号，规则闪动，秀出你的金点子的蒙层显示
				var phoneNumber=localStorage.getItem("me_phonenumber");
				var stored_version_info = localStorage.getItem(version_info);
				var addCustomerRule = localStorage.getItem(addCustomer_flash_flag);
                var gold_idea_flag = localStorage.getItem(template_list_gold_idea_flag);
                var lastLoginTime =localStorage.getItem(last_login_time);
                var user_id=localStorage.getItem(user_uuid);
                // 清除所有的本地缓存和会话缓存
				localStorage.clear();
				sessionStorage.clear();
                // 保存 手机号码，版本号，规则闪动，秀出你的金点子的蒙层显示
                console.log("user_id"+user_id);
                if(user_id&&isSaveUserId){
                    localStorage.setItem(last_login_time,lastLoginTime);
                    localStorage.setItem("user_uuid", user_id);
                }
                if(phoneNumber){
                    localStorage.setItem("me_phonenumber", phoneNumber);
                }
                if(stored_version_info){
                    localStorage.setItem(version_info, stored_version_info);
                }
                if(addCustomerRule){
                    localStorage.setItem("addCustomer_flash_flag", addCustomerRule);
                }
                if(gold_idea_flag){
                    localStorage.setItem(template_list_gold_idea_flag, gold_idea_flag);
                }

				console.log("clearDBAndOtherData function flag:" + flag);
                if(deleteDbSuccess){
                    deleteDbSuccess();
                }
                /**
                 *  flag 判断是否退出应用
                 *        false 表示直接退出app,因为Ios有bug,所以直接替换到登录页。
                 *        ture  直接到登录页。
                 */
                if (isExit) {
                    if(flag) {
                        if(isInRootDirectory(window.location.href)) {
                            window.location.replace('login/login.html');
                        }else {
                            window.location.replace('../login/login.html');
                        }
                    } else {
                        if(equalsIgnoreCase(device.platform, "ios")) {
                            console.log("Just go to login screen, since it can't quit when call app.exitApp in ios");
                            if(isInRootDirectory(window.location.href)) {
                                window.location.replace('login/login.html');
                            }else {
                                window.location.replace('../login/login.html');
                            }
                        } else {
                            navigator.app.exitApp();
                        }
                    }
                }

			}
	}

	function clearDirectoryPhoto(){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function(fileSystem) {
				//创建目录
				fileSystem.root.getDirectory(downloadPath, {
					create: true
				},
				function(fileEntry) {
					if(fileEntry.isDirectory){
						fileEntry.removeRecursively();
					}
				},
				function() {

				});
			},
			function(evt) {
				console.log("加载失败");
			}
	  );
}
}
