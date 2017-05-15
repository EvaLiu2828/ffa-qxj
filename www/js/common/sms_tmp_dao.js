/**
 * Created by 201507270184 on 2016/5/17.
 * SmsTmpDao短信模板数据处理
 */
var SmsTmpDao = function() {

    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                       //数据库名称
    var sms_tmp_storage = indexedDB_config.smsTmpName;    // 短信模板数据表

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
            db.onerror = function(evt){console.log("sms db error")};
            callback && callback();
        };
        req.onerror = function(evt) {console.log("initDb: 数据库打开失败！sms-----"+ evt.target.error)};
    };


    // 插入操作
    this.insertData = function (data, callback){
        var tx = db.transaction(sms_tmp_storage, 'readwrite');
        tx.oncomplete = function() {
            callback && callback(data);
        };
        var store = tx.objectStore(sms_tmp_storage);
        store.put(data);
    };

    // 查询所有
    this.queryAllData = function(callback) {
        var index = db.transaction(sms_tmp_storage, 'readonly').objectStore(sms_tmp_storage);
        var data = [];
        index.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                //data.push(cursor.value);
                //data.push(cursor.key);
                var obj={
                    key:cursor.key,
                    value:cursor.value.content
                };
                data.push(obj);
                cursor.continue();
            } else {
                callback && callback(data);
            }
        };
    };
    //获取最后一条记录的key
    this.getLastId = function(callback) {
        var index = db.transaction(sms_tmp_storage, 'readonly').objectStore(sms_tmp_storage);
        var id = null;
        index.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                id = cursor.value.id;
                cursor.continue();
            } else {
                callback && callback(id);
            }
        };

    };
    // 更新
    this.updateData = function(id, data, callback) {
        //console.log(id);
        var transaction = db.transaction([sms_tmp_storage], 'readwrite');
        var store = transaction.objectStore(sms_tmp_storage);
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
    //
    // 通过id查信息
    this.queryData = function(id, callback) {
        var transaction = db.transaction([sms_tmp_storage], 'readwrite');
        var store = transaction.objectStore(sms_tmp_storage);
        var req = store.get(id);
        req.onsuccess = function() {
            callback && callback(this.result);
        }
        req.onerror = function() {
            callback && callback(this.result);
        }
    };

    //
    // 删除全部数据
    this.deleteAllData = function(callback) {
        var tx = db.transaction(sms_tmp_storage, 'readwrite');
        tx.objectStore(sms_tmp_storage).clear();
        tx.oncomplete=function(){
            callback && callback();
        }
    };
    //
    //删除一条数据
    this.deleteData = function(id,callback) {
        var tx = db.transaction(sms_tmp_storage, 'readwrite');
        tx.objectStore(sms_tmp_storage).delete(id);
        tx.oncomplete=function(){
            callback && callback();
        }
    };
};
