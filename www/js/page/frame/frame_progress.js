var frame_progress_isfresh = false;			//审核中是否刷新
var frame_progress_isshow = false;         //审核中初始化页面是否显示过
var frame_progress_isfresh_over = false;     //已审核是否刷新
var frame_progress_isshow_over = false;     //已审核初始化页面是否显示
var frame_progress_team_fresh = false;        //团队经理进度是否刷新
var frame_progress_isFirst = false;//是否是第一次点击进度
var frame_progress_is_list = [];//审核中数据列表
var frame_progress_over_list = [];//已审核数据列表
var frame_progress_team_list = [];//团队经理数据列表
var frame_progress_salers_list = [];//团队经理的销售列表
var frame_progress_issuccess = true;//请求是否成功

//var refreshDelay = 3000;
var myScroll_progress;
var myScroll_progress_team;

var customerProgressDao = new CustomerProgressDao();//客户经理进度数据库
var teamProgressSalerDao = new TeamProgressSalerDao();//团队经理进度销售列表数据库
var teamProgressDao = new TeamProgressDao();//团队经理进度数据库


$(function () {
    /**
     *点击进度
     */

    var ProgressPage = FFA.namespace('Frame.ProgressPage');
    var leftBtn = $('.js-header-left-btn');
    var rightBtn = $('.js-header-right-btn');
    var title = $('.js-header-title');


    ProgressPage.init = (function () {

        var flag;
        return function () {

            //根据职位（团队经理/客户经理）渲染页面
            var position = get(user_level_flag);
            if(position == customer_level_falg){
                //客户经理
                $('.js-account-manager').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');

                if ($("#progressTabBtnLeft").attr('checked')) {
                    $(".frame_progress_over").hide();				 //隐藏已审核页面
                    $(".frame_progress_is").show();					 //显示审核中页面
                } else {
                    $(".frame_progress_is").hide();
                    $(".frame_progress_over").show();
                }
            } else if(position == team_level_flag){
                //团队经理
                $('.js-team-manager').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');
                $('.js-progress-team').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');
                rightBtn.show();
                rightBtn.text('所属销售');

            }

            if(!flag){
                flag = true;
                if(position == team_level_flag){
                    //重置客户经理ID
                    put("progress_saler_compno", "00000000000000000000");
                }

                frame_progress_issuccess = false;

                //加载新数据
                loadNewData();

            }

        };
    })();




    //tab按钮样式重构  js修改
    $(".js-progress-tab-btns").on("change","[name=progressTabBtn]" , function () {
//        put('pullRefreshStartTime', (new Date()).getTime());
        if(this.id === "progressTabBtnLeft"){
            $(".frame_progress_over").hide();				 //隐藏已审核页面
            $(".frame_progress_is").show();					 //显示审核中页面

        }else if(this.id === "progressTabBtnRight"){
            $(".frame_progress_is").hide();
            $(".frame_progress_over").show();

        }
        myScroll_progress.scrollTo(0, -40);
    //    myScroll_progress.refresh();
        var stime = get('pullRefreshStartTime');
        iscrollRefresh(myScroll_progress, stime, 0);


    });
    //打电话谈框
    $('#wrapper_progress').on('click', '.call', function () {
        console.log('call()');
        var index = $(this).parent().parent().index();

        var toCallName,
            toCallNum;
        if($("#progressTabBtnLeft").attr('checked')){
            toCallName = frame_progress_is_list[index]['cusName'];
            toCallNum = frame_progress_is_list[index]["mobile"]
        }else{
            toCallName = frame_progress_over_list[index]['cusName'];
            toCallNum =frame_progress_over_list[index]["mobile"];
        }

        FFA.Components.Popup.Confirm('A', {
            content: '拨打电话给' + toCallName + '?',  //显示内容
            withMask: 'A', //蒙层类型
            leftButton: '取消',
            rightButton: '确认'
        }, function () {
            console.log('左按钮回调');
        }, function () {
            location.href = 'tel:' + toCallNum;
            frame_progress_call_request(toCallName, toCallNum);
        });
    });

    //团队经理点击rightBtn，显示销售列表
    rightBtn.on('click', function(){
        $('.js-sales-list').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');
        leftBtn.show();
        rightBtn.hide();
        title.text('所属销售');
        rightBtn.css("background-color","#4591ff");


    });
    //点击团队经理销售列表页返回按钮
    leftBtn.on('click', function(){
        $('.js-team-manager').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');
        $('.js-progress-team').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');
        leftBtn.hide();
        rightBtn.show();
        rightBtn.text('所属销售');
        leftBtn.css("background-color","#4591ff");
        title.text('进度');

    });

    //团队经理选择销售
    $(".js-sales-list").on('click','.saler-name', function(){
        put('pullRefreshStartTime',(new Date()).getTime());
        $(this).addClass("checked").siblings().removeClass("checked");
        var salerId = $(this).attr("data-saler");
        put("progress_saler_compno", salerId);

        frame_progress_team_fresh = true;

        //返回团队经理进度页
        $('.js-team-manager').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');
        $('.js-progress-team').addClass('progressDisplayBlock').siblings().removeClass('progressDisplayBlock');
        leftBtn.hide();
        rightBtn.show();
        rightBtn.text('所属销售');
        leftBtn.css("background-color","#4591ff");
        title.text('进度');

        myScroll_progress_team.minScrollY = 0;    //最小Y轴滚动距离
        myScroll_progress_team.scrollTo(0, 0);
        $('#pullDown_progress_team').addClass('loading_progress');

        if (frame_progress_issuccess) {//请求没有返回，不允许再次发请求
            frame_progress_issuccess = false;
            //清空页面避免累加显示
            $("#frame_progress_team").html('');
            frame_progress_team_list = [];//团队经理数据列表
            $(".js-sales-list ul").html('');
            frame_progress_salers_list = [];//团队经理销售列表
            loadNewData();
        }


    });

});

