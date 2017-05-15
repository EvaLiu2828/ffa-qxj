/**
 *  动画
 */

function init() {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    var height;
    if(screen.height>790){
        height = screen.height/ window.devicePixelRatio;
    }else{
        height = screen.height;
    }
    document.getElementById("startCanvas").style.height=(height*0.79)+"px";
    fanvas.play("startCanvas", swfData, {
        cache: true, autoPlay: true, clearAll: true,
        onFrame: function (index) {
//                    console.log("onFrame", index);
//                    if(index == 10){
//                        fanvas.pause("startCanvas");
//                        setTimeout(function(){
////                            fanvas.resume("startCanvas");
//                            fanvas.replay("startCanvas");
//                        }, 2000);
//                    }
        },
        imagePath: "../images/startpage3/"
    });

    /**
     *  数字下落
     *  runCount
     */
    var amount = '508888',          //结果数字
            time = 1600;            //数完时间，修改此处，可以调节下落速度
        if (device.version == "4.4.2") {
            time = 5800;
        }
    var countNum = localStorage.getItem(consult_num);
    if (countNum != null && countNum != "") {
        amount = countNum;
    }

    var itemTag = "";
    $(document).ready(function () {
        //禁止用户滑动  ios滑动时动画会暂停   此方法会会使点击事件失效
        window.addEventListener("touchmove", function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener("deviceready", function () {
            TalkingData.init('4DF2173677F6F588BDA1FAA353F601E4', 'TalkingData');//TalkingData进行注册
            //talkingdata 测试Key：3ACAA7BDB0EC5184CA78027BF7FE12F4
            //talkingdata 线上Key：4DF2173677F6F588BDA1FAA353F601E4  上线前准备时一定要改线上Key
            ShenYunData.setDevMode(false);//为true则相关数据表示是测试数据，否则是正式数据，默认为false
            ShenYunData.init('4028804a54a9af4a0154b768651a0003', 'ShenYunData', 'ShenYunData');//安卓平台燊昀数据注册
            //ShenYunData.init('4028804a54be21380154f15e5f860003','ShenYunData','ShenYunData');//ios平台燊昀数据注册，对应平台开对应平台的


            var pushRegistradionID = localStorage.getItem(push_registradion_id);
            if (pushRegistradionID == null || pushRegistradionID == "") {
                console.log("Startpage init jpushPlugin......");
                window.plugins.jPushPlugin.init();
            }
            document.addEventListener('jpush.openNotification', function (evt) {
                if (window.plugins.jPushPlugin.isPlatformIOS()) {
                    if (evt != null && evt != "" && typeof evt.key != 'undefined') {
                        if (evt.key == 0) {
                            itemTag = "customer";
                        }
                    }
                } else {
                    if (evt != null && evt != "" && typeof evt['cn.jpush.android.EXTRA'].key != 'undefined') {
                        var value = evt['cn.jpush.android.EXTRA'].key;
                        if (value == 0) {
                            itemTag = "customer";
                        }
                    }
                }
            }, false);

            // 数字下落开始
            console.log(time + "-----------------" + amount);
            runCount(amount, time);


        }, false);
        loadbody();
    });
    /**
     *  页面动画渲染
     *  loadbody
     */
    function loadbody() {
        var width = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;  //动画宽度
        var r = width / 750;
        var height = r * 1334;    //动画高度,根据比例求高度

        //背景样式
        $(".container").css({height: height});
    }

    function runCount(amount, time) {
        var end = amount.split(''),      // 转成数组，最终显示的数字
                countEle = $('.js-count'),
                count;

        var count = end.join('').replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,'); // 159888 转换成 159，888

        var numStr = count.split('');
        var len = numStr.length;

        var c = time / len,  // 数字下落间隔时间
                m = len - 1,      // 数字的index(倒数)
                y = 0;           // 数字的index
        while (y < len) {
            countEle.append('<i id="id_' + y + '">' + numStr[y] + '</i>');
            y++;
        }

        // 数字下落效果实现
        function controller_time() {
            $("#id_" + m).addClass("dropDown animated");
            m = m - 1;
            if (m < 0) {
                cancel();
            }
            ;
        }

        var ti = window.setInterval(controller_time, c);

        function cancel() {
            window.clearInterval(ti);
            countFun();
        }

        // 数完之后的操作
        function countFun() {
            //数完1s后跳转
            setTimeout(function () {
                var login_user_id = get(user_uuid);
                var stored_version_info = localStorage.getItem(version_info);
                var cur_version_info = getString(version_info);
                if (cur_version_info != stored_version_info) {
                    localStorage.setItem(version_info, cur_version_info);
                    window.location.replace('./homelogo.html');
                } else {
                    if (!isEmpty(login_user_id) && isInvalidityTime()) {//如果30内的登陆那么直接到首页
                        redirect(itemTag);
                    } else {
                        window.location.replace('./login/login.html');
                    }
                }
            }, 1200);
        }
    }
}
}