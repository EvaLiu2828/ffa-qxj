/**
 * 客户经理进度数据库操作
 */
var CustomerProgressDao = function() {

    //ios8 bug修复
    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                           //数据库名称
    var storage_name = indexedDB_config.customerProgressStorage;     // 客户经理进度列表
    var db; //数据库对象

    // 初始化
    this.init = function (callback){
        if (db) {
            callback && callback();
            return;
        }
        var req = indexedDB.open(DBName);
        req.onsuccess = function(evt) {
            //数据库打开成功
            db = req.result;
            db.onerror = function(evt){console.log("db error")};
            callback && callback();
        };
        req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
    };


    // 插入操作
    this.insertData = function (data, callback){
        var tx = db.transaction(storage_name, 'readwrite');
        tx.oncomplete = function() {
            callback && callback(data);
        };
        var store = tx.objectStore(storage_name);
        //  for (d in data) {
        store.put(data);
        //   }

    };

    // 查询
    this.queryData = function(id, callback) {
        var tx = db.transaction(storage_name, 'readwrite');
        var store = tx.objectStore(storage_name);
        var req = store.get(id);
        req.onsuccess = function() {
            callback && callback(this.result);
        }
        req.onerror = function() {
            callback && callback(this.result);
        }
    };

    // 更新
    this.updateData = function(id, data, callback) {
        var tx = db.transaction([storage_name], 'readwrite');
        var store = tx.objectStore(storage_name);
        var req = store.get(id);
        req.onsuccess = function() {
            var DBdata = this.result;
            for (d in data) {
                DBdata[d] = data[d];
            }
            store.put(DBdata);

            callback && callback(data);

        }

    };

};

/**
 * 团队经理进度销售列表数据库操作
 */
var TeamProgressSalerDao = function(){
    //ios8 bug修复
    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                           //数据库名称
    var storage_name = indexedDB_config.teamProgressSalerStorage;     // 团队经理进度销售列表
    var db; //数据库对象

    // 初始化
    this.init = function (callback){
        if (db) {
            callback && callback();
            return;
        }
        var req = indexedDB.open(DBName);
        req.onsuccess = function(evt) {
            //数据库打开成功
            db = req.result;
            db.onerror = function(evt){console.log("db error")};
            callback && callback();
        };
        req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
    };


    // 插入操作
    this.insertData = function (data, callback){
        var tx = db.transaction(storage_name, 'readwrite');
        tx.oncomplete = function() {
            callback && callback(data);
        };
        var store = tx.objectStore(storage_name);
        //  for (d in data) {
        store.put(data);
        //   }

    };

    // 查询
    this.queryData = function(id, callback) {
        var tx = db.transaction(storage_name, 'readwrite');
        var store = tx.objectStore(storage_name);
        var req = store.get(id);
        req.onsuccess = function() {
            callback && callback(this.result);
        }
        req.onerror = function() {
            callback && callback(this.result);
        }
    };

    // 更新
    this.updateData = function(id, data, callback) {
        var tx = db.transaction([storage_name], 'readwrite');
        var store = tx.objectStore(storage_name);
        var req = store.get(id);
        req.onsuccess = function() {
            var DBdata = this.result;
            for (d in data) {
                DBdata[d] = data[d];
            }
            store.put(DBdata);

            callback && callback(data);

        }

    };
};

/**
 * 团队经理进度数据库操作
 */
var TeamProgressDao = function(){
    //ios8 bug修复
    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                           //数据库名称
    var storage_name = indexedDB_config.teamProgressStorage;     // 团队经理进度列表
    var db; //数据库对象



    // 初始化
    this.init = function (callback){
        if (db) {
            callback && callback();
            return;
        }
        var req = indexedDB.open(DBName);
        req.onsuccess = function(evt) {
            //数据库打开成功
            db = req.result;
            db.onerror = function(evt){console.log("db error")};
            callback && callback();
        };
        req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
    };


    // 插入操作
    this.insertData = function (data, callback){
        var tx = db.transaction(storage_name, 'readwrite');
        tx.oncomplete = function() {
            callback && callback(data);
        };
        var store = tx.objectStore(storage_name);
        //console.log("data = "+data);
        var d;
        for (d in data) {
            store.put(data[d]);
        }

    };

    // 查询,id代表销售ID
    this.queryData = function(id, callback) {

        var index = db.transaction(storage_name, 'readonly').objectStore(storage_name).index("by_receiveTime");
        var data = [];
        var upperBoundOpenKeyRange = IDBKeyRange.upperBound("9999-99-99 99:99:99", true);
        index.openCursor(upperBoundOpenKeyRange, 'prev').onsuccess = function(e){
            var cursor = e.target.result;
            if(cursor) {
                var value = cursor.value;
                if(id == "00000000000000000000"){
                    //查询全部
                    data.push(cursor.value);

                } else {
                    if(compnoSubstr(id) == value.userUUID){
                        data.push(value);
                    }
                }
                cursor.continue();
            } else {
                callback && callback(data);
            }
        };
    };

    // 删除,id代表销售ID
    this.deleteData = function(id, callback) {
        var tx = db.transaction(storage_name, 'readwrite');
        if(id == "00000000000000000000"){
            //删除全部
            tx.objectStore(storage_name).clear();
            tx.oncomplete = function(){
                callback && callback();
            }

        } else {
            var index = tx.objectStore(storage_name);
            index.openCursor().onsuccess = function(e) {
                var cursor = e.target.result;
                if(cursor){
                    var value = cursor.value;
                    if(compnoSubstr(id) == value.userUUID){
                        index.delete(value.id);
                    }
                    cursor.continue();
                } else {
                    callback && callback();
                }
            }
        }

    }

};