/**
 * 加载新数据
 */
var loadNewData = function(){
    //初始化时显示loading
    put('pullRefreshStartTime',(new Date()).getTime());

    var position = get(user_level_flag);

    if(position == customer_level_falg){

        //客户经理
        if(!window.myScroll_progress){
            myScroll_progress = initP2R_progress(pullDownAction, pullUpAction, 'pullDown_progress', 'pullUp_progress', 'wrapper_progress');
        }
        myScroll_progress.minScrollY = 0;    //最小Y轴滚动距离
        myScroll_progress.scrollTo(0, 0);     //滚动至Y轴顶端 显示出loading
        $('#pullDown_progress').addClass('loading_progress');
        //$('.pullDownLabel_progress').html('努力加载中...');
        //$("#pullDownIcon_progress").className = "loading_progress";

        customer_db_operation();


    } else if(position == team_level_flag){

        //团队经理
        if(!window.myScroll_progress_team){
            myScroll_progress_team = initP2R_progress(pullDownActionTeam, pullUpActionTeam, 'pullDown_progress_team', 'pullUp_progress_team', 'wrapper_progress_team');
        }
        myScroll_progress_team.minScrollY = 0;    //最小Y轴滚动距离
        myScroll_progress_team.scrollTo(0, 0);     //滚动至Y轴顶端 显示出loading
        $('#pullDown_progress_team').addClass('loading_progress');
        //$('.pullDownLabel_progress').html('努力加载中...');
        //$("#pullDownIcon_progress_team").className = "loading_progress";


        team_db_operation();

    }

};

/**
 * 客户经理indexedDB操作
 */
var customer_db_operation = function(){

    var stime = get('pullRefreshStartTime');

    var frame_progress_over = document.getElementById("frame_progress_over"),
        frame_progress_is = document.getElementById("frame_progress_is"),
        noContent_html = '<img class="no_progress" src="../images/noContent.png"/> <p class="no_content_font">还没客户？</p><p class="no_content_font">快去展业！</p>';

    customerProgressDao.init(function(){
        customerProgressDao.queryData(get(user_uuid),function(result){
            if((result != null)&&(result.length != 0)){
                console.log("数据库不为空");
                frame_progress_over_list = result.progress2 || [] ; // 已审核的数据
                frame_progress_is_list = result.progress || []; // 审核中的数据
                var over_length = frame_progress_over_list.length || 0,
                    is_length = frame_progress_is_list.length || 0;
                if(is_length == 0){
                    frame_progress_is.innerHTML = noContent_html;
                } else {
                    $("#frame_progress_audit").text("审核中(" + is_length + ")");
                    initPage(frame_progress_is_list);
                }
                if(over_length == 0){
                    frame_progress_over.innerHTML = noContent_html;
                } else {
                    $("#frame_progress_yes").text("已审核(" + over_length + ")");
                    initPage_over(frame_progress_over_list);
                }

                iscrollRefresh(myScroll_progress, stime, 0);

                //客户经理
                frame_progress_request();//进度网络请求

            } else {
                console.log("数据库为空");
                frame_progress_over.innerHTML = noContent_html;
                frame_progress_is.innerHTML = noContent_html;
                iscrollRefresh(myScroll_progress, stime, 0);

                //客户经理
                frame_progress_request();//进度网络请求

            }

        });

    });

};

