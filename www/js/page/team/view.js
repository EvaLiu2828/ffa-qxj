/**
 * Created by 201408040800 on 2016/6/23.
 */
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
;(function(FFA){
    var TeamView = FFA.namespace("Team.TeamView");

    var TeamModel = FFA.namespace("Team.TeamModel");

    var TeamController = FFA.namespace("Team.Controller");

    // 初始化页面
    TeamView.init = function() {
     //   $(".js-footer").show();
    //    $(".js-customer-wrap-outer").eq(0).show();
        if (!this.inited) {
            this.inited = true;
            TeamController.setContainer($("#js-manager-wrap-outer"));
            TeamView._initPageScrollPlugin();
            TeamController.initPage('index');
        }


    };

    TeamView._initPageScrollPlugin = function () {
        //下拉刷新控件初始化
        var pullDownEle = document.getElementById('members-pullDown'),
            pullUpEle = document.getElementById('members-pullUp');
        var teamPullToRefresh = initPullToRefresh(function () {
            put('pullRefreshStartTime', (new Date()).getTime());
            TeamController.refresh();
        }, function () {
            console.log("上拉刷新");
            //put('pullRefreshStartTime', (new Date()).getTime());
            TeamController.nextPage();
        }, pullDownEle, pullUpEle, 'teams-wrapper');
        TeamController.setPtoRObject(teamPullToRefresh);    //将customerPullToRefresh对象传入controller

    };



    // 页面加载时调用
    $(function(){

        // 查看团队经理的客户
        $(".js-manager-item").live("tap", function() {
            put("customer-sublevel-managerId", 0);
            put("customer-sublevel-cusCount", '');
            var cusCount = $(this).attr("data-cusCount")
            put("team-customer-count", cusCount);
            window.location.href = 'team/customer.html';
        });

        // 查看团队经理下的销售经理的客户
        $(".js-menber-item").live("tap", function() {
            var userName = $(this).attr("data-userName")+"的客户" || '客户',
                managerId = $(this).attr("data-managerId"),
                cusCount = $(this).attr("data-cusCount");
            put("customer-sublevel-title", userName);
            put("customer-sublevel-managerId", managerId);
            put("customer-sublevel-cusCount", cusCount);
            window.location.href = 'team/salerCustomer.html';
        });
    });

})(FFA);

