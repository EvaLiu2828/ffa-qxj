/**
 * Created by 201504095248 on 2015/8/27.
 * 此js文件是之前frame.html页面下部的js代码
 */

//干掉loading
////ajax请求前触发loading
//;(function ($) {
//    //TODO 应改为局部变量
//    var loading;
//
//    $(document).on('ajaxBeforeSend', function (e, xhr, options) {
//
//        //不想触发loading的请求在这里过滤
//        if ((!options.url.match('getCustList')) &&
//            (!options.url.match('progressDetails')) &&
//            (!options.url.match('checkVerAndUpOptTime')) &&
//            (!options.url.match('hotSpotQuery')) &&
//            (!options.url.match('myMicroShop'))) {
//            loading = FFA.Components.Popup.Loading('A', {
//                //withMask: 'A'   //蒙层类型
//            });
//        }
//    });
//    //请求结束隐藏loading
//    $(document).on('ajaxComplete', function (e, xhr, options) {
//        loading && loading.remove();
//    });
//
//    //ajaxError隐藏loading
//    $(document).on('ajaxError', function (e, xhr, options) {
//        loading && loading.remove();
//    });
//})(Zepto);

// 防止穿透
$(function () {
    FastClick.attach(document.body);
});

//Frame方法定义
(function (FFA) {
    var Frame = FFA.namespace("Frame");
    var ExhibitionPage = FFA.namespace('Frame.ExhibitionPage');

    //轮播图初始化方法
    ExhibitionPage.initBanner = (function () {
        var banner = null;

        function init(){
            var bullets = document.getElementById('position').getElementsByTagName('li');
            banner = Swipe(document.getElementById('mySwipe'), {
                auto: 2000,
                continuous: true,
                disableScroll: false,
                callback: function (pos) {
                    var i = bullets.length;
                    while (i--) {
                        bullets[i].className = ' ';
                    }
                    bullets[pos].className = 'cur';
                }
            });
        }

        return function () {
            if (banner) {
                banner.kill();
                init();
            }else{
                init();
            }
        };
    })();

    //统计方法
    Frame.categoryName = function (categoryName) {
        var dateUtils = new DateUtils();
        var statistics = new Statistics();
        var data = {
            id: dateUtils.getTime(),
            time: dateUtils.getYMD(),
            category_name: categoryName,
            user_id: get(user_uuid)
        };
        statistics.categoryStatistics(data);
    };



    /*页面跳转
     根据不同按钮上的页面名称判断点击了哪个tab
     展业：exhibition
     客户：customer
     中间加号：plus
     进度：progress
     我的：mine
     */
    Frame.goToPage = function (pageName) {

        //没有页面名称时 进入展业
        pageName = pageName || "exhibition";
        //导入CustomerPage ProgressPage对象
        var CustomerPage = FFA.namespace('Frame.CustomerPage');
        var ProgressPage = FFA.namespace('Frame.ProgressPage');
        var TeamView = FFA.namespace("Team.TeamView");

        var title; // 页头

        // 荣誉排行
        var rank = $("#honor_rank");
        rank.css("display","none");

        //----start by lyx----
        //抢商机
        var grab = $("#grab_bussince");
        grab.css("display","none");
        //----end by lyx----

        //切换页面
        $("#page-" + pageName).addClass("actived").siblings().removeClass("actived");
        $(".js-footer-tab." + pageName).addClass("actived").siblings().removeClass("actived");

        //根据页面名称初始化页面
        switch(pageName){
            case "exhibition":
                title = "展业";
                rank.css("display","inline");
                ExhibitionPage.initBanner();
                break;
            case "customer":
                title = "客户";
                //start by lyx
                grab.css("display","inline");
                //end by lyx
                CustomerPage.init();
                break;
            case "plus":
                break;
            case "progress":
                title = "进度";
                ProgressPage.init();
                break;
            case "mine":
                title = "我的";
                // 获取小红点(所有的)
                var RedDot = FFA.namespace("RedDot");
                RedDot.geAlltRedDotState();
                break;
            case "team":
                title = "团队";
                TeamView.init();
                break;
            case "department":
                title = "营业部";
                //   TeamView.init();
                break;
            default:
                title = "展业";
                ExhibitionPage.initBanner();
                break;
        }

        //设置页面头
        $(".js-header-title").text(title);

        if (pageName=="mine"){
            $("#content").addClass("topPadding");
            $("header").addClass("hideHeader");
        }else{
            $("#content").removeClass("topPadding");
            $("header").removeClass("hideHeader");
        }

        if(pageName !== "progress"){
            $(".js-header-left-btn").hide();
            $(".js-header-right-btn").hide();
        }
    };


})(FFA);

