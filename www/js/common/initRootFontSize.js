/**
 *
 * Created by v-qizhongfang on 2015/8/20.
 * rem布局的页面始化
 * 1.根据devicePixelRatio设置缩放比例，适配各种屏幕的1px边框
 * 2.根据屏幕宽度设置根元素font-size，用rem做单位可进行全适配布局
 */
(function (doc, win) {

    var viewport = document.getElementsByName('viewport')[0],
        dpr = window.devicePixelRatio,
        scale = 1 / dpr,
        docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    function recalc() {
        var clientWidth = docEl.clientWidth;
        var fs = 20 + (clientWidth - 320)/50;   //屏幕宽度每增加50px基础字体增加1px

        if(fs > 28){
            fs = 28;
        }

        if (!clientWidth) return;

        docEl.style.fontSize = fs + 'px';
        docEl.dataset.dpr = dpr;


        FFA.fontSize = fs;
        FFA.dpr = dpr;
    }
    //TODO 直接调用加载更快 不会闪屏
    recalc();

    if (!doc.addEventListener) return;
    //win.addEventListener(resizeEvt, function () {
    //    console.log('resize');
    //    recalc();
    //}, false);
    //doc.addEventListener('DOMContentLoaded', function () {
    //    console.log('load');
    //
    //}, false);
})(document, window);

//获取屏幕大小 并记录
(function (doc, win, FFA) {

    var UI = FFA.namespace("UI");
    var docEl = doc.documentElement;

    var clientHeight = parseInt(localStorage.getItem('clientHeight'));
    var clientWidth = docEl.clientWidth;

    localStorage.setItem('clientWidth', clientWidth);

    if(!clientHeight || clientHeight < docEl.clientHeight){ //记录较大高度
        clientHeight = docEl.clientHeight;
        localStorage.setItem('clientHeight', clientHeight);
    }

    UI.pageWidth = clientWidth;
    UI.pageHeight = clientHeight;

})(document, window, FFA);