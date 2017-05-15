/**
 * Created by Administrator on 2015/11/6.
 */
/**
 * 进入应用时建库，
 * 所有建库方法请放在这里
 */
(function initDB(){
    "use strict";
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
    var DBName = indexedDB_config.keepDataDb;//db名字
    var DBVersion = indexedDB_config.frameNoRedDotVerion;//数据库版本
    var noReadName = indexedDB_config.noReadFrameTmplate;
    var req = indexedDB.open(DBName, DBVersion);
    req.onsuccess = function(evt) {
        db = this.result;
        if(db.objectStoreNames.contains(noReadName)){
            console.log("indexedBD初始化成功！");
        }else{
            console.log("初始化失败，删掉库！！");
            indexedDB.deleteDatabase(DBName);
            setTimeout(initDB,500);
        }

    };
    req.onerror = function(evt) {console.log("initDb:", evt.target.error)};
    req.onupgradeneeded = function(evt) {
        db = this.result;
        //展业的列表未读信息小红点表
        var noReadFrameTmplateStorage = db.createObjectStore(noReadName,{keyPath:'tgroupId'});
        //删除旧的数据库
        indexedDB.deleteDatabase(indexedDB_config.DBNameOld);
    };
})();