/**
 * 团队经理indexedDB操作
 */

var team_db_operation = function(){
    var stime = get('pullRefreshStartTime');
    var salerCompno = get("progress_saler_compno");
    var frame_progress_team = document.getElementById("frame_progress_team"),
        frame_progress_salers = document.getElementById("frame_sales_list"),
        noList_html = '<ul class="com-check-list-a"><li class="saler-name checked" data-saler="00000000000000000000"><span class="block-left"><label>全部</label></span></li></ul>',
        noContent_html = '<img class="no_progress" src="../images/noContent.png"/> <p class="no_content_font">还没客户？</p><p class="no_content_font">快去展业！</p>';


    //团队经理进度数据库操作
    var teamProgressInit = function(){
        var deferred1 = $.Deferred();

        teamProgressDao.init(function(){
            teamProgressDao.queryData(salerCompno,function(result){
                if((result != null)&&(result.length != 0)){
                    console.log("数据库中该销售的数据不为空");
                    frame_progress_team_list = result;
                    initPage_team(frame_progress_team_list);
                    iscrollRefresh(myScroll_progress_team, stime, 0);
                    deferred1.resolve();
                } else {
                    console.log("数据库中该销售的数据为空");
                    frame_progress_team.innerHTML = noContent_html;
                    iscrollRefresh(myScroll_progress_team, stime, 0);
                    deferred1.resolve();
                }
            })

        });

        return deferred1.promise();
    };

    //团队经理销售列表数据库操作
    var teamProgressSalerInit = function(){
        var deferred2 = $.Deferred();

        teamProgressSalerDao.init(function(){
            teamProgressSalerDao.queryData(get(user_uuid),function(result){
                if((result != null)&&(result.length != 0)){
                    console.log("销售列表不为空");
                    frame_progress_salers_list = result.userNameCompList;
                    initPage_salesList(frame_progress_salers_list);
                    deferred2.resolve();
                } else {
                    console.log("销售列表为空");
                    frame_progress_salers.innerHTML = noList_html;
                    deferred2.resolve();
                }
            })

        });

        return deferred2.promise();

    };


    $.when(teamProgressInit(), teamProgressSalerInit())
        .done(function(){
            //团队经理
            frame_progress_team_request();//进度网络请求
        });
};

/**
 *下拉刷新
 */
var pullDownAction = function () {
    put('pullRefreshStartTime', (new Date()).getTime());

    //if ($("#progressTabBtnLeft").attr('checked')) {
    //    frame_progress_isfresh = true;
    //} else {
    //    frame_progress_isfresh_over = true;
    //}
    frame_progress_isfresh = true;
    frame_progress_isfresh_over = true;

    if (frame_progress_issuccess) {//请求没有返回，不允许再次发请求
        frame_progress_issuccess = false;
        $("#frame_progress_is").html('');//清空页面避免累加显示
        frame_progress_is_list = [];//审核中数据列表

        $("#frame_progress_over").html('');//清空页面避免累加显示
        frame_progress_over_list = [];//已审核数据列表
        loadNewData();
    }

};

/**
 * 团队经理下拉刷新
 */
var pullDownActionTeam = function () {
    put('pullRefreshStartTime', (new Date()).getTime());

    frame_progress_team_fresh = true;

    if (frame_progress_issuccess) {//请求没有返回，不允许再次发请求
        frame_progress_issuccess = false;
        $("#frame_progress_team").html('');//清空页面避免累加显示
        frame_progress_team_list = [];//团队经理数据列表
        $(".js-sales-list ul").html('');//清空页面避免累加显示
        frame_progress_salers_list = [];//团队经理销售列表
        loadNewData();
    }

};
/**
 *上拉加载
 */
var pullUpAction = function () {
    put('pullRefreshStartTime', (new Date()).getTime());
    if ($("#progressTabBtnRight").attr('checked')) {
        nextPage_over(frame_progress_over_list);//加载更多
    } else if ($("#progressTabBtnLeft").attr('checked')) {
        nextPage(frame_progress_is_list);//审核中加载更多
    }
};
/**
 * 团队经理上拉加载
 */
var pullUpActionTeam = function () {
    put('pullRefreshStartTime', (new Date()).getTime());
    nextPage_team(frame_progress_team_list);//团队经理加载更多
};

