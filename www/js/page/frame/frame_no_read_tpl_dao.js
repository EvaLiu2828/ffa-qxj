/**
 * Created by Administrator on 2015/10/9.
 */
(function (FFA) {
    var frameNoReadTemplete_dao = FFA.namespace('frame_no_read_templete_dao');
    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
    var DBName = indexedDB_config.keepDataDb; //数据库名称
    var no_read_frame_tmplate = indexedDB_config.noReadFrameTmplate; //未读表
    var db; //数据库对象
    frameNoReadTemplete_dao.init=function(callback){
        if(db){
            callback();
            return;
        }
        var req = indexedDB.open(DBName);
        req.onsuccess = function(evt) {
            //数据库打开成功
            db = req.result;
            db.onerror = function(evt){console.log("db error")};
            callback();
        };
        req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
    }
    frameNoReadTemplete_dao.insert=function(dataList,callbackObj){
        var tx = db.transaction(no_read_frame_tmplate,'readwrite');
        tx.oncomplete = function() {
            console.log("刷新成功！！");
        };
        var varHotQueryDao = tx.objectStore(no_read_frame_tmplate);
        for(var i in dataList){
           varHotQueryDao.put(dataList[i]);
            callbackObj(dataList[i]);//将对象传输过去，修改页面的ui
        }
    }
    frameNoReadTemplete_dao.query=function(callback){
        var index = db.transaction(no_read_frame_tmplate, 'readonly').objectStore(no_read_frame_tmplate);
        index.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                var value = cursor.value;
                callback(value);//查询出对象，将对象传输过去，用来同服务器进行数据比较
                cursor.continue();
            } else {
                callback(undefined);
            };

        };
    }

    frameNoReadTemplete_dao.update= function (tGroupId) {
        var updateTransaction = db.transaction(no_read_frame_tmplate, 'readwrite').objectStore(no_read_frame_tmplate);
        updateTransaction.get(tGroupId).onsuccess=function(event){
            var noReadObj = event.target.result;
            noReadObj.flag=0;//如果点击到某个列表项了，修改flag标示
            var request = updateTransaction.put(noReadObj);
            request.onsuccess = function(e) {

            };
            request.onerror = function(e) {
                console.log("error");
            };
        };
    }
    frameNoReadTemplete_dao.delete=function(){
        var tx = db.transaction(no_read_frame_tmplate,'readwrite');
        tx.objectStore(no_read_frame_tmplate).clear();//清除表中的数据
    }
})(FFA);