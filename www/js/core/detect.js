/**
 * 检测
 */

//检测


!function () {
    var detect = function () {
        if (Zepto.os.ios) {
            body.addClass("ios");
        } else if (Zepto.os.android) {
            body.addClass("android");
        }
    };
    var body = $("body");

    if(body.length !== 0){
        console.log("plan1");
        detect(body);
    }else{
        $(function () {
            body = $("body");
            detect(body);
        })
    }

}();