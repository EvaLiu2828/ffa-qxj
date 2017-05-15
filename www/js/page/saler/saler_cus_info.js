/**
 * Created by 201408040800 on 2016/7/26.
 */
//页面跳转太快时会触发下一个页面相同位置上的点击事件
//暂用详情页测试
/*(function () {
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
/**
 * 团队经理下面的客户信息
 */
(function(FFA){
    $(function(){
        FastClick.attach(document.body);


        $("#title").text(get("customer-sublevel-title"));


        var SalerCustomerPage = FFA.namespace('Frame.SalerCustomerPage');
        // 初始化客户页面
        var managerId = get("customer-sublevel-managerId") || '';
        var cusCount = get("customer-sublevel-cusCount") || '';
        SalerCustomerPage.init(cusCount, managerId);


        $(".js-back-btn").on("tap", back);

        function back() {
            window.location.href =  '../frame.html';
         //   history.back();
        }


        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            console.log("onDeviceRead");
            document.addEventListener("backbutton", back, false);
        }
    });
})(FFA);
