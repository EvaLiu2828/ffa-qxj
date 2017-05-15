// JavaScript Document
/*var queryData={
	codeInfo="0",
	version="1",
	newsList=hot_query_data;
}*/
var hot_query_data = [{
    newsid: "1",
    image: "18512333709",
    url: "",
    flagup: ""
},
{
    newsid: "2",
    image: "18512333709",
    url: "",
    flagup: ""
},
{
    newsid: "3",
    image: "18512333709",
    url: "",
    flagup: ""
},
{
    newsid: "4",
    image: "18512333709",
    url: "",
    flagup: ""
},
];
function HotQuery(hotQuery){
	var indexedDB = window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB ||
		window.shimIndexedDB;
	var DBName = indexedDB_config.DBName; //数据库名称
	//start by lyx 20161206
	var hot_query_storage_name = hotQuery ? hotQuery : indexedDB_config.hotQueryName; //热点表
	//end by lyx 20161206
	var db; //数据库对象
	
	var divPoint = '9999999999999'; //最后一个数据的时间戳（记录取出位置）
	this.init=function (insertDataCallback){
		if(db){
			console.log("db对象已存在!");
			return;
			}
		var req = indexedDB.open(DBName);
		req.onsuccess = function(evt) {
				//数据库打开成功
				db = req.result;
				db.onerror = function(evt){console.log("db error")};
				insertDataCallback();
			};
			req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
	}
	this.insertData=function (data,callback){
		var tx = db.transaction(hot_query_storage_name,'readwrite');
		tx.oncomplete = function() {
			callback();
			console.log("刷新成功！！");
		};
		var varHotQueryDao = tx.objectStore(hot_query_storage_name);
		
		for(var i in data.dataList){
			console.log('data.dataList[i]'+data.dataList[i].title);
			var cusReqAdd = varHotQueryDao.put(data.dataList[i]);
		}
	};
	this.queryHotdata=function (){
		var index = db.transaction(hot_query_storage_name, 'readonly').objectStore(hot_query_storage_name).index('by_lastUptDate');
       // var upperBoundOpenKeyRange = IDBKeyRange.upperBound(divPoint, true);(null,'prev')
       var upperBoundRange = IDBKeyRange.upperBound(divPoint, true);
        index.openCursor(upperBoundRange, 'prev').onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				var value = cursor.value;
					hot_spot_query_callback2(value);
					cursor.continue();
				} else {
					
				};
	
			};
	}
	this.deleteHotData=function(){
		var index = db.transaction(hot_query_storage_name, 'readwrite').objectStore(hot_query_storage_name);
		index.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				var value = cursor.value;
					var cusReqDel = index.delete(value.newsid);
					cusReqDel.onsuccess = function(evt){
						//删除本地的图片
						delte_object_callback(value);
					}
					cursor.continue();
				} else {
					console.log("null");
				};
			}
	}
}