/**
 * 显示头像
 */
function frame_progress_show_head(sex) {
    var avatarStr;
    if (sex == "1") {
        avatarStr = "../images/male.png";
    } else if (sex == "2") {
        avatarStr = "../images/female.png";
    } else {
        avatarStr = " ../images/nogender.png";
    }
    return avatarStr;
}

/**
 * 进度返回的时间截取
 * @param dates
 * @returns {string}
 */
function progressDate(dates){
    if(dates != ""){
        return dates.substring(5,16);
    }else{
        return "";
    }
}

/**
 *审核中分页显示
 */
var start = 0;
var end = 10;
var sumPage = 0;
var perPage = 10;
var currentPage = 1;
var sumNum = 0;
/**
 *进度审核中初始化数据
 */
function initPage(datas) {
    if (datas.length < 10) {
        for (var i = 0; i < datas.length; i++) {
            progress_is_html(datas[i]);
        }

    } else {
        for (var i = 0; i < (datas.length - (datas.length - 10)); i++) {
            progress_is_html(datas[i]);
        }

        sumPage = parseInt(datas.length / perPage);
        if ((datas.length % ((parseInt(datas.length / perPage)) * 10)) != 0) {
            sumPage = parseInt(datas.length / perPage) + 1;
        }
        sumNum = datas.length;
    }
//    myScroll_progress.refresh();
    var stime = get('pullRefreshStartTime');
    iscrollRefresh(myScroll_progress, stime, 0);
}

/**
 * 审核中的html渲染
 * @param data   审核中的数据
 */
function progress_is_html(data) {
    var render_data = {
        strsex: frame_progress_show_head(data["strsex"]),
        cusName: !isEmpty(data["cusName"]) ? data["cusName"] : '',
        productName: !isEmpty(data["productName"]) ? data["productName"] : '',
        monthCount:!isEmpty(data["monthCount"]) ? data["monthCount"] + '个月' : '',
        subAppTime: !isEmpty(data["subAppTime"]) ? progressDate(data["subAppTime"]) : '——',
        contractAmount: '——万',
        contractGetAmount: '——万',
        //  subAppTime: data_over[i]["subAppTime"] != null ? data_over[i]["subAppTime"] : '',
        approvedTime: '——',
        status: !isEmpty(data["status"]) ? data["status"] : ''

    };

    var html = '<div class="order">' +
        '<div class="order-top clear">' +
        '<div class="order-top-left fl"><img class="from-icon lastname icon" src=' + render_data.strsex + '></div>' +
        '<div class="order-top-middle fl">' +
        '<span class="item md-item emphasis bod">' + render_data.cusName + '</span>' +
        '<span class="item md-item">' + render_data.productName + ' ' + render_data.monthCount + '</span>' +
        '<span class="item md-item frame_p_bottom">提交申请:' + render_data.subAppTime + '</span>' +
        '</div>' +
        '<div class="order-top-right">' +
        '<span class="item rt-item frame_right_top">合同:' + render_data.contractAmount + '</span>' +
        '<span class="item rt-item frame_right_top">放款:' + render_data.contractGetAmount + '</span>' +
        '<span class="item rt-item frame_p_bottom">批核时间:' + render_data.approvedTime + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="order-bottom"><span class="">' + render_data.status + '</span>';

    if (!isEmpty(data["mobile"])) {
        html += '<button class="call" id="frame_call">呼叫</button>';
    }

    html += '</div></div>';

    $(".frame_progress_is").append(html);
}


/**
 *加载更多
 */
function nextPage(datas_is) {
    if (frame_progress_isfresh) {//刷新过，重新设置数据初始值
        frame_progress_isfresh = false;
        start = 0;
        end = 10;
        sumPage = 0;
        perPage = 10;
        currentPage = 1;
        sumNum = 0;
    }
    if (currentPage == sumPage) {
        currentPage = sumPage;
    } else {
        currentPage = currentPage + 1;
    }
    if (start >= ((parseInt(datas_is.length / perPage))) * 10) {
        start = (parseInt(datas_is.length / perPage)) * 10;
        end = datas_is.length;
    }
    start = start + perPage;
    end = end + perPage;
    for (var i = start; i < end; i++) {
        //加载html
        if (i < datas_is.length) {
            progress_is_html(datas_is[i]);
        }
    }
//    myScroll_progress.refresh();

    var stime = get('pullRefreshStartTime');
    iscrollRefresh(myScroll_progress, stime, 0);
}

