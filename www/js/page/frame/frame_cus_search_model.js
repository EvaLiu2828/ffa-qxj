/**
 * Created by v-qizhongfang on 2015/7/9.
 */


(function($){
    "use strict";

    var Customer = FFA.namespace("Customer");
    var indexedDBDAO = indexedDBDAOFactory(indexedDB_config),  //dao对象
        db,             //db
        customerItemTmpl;   //模板

    var keyWord ;   //搜索关键字

    var indexName = 'by_lastUptDate';   //索引
    var count = 50;     //页面显示条数
    var endPointer; //记录打印终点，限制打印条数
    var container; //外层div

    //初始状态
    var initStatus = {
        pointer : 0,
        divPoint : '9999999999999',
        date : 9999999999999
    };
    var status = $.extend({},initStatus);
    status.reset = function(){

        //状态初始化方法
        $.extend(this,initStatus);
    };

    //TODO 暂时在这里获取模板  模板写在了页面中

    var tempStr = $("#customerItemTmpl").html();
    if(tempStr){
        customerItemTmpl = _.template($("#customerItemTmpl").html(), {variable: 'data'});
    }

    //初始化indexedDBDAO对象
    $.when(indexedDBDAO.init())
        .done(function(){
            db = indexedDBDAO.getDB();
        })
        .fail(function(){
        });



    /**
     * 取status.divPoint后count条数据并打印
     */
    var tx; //保存事务对象 用来强制终止

    //TODO 未缓存 使用buffer可能导致输出错误 待优化 需要更好方案
    var print = function (keyWord){

        console.log('print');
        endPointer = status.pointer + count;    //结束位置

        tx = db.transaction(indexedDB_config.cusStorageName, 'readonly');
        var index = tx.objectStore(indexedDB_config.cusStorageName).index(indexName),
            upperBoundRange = IDBKeyRange.upperBound(status.divPoint, true),
            cursorReq = index.openCursor(upperBoundRange, 'prev');
            cursorReq.onsuccess = function(event) {
                var cursor = event.target.result;
                if(cursor){
                    var value = cursor.value;
                    if (status.pointer < endPointer) {      //限制条数
                        if (cursor.key) {                   //索引字段为空时不显示此客户
                            value.sortTime = cursor.key; //排序依据字段

                            if(value.cusName.match(keyWord)){   //关键字过滤
                                //buffer += constructItem(value); //将新数据加入输出缓存
                                container.append(customerItemTmpl(value));
                                status.divPoint = cursor.key;   //得到新的分割点
                                status.pointer++;               //指针位置前移
                            }
                        }
                        cursor.continue();                  //控制游标继续
                    }else {
                        //当前页结束
                    }
                }else{
                    //游标结束
                }
            };
            cursorReq.onerror = function (e) {
                console.log("游标取值失败..\n" + e.target.error);
            };

    };

    Customer.searchModel =  {
        /**
         *搜索
         * @param keyWord   关键字
         */
        search: function (k) {
            try{
                //强制结束事务
                tx.abort();
            }catch(e){
                console.log('这个事务已经结束');
                //这个事务已经结束 不做任何操作
            }
            status.reset(); //状态重置
            container.html(''); //清空搜索结果
            //如果关键字非空则保存关键字并打印
            if(typeof k === 'string' && k !== ''){
                print(k);
                keyWord = k;
            }else{

            }
        },

        /**
         * 翻页
         */
        nextPage: function () {
            print(keyWord);
        },


        setContainer : function (ele){
            container = ele;
        }


    };

})(Zepto);
