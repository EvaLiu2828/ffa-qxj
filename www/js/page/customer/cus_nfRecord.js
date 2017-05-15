/**
 * Created by 201507270168 on 2015/12/9.
 */
var categoryValue="01";
$(function() {
    //-------------------------选择类别开始-----------------------------//
    /**
     *页面切换
     */
    $(".js-chooseCategory").on("click",function(){
        $(".categoryPage").removeClass('modify').siblings().addClass('modify');
    });
    $(".icon-left-arrow").on("click",function(){
        $(".nfRecordPage").removeClass('modify').siblings().addClass('modify');
    });

    /* 选择类别类型  */
    $(".js-chooseCategoryPhone").click(function() {
        $(this).addClass('checked').siblings().removeClass('checked');
        $(".nfRecordPage").removeClass('modify').siblings().addClass('modify');
        $(".js-chooseCategoryContent").text("联络");
        categoryValue="01";
    });
    $(".js-chooseCategoryCup").click(function() {
        $(this).addClass('checked').siblings().removeClass('checked');
        $(".nfRecordPage").removeClass('modify').siblings().addClass('modify');
        $(".js-chooseCategoryContent").text("面谈");
        categoryValue="02";
    });
    $(".js-chooseCategoryHome").click(function() {
        $(this).addClass('checked').siblings().removeClass('checked');
        $(".nfRecordPage").removeClass('modify').siblings().addClass('modify');
        $(".js-chooseCategoryContent").text("到店");
        categoryValue="03";
    });

//-------------------------类别选择结束-----------------------------//
//    选择时间
    $(function() {
        var result = $('#result')[0];
        var btns = $('.btn');
        btns.each(function(i, btn) {
            btn.addEventListener('tap', function() {
                var optionsJson = this.getAttribute('data-options') || '{}';
                var options = JSON.parse(optionsJson);
                var id = this.getAttribute('id');
                /*
                 * 首次显示时实例化组件
                 * 示例为了简洁，将 options 放在了按钮的 dom 上
                 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
                 */
				var picker = new mui.DtPicker(options);
                    picker.show(function(rs) {
                        /*
                         * rs.value 拼合后的 value
                         * rs.text 拼合后的 text
                         * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                         * rs.m 月，用法同年
                         * rs.d 日，用法同年
                         * rs.h 时，用法同年
                         * rs.i 分（minutes 的第二个字母），用法同年
                         */
                        result.innerText = rs.text;
                        picker.dispose();
                    });
            }, false);
        });
    });
    //-------------------------显示输入内容字数-----------------------------//
    $(".js-text").bind('input', function() {
        var MAX_LENGTH = 30;
        var content = $(".js-text").val().trim();
        var length = content.length;
        var overPlusLength = MAX_LENGTH - length;

        // 显示下标可输入多少文字
        if (overPlusLength >= 0) {
            $(".js-overPlus-length").text(length + '/30');
        }

        // 截取字符串
        if (length >= MAX_LENGTH) {
            content = content.substr(0, MAX_LENGTH);
        }

        $(".js-text").val(content);
    });

    /**
     * 保存数据并向后台发送请求
     */
    $(".js-nfRecord-send").click(function(){
        var Utils = FFA.namespace("Utils"),
            Components = FFA.namespace('Components');
        var inputTimeValue = $("#result").text().trim();
        var contentValue = $(".js-text").val();//Utils.htmlEncodeByRegExp($(".js-text").val());
        var hashMap = new HashMap();
        var deviceUUID=getDeviceUUID();
        var userID=get(user_uuid);
        console.log(location.search);
        var myPhoneNumber = Utils.urlArgs()['phonenumber'];
        console.log("myPhoneNumber----->"+myPhoneNumber);
        console.log("time---->"+inputTimeValue);
        //var myPhoneNumber=get(me_phonenumber);
        hashMap.put(devUUID,deviceUUID);
        hashMap.put(userUUID,userID);
        hashMap.put(optFlag,0);
        hashMap.put(phonenumber,myPhoneNumber);
        hashMap.put(category,categoryValue);
        hashMap.put(inputTime,inputTimeValue);
        hashMap.put(content,contentValue);

        var alert = null;
        if(inputTimeValue === ""){
            //时间不能为空
            alert = Components.Popup.Alert('A', {
                content: "请选择时间！",  //显示内容
                withMask: 'A'   //蒙层类型
            });
            return;
        }else{
            http_post(createFollowRecord_interface,getJsonStr(hashMap),function(){
                console.log("success");
                window.history.back();
            },function(){
                console.log("fail");
            });
        }
    });
    $(".js-back").click(function(){
        window.history.back();
    });

});

