/**
 * Created by v-qizhongfang on 2015/7/9.
 */
;(function(FFA){
//    var refreshDelay = 3000;
    var SalerCustomer = FFA.namespace("SalerCustomer");
    var Utils = FFA.namespace("Utils");


    var indexedDBDAO = indexedDBDAOFactory(indexedDB_config.DBName, indexedDB_config.verSalerCustomerStorage, indexedDB_config.salerCustomerStorage),  //dao对象
        PtoR,   //下拉刷新对象
        customerItemTmpl;

    var indexName = 'by_lastUptDate',  //'by_commtionTime'
        count = 100,     //页面显示条数
        endPointer, //记录打印终点，限制打印条数
        container,  //容器
        parentId;

    //初始状态
    var initStatus = {
            pointer : 0,
            divPoint : '9999999999999',
            date : 9999999999999
        };
    var status = $.extend({},initStatus);       //状态记录
        status.reset = function(){$.extend(this,initStatus)};   //状态初始化

    indexedDBDAO = Utils.eventuality(indexedDBDAO); //为DAO对象增加事件方法



    //TODO 暂时在这里获取模板  模板写在了页面中

    var tempStr;
    function getTemplate(page, managerId){
        switch (page) {
            //客户页面模板
            case "page-customer":
                tempStr = $("#salerCustomerItemTmpl").html();
                if (tempStr){
                    customerItemTmpl = _.template(tempStr, {variable: 'data'});
                }
                break;
            //客户状态页面初模板
            case "page-customer-state":
                tempStr = $("#customerStateItemTmpl").html();
                if(tempStr){
                    customerItemTmpl = _.template(tempStr, {variable: 'data'});
                }
                break;
            //客户详情页面模板
            case "page-customer-detail":
                indexedDBDAO.on("inited", function () {

                });
                break;
        }

    }

    /**
     *
     * @param flag          刷新传1   初始化传0
     * @param cusCount   团队经理/销售经理的客户数量，来区别是不是团队经理（前提是managerId没有的情况下）
     * @param managerId  销售经理的员工编号（20位）,区别是不是销售经理（即当前用户级别不是客户经理的别称）
     */
    function refreshCustomerList(flag, cusCount, managerId){
    //    var keyName = phonenumber;

        //对存入indexeddb的数据处理方法
        function processItem(item){
            var item =Utils.filter(item);
            if(!item['commtionTime'] && (
                    parseInt(item['cusSource'])===2 ||  parseInt(item['cusSource'])===3 || parseInt(item['cusSource'])===4 || parseInt(item['cusSource'])===5
                    || parseInt(item['cusSource'])===23 ||  parseInt(item['cusSource'])===43 ||  parseInt(item['cusSource'])===53 || parseInt(item['cusSource'])===13 ||  parseInt(item['cusSource'])===7 || parseInt(item['cusSource'])===8 || parseInt(item['cusSource'])===9
                )){   //微信营销获客,我的微店,抢小姨，安布雷拉，以及抢小姨和它们的组合：手姨，网姨，微姨，安姨才有未联系人
                item['nocontact'] = "Y";
            }

            item['managerId'] = managerId;  // 追加managerId字段

            return item;
        }


        status.reset();  //状态初始化，防止不同页面数据错乱
        $.when(getCustList(cusCount,managerId))
            .done(function (code, data) {
                console.log(data);
                if(code === 0){
                    //有更新
                    container.html('');      //页面内容初始化


                    var a, u, d;    //增删改字段
                    a = data.add || [];
                    u = data.update || [];
                    d = data.del || [];

                    a = $.map(a, processItem);
                    u = $.map(u, processItem);

                    $.when(indexedDBDAO.updateLocalDB(a, u, d, data.updatedate,managerId))    //调用数据库更新方法
                        .done(function(){
                            console.log('本地数据更新成功！');
                        })
                        .fail(function(){
                            console.log('本地数据更新失败！');

                        })
                        .always(function () {
                            //获取客户数量
                            print();    //无论本地库更新是否成功都打印客户数据
                        });

                }else{
                    //没有更新时， flag == 0打印客户数据    else 不打印
                    console.log("r3");
                    if(!flag){
                        //没有更新
                        print();
                    }else{
                        //有更新
                        console.log("不打印");
                    }

                   // PtoR.refresh();


                    var stime = get('pullRefreshStartTime');
                    var delay = 0;

                    iscrollRefresh(PtoR, stime, delay);





                    //console.log('没有新数据');
                }
            })
            .fail(function (code, err) {
                print();
                if(code === 0){
                    //ajax报错
                    console.log(err);
                }else{
                    //上次更新时间获取失败
                    console.log(err);
                }

            })
            .always(function () {
                //var Customer = FFA.namespace('Customer');
                //var customerModel = Customer.customerModel;
                //customerModel.requestCount = 0;
            });
    }

    /**
     * 获取客户列表 判断是否有更新
     * 错误代码
     * 0: ajax请求失败  1: 上次更新时间获取失败
     *
     * 是否有更新标识
     * 0: 有更新   1:没更新
     * @returns {*}
     */
    function getCustList(cusCount, managerId){
        var deferred =  $.Deferred();
        indexedDBDAO.getUpdateTime(managerId)     //获取上次更新时间
            .done(function(updateTime){
                var params = {};
                params.timestamp = updateTime;	//上次刷新时间
                params.managerId = managerId;
                params.cusCount = cusCount;
                salerCustomerService.getCustomerList(params,     //获取客户列表请求
                    function (data) {
                        console.log('客户列表接口成功回调');
                        console.log(data);
                        //获取各个字段长度 判断是否有更新
                        var addLen = data && data.add && data.add.length;
                        var updateLen = data && data.update && data.update.length;
                        var delLen = data && data.del && data.del.length;
                        if(addLen||updateLen||delLen){
                            //有更新
                            deferred.resolve(0, data);
                            console.log('有更新数据');
                        }else{
                            //请求成功 没更新
                            deferred.resolve(1, data);
                            console.log('没有更新数据');
                        }
                    },
                    function (e) {
                        //ajax请求失败
                        deferred.reject(0, e);
                        console.log(e);
                        console.log('ajax请求失败')
                    });
            })
            .fail(function (e) {
                deferred.reject(1, e);
                console.log(e);
                console.log('获取上次更新时间失败')
            });
        return deferred.promise();
    }


/**************************************下边是打印方法***************************************************************/
    /**
     * 取status.divPoint之后的count条数据并打印
     * @param managerId  销售经理的员工编号（20位）,区别是不是销售经理（即当前用户级别不是客户经理的别称）
     */
    function print(){
        console.log('print');
        //每次执行打印方法执行一次  限制打印条数
        endPointer = status.pointer + count;
        console.log("endPointer="+endPointer);
        //适用printFun方法作
        // 为openCursor的onsuccess方法 每取出一条记录执行一次

        indexedDBDAO.getByCursor(printFun, status.divPoint, indexName);  // 获取销售列表的数据
    }

    /**
     * 打印规则 传递给openCursor方法  每取到一条数据 此方法执行一次,此方法主要针对销售客户的页面打印
     * @param value     值   要被打印的对象
     * @param divPoint  索引 时间 按此排序，倒序打印
     * @param pointer   指针 标示数据位置 正整数
     */
    var buffer = '';
    function printFun(event) {
        var cursor = event.target.result;
        var stime = get('pullRefreshStartTime');
        var delay = 0;
        if (cursor) {
            var value = cursor.value;
            var managerId = get("customer-sublevel-managerId");
            if (status.pointer < endPointer) {
                if (cursor.key){
                    if (value.managerId === managerId) {
                        value.sortTime = cursor.key; //排序依据字段
                        if (parseInt(cursor.key) - status.date < 0) {
                            status.date = Date.parse(new Date(parseInt(cursor.key)).toDateString());  //按日期向下取整
                            buffer += '<li class="date">' + Utils.formatDate(cursor.key, "/") + '</li>' + customerItemTmpl(value);
                        } else {
                            buffer += customerItemTmpl(value);
                        }
                        status.divPoint = cursor.key;
                        status.pointer++;
                    }
                }
                cursor.continue();
            }else{
                //当前页输出结束
                container.html(buffer);
                //    PtoR.refresh();

                iscrollRefresh(PtoR, stime, delay);

                buffer = '';
            }

        } else {
            //所有数据输出结束
            if(status.pointer === 0){
                container.html('<div class="nocustomer">没有'+get("customer-sublevel-title")+'信息!!</div>');
            }else{
                container.html(buffer);
            }
            // PtoR.refresh()
            iscrollRefresh(PtoR, stime, delay);

            $('#pullUp').hide();
            buffer = '';
        }
    }

    function showLoading(){
        PtoR.minScrollY = 0;    //最小Y轴滚动距离
        PtoR.scrollTo(0,0);     //滚动至Y轴顶端 显示出loading
        $('#pullDown').addClass('loading');
        $('.pullDownLabel').html('努力加载中...');
    }

    SalerCustomer.salerCustomerModel = {
        /**
         * 首次进入页面
         * @param page
         * @param cusCount   团队经理/销售经理的客户数量，来区别是不是团队经理的客户list（前提是managerId没有的情况下）
         * @param managerId  销售经理的员工编号（20位）,区别是不是销售经理（即当前用户级别不是客户经理的别称）
         */
        init:function(page, cusCount, managerId){
            switch (page) {
                //客户页面初始化
                case "page-customer":
                    indexedDBDAO.on("inited", function () {
                        getTemplate(page);
                        refreshCustomerList(0,cusCount,managerId);
                        put('pullRefreshStartTime',(new Date()).getTime());
                        showLoading();
                    });
                    break;
                //客户状态页面初始化
                case "page-customer-state":
                    getTemplate(page);
                    break;
                //客户详情页面初始化
                case "page-customer-detail":
                    indexedDBDAO.on("inited", function () {

                    });
                    break;
            }


            //初始化indexedDBDAO对象
            $.when(indexedDBDAO.init())
                .done(function(){
                    indexedDBDAO.fire("inited")
                })
                .fail(function(){
                });

        },

        setLoading : function () {
           showLoading();
        },

        /**
         * 刷新
         * @param cusCount   团队经理/销售经理的客户数量，来区别是不是团队经理（前提是managerId没有的情况下）
         * @param managerId  销售经理的员工编号（20位）,区别是不是销售经理（即当前用户级别不是客户经理的别称）
         */
        requestCountArr : [],
        setRequestCount: function(managerId, value) {
            if (value) {
                this.requestCountArr[managerId] = value;
            } else {
                this.requestCountArr[managerId] = this.requestCountArr[managerId] ? this.requestCountArr[managerId]++ : 1;
            }
        },
        getRequestCount: function(managerId) {
          return this.requestCountArr[managerId];
        },
        refresh:function(cusCount,managerId){
            this.setRequestCount(managerId);
            console.log('refreshing..');
            if(!indexedDBDAO){
                $.when(indexedDBDAOFactory(indexedDB_config.DBName, indexedDB_config.verSalerCustomerStorage, indexedDB_config.salerCustomerStorage))
                    .done(function(indexedDBDAOObject){
                        indexedDBDAO = indexedDBDAOObject;
                        refreshCustomerList(1,cusCount,managerId);
                    })
                    .fail(function(){
                        console.log('get db object fail...');
                    });
            }else{
                refreshCustomerList(1,cusCount,managerId);
            }
        },
        /**
         *展示页面
         */
        display: function(){
            if(indexedDBDAO){
                print();
            }else{
                $.when(indexedDBDAOFactory(indexedDB_config.DBName, indexedDB_config.verSalerCustomerStorage, indexedDB_config.salerCustomerStorage))
                    .done(function(indexedDBDAOObject) {
                        indexedDBDAO = indexedDBDAOObject;
                        print();
                    })
                    .fail(function(){
                        console.log('updateLocalDB fail...');
                    });
            }

        },
        /**
         * 翻页
         */
        nextPage : function(){
            status.reset();  //状态初始化，防止不同页面数据错乱
            print();
        },
        /**
         * 保存通话时间
         */
        saveCommunictionTime : function(phoneNumber){
            var deferred =  $.Deferred();
            indexedDBDAO.getItem(phoneNumber)
                .done(function (customer) {
                    //创建一个customer的子对象用于传参
                    var params = Utils.inherit(customer);
                    params.commtionTime = new Date().getTime().toString();
                    salerCustomerService.updateCommtionTime(params,
                        function(data){
                            if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                                customer.commtionTime = params.commtionTime;

                                //保存通话记录成功删除nocontact标识
                                delete customer.nocontact;
                                indexedDBDAO.updateItem(customer)
                                    .done(function() {
                                        deferred.resolve(data);
                                    })
                                    .fail(function (e) {
                                        deferred.reject(5,e);
                                    });
                            }else{
                                deferred.reject(1, data);
                            }
                        },
                        function(e){
                            deferred.reject(0, e);
                        });
                })
                .fail();
            return deferred.promise();
        },


        /**
         *
         * 查询占坑状态
         * @returns {*}
         */
        checkOccupy : function (phoneNumber) {
            var deferred =  $.Deferred();

            if(indexedDBDAO){
                indexedDBDAO.getItem(phoneNumber)
                    .done(function (customer) {
                        //创建一个customer的子对象用于传参
                        //01	占坑中
                        //02	未占坑
                        //03	占坑失败
                        //04	占坑失效
                        if(!customer.occupy || parseInt(customer.occupy) === 2){
                            deferred.reject(2, customer); //用户未占坑拒绝查询
                        }else{
                            deferred.resolve(customer);
                        }
                    })
                    .fail();
            }

            return deferred.promise();
        },
        /**
         * 查询进度
         * 成功无code值 只有数据
         * 失败返回错误代码和数据
         * 0是404
         */
        queryProgress : function (phoneNumber) {
            var deferred =  $.Deferred();
            var progressCount;
            indexedDBDAO.getItem(phoneNumber)
                .done(function (customer) {
                //    执行查询操作
                    var params = Utils.inherit(customer);
                    salerCustomerService.queryProgress(params,
                        function(data){
                            if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                                //查询成功
                                if(data.hasOwnProperty('progressCount')){
                                    progressCount = data.progressCount;
                                    if(typeof progressCount === 'string'){
                                        switch (progressCount){
                                            case 'yes':
                                                //弹框 跳转
                                                deferred.resolve(1, data);
                                                break;
                                            case 'no':
                                                //不弹框 跳转
                                                deferred.resolve(2, data);
                                                break;
                                        }

                                    }

                                }

                            }else{
                                deferred.reject(1, data);
                            }
                        },
                        function(e){
                            deferred.reject(0, e);
                        });
                })
                .fail(function () {
                    console.log('获取本地客户信息失败')
                });
            return deferred.promise();
        },



        byCreateTime : function(){
            indexName = 'by_lastUptDate';
            container.html('');      //页面内容初始化
            status.reset();  //状态初始化
            print();
        },
        byCommtionTime : function(){
            indexName = 'by_commtionTime';
            container.html('');      //页面内容初始化
            status.reset();  //状态初始化
            print();
        },
        setContainer : function (ele){
            container = ele;
        },
        setPtoRObject : function (ptr) {
            PtoR = ptr;
        },
        getPtoRObject : function () {
            return PtoR;
        },

        getIndexedDBDAO : function () {
            return indexedDBDAO;
        }
    };

})(FFA);