/**
 *已审核分页显示
 */
var start_over = 0;
var end_over = 10;
var sumPage_over = 0;
var perPage_over = 10;
var currentPage_over = 1;
var sumNum_over = 0;
/**
 *进度已审核初始化数据
 */
function initPage_over(data_over) {
    var len = data_over.length;
    if (len < 10) {
        for (var i = 0; i < len; i++) {
            progress_over_html(data_over[i]);
        }
    } else {
        for (var i = 0; i < (len - (len - 10)); i++) {
            progress_over_html(data_over[i]);
        }
        sumPage_over = parseInt(data_over.length / perPage_over);
        if ((data_over.length % ((parseInt(data_over.length / perPage_over)) * 10)) != 0) {
            sumPage_over = parseInt(data_over.length / perPage_over) + 1;
            //alert("sumPage="+sumPage_over);
        }
        sumNum_over = data_over.length;
    }
//    myScroll_progress.refresh();

    var stime = get('pullRefreshStartTime');
    iscrollRefresh(myScroll_progress, stime, 0);
}

    /**
     * 已审核的html渲染
     * @param data  已审核的数据 object
     */
function progress_over_html(data) {
    var render_data = {
        strsex: frame_progress_show_head(data["strsex"]),
        cusName: !isEmpty(data["cusName"]) ? data["cusName"] : '',
        productName: !isEmpty(data["productName"]) ? data["productName"] : '',
        monthCount:!isEmpty(data["monthCount"]) ? data["monthCount"] + '个月' : '',
        subAppTime: !isEmpty(data["subAppTime"]) ? progressDate(data["subAppTime"]) : '',
        contractAmount: !isEmpty(data["contractAmount"]) ? data["contractAmount"] + '万' : '',
        contractGetAmount: !isEmpty(data["contractGetAmount"]) ? data["contractGetAmount"] + '万' : '',
        //  subAppTime: data_over[i]["subAppTime"] != null ? data_over[i]["subAppTime"] : '',
        approvedTime: !isEmpty(data["approvedTime"]) ? progressDate(data["approvedTime"]) : '',
        status: !isEmpty(data["status"]) ? data["status"] : ''
    };

    var html = '<div class="order">' +
        '<div class="order-top clear">' +
        '<div class="order-top-left fl"><img class="from-icon lastname icon" src=' + render_data.strsex + '></div>' +
        '<div class="order-top-middle fl">' +
        '<span class="item md-item emphasis bod">' + render_data.cusName + '</span>' +
        '<span class="item md-item">' + render_data.productName + ' ' + render_data.monthCount + '</span>' +
        '<span class="item md-item frame_p_bottom">提交申请:' + render_data.subAppTime + '</span>' +
        '</div>' +
        '<div class="order-top-right">' +
        '<span class="item rt-item frame_right_top">合同:' + render_data.contractAmount + '</span>' +
        '<span class="item rt-item frame_right_top">放款:' + render_data.contractGetAmount + '</span>' +
        '<span class="item rt-item frame_p_bottom">批核时间:' + render_data.approvedTime + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="order-bottom"><span class="">' + render_data.status + '</span>';

    if (!isEmpty(data["mobile"])) {
        html += '<button class="call" id="frame_call">呼叫</button>';
    }
    html +='</div></div>';
    $(".frame_progress_over").append(html);
}


/**
 *加载更多
 */
function nextPage_over(datas_over) {
    if (frame_progress_isfresh_over) {//刷新过，重新设置数据初始值
        frame_progress_isfresh_over = false;
        start_over = 0;
        end_over = 10;
        sumPage_over = 0;
        perPage_over = 10;
        currentPage_over = 1;
        sumNum_over = 0;
    }
    if (currentPage_over == sumPage_over) {
        currentPage_over = sumPage_over;
    } else {
        currentPage_over = currentPage_over + 1;
    }
    if (start_over >= ((parseInt(datas_over.length / perPage_over))) * 10) {
        start_over = (parseInt(datas_over.length / perPage_over)) * 10;
        end_over = datas_over.length;
    }
    start_over = start_over + perPage_over;
    end_over = end_over + perPage_over;
    for (var i = start_over; i < end_over; i++) {
        //加载html
        if (i < datas_over.length) {
            progress_over_html(datas_over[i]);
        }

    }
//    myScroll_progress.refresh();

    var stime = get('pullRefreshStartTime');
    iscrollRefresh(myScroll_progress, stime, 0);
}


/**
 *团队经理数据分页显示
 */
