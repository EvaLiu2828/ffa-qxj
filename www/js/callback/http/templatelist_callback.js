// JavaScript Document
var zy_array = new Array();

var tp = refresh_pagination({
    DBName: indexedDB_config.DBName, //数据库名称
    verStorageName: indexedDB_config.verStorageName,	//版本库,记录更新时间戳
    zyStorageName: indexedDB_config.tmplStorageName //模板表

}, {
    sortType: "by_lastUptDate", //初始化排序索引名
//	sortDirection : "prev",	//初始排序方向为倒序（暂时不可改正序还没做）
    items_first_page: 5,	//首页显示条数
    items_per_page: 5, //每页加载条数
    id: "yrd-content",
    key: "templateId"
}, printItem);

function zy_list_response_result(data) {
    var server_code_info = data.codeInfo;
    var server_success_info = data.msgInfo;
    var zy_list_code_info = "0";
    if (server_code_info != null && zy_list_code_info == server_code_info) {
        zy_list_success_callback(data);
    } else {
        zy_list_other_callback(server_success_info);
    }
}
/**展业列表返回数据成功展示数据*/
function zy_list_success_callback(data) {
    console.log("展业返回信息回调" + JSON.stringify(data));
    //zy_myScroll.refresh();
    tp.deleteDBData(data);
    //
    zy_value_to_view(data);
}
function zy_list_other_callback(server_success_info) {

}

/**列表返回失败
 *
 */
function zy_list_error_callback() {
//    $("#yrd-content").html('');
//    var stime = get('pullRefreshStartTime');
//    var delay = 0;
////    if ((((new Date()).getTime()) - stime) < refreshDelay ) delay = refreshDelay;
////    setTimeout(function(){ zy_myScroll.refresh(); },delay);
//
//    iscrollRefresh(zy_myScroll, stime, delay);
}

/**
 * 给view展示层传值
 * @param data
 */
function zy_value_to_view(data) {
    sessionStorage.setItem("zy_list_timestamp", data["timestamp"]);//服务器返回时间戳
}




/**
 * 数据库操作
 * @param DBconfig
 * @param options
 * @param printItem
 */
