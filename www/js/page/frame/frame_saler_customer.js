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
    var SalerCustomerPage = FFA.namespace('Frame.SalerCustomerPage'),
        SalerCustomer = FFA.namespace('SalerCustomer');
    var salerCustomerModel = SalerCustomer.salerCustomerModel;

    SalerCustomerPage._initPageScrollPlugin = function (cusCount,managerId) {
        //下拉刷新控件初始化
        console.log("下拉刷新控件初始化initing....");
        var customerPullToRefresh = initPullToRefresh(function () {
            console.log("下拉刷新！！！");
            if (managerId == get("customer-sublevel-managerId")) {
                put('pullRefreshStartTime', (new Date()).getTime());
                salerCustomerModel.refresh(cusCount, managerId);
            }
        }, function () {
            console.log("上拉刷新！！！");
            put('pullRefreshStartTime', (new Date()).getTime());
            salerCustomerModel.nextPage();
        }, null, null, 'customers-wrapper');
        salerCustomerModel.setPtoRObject(customerPullToRefresh);    //将customerPullToRefresh对象传入controller

    };

    /**
     * 初始化客户页面
     * @param cusCount   团队经理/销售经理的客户数量，来区别是不是团队经理（前提是managerId没有的情况下）
     * @param managerId  销售经理的员工编号（20位）,区别是不是销售经理（即当前用户级别不是客户经理的别称）
     */
    SalerCustomerPage.init = function (cusCount, managerId) {
        if (!this.inited) {
            console.log("初始化initing.....");
            this.inited = true;
            salerCustomerModel.setContainer($('#contacters-container'));    //内容容器设定
       //     searchModel.setContainer($('#search-container'));  //内容容器设定
            this._initPageScrollPlugin(cusCount, managerId);
            salerCustomerModel.init("page-customer", cusCount, managerId);
        }
    };

})(FFA);


//事件注册
$(function () {
    var Components = FFA.namespace('Components'),
        SalerCustomer = FFA.namespace('SalerCustomer'),
        Utils = FFA.namespace('Utils'),
        alert = null;

    var salerCustomerController = SalerCustomer.controller;
    var salerCustomerPage = $("#page-customer");


    // 点击销售 进入销售客户详情页面
    salerCustomerPage.on('tap', '.js-saler-li', function (event) {
        Utils.stopEvent(event);
        var phonenumber = $(this).data('phonenumber');
        salerCustomerController.toDetail(phonenumber);
    });

    //排序按钮方法
    salerCustomerPage.on('tap', '.js-tab-btn', function (event) {
        console.log(1);
        salerCustomerController.switchSortType(this, event);
    });
});