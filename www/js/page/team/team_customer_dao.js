/**
 * 团队经理以及团队经理下的客户经理列表的IndexedDB操作
 */
function teamCustomerDAO() {
    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                       //数据库名称
    var storage = indexedDB_config.teamCustomerStorage;
    var db; //数据库对象

    return {
        // 初始化标识
        inited: false,
        /**
         * 初始化
         * @returns {*}
         */
        init: function() {
            var deferred = $.Deferred();
            var req = indexedDB.open(DBName); // 打开数据库
            req.onsuccess = function(e) {
                //数据库打开成功
                db = e.target.result;
                db.onerror = function(e){
                    console.log("db error")
                };
                console.log("********** teamCustomerDAO initing *************");
                this.inited = true;
                deferred.resolve(this);
            };
            req.onerror = function(e) {
                console.log("initDb: 数据库打开失败！"+ e.target.error);
                deferred.reject(e);
            };
            return deferred.promise();
        },
        /**
         * 查询所有的数据
         * @returns {*}
         */
        queryAll: function() {
            var deferred = $.Deferred();
            var index = db.transaction(storage, 'readonly').objectStore(storage);
            var cursorReq = index.openCursor();
            cursorReq.onsuccess = function(e) {
                var cursor = e.target.result;
                if (cursor) {
                    deferred.resolve(0,cursor.value);
                } else {
                    deferred.resolve(1, null);
                }
            };
            cursorReq.onerror = function(e) {
                deferred.reject(2, e);
            };
            return deferred.promise();
        },
        /**
         * 插入数据库
         * @param data
         * @returns {*}
         */
        insert: function(data) {
            var deferred = $.Deferred();
            var tx = db.transaction(storage, 'readwrite');

            var store = tx.objectStore(storage);
            var req = store.put(data);
            req.onsuccess = function() {
                deferred.resolve();
            };
            req.onerror = function() {
                deferred.reject();
            };
            return deferred.promise();
        },
        getDB: function() {
            return db;
        },
        // 删除
        deleteAllData: function() {
            var deferred = $.Deferred();
            var tx = db.transaction(storage, 'readwrite');
            var req = tx.objectStore(storage).clear();
            req.onsuccess = function() {
                deferred.resolve();
            };
            req.onerror = function() {
                deferred.reject();
            };
            return deferred.promise();
        }

    };
}