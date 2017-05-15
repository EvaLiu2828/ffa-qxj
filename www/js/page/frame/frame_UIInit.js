/**
 * Created by v-qizhongfang on 2015/10/27.
 */
//用于检测设备 并将设备相关class样式加入body元素
!function ($) {

    var Utils = FFA.namespace("Utils");
    function addDeviceClass(FFA) {
        var classList = document.body.classList;
        var os = [];
        if ($.os.ios) {
            os.push({
                os: 'ios',
                version: $.os.version
            });
            classList.add('ios');
        } else if ($.os.android) {
            os.push({
                os: 'android',
                version: $.os.version
            });
            classList.add('android');
        }
        if ($.os.wechat) {
            os.push({
                os: 'wechat',
                version: $.os.wechat.version
            });
            classList.add('wechat');
        }
        if (os.length) {
            Utils.each(os, function (index, osObj) {
                var version = '';
                var classArray = [];
                if (osObj.version) {
                    Utils.each(osObj.version.split('.'), function (i, v) {
                        version = version + (version ? '-' : '') + v;
                        classList.add(osObj.os + '-' + version);
                    });
                }
            });
        }
    }

    if (document.body) {
        addDeviceClass(FFA);
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            addDeviceClass(FFA);
            console.log("init frame plan B invoke");
        }, false);
    }
}(FFA);


/**
 * 计算CSS样式
 */
(function (FFA) {

    //页面UI设置
    //UI命名空间 获取 or 构建
    var Utils = FFA.namespace("Utils");
    var UI = FFA.namespace("UI");
    var ExhibitionUI = FFA.namespace("UI.Exhibition");  //展业UI
    var CustomerUI = FFA.namespace("UI.Customer");  //客户UI
    var ProgressUI = FFA.namespace("UI.Progress");  //进度UI
    var MineUI = FFA.namespace("UI.Mine");  //我的UI

    //获取frame页面属性
    var pageHeight = UI.pageHeight, //页面高度
        pageWidth = UI.pageWidth,   //页面宽度
        headerHeight = UI.headerHeight = FFA.os.ios ? 65 : 45,   //页头高度
        footerHeight = UI.footerHeight = 50,  //页脚高度
        hfHeight = headerHeight + footerHeight;


    //计算展业页面样式
    var bannerHeight = ExhibitionUI.bannerHeight = (pageWidth * 240) / 640, //轮播图高度
        menuHeight = ExhibitionUI.menuHeight = pageHeight - hfHeight - bannerHeight,  //展业九宫格高度
        menuLiHeight = (menuHeight - 20) / 3, //展业九宫格 单格高度
        menuImgHeight = menuLiHeight * 0.5;   //展业九宫格 图片高度


    //客户页面样式计算
    var searchInputHeight = CustomerUI.searchInputHeight = 46, //客户进度页面tab按钮高度
        customerTabBtnsHeight = CustomerUI.tabBtnsHeight = 40, //客户进度页面tab按钮高度
        customerListHeight = CustomerUI.customerContainerHeight = pageHeight - hfHeight - searchInputHeight - customerTabBtnsHeight;
        //searchListHeight = CustomerUI.searchListHeight = pageHeight - customerListHeight + searchInputHeight;    //搜罗列表高度



    //进度页面样式计算
    var progressTabBtnsHeight = ProgressUI.tabBtnsHeight = 40, //客户进度页面tab按钮高度
        progressListHeight = pageHeight - hfHeight - progressTabBtnsHeight; //进度列表高度



    var exhibitionCSS = '.exhibit-ul' +
                        '{height:' + menuHeight + 'px;}' +
                        '.exhibit-ul li' +
                        '{height:' + menuLiHeight + 'px;}' +
                        '.exhibit-ul li >div' +
                        '{width:' + menuImgHeight + 'px;' +
                        'height:' + menuImgHeight + 'px;}';


    var customerCSS = '.contacters-container' +
                    '{min-height: ' + customerListHeight + 'px;}';
                    //'#search-wrapper' +
                    //'{max-height: ' + searchListHeight + 'px;}';

    var progressCSS = '.orders' +
                    '{min-height: ' + progressListHeight + 'px;}'+
                    '#wrapper_progress' +
                    '{height: ' + progressListHeight + 'px;}';

    Utils.addCSS(exhibitionCSS + customerCSS + progressCSS);
})(FFA);