function refresh_pagination(DBconfig, options, printItem) {

    //ios8 bug修复
    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;


    var DBName = DBconfig.DBName; //数据库名称
    var verStorageName = DBconfig.verStorageName;	//版本库,记录更新时间戳
    var zyStorageName = DBconfig.zyStorageName; //展业模板表
    var db; //数据库对象

    var _sortType = options.sortType || "by_createTime"; //初始化排序方式
    var _sortDirection = options.sortDirection || "prev";	//初始排序方向
    var items_first_page = options.items_first_page;	//首页显示条数
    var items_per_page = options.items_per_page; //每页加载条数
    var id = options.id;	//容器div
    var key = options.key;	//主键

    var count = items_first_page;	//页面下次打印至第count条数据
    var displayed = []; //页面上显示的模板
    var pointer = 0; //记录已经打印的数据条数
    var divPoint = '9999999999999'; //最后一个数据的时间戳（记录取出位置）
    var _pid = get('zhanye-number-pid');	//模板组



    return {

        init: function (isContentRefresh) {
            put('pullRefreshStartTime', (new Date()).getTime());
            if (db) {
                console.log("db对象已存在!");
                checkNewData(true,isContentRefresh);
                return;
            }
            var req = indexedDB.open(DBName);
            req.onsuccess = function (evt) {
                //数据库打开成功
                db = req.result;
                db.onerror = function (evt) {
                    console.log("db error")
                };
                console.log('init invoke');
                // checkNewData();
                checkNewData(true,isContentRefresh);
            };
            req.onerror = function (evt) {
                console.log("initDb: 数据库打开失败！" + evt.target.error)
            };
        },
        /**
         * 刷新
         */
        refresh: function () {
            zy_array = new Array();
            checkNewData();
        },
        deleteDBData: function (data) {
            var index = db.transaction(zyStorageName, 'readwrite').objectStore(zyStorageName);
            index.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var value = cursor.value;
                    var _tgroupId = get('zhanye-number');	//模板组
                    if (_tgroupId + '' === value.tgroupId + '') {
                        index.delete(value.templateId);
                    } else {
                        // 删除菜单时，对应的菜单也删除
                        var cidArr = get("tempCids").split(","); // 菜单数组
                        if (!contains(cidArr, value.tgroupId)) {
                            index.delete(value.templateId);
                        }
                    }
                    cursor.continue();
                } else {
                    tp.wirteToDatabase(data);
                    //删除数据库结束
                    // console.log("删除成功");
                }
            }
        },
        /**
         * 往数据库添加数据
         * @param data
         */
        wirteToDatabase: function (data) {
            var tx = db.transaction([verStorageName, zyStorageName], 'readwrite');
            tx.oncomplete = function () {

            };
            var verStorage = tx.objectStore(verStorageName);
            var _tgroupId = get("zhanye-number");
            var verReq = verStorage.get(zyStorageName + '_' + _tgroupId);		//取出上次刷新时间戳
            verReq.onerror = function (evt) {
                console.log("版本号读取失败！\n" + evt.target.error)
            };
            verReq.onsuccess = function (evt) {
                var updatedate = verReq.result ? verReq.result['updatedate'] : '';
            }
            verStorage.put({
                'storageName': zyStorageName + '_' + _tgroupId,
                'updatedate': data.timestamp
            });		//记录刷新时间戳
            var cusStorage = tx.objectStore(zyStorageName);
            var addLen = data.newList || data.newList.length;
            if (addLen) {//长度不全为0，有更新
                //添加


              //  if (addLen) {
                    for (var i in data.newList) {
                        var zy_db_data = cusStorage.put(FFA.Utils.filter(data.newList[i]));
                        zy_array.push(data.newList[i]);
                    }
                //}
            } else {
                console.log("没有更新~.~");
            }

            tx.oncomplete = function () {
                reset();
                tp.print()//打印
            };
        },

        /**
         * indexedDB取数据
         * @param {Object} keyword    //key为搜索关键字不传打印全部
         */
        print: function (fn) {
            tp.display();
            //    zy_myScroll.refresh();
        },
        display: function (firstLoad) {
            var index = db.transaction(zyStorageName, 'readonly').objectStore(zyStorageName).index(_sortType);
            var upperBoundOpenKeyRange = IDBKeyRange.upperBound(divPoint, true);
            index.openCursor(upperBoundOpenKeyRange, 'prev').onsuccess = function (event) {
                var cursor = event.target.result;
                console.log("cursor=" + cursor);

                var stime = get('pullRefreshStartTime');
                var delay = 0;

                if (cursor) {
                    var value = cursor.value;
                    divPoint = value[_sortType.replace('by_', '')];
                    if (pointer < count) {

                        // 全部
                        var is_full = get("zhanye-number-full") || 'false';
                        console.log(is_full);
                        if (is_full == 'true') {
                            console.log('全部');
                            if (_pid == value.parentId) {
                                displayed.push(value);
                                printItem(value, 0);//打印
                                pointer++; //计数
                            }
                        } else {
                            console.log('其他');
                            var _tgroupId = get('zhanye-number');	//模板组
                            var tgroupId = value.tgroupId;

                            if (_tgroupId + '' === tgroupId + '') {
                                displayed.push(value);
                                printItem(value, 0);//打印
                                pointer++; //计数
                            }
                        }

                        cursor.continue();
                    } else {
                        // zy_myScroll.refresh();
                        iscrollRefresh(zy_myScroll, stime, delay);

                        if (firstLoad) {
                            tp.refresh();//xian
                        }
                    }

                } else {
                    console.log("end----------------->");
                    if (!firstLoad) {

//                      zy_myScroll.refresh();
                        iscrollRefresh(zy_myScroll, stime, delay);

                        //数据不够,显示敬请期待
                        if (pointer === 0) {
                            zy_wait();
                        }
                    } else {

                        iscrollRefresh(zy_myScroll, stime, delay);
                    //    zy_myScroll.refresh();

                        tp.refresh();
                    }
                }
            }

        },
        zy_nextPage: function () {
            nextPage();
        }

    }
    function reset() {
        displayed = [];
        count = items_first_page;
        pointer = 0; //指针位置置零
        divPoint = '9999999999999'; //分割点
        $('#pullUp').show();
        document.getElementById(id).innerHTML = '';
    }

}


/**
 * 菜单数据库操作
 */
var TemplateMenuDao = function() {

    //ios8 bug修复
    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                           //数据库名称
    var storage_name = indexedDB_config.tmplMenuListName;     // 菜单列表
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
        console.log('菜单操作-插入');
        console.log(data);
        var tx = db.transaction(storage_name, 'readwrite');
        tx.oncomplete = function() {
            callback && callback(data);
        };
        var store = tx.objectStore(storage_name);
      //  for (d in data) {
            store.put(data);
     //   }

    };

    // 通过组别id获取模板菜单列表
    this.queryData = function(tgroupid, callback) {
        var tx = db.transaction(storage_name, 'readwrite');
        var store = tx.objectStore(storage_name);
        var req = store.get(tgroupid);
        req.onsuccess = function() {
            callback && callback(this.result);
        }
        req.onerror = function() {
            callback && callback(this.result);
        }
    };

    // 更新
    this.updateData = function(tgroupid, data, callback) {
        var tx = db.transaction([storage_name], 'readwrite');
        var store = tx.objectStore(storage_name);
        var req = store.get(tgroupid);
        req.onsuccess = function() {
            var DBdata = this.result;
            for (d in data) {
                DBdata[d] = data[d];
            }
            store.put(DBdata);

            callback && callback(data);

        }

    };

    // 删除
    this.deleteData = function(tgroupId, data, callback) {
        console.log('菜单操作-删除');
        var index = db.transaction(storage_name, 'readwrite').objectStore(storage_name);
        index.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var value = cursor.value;
                console.log(value);
                if (tgroupId+''  === value.tgroup+'') {
                    index.delete(value.tgroup);
                }
                cursor.continue();
            } else {

              //  TemplateMenuDao.insertData(data, callback);

                callback && callback(data);
            }
        }
    }
};