//frame页面初始化
$(function () {
    var Frame = FFA.namespace("Frame"),
        pageName = sessionStorage.getItem("pageName"),  //页面名称
        footer = $(".js-footer");   //页脚

    var Customer = FFA.namespace('Customer');

    var customerController = Customer.controller;


    var ExhibitionPage = FFA.namespace('Frame.ExhibitionPage');
    var CustomerPage = FFA.namespace('Frame.CustomerPage');
    var ProgressPage = FFA.namespace('Frame.ProgressPage');
    //var MinePage = FFA.namespace('Frame.MinePage');


    var level = get(user_level_flag);
    // 团队经理
    var level_txt = $("#js-level-control .tab-name", footer),
        level_obj = $("#js-level-control", footer),
        remove_class = $("#js-level-control").data("page");

    if (level == team_level_flag) {
        level_txt.text("团队");
        level_obj.data("page", "team");
        level_obj.removeClass(remove_class).addClass("team");
    } else if (level == dep_level_flag) { // 营业部经理
        level_txt.text("营业部");
        level_obj.data("page", "department");
        level_obj.removeClass(remove_class).addClass("department");
    } else {
        level_txt.text("客户");
        level_obj.data("page", "customer");
        level_obj.removeClass(remove_class).addClass("customer");

        put("customer-sublevel-title", '');
        put("customer-sublevel-managerId", '');
        put("customer-sublevel-cusCount", '');
        put("team-customer-count", '');
    }

    //跳转至相应页面
    Frame.goToPage(pageName);

    //页脚点击事件注册
    footer.on("click", ".js-footer-tab", function () {

        var pageName = $(this).data("page");     //获取页面名称
        //页面名称存入session
        if(pageName !== "plus"){
            sessionStorage.setItem("pageName", pageName);
        }

        //如果页面处于客户搜索状态则取消搜索
        if($(document.body).hasClass("searching")){
            customerController.cancelSearch();
        }
        //进行页面跳转
        Frame.goToPage(pageName);
    });

    footer.on("click", ".exhibition", function () {
        ExhibitionPage.initBanner();
    });

    footer.on("click", ".customer", function () {
        CustomerPage.init();
    });

    footer.on("click", ".team", function () {
        var TeamView = FFA.namespace("Team.TeamView");
        TeamView.init();
    });
    footer.on("click", ".department", function () {
        //   CustomerPage.init();
    });

    footer.on("click", ".progress", function () {
        ProgressPage.init();
    });

    footer.on("click", ".mine", function () {
        mine(mine_get_success, mine_get_fail);

        //普惠金融家数据请求
    //    mine_rate(mine_rate_get_success_before, mine_rate_get_fail);

        //绩效查询小红点请求
    //    mine_perform_dot(mine_perform_dot_get_success,mine_perform_dot_get_fail);

        // 获取小红点(所有的)
        var RedDot = FFA.namespace("RedDot");
        RedDot.getAllRedDot();

    });


    //加号点击事件
    footer.on("click", ".plus", function () {
        location.href="./enter/addCustomer.html";
    });


    //在页脚点击标签添加统计方法
    footer.on("click", ".js-footer-tab", function () {
        var pageName = $(this).data("page");

        //展业：exhibition
        //客户：customer
        //中间加号：plus
        //进度：progress
        //我的：mine
        switch (pageName) {
            case "exhibition":
                Frame.categoryName("展业");
                break;
            case "customer":
                Frame.categoryName("客户");
                break;
            case "team":
                Frame.categoryName("团队");
                break;
            case "department":
                Frame.categoryName("营业部");
                break;
            case "plus":
                Frame.categoryName("添加客户");
                break;
            case "progress":
                Frame.categoryName("进度");
                break;
            case "mine":
                Frame.categoryName("我的");
                break;
        }
    })
});




