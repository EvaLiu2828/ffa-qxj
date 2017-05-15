document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);
//v基本参数定义
var page_flip, vertical_scroll = [], pages, t, p, iDevice = (/iphone|ipad/gi).test(navigator.appVersion), $id = function (id) {
    return document.getElementById(id);
}, $sa = function (s) {
    return document.querySelectorAll(s);
}, $s = function (s) {
    return document.querySelector(s);
}, initScroll = function () {//初始化iscroll
    intervalTime = setInterval(function () {
        var resultContentH = $("#applyResult").height();

        if (window.scrollY != 1) {
            t = setTimeout(initScroll, 100);
        }
        else if (resultContentH > 0) {
            // console.log("此时高度是:" + resultContentH);
            $("#applyResult").height(resultContentH);
            $("#shareResult").height(resultContentH);
            setTimeout(function () {
                clearInterval(intervalTime);
                clearTimeout(t);
                t = null;
                //获取上下滚动的iscroll
                pages = $sa('.scrollerwrapper');
                //设置左右滚动的iscroll
                page_flip = new iScroll('pagewrapper', {
                    bounce: false,
                    hScrollbar: false,
                    vScrollbar: false,
                    snap: true,//此处必须为true
                    momentum: false,
                    lockDirection: true,
                    fixedScrollbar: false,//只有按住屏幕的时候才能显示出滚动条
                    onScrollEnd: function () {
                        //此处利用this.currPagex 获取当前是在第几屏 . 从0开始:0,1,2,3,4.....
                        //active为处于当前某个栏目时导航的样式.
                        $s('#nav a.active').className = '';
                        $s('#nav li:nth-child(' + (this.currPageX + 1) + ') a').className = 'active';
                    }
                });
                //此处的获取size函数不能缺少.除非自定义css.
                setSize();
                for (var a = 0; a < pages.length; a++) {
                    //利用数组来定义出上下滚动的iscroll
                    vertical_scroll[a] = new iScroll(pages[a], {
                        bounce: false,
                        hScrollbar: false,
                        vScrollbar: true,
                        fixedScrollbar: false,
                        lockDirection: true,
                        fadeScrollbar: true,
                        hideScrollbar: true
                    });
                }
                //监听手机屏幕旋转
                // window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
                //     setSize();
                //     setTimeout(function () {
                //         var a = page_flip.currPageX;
                //         page_flip.scrollToPage(a, 0, 0)
                //     }, 400);
                // }, false);
                //delegate('nav', 'touchstart', goToPage);
            }, 100)
        }
    }, 10)
}, setSize = function () {//重新计算宽度
    if (window.scrollY != 1) {
        window.scrollTo(0, 1);
        p = setTimeout(setSize, 100);
    }
    else {
        //清除
        clearTimeout(p);
        p = null;
        //vsrollH 为屏幕高度- 头部高度，即为滚动区域高度
        var vscrollH = window.innerHeight - $id('nav').offsetHeight;
        if (iDevice) {
            //高度设置。可以在css里设置height：100%。
            $id('pagewrapper').style.height = vscrollH + 'px';
        }
        var e = $id('pagewrapper'), a = $id('pageflip'), b = e.offsetWidth;

        //一共几个TAB
        a.style.width = b * 2 + 'px';
        for (var c = 0; c < pages.length; c++) {
            pages[c].style.width = b + 'px';
            if (vertical_scroll[c]) {
                //设置上下滚动的每个iscroll的高度
                pages[c].style.height = vscrollH + 'px';
                vertical_scroll[c].refresh();
            }
        }
        page_flip.refresh();
    }
}, loaded = function () {//初始化load事件
    window.scrollTo(0, 1);
    t = setTimeout(initScroll, 100);
    window.removeEventListener('load', loaded, false);
}, stopDefault = function (e) {
    e.preventDefault()
}, delegate = function (obj, fun, callback) {
    var parent = $id(obj);
    parent.addEventListener(fun, callback, false);
}, goToPage = function (n) {
    page_flip.scrollToPage(n, 0, 400);
}, init = function () {
    window.addEventListener('DOMContentLoaded', loaded, false);
}
init();

var apply_list = [];//获客数据列表
var share_list = [];//分享数据列表
var honor_rank_issuccess = true;//请求是否成功

$(function () {
    honor_rank_issuccess = false;
    honor_rank_request();//网络请求
});

/**
 *获客初始化数据
 */
