var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
$(function () {
    FastClick.attach(document.body);
});

Zepto(function ($) {

    var localStorage_name = localStorage.getItem("localStorage_name");
    var localStorage_city = localStorage.getItem("localStorage_city");
    var localStorage_number = localStorage.getItem("localStorage_number");
    var localStorage_department = localStorage.getItem("localStorage_department");
    var localStorage_position=localStorage.getItem("localStorage_position");
    var localStorage_showPaperFlag=localStorage.getItem("localStorage_showPaperFlag");
    //---start by ly 20161031---
    var localStorage_coin=localStorage.getItem("localStorage_coin");
    //---end by ly 20161031---

    //判断是否显示日报
    if (localStorage_showPaperFlag =="1"){
        $(".dailyPaper").css("display","block");
    }else{
        $(".dailyPaper").css("display","none");
    }
    //console.log("localStorage_Lname---->"+localStorage_levelName );
    //console.log("me_phonenumber---->"+me_phonenumber);
    $(".localStorage-name").text(localStorage_name);
    $(".localStorage-city").text(localStorage_city);
    $(".localStorage-number").text(localStorage_number);
    $(".localStorage-department").text(localStorage_department);
    //---start by ly 20161031---
    $(".localStorage-coin").text(localStorage_coin);
    //---end by ly 20161031---

    var mx = parseInt($(window).height());
    var m = parseInt($(".ykl-footer").height());
    var headerH = parseInt($(".ykl-header").height());
    //var bannerH = parseInt($("#mySwipe").height());
    console.log(mx);
    if (mx <= 480) {
        $(".share-con").css({"height": "33%", "margin-top": "92%"});

    }
    //$(".InnerDiv").height(mx - m - headerH);
    //

    $(".bod input").focus(function () {
        if($(this).val()!=""){
            $(this).addClass("inputB");
        }else{
            $(this).removeClass("inputB");
            $(this).bind('input', function() {
                if($(this).val()!="") {
                    $(this).addClass("inputB");
                }else{
                    $(this).removeClass("inputB");
                }
            });
        }
    });
    $(".bod input").blur(function () {
        $(this).removeClass("inputB");
    });

    $(".spn").click(function () {
        $(this).prev().val('');
        $(this).prev().focus();
    });
    $(".bod").click(function () {
        $(this).focus();
    });

    Zepto(".show_error_confirm_button").click(function () {
        $(".show_error_dialog .alt").hide();
        $(".show_error_dialog .altW").hide();
    });


    /*************************/
    /*footer*/
    $(".ykl-footer .oDiv").on('click', function () {
        $(this).find('.ykl-img1').addClass("disp").next().removeClass("disp");
        $(this).find('p').addClass("color");
        $(this).siblings().find('.ykl-img1').removeClass("disp").next().addClass('disp');
        $(this).siblings().find('p').removeClass("color");

        var n = [
            "zhanye.html",
            "javascript:",
            "javascript:",
            "javascript:",
            "javascript:"
            ];
        var m = $(this).index();
        $("#framUrl").attr("src", n[m]);
    });

    /*share.html*/
    Zepto(".share").click(function () {
        $(".share-alt").addClass("show");
    });
    Zepto(".share-qx").click(function () {
        $(".share-alt").removeClass("show");
    });
    Zepto(".js-hide-share").click(function(){
        $(".share-alt").removeClass("show");
    });

});



