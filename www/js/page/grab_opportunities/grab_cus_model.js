/**
 * Created by apple on 16/10/31.
 */
/**
 * Created by apple on 16/10/20.
 */
;(function(FFA){
    var QiangCustomer = FFA.namespace("QiangCustomer"),
        Utils = FFA.namespace("Utils"),
        Components = FFA.namespace('Components'),
        QiangTimetab = QiangCustomer.timetab;
        confirm = null,
        loading = null,
        alert = null,
        flag = false;

    var PtoR,   //下拉刷新对象
        customerItemTmpl,
        manager,
        container;  //容器


    var tempStr;
    var buffer = '';
    var delay;

    function getTemplate(page){
        switch (page) {
            //客户页面模板
            case "page-customer":
                tempStr = $("#customerItemTmpl").html();
                if(tempStr){
                    customerItemTmpl = _.template(tempStr, {variable: 'QsjData'});
                }
                break;
        }
    }

    function showLoading(){
        PtoR.minScrollY = 0;    //最小Y轴滚动距离
        PtoR.scrollTo(0,0);     //滚动至Y轴顶端 显示出loading
        $('#pullDown').addClass('loading');
        $('.pullDownLabel').html('努力加载中...');
    }

    /**
     * 初始请求
     */
    function getCusList(){
        manager = $('#manager-info');
        container = $('#contacters-container');
        manager.html('');      //页面内容初始化
        container.html('');      //页面内容初始化
        var params ={};

        qiangCusService.getQCustomerList(params,
            function(qData){
                console.log(qData);
                delay = 0;
                if(qData.codeInfo == 0){
                    var systemTime = qData.nowTime;
                    var qsjData = qData.data;
                    var stime = new Date(qData.nowTime.replace(/-/g,'/')).getTime();
                    /**
                     * 经理信息
                     */
                    var managerStr = $("#managerInfoTmpl").html();
                    if(managerStr){
                        var managerInfoTmpl = _.template(managerStr, {variable: 'qData'});
                    }
                    var marnagerbuffer = '';
                    marnagerbuffer += managerInfoTmpl(qData);
                    manager.append(marnagerbuffer);

                    var _h = $('.header').height()+$('.content-top').height()+10;
                    $('.customer-list').css('top', _h);

                    /**
                     * 客户列表
                     * @type {any}
                     */
                    cusList(qsjData,systemTime,stime,delay);
                } else {
                    console.log(qData);
                    Components.Popup.Toast('B', {
                        content: qData.msgInfo,
                        width: 220,
                        duration: 2000
                    });
                    container.html('<div class="nocustomer js-nocustomer">暂时没有客户</div>');
                    $('.com-check-list-a').css({'paddingBottom':'30px','background':'none'});
                    iscrollRefresh(PtoR, stime, delay);
                    $('#pullUp').hide();
                    buffer = '';
                }
            },
            function(e){
                console.log(e);
                $('.page-list').css('display','none');
            });
    }

    /**
     * 刷新请求
     */
    function getCusList2(){
        manager = $('#manager-info');
        container = $('#contacters-container');
        container.html('');      //页面内容初始化
        var params ={};

        qiangCusService.getQCustomerList(params,
            function(qData){
                console.log(qData);
                delay = 0;
                if(qData.codeInfo == 0){
                    var systemTime = qData.nowTime;
                    var qsjData = qData.data;
                    console.log(qsjData);
                    var stime = new Date(qData.nowTime.replace(/-/g,'/')).getTime();
                    cusList(qsjData,systemTime,stime,delay);
                } else {
                    console.log(qData);
                    Components.Popup.Toast('B', {
                        content: qData.msgInfo,
                        width: 220,
                        duration: 2000
                    });
                    container.html('<div class="nocustomer js-nocustomer">暂时没有客户</div>');
                    $('.com-check-list-a').css({'paddingBottom':'30px','background':'none'});
                    iscrollRefresh(PtoR, stime, delay);
                    $('#pullUp').hide();
                    buffer = '';
                }
            },
            function(e){
                console.log(e);
                // $('.page-list').css('display','none');
            });

    }

    function cusList(qsjData,systemTime,stime,delay) {
        /**
         * 客户列表
         * @type {any}
         */
        var QsjData = [];   //经过时间筛查的数组
        if(qsjData.length != 0){
            var tempStr = $("#customerItemTmpl").html();

            for (var i = 0, l = qsjData.length; i < l; i++) {
                var _endTime = qsjData[i].distributeTime.substring(0,qsjData[i].distributeTime.length-2);
                var endTime = new Date(_endTime.replace(/-/g,'/')).getTime()+parseInt(qsjData[i].preheatTime)*60*1000+parseInt(qsjData[i].validTime)*60*1000;
                if(endTime > stime){
                    QsjData.push(qsjData[i]);
                }
            }
            console.log(QsjData);
            if(QsjData.length != 0){
                if(tempStr){
                    var customerItemTmpl = _.template(tempStr, {variable: 'QsjData'});
                }

                for (var i = 0, l = QsjData.length; i < l; i++) {
                    buffer += customerItemTmpl(QsjData[i]);
                }
                container.append(buffer);

                if(QsjData.length != 0){
                    for (var i = 0, l = QsjData.length; i < l; i++) { // 判断是否是限时抢购
                        if(QsjData[i].saleaType == '0'){
                            //倒计时
                            QiangTimetab.toGo.setTime(systemTime, QsjData[i].distributeTime, QsjData[i].validTime, QsjData[i].preheatTime, i);
                        }
                    }
                }
                iscrollRefresh(PtoR, stime, delay);
                buffer = '';
            } else {
                container.html('<div class="nocustomer js-nocustomer">暂时没有客户</div>');
                $('.com-check-list-a').css({'paddingBottom':'30px','background':'none'});
                iscrollRefresh(PtoR, stime, delay);
                $('#pullUp').hide();
                buffer = '';
            }
        } else {
            container.html('<div class="nocustomer js-nocustomer">暂时没有客户</div>');
            $('.com-check-list-a').css({'paddingBottom':'30px','background':'none'});
            iscrollRefresh(PtoR, stime, delay);
            $('#pullUp').hide();
            buffer = '';
        }
    }

    /**
     *打印规则 传递给openCursor方法  每取到一条数据 此方法执行一次
     * @param value     值   要被打印的对象
     * @param divPoint       索引 时间 按此排序，倒序打印
     * @param pointer   指针 标示数据位置 正整数
     */
    QiangCustomer.customerModel = {
        /**
         * 首次进入页面
         */
        init: function(page){
            switch (page){
                //抢商机页面初始化
                case "page-customer":
                    getTemplate(page);
                    showLoading();
                    getCusList();
                    break;
            }
        },
        /**
         * 刷新
         */
        refresh:function(){
            console.log('refreshing..');
            getCusList2();
        },
        setPtoRObject : function (ptr) {
            PtoR = ptr;
        },
        setContainer : function (ele){
            container = ele;
        }
    }
})(FFA);