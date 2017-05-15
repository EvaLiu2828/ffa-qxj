var CellInfoDao=function(){
	var indexedDB = window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB ||
		window.shimIndexedDB;
	var DBName = indexedDB_config.DBName; //数据库名称
	var cell_info_storage_name = indexedDB_config.cellInfoName; //热点表
	var db; //数据库对象 
	this.init=function (cellCallback){
		if(db){
			console.log("db对象已存在!");
			return;
		}
		var req = indexedDB.open(DBName);
		req.onsuccess = function(evt) {
				//数据库打开成功
				db = req.result;
				db.onerror = function(evt){console.log("db error")};
				cellCallback();
		};
		req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
	}
	this.insertData=function (cell_info,callback){
		var tx = db.transaction(cell_info_storage_name,'readwrite');
		tx.oncomplete = function() {
			callback();
			console.log("刷新成功！！");
		};
		var varHotQueryDao = tx.objectStore(cell_info_storage_name);
		var cusReqAdd = varHotQueryDao.put(cell_info);
		
	};
	this.queryHotdata=function (phoneNumber,dataCallback){
		var index = db.transaction([cell_info_storage_name], 'readonly').objectStore(cell_info_storage_name);//.index('by_lastUptDate');
        var transaction = db.transaction([cell_info_storage_name], 'readwrite');
		var store = transaction.objectStore(cell_info_storage_name);
		var req = store.get(phoneNumber);
		req.onsuccess= function(evt){
			
			dataCallback(this.result);
		};
		req.onerror = function(evt){
			dataCallback(this.result);
		};
	}
	this.deleteHotData=function(clearCallback){
		var tx = db.transaction([indexedDB_config.verStorageName,
		indexedDB_config.cusStorageName,
		indexedDB_config.tmplStorageName,
		indexedDB_config.hotQueryName,indexedDB_config.cellInfoName],'readwrite');
		tx.objectStore(indexedDB_config.cellInfoName).clear();
		tx.oncomplete=function(){
			clearCallback();
		}
	}
	
}
