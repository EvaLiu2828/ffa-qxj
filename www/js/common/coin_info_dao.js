/**
 * Created by 201507270184 on 2016/11/4.
 */
/**
 * CoinInfoDao   ָ������ݴ���
 *
 */
var CoinInfoDao = function() {

    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                       //���ݿ�����
    var coin_info_storage = indexedDB_config.coinInfoName;     // ָ������ݱ�
    var db; //���ݿ����

    // ��ʼ��
    this.init = function (callback){
        if (db) {
            callback && callback();
            return;
        }
        var req = indexedDB.open(DBName);
        req.onsuccess = function(evt) {
            //���ݿ�򿪳ɹ�
            db = req.result;
            db.onerror = function(evt){console.log("db error")};
            callback && callback();
        };
        req.onerror = function(evt) {console.log("initDb: ���ݿ��ʧ�ܣ�"+ evt.target.error)};
    };


    // �������
    this.insertData = function (data, callback){
        var tx = db.transaction(coin_info_storage, 'readwrite');
        tx.oncomplete = function() {
            callback && callback();
        };
        var store = tx.objectStore(coin_info_storage);
        store.put(data);
    };

    // ��ѯ����
    this.queryAllData = function(callback) {
        var index = db.transaction(coin_info_storage, 'readonly').objectStore(coin_info_storage);
        var data = null;
        index.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                data = cursor.value;
                cursor.continue();
            }
        };

        callback && callback(data);

    };

    // ����
    this.updateData = function(usercode, data, callback) {
        var transaction = db.transaction([coin_info_storage], 'readwrite');
        var store = transaction.objectStore(coin_info_storage);
        var req = store.get(usercode);
        req.onsuccess = function() {
            var DBdata = this.result;
            for (d in data) {
                DBdata[d] = data[d];
            }
            store.put(DBdata);

            callback && callback(data);

        }

    };

    // ͨ��Ա����Ų���Ϣ
    this.queryData = function(usercode, callback) {
        var transaction = db.transaction([coin_info_storage], 'readwrite');
        var store = transaction.objectStore(coin_info_storage);
        var req = store.get(usercode);
        req.onsuccess = function() {
            callback && callback(this.result);
        }
        req.onerror = function() {
            callback && callback(this.result);
        }
    };

    // ɾ��
    this.deleteAllData = function(callback) {
        var tx = db.transaction(coin_info_storage, 'readwrite');
        tx.objectStore(coin_info_storage).clear();
        tx.oncomplete=function(){
            callback && callback();
        }
    }
};