//我的页面导航功能
$(function () {
    //我的页面导航
    $('.js-mine-list-nav').on('click', 'li', function (evt) {

        // 小红点的状态更新
        var className = $(this).attr("class");
        if (className){
            var match = className.match(/^js_red_dot_wrap\_([0-9]+)/);

            if (match) {
                var RedDot = FFA.namespace("RedDot");
                RedDot.setRedDotState(match[1], 1); // 设置已读
            }
        }
        var url = $(this).data('url');  //使用data存储地址
        window.location.href = url;

    });
    //---start by ly 20161031---
    //指尖币页面入口
    $('.js-coin').on('click',function(){
        window.location.href = "setting/coin.html?flag=0";
    });
    //---end by ly 20161031---
});


$(function () {
    document.addEventListener("deviceready", function () {
        downloadHeaderPhoto();
        FFA.namespace('NoReadFrame').readLocalDataUpload();
        //setTimeout("downloadHeaderPhoto()", 500);

        //TODO  获取未联系过客户的数量
    });

    /*客户热点*/
    var frame_hot_query = 1;

    function frame_hot_query_timer() {
        frame_hot_query = frame_hot_query - 1;
        if (frame_hot_query < 0) {
            hot_spot_query();
            window.clearInterval(ti);
        }
    }

    var ti = window.setInterval(frame_hot_query_timer, 500);
    $(".js-photo-touched").bind('click', function () {
        var n = $(this).attr("id");
        put('choose_hot', n);
        var news_id= get(n);
        if(news_id){
            window.location = "exhibit/hotactive_none.html";
        }
    });

    //添加直接查询的逻辑
    var spot_version = get(spot_query_version);
    console.log("log" + spot_version);
    if (!isEmpty(spot_version)) {
        query_version_equals(true, null);//如果当前有数据直接查询
    }
    /*展业js*/

    /*我的微店的请求参数*/
    setTimeout("reponse_shop_url()", 500);
    /*申请js*/

    /*我js*/
    var header = new Header();
    //更换头像
    $(".change_header").click(function () {
        header.click_head_show();
    });

    /*var header_url=get(header_crop_url);
     console.log(header_crop_url);
     if(header_url!=null&&header_url.length>0){
     $(".change_header").css("background-image",'url('+header_url+'?id='+Math.random()+')');
     }*/
    //从本地相册选取
    $(".head_choose_confirm").click(function () {
        header.head_crop_photo_library();
    });
    //触摸开始事件
    $(".head_choose_confirm").bind("touchstart", function () {
        $(".head_choose_confirm").find("p").css("color", "#dcdcdc");
    });
    //触摸结束事件
    $(".head_choose_confirm").bind("touchend", function () {
        $(".head_choose_confirm").find("p").css("color", "#000000");
    });

    //取消
    $(".head_choose_cancel").click(function () {
        header.head_crop_hide();
    });

    //点击浮层，弹出框消失
    $(".js_head_choose_background").on('click', function () {
        console.log("js_head_choose_background");
        header.head_crop_hide();
    });


    $(".js-exit-btn").click(function () {
        FFA.Components.Popup.Confirm('B', {
            content: '退出后您将收不到指尖金融家通知',  //显示内容
            withMask: 'A',   //蒙层类型
            leftButton: '取消', //左按钮内容
            rightButton: '退出' //右按钮内容

        }, null, function () {
            new SystemExit().exit(true,function(){
                console.log('exit success');
            },false);
        });
    });

});


