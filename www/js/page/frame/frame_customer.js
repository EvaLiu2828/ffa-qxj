//modele初始化
/*;(function () {
    var lastClickTime = new Date().getTime();
    var clickTime;
    document.addEventListener('click', function (e) {
        clickTime = e['timeStamp'];
        if (clickTime && (clickTime - lastClickTime) < 500) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
        //lastClickTime = clickTime;
    }, true);
})();*/
/*点透事件*/
$(function () {
    FastClick.attach(document.body);
});
(function (FFA) {
    var CustomerPage = FFA.namespace('Frame.CustomerPage'),
        Customer = FFA.namespace('Customer');
    var customerModel = Customer.customerModel,
        searchModel = Customer.searchModel;

    CustomerPage._initPageScrollPlugin = function () {
        //下拉刷新控件初始化
        var customerPullToRefresh = initPullToRefresh(function () {
            put('pullRefreshStartTime', (new Date()).getTime());
            customerModel.refresh();
        }, function () {
            console.log("上拉刷新！！！");
            put('pullRefreshStartTime', (new Date()).getTime());
            // customerModel.nextPage();
        }, null, null, 'customers-wrapper');
        customerModel.setPtoRObject(customerPullToRefresh);    //将customerPullToRefresh对象传入controller

    };
    CustomerPage.init = function () {
        if (!this.inited) {
            this.inited = true;
            customerModel.setContainer($('#contacters-container'));    //内容容器设定
            searchModel.setContainer($('#search-container'));  //内容容器设定
            this._initPageScrollPlugin();
            customerModel.init("page-customer");
        }
    };
})(FFA);


//事件注册
$(function () {
    if (get(user_level_flag) == customer_level_falg) {
        FFA.Customer.getNoContactNum();
    }

    var Components = FFA.namespace('Components'),
        Customer = FFA.namespace('Customer'),
        Utils = FFA.namespace('Utils'),
        alert = null;

    var customerController = Customer.controller;



    var customerPage = $("#page-customer");


    //可清空输入框
    customerPage.on("input", "#searchInput" , function () {
        var len = $(this).val().length;
        if (len > 0) {
            $(this).siblings(".js-rm-del").addClass("delete")
        } else {
            $(this).siblings(".js-rm-del").removeClass("delete")
        }
    });

    //可清空输入框
    customerPage.on("tap", ".rm-del", function () {
        var input = $(this).siblings('.rm-input');
        input.val('');
        $(this).removeClass("delete");
        $("#search-wrapper").scrollTop(0);
        setTimeout(function () {
            $('#search-container').html('');
        },0);

    });


    //索索输入框
    customerPage.on("input", "#searchInput", function () {
        customerController.search.handleSearch(event);
    });

    customerPage.on("focus", "#searchInput", function () {
        customerController.willSearch(event);
    });

    //取消搜索状态
    customerPage.on("tap", ".js-search-cancel", function (event) {
        Utils.stopEvent(event);
        $("#search-wrapper").scrollTop(0);
        setTimeout(function () {
            customerController.cancelSearch(event);
        },0);

    });

    //搜索翻页
    $("#search-wrapper").on('scroll', function (event) {
        Utils.stopEvent(event);
        if(cordova.plugins.Keyboard.isVisible){
            cordova.plugins.Keyboard.close();
        }
        customerController.search.handleNextPage(this, event);

    });

    //点击客户 进入客户详情页面
    customerPage.on('tap', '.js-contacter-info', function (event) {
        Utils.stopEvent(event);
        var phonenumber = $(this).parents('.contacter').data('phonenumber');
        customerController.toDetail(phonenumber);
    });

    //点击查询按钮进入查询页面
    customerPage.on('tap', '.js-query', function (event) {
        console.log('query');
        Utils.stopEvent(event);
        var phonenumber = $(this).parents('.contacter').data('phonenumber');
        customerController.queryProgress(phonenumber)
            .done(function (code, data) {
                //查询成功
                var stateObj = customerController.processStateData(data);
                _(stateObj).mapObject(function () {
                    sessionStorage.setItem(arguments[1],arguments[0]);
                });
                switch (code){
                    case 1:
                        //弹框 跳转
                        alert = Components.Popup.Alert('A', {
                            content: data.msgInfo,  //显示内容
                            withMask: 'A' //蒙层类型
                        },function () {
                            customerController.toState();
                        }.bind(this));
                        break;
                    case 2:
                        //不弹框 跳转
                            customerController.toState();
                        break;
                }


            })
            .fail(function (code, data) {
                //查询失败
                alert = Components.Popup.Alert('A', {
                    content: data.msgInfo,  //显示内容
                    withMask: 'A' //蒙层类型
                },function () {

                }.bind(this));

            });
    });

    //点击信息按钮进入短信模板页面
    customerPage.on('tap', '.js-message', function (event) {
        Utils.stopEvent(event);
        customerController.sms.handleSms(this,event);
    });

    customerPage.on('tap', '.js-call', function (event) {
        Utils.stopEvent(event);
        customerController.call.handleCall(this, event);
    });

    //排序按钮方法
    customerPage.on('tap', '.js-tab-btn', function (event) {
        console.log(1);
        customerController.switchSortType(this, event);
    });

    /*---start by lyx 20161031---*/
    //点击抢按钮进入抢商机模版页面
    $('.js-header').on('tap', '.icon-qiang2', function (event) {
        console.log('qiang');

        window.location.href = '../grab_opportunities/grab_opportunities.html';
    });
    /*---end by lyx 20161031---*/
});