var start_team = 0;
var end_team = 10;
var sumPage_team = 0;
var perPage_team = 10;
var currentPage_team = 1;
var sumNum_team = 0;
/**
 *进度团队经理初始化数据
 */
function initPage_team(datas_team) {
    if (datas_team.length < 10) {
        for (var i = 0; i < datas_team.length; i++) {

            progress_team_html(datas_team[i]);
        }

    } else {
        for (var i = 0; i < (datas_team.length - (datas_team.length - 10)); i++) {

            progress_team_html(datas_team[i]);
        }

        sumPage_team = parseInt(datas_team.length / perPage_team);
        if ((datas_team.length % ((parseInt(datas_team.length / perPage_team)) * 10)) != 0) {
            sumPage_team = parseInt(datas_team.length / perPage_team) + 1;
        }
        sumNum_team = datas_team.length;
    }
//    myScroll_progress.refresh();
    var stime = get('pullRefreshStartTime');
    iscrollRefresh(myScroll_progress_team, stime, 0);
}

/**
 * 团队经理数据的html渲染
 * @param data   团队经理的数据
 */
function progress_team_html(data) {

    var render_data = {
        strsex: frame_progress_show_head(data["strsex"]),
        cusName: !isEmpty(data["cusName"]) ? data["cusName"] : '',
        productName: !isEmpty(data["productName"]) ? data["productName"] : '',
        monthCount:!isEmpty(data["monthCount"]) ? data["monthCount"] + '个月' : '',
        subAppTime: !isEmpty(data["subAppTime"]) ? data["subAppTime"] : '',
        contractAmount: !isEmpty(data["contractAmount"]) ? data["contractAmount"] + '万' : '',
        contractGetAmount: !isEmpty(data["contractGetAmount"]) ? data["contractGetAmount"] + '万' : '',
        //  subAppTime: data_over[i]["subAppTime"] != null ? data_over[i]["subAppTime"] : '',
        approvedTime:!isEmpty(data["approvedTime"]) ? data["approvedTime"] : '',
        salerName: !isEmpty(data["salerName"]) ? data["salerName"] : '',
        status: !isEmpty(data["status"]) ? data["status"] : ''
    };

    var html = '<div class="order">' +
        '<div class="order-top clear">' +
        '<div class="order-top-left fl"><img class="from-icon lastname icon" src=' + render_data.strsex + '></div>' +
        '<div class="order-top-middle fl">' +
        '<span class="item md-item emphasis bod">' + render_data.cusName + '</span>' +
        '<span class="item md-item">' + render_data.productName + '</span>' +
        '<span class="item md-item frame_p_bottom">提交申请:' + render_data.subAppTime + '</span>' +
        '</div>' +
        '<div class="order-top-right">' +
        '<span class="item rt-item frame_right_top">合同/放款:' + render_data.contractAmount +'/'+ render_data.contractGetAmount + '</span>' +
        '<span class="item rt-item frame_right_top">' + render_data.monthCount + '</span>' +
        '<span class="item rt-item frame_p_bottom">批核时间:' + render_data.approvedTime + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="order-bottom">'+
        '<span class="order-saler">销售:' + render_data.salerName + '</span>'+
        '<span class="order-status">' + render_data.status + '</span>';

    html += '</div></div>';

    $(".frame_progress_team").append(html);
}

/**
 *进度团队经理销售列表初始化数据
 */
function initPage_salesList(saler_list) {

    var salerId = get("progress_saler_compno");
    for (var i = 0; i < saler_list.length; i++) {

        progress_sales_list(saler_list[i], salerId);
    }

}


/**
 * 团队经理销售列表的html渲染
 * @param data   团队经理的销售列表
 * @salerId  选中的销售ID
 */
function progress_sales_list(data, salerId) {

    var render_data = {
        userName: !isEmpty(data["userName"]) ? data["userName"] : '',
        salerId: !isEmpty(data["compno"]) ? data["compno"] : ''
    };

    var cls = '';

    if(render_data.salerId == salerId){
        cls = 'checked';
    }else {
        cls = '';
    }

    var html = '<li class="saler-name '+ cls + '" data-saler="'+ render_data.salerId +'">'+
        '<span class="block-left">' + '<label>' +
        render_data.userName + '</label>'+
        '</span>'+
        '</li>';


    $(".js-sales-list ul").append(html);
}

/**
 *团队经理加载更多
 */