function equalsIgnoreCase(str1, str2) {
    if (str1.toUpperCase() == str2.toUpperCase()) {
        return true;
    }
    return false;
}

function checkUpdate() {
    var hashMap = new HashMap();
    var deviceUUID = getDeviceUUID();
    var userID = localStorage.getItem(user_uuid);//get(user_uuid);
    var myPhoneNumber = localStorage.getItem(me_phonenumber);
    var platform_flag = "";
    //start 2015-7-7 wangjunbao update
    if (equalsIgnoreCase(device.platform, "Android")) {
        platform_flag = "1";
    } else if (equalsIgnoreCase(device.platform, "ios")) {
        platform_flag = "2";
    } else {
    }
    //end 2015-7-7 wangjunbao update
    console.log("checkVersionUpdate devicePlatform:" + device.platform);
    var versionInfo = getString("version_info");
    hashMap.put(userUUID, userID);
    hashMap.put(devUUID, deviceUUID);
    hashMap.put(phoneNumber, myPhoneNumber);
    hashMap.put(flag, platform_flag);
    hashMap.put(version, versionInfo);
    //console.log("checkVersionUpdate check_version_interface:" + check_version_interface);
    //console.log("checkVersionUpdate JsonStr:" + getJsonStr(hashMap));
    http_post(check_version_interface, getJsonStr(hashMap), check_version_success, check_version_fail);
    //console.log("checkVersionUpdate post check version request");
}

function downloadHeaderPhoto() {

    var header_url = get(header_crop_url);
    console.log("header_crop_url---------------->" + header_crop_url);
    if (header_url != null && header_url.length > 0) {
        var headerPhotoDownload = new HeaderPhotoDownload();
        var headerParameter = {
            headPath: header_url,
            photoShowId: "js-header-photo",
            isBackground: true
        }
        headerPhotoDownload.header_download_pic(headerParameter);
        $(".change_header").css("background-image",'url('+header_url+'?id='+Math.random()+')');
    }
}

$(function () {
    setTimeout("checkUpdate()", 500);
    document.addEventListener("deviceready", function () {
        var onGetRegistradionID = function (data) {
            console.log("JPushPlugin:registrationID is " + data);
            localStorage.setItem(push_registradion_id, data);
        };
        var pushRegistradionID = localStorage.getItem(push_registradion_id);
        if(pushRegistradionID == null || pushRegistradionID == "") {
            try {
                window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
            }
            catch (exception) {
                console.log(exception);
            }
        }
        if (device.platform != "Android") {
            window.plugins.jPushPlugin.setDebugModeFromIos();
            window.plugins.jPushPlugin.resetBadge();
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        } else {
            window.plugins.jPushPlugin.setDebugMode(false);
        }
        var userID = compnoSubstr(localStorage.getItem(user_uuid));
        window.plugins.jPushPlugin.setAlias(userID);
}, false);
});


$('.js-zy-ul-div').on('click', function () {

    var url = $(this).data('url'),
        num = $(this).data('num');
    //数据统计开始
    var templateListUtils = new TemplateListUtils();
    var dateUtils = new DateUtils();
    var statistics = new Statistics();
    var data = {
        id: dateUtils.getTime(),
        time: dateUtils.getYMD(),
        module_name: templateListUtils.categoryName(num),
        user_id: get(user_uuid)
    }
    statistics.moduleStatistics(data);
    //数据统计结束
    localStorage.setItem('zhanye-number', num);
    put('zhanye-number-pid', num);
    put("zhanye-number-full", 'true');
    window.location = url;
});


