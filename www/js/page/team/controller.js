/**
 * Created by 201408040800 on 2016/6/23.
 */
;(function(FFA){
    var TeamController = FFA.namespace("Team.Controller");
    var TeamModel = FFA.namespace("Team.TeamModel");
    var Utils = FFA.namespace("Utils");


    var PtoR,   //下拉刷新对象
        teamItemTmpl,
        teamItemTmpl2;

    var container,
        count = 100,     //页面显示条数
        endPointer; //记录打印终点，限制打印条数;

    var teamCustomerDao = teamCustomerDAO();
 //   teamCustomerDao.init();
  //  teamCustomerDao = Utils.eventuality(teamCustomerDao); //为DAO对象增加事件方法
    var db;

    //$.when(teamCustomerDao.init()).done(function(){
    //    db = teamCustomerDao.getDB();
    //    console.log("初始化成功.....");
    //}).fail(function(){
    //    console.log("初始化失败.....");
    //});

    //初始状态
    //var initStatus = {
    //    pointer : 0,
    //    divPoint : '9999999999999',
    //    date : 9999999999999
    //};
    //var status = $.extend({},initStatus);       //状态记录
    //status.reset = function(){$.extend(this,initStatus)};   //状态初始化






    /**
     * 获取模板
     */
    var tempStr,tempStr2;
    function getTemplate(page){
        switch (page) {
            //客户页面模板
            case "index":
                tempStr = $("#managerItemTmpl").html();
                tempStr2 = $("#memberItemTmpl").html();
                if (tempStr) teamItemTmpl = _.template(tempStr, {variable: 'data'});
                if (tempStr2) teamItemTmpl2 = _.template(tempStr2, {variable: 'data'});
                break;
        }
    }

    /**
     * 获取团队成员列表
     * @param flag 初始化传0,刷新传1
     */
    function getList(flag) {
       // var deferred =  $.Deferred();
        $.when(teamCustomerDao.queryAll()).done(function(code, data){
            if (code == 0) {
                console.log("缓存的");
                container.html('');
                print(data);
            }
        }).fail(function(){
            // 不做处理
        }).always(function(code, msg){
            $.when(getListData()).done(function (data) {
                if (data && data.codeInfo == 0) {
                    console.log("网络的");
                    container.html('');
                    print(data);

                    $.when(teamCustomerDao.deleteAllData()).done(function(){
                        teamCustomerDao.insert(data);
                    });
                } else {
                    //没有更新时， flag == 0打印客户数据    else 不打印
                    if(!flag){
                        //没有更新
                        print();
                    }else{
                        //有更新
                        console.log("不打印");
                    }
                    var stime = get('pullRefreshStartTime');
                    var delay = 0;

                    iscrollRefresh(PtoR, stime, delay);
                }

            }).fail(function(e){
                if (code != 0) {
                    print();
                }
            });
        });
    }


    function print(data) {
        console.log('print');

        //每次执行打印方法执行一次  限制打印条数
        //endPointer = status.pointer + count;


        if (data) {
            console.log(data);
            printFn(data);

        } else {
            buffer = '<div class="nocustomer">没有团队经理信息，快去推广自己吧</div>';
            container.html(buffer);

            var stime = get('pullRefreshStartTime');
            var delay = 0;

            iscrollRefresh(PtoR, stime, delay);

            buffer = '';
        }

    }

    var buffer = '';
    function printFn(data) {
      //  var len = data.length;
        if (data) {

            var _tempData = {
                leaderHeadPath: data.leaderHeadPath,               // 团队经理头像
                leaderName: data.leaderName,                        // 团队经理名称
                leaderCusCount: data.leaderCusCount,              //团队经理客户总数
                leaderRedpt: data.leaderRedpt,                     // 团队经理获客小红点 0, 不显示小红点； 1 显示小红点
                month: data.month,                                   // 当前月份
                teamCusCount: data.teamCusCount,                  // 本月团队客户总数
                teamIntoPiecesCount: data.teamIntoPiecesCount,  // 本月团队进件数总数
                teamLoanCount: data.teamLoanCount,                // 本月团队放款数总数
                levelName: '团队经理'
            };
            var dataList = [];
            dataList.push(_tempData);
            var _teamList = data.teamList;
            for (var d in _teamList) {
                dataList.push(_teamList[d]);
            }

            console.log(dataList);
            var l = dataList.length;
            for (var i = 0; i < l; i++) {
                //printSaler(data[i]);
                if (i == 0) {
                    buffer += teamItemTmpl(dataList[i]);
                } else {
                    buffer += teamItemTmpl2(dataList[i]);
                }

            }
        }

        container.append(buffer);

        var stime = get('pullRefreshStartTime');
        var delay = 0;

        iscrollRefresh(PtoR, stime, delay);

        buffer = '';

    }

    /**
     * 通过ajax获取数据
     * @returns {*}
     */
    function getListData(){
        var deferred =  $.Deferred();
        TeamModel.getPageData(function (data) {
            console.log("获取团队经理数据成功：");
            console.log(data);
            deferred.resolve(data);
        }, function (e) {
            console.log("网络请求失败，数据获取失败！！");
            deferred.reject(e);
        });
        return deferred.promise();
    }




    function showLoading(){
        PtoR.minScrollY = 0;    //最小Y轴滚动距离
        PtoR.scrollTo(0,0);     //滚动至Y轴顶端 显示出loading
        $('#members-pullDown').addClass('loading');
        $('.pullDownLabel').html('努力加载中...');

        //setTimeout(function(){
        //    PtoR.refresh();
        //},3000);
    }

    // 获取当前用户级别名称
    TeamController.getTeamName = function(level) {
        var level = TeamModel.getUserLevelFlag(level);
        var name = '';
        switch (level) {
            case dep_level_flag:
                name = '营业部';
                break;
            case team_level_flag:
                name = '团队';
                break;
            case customer_level_falg:
            default :
                name = '客户'
        }
        return name;
    };

    TeamController.initPage = function(page) {

        switch (page) {
            //客户页面初始化
            case "index":
            //    teamCustomerDao.on("inited", function(){

            console.log("inited:");
                console.log(teamCustomerDao.inited);
                //if (!teamCustomerDao.inited) {
                //    $.when(teamCustomerDao.init()).done(function(){
                //        db = teamCustomerDao.getDB();
                //        console.log("初始化成功.....");
                //
                //        getTemplate("index");
                //        getList(0);
                //        showLoading();
                //
                //    }).fail(function(){
                //        console.log("初始化失败.....");
                //    });
                //} else {
                //    getTemplate("index");
                //    getList(0);
                //    showLoading();
                //}


                $.when(teamCustomerDao.init()).done(function(){
                    db = teamCustomerDao.getDB();
                    console.log("初始化成功.....");

                    getTemplate("index");
                    getList(0);
                    showLoading();

                }).fail(function(){
                    console.log("初始化失败.....");
                }).always(function(){

                });




            //    });


                break;
            //客户状态页面初始化
            case "state":
                //getTemplate(page);
                //break;
            //客户详情页面初始化
            case "detail":
                //indexedDBDAO.on("inited", function () {
                //
                //});
                break;
        }

    };

    TeamController.setPtoRObject = function(obj) {
        PtoR = obj;
    };
    TeamController.setContainer = function (ele){
        container = ele;
    };
    TeamController.refresh = function() {
       // teamPageRender();
        getList(1);
    };
    TeamController.nextPage = function() {
        // teamPageRender();
       // getList(1);
        PtoR.refresh();
    };
})(FFA);
