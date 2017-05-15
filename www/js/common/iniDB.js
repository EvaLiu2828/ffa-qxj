/**
 * 进入应用时建库，
 * 所有建库方法请放在这里
 */



(function initDB(){
	"use strict";
	//shimIndexedDB.__useShim();
	var db;
	// This works on all browsers, and only uses IndexedDBShim as a final fallback
	var indexedDB = window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB ||
		window.shimIndexedDB;

	if (!indexedDB) {
	window.alert("浏览器不支持indexDB！");
	}
	var DBName = indexedDB_config.DBName; 
	var DBVersion = indexedDB_config.DBVersion;	
	var verStorageName = indexedDB_config.verStorageName;	
	var cusStorageName = indexedDB_config.cusStorageName; 
	var tmplStorageName = indexedDB_config.tmplStorageName; 
	var hotQueryName = indexedDB_config.hotQueryName;
	var cellInfoName=indexedDB_config.cellInfoName;
	var rateInfoName = indexedDB_config.rateInfoName;
	var smsTmpName = indexedDB_config.smsTmpName;//短信模板表
	var tmplMenuListName = indexedDB_config.tmplMenuListName; // 模板菜单列表
	var performInfoName = indexedDB_config.performInfoName; //绩效查询表
	var salerCustomerStorageName = indexedDB_config.salerCustomerStorage;
	var verSalerCustomerStorageName = indexedDB_config.verSalerCustomerStorage;
	var teamCustomerStorageName = indexedDB_config.teamCustomerStorage;
	var customerProgressStorageName = indexedDB_config.customerProgressStorage;
	var teamProgressStorageName = indexedDB_config.teamProgressStorage;
	var teamProgressSalerStorageName = indexedDB_config.teamProgressSalerStorage;
	//start by ly
	var coinInfoName = indexedDB_config.coinInfoName; //指尖币信息表
	//end by ly
	//start by lyx
	var qsjHotQuerName = indexedDB_config.qsjHotQuerName;  //抢商机信息表
	//end by lyx

	//var noReadName = indexedDB_config.noReadFrameTmplate;
	var req = indexedDB.open(DBName, DBVersion);

	req.onsuccess = function(evt) {
		db = this.result;
		if(db.objectStoreNames.contains(verStorageName)&&db.objectStoreNames.contains(cusStorageName)&&db.objectStoreNames.contains(tmplStorageName)&&db.objectStoreNames.contains(hotQueryName)&&db.objectStoreNames.contains(cellInfoName)
			&&db.objectStoreNames.contains(rateInfoName)&&db.objectStoreNames.contains(smsTmpName)&&db.objectStoreNames.contains(tmplMenuListName)&&db.objectStoreNames.contains(performInfoName)&&db.objectStoreNames.contains(salerCustomerStorageName)
			&&db.objectStoreNames.contains(verSalerCustomerStorageName)&&db.objectStoreNames.contains(teamCustomerStorageName)&&db.objectStoreNames.contains(customerProgressStorageName)&&db.objectStoreNames.contains(teamProgressStorageName)
			//start by ly/lyx
			&&db.objectStoreNames.contains(teamProgressSalerStorageName)&&db.objectStoreNames.contains(coinInfoName)&&db.objectStoreNames.contains(qsjHotQuerName)){
			//end by ly/lyx
			console.log("indexedBD初始化成功！");
		}else{
			console.log("初始化失败，删掉库！！");
			indexedDB.deleteDatabase(DBName);
			setTimeout(initDB,500);
		}

	};
	req.onerror = function(evt) {console.log("initDb:", evt.target.error)};
	req.onupgradeneeded = function(evt) {
		console.log('upgrade');
		db = this.result;
		//初始化版本库
		var verStorage = db.createObjectStore(verStorageName, {keyPath: 'storageName'});
		//初始化客户库
		var cusStorage = db.createObjectStore(cusStorageName, {keyPath: 'phonenumber'});
		cusStorage.createIndex("by_commtionTime", "commtionTime", {unique: false});
		cusStorage.createIndex("by_createTime", "createTime", {unique: false});
		cusStorage.createIndex("by_lastUptDate", "lastUptDate", {unique: false});
		cusStorage.createIndex("by_nocontact", "nocontact", {unique: false});	//未联系过的客户索引
		//初始化模板库
		var tmplStorage = db.createObjectStore(tmplStorageName, {keyPath: 'templateId'});
		tmplStorage.createIndex("by_lastUptDate", "lastUptDate", {unique: false});
		//初始化热点表
		var hotQueryStorage = db.createObjectStore(hotQueryName, {keyPath: 'newsid'});//热点的id作为key值
		hotQueryStorage.createIndex("by_lastUptDate", "createDate", {unique: false});
		//初始化销售信息表
		var headerImageStorage = db.createObjectStore(cellInfoName,{keyPath:'phonenumber'});

		//初始化普惠金融师表
		var rateInfoStorage = db.createObjectStore(rateInfoName,{keyPath:'usercode'});

		//初始化短信模板表
		var smsTmpStorage = db.createObjectStore(smsTmpName,{keyPath:'id'});

		// 初始化模板菜单列表
		db.createObjectStore(tmplMenuListName,{keyPath:'tgroup'});

		//初始化绩效查询表
		var performInfoStorage = db.createObjectStore(performInfoName,{keyPath:'compno'});

		//初始化销售库
		var salerCusStorage = db.createObjectStore(salerCustomerStorageName, {keyPath: 'phonenumber'});
		salerCusStorage.createIndex("by_commtionTime", "commtionTime", {unique: false});
		salerCusStorage.createIndex("by_createTime", "createTime", {unique: false});
		salerCusStorage.createIndex("by_lastUptDate", "lastUptDate", {unique: false});

		// 客户经理下的客户
		db.createObjectStore(verSalerCustomerStorageName, {keyPath: 'managerId'});

		// 团队经理以及团队经理下的客户经理列表
		db.createObjectStore(teamCustomerStorageName, {autoIncrement: true});


		//客户经理进度表初始化
		var customerProgressStorage = db.createObjectStore(customerProgressStorageName, {keyPath: 'userUUID'});
		//团队经理进度表初始化
		var teamProgressStorage = db.createObjectStore(teamProgressStorageName, {keyPath: 'id'});
		teamProgressStorage.createIndex("by_receiveTime", "receiveTime", {unique: false});
		//团队经理进度-销售列表初始化
		var teamProgressSalerStorage = db.createObjectStore(teamProgressSalerStorageName, {keyPath: 'userUUID'});
        //start by ly
		//初始化指尖币信息表
		var coinInfoStorage = db.createObjectStore(coinInfoName,{keyPath:'userUUID'});
        //end by ly
		//start by lyx
		var qsjHotStorage = db.createObjectStore(qsjHotQuerName,{keyPath:'newsid'});
		qsjHotStorage.createIndex("by_lastUptDate", "createDate", {unique: false});
		//end by lyx
        //展业的列表未读信息小红点表

        //var noReadFrameTmplateStorage = db.createObjectStore(noReadName,{keyPath:'tgroupId'});
        //删除旧的数据库
        indexedDB.deleteDatabase(indexedDB_config.DBNameOld);
	};
	
})();