function initPage_apply(datas) {
    for (var i = 0; i < datas.length; i++) {
        var render_data = {
            deptName: !isEmpty(datas[i]["deptName"]) ? datas[i]["deptName"] : '',
            applyCount: !isEmpty("" + datas[i]["applyCount"]) ? ("" + datas[i]["applyCount"]) : ''
        };
        switch (i) {
            case 0:
                var html = '<li class="top-border">' +
                    '<span class="icon-round-1">'  + '</span>' +
                    '<span class="icon-honor_bottom-1">'  + '</span>' +
                    '<span class="honor-num num-one">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">获客:' + (" " + render_data.applyCount) +
                    '</span>' + '</li>';
                break;
            case 1:
                var html = '<li class="top-border">' +
                    '<span class="icon-round-2">'  + '</span>' +
                    '<span class="icon-honor_bottom-2">'  + '</span>' +
                    '<span class="honor-num num-two">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">获客:' + (" " + render_data.applyCount) +
                    '</span>' + '</li>';
                break;
            case 2:
                var html = '<li class="top-border">' +
                    '<span class="icon-round-3">'  + '</span>' +
                    '<span class="icon-honor_bottom-3">'  + '</span>' +
                    '<span class="honor-num num-three">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">获客:' + (" " + render_data.applyCount) +
                    '</span>' + '</li>';
                break;
            default:
                var html = '<li class="top-border">' +
                    '<span class="honor-num">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">获客:' + (" " + render_data.applyCount) +
                    '</span>' + '</li>';
        }
//                html += '</div>';
        $(".honor_apply").append(html);
    }
}

/**
 * 分享初始化数据
 */
function initPage_share(data_over) {

    for (var i = 0; i < data_over.length; i++) {

        var render_data = {
            deptName: !isEmpty(data_over[i]["deptName"]) ? data_over[i]["deptName"] : '',
            shareCount: !isEmpty("" + data_over[i]["shareCount"]) ? ("" + data_over[i]["shareCount"]) : ''
        };

        switch (i) {
            case 0:
                var html = '<li class="top-border">' +
                    '<span class="icon-round-1">'  + '</span>' +
                    '<span class="icon-honor_bottom-1">'  + '</span>' +
                    '<span class="honor-num num-one">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">分享:' + (" " + render_data.shareCount) +
                    '</span>' + '</li>';
                break;
            case 1:
                var html = '<li class="top-border">' +
                    '<span class="icon-round-2">'  + '</span>' +
                    '<span class="icon-honor_bottom-2">'  + '</span>' +
                    '<span class="honor-num num-two">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">分享:' + (" " + render_data.shareCount) +
                    '</span>' + '</li>';
                break;
            case 2:
                var html = '<li class="top-border">' +
                    '<span class="icon-round-3">'  + '</span>' +
                    '<span class="icon-honor_bottom-3">'  + '</span>' +
                    '<span class="honor-num num-three">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">分享:' + (" " + render_data.shareCount) +
                    '</span>' + '</li>';
                break;
            default:
                var html = '<li class="top-border">' +
                    '<span class="honor-num">' + (i + 1) + '</span>' +
                    '<span class="honor-name">' + render_data.deptName + '</span>' +
                    '<span class="right-content">分享:' + (" " + render_data.shareCount) +
                    '</span>' + '</li>';
        }
        $(".honor_share").append(html);
    }
}

/**
 *请求参数
 * @returns {*}
 */
function honor_rank_getParamsdata() {
    var deviceUUID = getDeviceUUID();
    var userUUID = get(user_uuid);
    var hashMap = new HashMap();
    hashMap.put("devUUID", deviceUUID);
    hashMap.put("userUUID", userUUID);
    return getJsonStr(hashMap);
}

/**
 * 请求数据
 */
function honor_rank_request() {

    var Components = FFA.namespace('Components');
    var loading = Components.Popup.Loading('A');

    console.log("荣誉接口" + honor_rank_interface + "参数：" + honor_rank_getParamsdata());

    var share_col = document.getElementById("share_col"),
        apply_col = document.getElementById("apply_col"),
        noContent_html = '<p class="no_content_pic"><img class="no_progress" src="../../images/noContent.png"></p><p class="no_content_font">暂时没有数据</p>';

    http_post(honor_rank_interface, honor_rank_getParamsdata(),
        function (data) {

            // $.getJSON('test.json', function (data) {
            loading.remove();
            // console.log("返回数据" + JSON.stringify(data));

            var msgInfo = data.msgInfo;

            if (data) {
                share_list = data.honorShareResult || []; //分享数据
                apply_list = data.honorApplyResult || []; //获客数据

                var share_len = share_list.length || 0,
                    apply_len = apply_list.length || 0;

                if (share_len == 0) {//分享暂无数据
                    share_col.innerHTML = noContent_html;
                } else {
                    initPage_share(share_list); //分享数据初始化
                }
                if (apply_len == 0) {//获客暂无数据
                    apply_col.innerHTML = noContent_html;
                } else {
                    initPage_apply(apply_list);//获客数据初始化
                }
            }
            setTimeout("honor_rank_issuccess = true", 200);

        }, function (xhr, e) {
            loading.remove();
            console.log("请求失败" + xhr);

            apply_col.innerHTML = noContent_html;
            share_col.innerHTML = noContent_html;

            setTimeout("honor_rank_issuccess = true", 200);
        }
    );//请求网络

}