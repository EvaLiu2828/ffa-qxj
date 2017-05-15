/**
 * Created by v-qizhongfang on 2015/7/8.
 */
/**
 * indexedDBDAOFactory defferjs 版本
 * 传入的对象不能有null 或者 undefine 字段
 * 使用Utils.filter()方法过滤
 *
 * @version .5
 * @param DBconfig
 * @returns {*}
 */
function indexedDBDAOFactory(DBconfig) {
    "use strict";
    //shimIndexedDB.__useShim();
    //IOS8兼容

    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;


    var db; //db对象
    var DBName = DBconfig.DBName; //数据库名称
    var verStorageName = DBconfig.verStorageName;	//更新时间表
    var storageName = DBconfig.cusStorageName; 	//操作表

    return {
        inited: false,
        /**
         *
         * @param printItem //打印方法
         * @param divPoint
         * @param indexName
         * @returns {*}
         */
        getByCursor: function (printItem, divPoint, indexName) {
            var deferred = $.Deferred();
            var tx,
                storage;
            if (typeof printItem !== "function") {
                throw Error('参数应为打印方法，请传入方法');
            }
            tx = db.transaction(storageName, 'readonly');

            storage = tx.objectStore(storageName);
            if (indexName) {
                if (typeof indexName === 'string') {
                    storage = storage.index(indexName);
                } else {
                    throw Error('索引名应为字符串');
                }
            }
            var upperBoundRange = IDBKeyRange.upperBound(divPoint, true);
            var cursorReq = storage.openCursor(upperBoundRange, 'prev');
            cursorReq.onsuccess = printItem;
            cursorReq.onerror = function (e) {
                //console.log("游标取值失败..\n" + e.target.error);
                deferred.reject(e);
            };
            return deferred.promise();
        },
        /**
         *
         * @param a 增
         * @param d 删
         * @param u 改
         * @param updateTime    时间戳
         * @returns {*}
         */
        updateLocalDB: function (a, u, d, updateTime) {
            //参数检查
            if (!(a instanceof Array && d instanceof Array && u instanceof Array)) {
                throw Error('增删改字段应为数组。');
            }
            if (!(typeof updateTime === 'string')) {
                throw Error('刷新时间应为字符串。');
            }
            var deferred = $.Deferred();
            var tx = db.transaction([verStorageName, storageName], 'readwrite');
            tx.oncomplete = function (e) {
                //console.log('indexedDB更新成功');
                deferred.resolve();
            };
            tx.onabort = function () {
                //console.log('indexedDB更新失败');
                deferred.reject();
            };
            var updVerReq = tx.objectStore(verStorageName).put({'storageName': storageName, 'updateTime': updateTime});
            updVerReq.onsuccess = function (e) {
                //console.log('indexedDB版本时间戳更新成功');
            };
            var cusStorage = tx.objectStore(storageName);
            var i;
            for (i in d) {
                if (d.hasOwnProperty(i) && d[i][phonenumber]) {
                    var delReq = cusStorage.delete(d[i][phonenumber]);
                    delReq.onsuccess = function (e) {
                        //console.log('indexedDB删除条目成功');
                    }
                }
            }
            //添加
            for (i in a) {
                if (a.hasOwnProperty(i) && a[i][phonenumber]) {
                    var addReq = cusStorage.put(a[i]);
                    addReq.onsuccess = function (e) {
                        //console.log('indexedDB添加条目成功');
                    }
                }
            }
            //修改
            for (i in u) {
                if (u.hasOwnProperty(i) && u[i][phonenumber]) {
                    var updReq = cusStorage.put(u[i]);
                    updReq.onsuccess = function (e) {
                        //console.log('indexedDB修改条目成功');
                    }
                }
            }
            return deferred.promise();
        },
        /**
         * 更新条目
         * @param entry
         * @returns {*}
         */
        updateItem: function (entry) {
            //参数检查
            if (!(entry instanceof Object)) {
                throw Error('参数应该为对象。');
            }
            var deferred = $.Deferred();
            var tx = db.transaction([storageName], 'readwrite');
            var storage = tx.objectStore(storageName);
            var req = storage.put(entry);
            req.onsuccess = function (e) {
                //console.log('更新条目成功');
                deferred.resolve();
            };
            req.onerror = function (e) {
                //console.log("更新条目失败..\n" + e.target.error);
                deferred.reject();
            };
            return deferred.promise();
        },
        /**
         * 删除条目
         * @param key
         * @returns {*}
         */
        deleteItem: function (key) {
            key = key.toString();
            var deferred = $.Deferred();
            console.log(db);
            console.log(db.transaction);
            var tx = db.transaction([storageName], 'readwrite');
            var storage = tx.objectStore(storageName);
            try {
                var req = storage.delete(key);
                req.onsuccess = function (e) {
                    //console.log('删除条目成功');
                    deferred.resolve(e.target.result);
                };
                req.onerror = function (e) {
                    //console.log("删除条目失败..\n" + e.target.error);
                    deferred.reject();
                }
            } catch (e) {
                //console.log(e);
            }
            return deferred.promise();
        },
        /**
         * 根据key获取条目
         * @param key
         * @returns {*}
         */
        getItem: function (key) {
            key = key.toString();
            var deferred = $.Deferred();
            var tx = db.transaction([storageName], 'readonly');
            var storage = tx.objectStore(storageName);
            var req = storage.get(key);
            req.onsuccess = function (e) {
                //console.log("获取条目成功..");
                deferred.resolve(e.target.result);
            };
            req.onerror = function (e) {
                //console.log("获取条目失败..\n" + e.target.error);
                deferred.reject();
            };
            return deferred.promise();
        },

        /**
         * 获取更新时间
         */
        getUpdateTime: function () {
            var deferred = $.Deferred();
            var tx = db.transaction([verStorageName], 'readonly');
            var storage = tx.objectStore(verStorageName);
            var req = storage.get(storageName);
            req.onsuccess = function (e) {
                console.log("获取上次更新时间成功..");
                var result = e.target.result;
                deferred.resolve(result ? result.updateTime : "");
            };
            req.onerror = function (e) {
                //console.log("获取上次更新时间成功失败..\n" + e.target.error);
                deferred.reject();
            };
            return deferred.promise();

        },

        /**
         * 获取本地数据条数
         * @param indexName 可选参数 传入索引按照索引查询
         * @returns {*}
         */
        getCount: function (indexName) {
            var deferred = $.Deferred();
            var tx = db.transaction([storageName], 'readonly');
            var storage;

            //设置索引边界 indexedDB
            //var lowerBoundRange = IDBKeyRange.lowerBound("1", "999999999999999999999999");

            if(indexName){
                storage = tx.objectStore(storageName).index(indexName);
            }else{
                storage = tx.objectStore(storageName);
            }

            var req = storage.count();
            req.onerror = function (evt) {
                //console.log("get count fail..\n" + evt.target.error);
                deferred.reject();
            };
            req.onsuccess = function (evt) {
                //console.log("get count success..\n" + evt.target.error);
                deferred.resolve(evt.target.result);
            };
            return deferred.promise();
        },

        /**
         * 获取db对象
         * @returns {*}
         */
        getDB: function () {
            return db;
        },

        /**
         * 初始化
         * @type {*|Window}
         */
        init: function(){
            var deferred = $.Deferred();
            var openDBReq = indexedDB.open(DBName);
            openDBReq.onsuccess = function (e) {
                db = e.target.result;
                db.onabort = function (e) {
                    //console.log(e)
                };
                db.onerror = function (e) {
                    //console.log(e)
                };
                this.inited = true;
                deferred.resolve(this);
            };
            openDBReq.onerror = function (e) {
                //console.log('indexedDBDAO初始化失败');
                //console.log(e);
                deferred.reject(e);
            };
            return deferred.promise();
        }
    };
}