function nextPage_team(datas_team) {
    if (frame_progress_team_fresh) {//刷新过，重新设置数据初始值
        frame_progress_team_fresh = false;
        start_team = 0;
        end_team = 10;
        sumPage_team = 0;
        perPage_team = 10;
        currentPage_team = 1;
        sumNum_team = 0;
    }
    if (currentPage_team == sumPage_team) {
        currentPage_team = sumPage_team;
    } else {
        currentPage_team = currentPage_team + 1;
    }

    if (start_team >= ((parseInt(datas_team.length / perPage_team))) * 10) {
        start_team = (parseInt(datas_team.length / perPage_team)) * 10;
        end_team = datas_team.length;
    }
    start_team = start_team + perPage_team;
    end_team = end_team + perPage_team;

    for (var i = start_team; i < end_team; i++) {
        //加载html
        if (i < datas_team.length) {
            progress_team_html(datas_team[i]);
        }
    }
//    myScroll_progress.refresh();

    var stime = get('pullRefreshStartTime');
    iscrollRefresh(myScroll_progress_team, stime, 0);
}


/**
 *进度数据请求参数
 * @returns {*}
 */
function frame_progress_getParamsdata() {
    var deviceUUID = getDeviceUUID();
    var userUUID = get(user_uuid);
    var hashMap = new HashMap();
    hashMap.put("devUUID", deviceUUID);
    hashMap.put("userUUID", userUUID);
    return getJsonStr(hashMap);
}

/**
 * 进度请求数据
 */
function frame_progress_request() {
    console.log("进度接口" + frame_progress_interface + "参数：" + frame_progress_getParamsdata());

    var frame_progress_over = document.getElementById("frame_progress_over"),
        frame_progress_is = document.getElementById("frame_progress_is"),
        noContent_html = '<img class="no_progress" src="../images/noContent.png"/> <p class="no_content_font">还没客户？</p><p class="no_content_font">快去展业！</p>';

    var stime = get('pullRefreshStartTime');
    var delay = 0;

    http_post(frame_progress_interface, frame_progress_getParamsdata(),
        function (data) {
            console.log("进度返回数据" + JSON.stringify(data));
            var msgInfo = data.msgInfo;

//            data = data.progress;//  将data赋值
//            console.log("进度返回数据条数" + data.length);

            if (data) {
                /**
                 * 1.55版本将已审核和审核中的数据分别放置不同的list
                 */
                frame_progress_over_list = data.progress2 || [] ; // 已审核的数据
                frame_progress_is_list = data.progress || []; // 审核中的数据

                var over_len = frame_progress_over_list.length || 0,
                    is_len = frame_progress_is_list.length || 0;

                if (over_len == 0) {//已审核为空显示暂无数据
                    frame_progress_over.innerHTML = noContent_html;
                } else {
                    $("#frame_progress_yes").text("已审核(" + over_len + ")");
                    frame_progress_over.innerHTML = '';
                    //显示已审核数据
                    initPage_over(frame_progress_over_list);        //数据初始化
                }
                if (is_len == 0) {//审核中为空显示暂无数据
                    frame_progress_is.innerHTML = noContent_html;
                } else {
                    $("#frame_progress_audit").text("审核中(" + is_len + ")");
                    frame_progress_is.innerHTML = '';
                    //  显示审核中数据
                    initPage(frame_progress_is_list);//数据初始化
                }

                iscrollRefresh(myScroll_progress, stime, delay);

                //更新indexDB
                customerProgressDao.insertData(data,function(){
                    console.log("更新indexDB成功");
                })

            }
            setTimeout("frame_progress_issuccess = true", 200);
        }, function (xhr, e) {
            console.log("进度请求失败" + xhr);
            //如果没有数据返回，显示暂无数据
//            setTimeout(function(){
//                myScroll_progress.refresh();
//            },5000);

            iscrollRefresh(myScroll_progress, stime, 5000);
            //
            //frame_progress_is.innerHTML = noContent_html;
            //frame_progress_over.innerHTML = noContent_html;
            setTimeout("frame_progress_issuccess = true", 200);
        });//请求网路服务
}


/**
 *进度团队经理数据请求参数
 * @returns {*}
 */
function frame_progress_team_getParamsdata() {
    var deviceUUID = getDeviceUUID();
    var userUUID = get(user_uuid);
    var salerId = get("progress_saler_compno");
    var hashMap = new HashMap();
    hashMap.put("devUUID", deviceUUID);
    hashMap.put("userUUID", userUUID);
    hashMap.put("compno",salerId);
    return getJsonStr(hashMap);
}

