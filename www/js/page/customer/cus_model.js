/**
 * Created by v-qizhongfang on 2015/7/9.
 */
;(function(FFA){
//    var refreshDelay = 3000;
    var Customer = FFA.namespace("Customer");
    var Utils = FFA.namespace("Utils");


    var indexedDBDAO = indexedDBDAOFactory(indexedDB_config),  //dao对象
        PtoR,   //下拉刷新对象
        customerItemTmpl;

    var indexName = 'by_lastUptDate',  //'by_commtionTime'
        count = 100,     //页面显示条数
        endPointer, //记录打印终点，限制打印条数
        container;  //容器

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

    function getTemplate(page){
        switch (page) {
            //客户页面模板
            case "page-customer":
                tempStr = $("#customerItemTmpl").html();
                if(tempStr){
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
     * 获取客户数量
     */
    function getCustomerCount(){
        $.when(indexedDBDAO.getCount("by_createTime"))
            .done(function(amount){
                console.log(amount);
                var searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.setAttribute('placeholder','搜索'+amount+'位联系人');
                }
            })
            .fail()
            .always();
    }

    /**
     * 初始化传0
     * 刷新传1
     * @param flag
     */
    function refreshCustomerList(flag){

        //对存入indexeddb的数据处理方法
        function processItem(item){
            var item =Utils.filter(item);
            if(!item['commtionTime'] && (
                    parseInt(item['cusSource'])===2 ||  parseInt(item['cusSource'])===3 || parseInt(item['cusSource'])===4 || parseInt(item['cusSource'])===5
                    || parseInt(item['cusSource'])===23 ||  parseInt(item['cusSource'])===43 ||  parseInt(item['cusSource'])===53 || parseInt(item['cusSource'])===13 ||  parseInt(item['cusSource'])===7 || parseInt(item['cusSource'])===8 || parseInt(item['cusSource'])===9
                )){   //微信营销获客,我的微店,抢小姨，安布雷拉，以及抢小姨和它们的组合：手姨，网姨，微姨，安姨才有未联系人
                item['nocontact'] = "Y";
            }
            return item;
        }

        $.when(getCustList())
            .done(function (code, data) {
                if(code === 0){
                    //有更新
                    container.html('');      //页面内容初始化
                    status.reset();  //状态初始化
                    var a, u, d;    //增删改字段
                    a = data.add || [];
                    u = data.update || [];
                    d = data.del || [];

                    a = $.map(a, processItem);
                    u = $.map(u, processItem);

                    $.when(indexedDBDAO.updateLocalDB(a, u, d, data.updatedate))    //调用数据库更新方法
                        .done(function(){
                            console.log('本地数据更新成功！');
                        })
                        .fail(function(){
                            console.log('本地数据更新失败！');

                        })
                        .always(function () {
                            //获取客户数量
                            print();    //无论本地库更新是否成功都打印客户数据


                            getCustomerCount();    //获取客户数量
                            if (get(user_level_flag) == customer_level_falg) {
                                Customer.getNoContactNum(); //获取未联系人数量
                            }
                        });

                }else{
                    //没有更新时， flag == 0打印客户数据    else 不打印
                    if(!flag){
                        //没有更新
                        print();
                    }else{
                        //有更新
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
    function getCustList(){
        var deferred =  $.Deferred();
        indexedDBDAO.getUpdateTime()     //获取上次更新时间
            .done(function(updateTime){
                var params = {};
                params.timestamp = updateTime;	//上次刷新时间
                customerService.getCustomerList(params,     //获取客户列表请求
                    function (data) {
                        //console.log('客户列表接口成功回调');
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
     */
    function print(){
        console.log('print');
        //每次执行打印方法执行一次  限制打印条数
        endPointer = status.pointer + count;
        //适用printFun方法作为openCursor的onsuccess方法 每取出一条记录执行一次
        indexedDBDAO.getByCursor(printFun, status.divPoint, indexName);
    }

    /**
     *打印规则 传递给openCursor方法  每取到一条数据 此方法执行一次
     * @param value     值   要被打印的对象
     * @param divPoint       索引 时间 按此排序，倒序打印
     * @param pointer   指针 标示数据位置 正整数
     */
    var buffer = ''; //数据缓存字符串 避免单条打印影响渲染速度
    function printFun(event) {
        var cursor = event.target.result;

        var stime = get('pullRefreshStartTime');
        var delay = 0;

        if(cursor){
            var value = cursor.value;
            if (status.pointer < endPointer) {
                if(cursor.key){
                    value.sortTime = cursor.key; //排序依据字段

                    if(parseInt(cursor.key)-status.date < 0){
                        status.date = Date.parse(new Date(parseInt(cursor.key)).toDateString());  //按日期向下取整
                        buffer += '<li class="date">'+Utils.formatDate(cursor.key, "/")+'</li>' +
                            customerItemTmpl(value);
                    }else{
                        buffer += customerItemTmpl(value);
                    }
                    status.divPoint = cursor.key;
                    status.pointer++;
                }
                cursor.continue();
            }else{
                //当前页输出结束
                container.append(buffer);
            //    PtoR.refresh();

                iscrollRefresh(PtoR, stime, delay);

                buffer = '';
            }
        }else{
            //所有数据输出结束
            if(status.pointer === 0){
                container.html('<div class="nocustomer">没有客户信息，快去推广自己吧</div>');
            }else{
                container.append(buffer);
            }
           // PtoR.refresh();
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

    Customer.customerModel = {
        /**
         * 首次进入页面
         */
        init:function(page){

            switch (page) {
                //客户页面初始化
                case "page-customer":
                    indexedDBDAO.on("inited", function () {
                        getTemplate(page);
                        refreshCustomerList(0);
                        put('pullRefreshStartTime',(new Date()).getTime());
                        showLoading();

                        getCustomerCount();
                        if (get(user_level_flag) == customer_level_falg) {
                            FFA.Customer.getNoContactNum();
                        }
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
         */
        refresh:function(){
            console.log('refreshing..');
            if(!indexedDBDAO){
                $.when(indexedDBDAOFactory(indexedDB_config))
                    .done(function(indexedDBDAOObject){
                        indexedDBDAO = indexedDBDAOObject;
                        refreshCustomerList(1);
                    })
                    .fail(function(){
                        console.log('get db object fail...');
                    });
            }else{
                refreshCustomerList(1);
            }
        },
        /**
         *展示页面
         */
        display: function(){
            if(indexedDBDAO){
                print();
            }else{
                $.when(indexedDBDAOFactory(indexedDB_config))
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
                    customerService.updateCommtionTime(params,
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
                    customerService.queryProgress(params,
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