/**
 * 进度团队经理请求数据
 */
var frame_progress_team_request = function(){
    console.log("进度接口" + frame_progress_team_interface + "参数：" + frame_progress_team_getParamsdata());

    var frame_progress_team = document.getElementById("frame_progress_team"),
    frame_progress_salers = document.getElementById("frame_sales_list"),
        noList_html = '<ul class="com-check-list-a"><li class="saler-name checked" data-saler="00000000000000000000"><span class="block-left"><label>全部</label></span></li></ul>',
        noContent_html = '<img class="no_progress" src="../images/noContent.png"/> <p class="no_content_font">还没客户？</p><p class="no_content_font">快去展业！</p>';

    var stime = get('pullRefreshStartTime');
    var delay = 0;


    http_post(frame_progress_team_interface, frame_progress_team_getParamsdata(),
        function (data) {
            console.log("进度返回数据" + JSON.stringify(data));
            var msgInfo = data.msgInfo;
            var codeInfo = data.codeInfo;

            if (codeInfo != null && 0 == codeInfo) {

                frame_progress_team_list = data.progressList || [];//团队经理的数据
                frame_progress_salers_list = data.teamUserList.userNameCompList || [];//团队经理的销售列表

                var team_len = frame_progress_team_list.length || 0,
                    salers_len = frame_progress_salers_list.length || 0;

                if (team_len == 0) {//团队经理为空显示暂无数据
                    frame_progress_team.innerHTML = noContent_html;
                } else {
                    frame_progress_team.innerHTML = '';
                    //  显示团队经理的数据
                    initPage_team(frame_progress_team_list);//数据初始化
                }
                if (salers_len == 0) {//团队经理销售列表为空显示暂无数据
                    //frame_progress_salers.innerHTML = noContent_html;
                    console.log("团队经理销售列表为空");
                } else {
                    frame_progress_salers.innerHTML = '<ul class="com-check-list-a"></ul>';
                    //  显示团队经理销售列表的数据
                    initPage_salesList(frame_progress_salers_list);//数据初始化
                }

                iscrollRefresh(myScroll_progress_team, stime, delay);

                //更新indexDB
                teamProgressSalerDao.insertData(data.teamUserList,function(){
                    console.log("更新销售列表成功");
                });

                teamProgressDao.deleteData(get("progress_saler_compno"),function(){
                   teamProgressDao.insertData(data.progressList,function(){
                       console.log("更新indexDB成功");
                   })
                });

            } else {
                console.log("团队经理进度请求失败");
            }
            setTimeout("frame_progress_issuccess = true", 200);
        }, function (xhr, e) {
            console.log("团队经理进度请求失败xhr" + xhr);
            //如果没有数据返回，显示暂无数据
//            setTimeout(function(){
//                myScroll_progress.refresh();
//            },5000);

            iscrollRefresh(myScroll_progress_team, stime, 5000);

            //frame_progress_team.innerHTML = noContent_html;
            ////销售列表显示全部
            //frame_progress_salers.innerHTML = noList_html;
            setTimeout("frame_progress_issuccess = true", 200);
        });//请求网路服务
}

/**
 *
 * @param optFlag  标识为2，表示保存沟通时间
 * @param phonenumber  客户电话
 * @param cusName  客户姓名
 *  @param gender  客户性别
 * @returns {*}
 */
function frame_progress_getParams(optFlag, cusName, phonenumber) {
    var deviceUUID = getDeviceUUID();
    var userUUID = get(user_uuid);
    var compno = get(user_uuid);//员工编号
    var hashMap = new HashMap();
    hashMap.put("devUUID", deviceUUID);
    hashMap.put("userUUID", userUUID);
    hashMap.put("compno", compnoSubstr(userUUID));//员工编号
    hashMap.put("phonenumber", phonenumber);
    hashMap.put("cusName", cusName);
    hashMap.put("optFlag", optFlag);
    return getJsonStr(hashMap);
}

/**
 * 进度打电话请求
 */
function frame_progress_call_request(name, mobile) {
    var index = $(this).parent().parent().index();
    console.log("进度打电话接口" + update_customer_interface + ",,,参数" + frame_progress_getParams('2', name, mobile));
    setTimeout(function () {
    }, 500);
    http_post(update_customer_interface, frame_progress_getParams('2', name, mobile),
        function (data) {
            console.log("进度打电话返回数据" + JSON.stringify(data));
        }, function (xhr, e) {
            console.log("进度打电话请求失败" + xhr);
        });//请求网路服务
}