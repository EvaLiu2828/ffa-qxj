var needReply = "0";//表示是否需要回复，从后台获得，在退出时使用

var replyIndex = "0";//确定回复的是哪一天的日报


var reportPullToRefresh = initPullToRefresh(function () {
    //console.log("下拉刷新");
}, function () {
    //console.log("上拉加载");
}, null, null, 'report-whole-wrapper');

//监听返回键

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log("onDeviceRead");       //iScroll初始化
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener('touchend', onTouchEnd, false);
}

function onTouchEnd() {
    setTimeout(function () {
        reportPullToRefresh.refresh();
    }, 1);
}

function onBackKeyDown() {
    if (needReply == "1") {
        exitConfirm();
    } else {
        history.back();
    }
}

$(document).ready(function () {
//向后台发送，取出日报和回复数据
    var hashMap = new HashMap();
    hashMap.put(userUUID, get(user_uuid));
    hashMap.put(devUUID, getDeviceUUID());
    http_post(dailyReport_interface, getJsonStr(hashMap), report_apply_success, report_apply_fail); //向后台发送申请请求
});

//检查是否有网络连接
function loginIsHavaNetWork() {
    var netUtils = new NetUtils();
    if (netUtils.isHaveNet()) {
        return true;
    } else {
        alert("无网络连接，请检查网络设置");
        return false;
    }
}

//从后台读取日报和已经回复的数据
function report_apply_success(data) {
    needReply = data.needReply;
    var reportRecordList = data.dailypaperRecordList;
    //如果30天内没有日报，则显示为空白页
    if (reportRecordList == null || reportRecordList.length == 0) {
        $(".no-report").css("display", "block")
    } else {

        //显示日报
        var reportBuffer = ''; //数据缓存字符串 避免单条打印影响渲染速度,客户基本资料
        var reportContainer = $("#report-whole-container");
        var reportTemplate = _.template($('#reportTemplate').html(), {variable: 'reportData'});
        for (var i = 0; i < reportRecordList.length; i++) {
            var reportObj = {
                remark: reportRecordList[i].remark,
                content: reportRecordList[i].content,
                replyContent: reportRecordList[i].replyContent,
                createTime: reportRecordList[i].createTime,
                isreply: reportRecordList[i].isreply,
                id: reportRecordList[i].id.toString()
            };
            reportBuffer = reportTemplate(reportObj);
            reportContainer.append(reportBuffer);
            //显示回复
            if (reportObj.replyContent != "" && reportObj.replyContent != null) {
                replyInitial(reportObj.replyContent, reportObj.id);
            }
            //显示回复按钮
            if (reportObj.isreply != "2") {
                $("#index-" + reportObj.id + "-report").find(".click-reply").css("display", "block");
            }
        }
    }

    //更新iScroll
    setTimeout(function () {
        reportPullToRefresh.refresh();
    }, 100);

    setTimeout(function () {
        reportPullToRefresh.scrollToElement($(".reply-list").last()[0], 200)
    }, 200);
}

function report_apply_fail() {}

//初始化回复内容
function replyInitial(replyContent, reportId) {
    var html = '<div class="box reply"> <div class="box-con ">';
    var p = '<p class="replyText">' + replyContent + '</p>';
    html += p + '</div><span class="right-arrow icon-report-arrow1"></span>';
    $("#index-" + reportId + "-report").find(".reply-list").html(html);
}

//改变回复内容
function PrintReply(replyContent) {
    var html = '<div class="box reply"> <div class="box-con ">';
    var p = '<p class="replyText">' + replyContent + '</p>';
    html += p + '</div><span class="right-arrow icon-report-arrow1"></span>';
    replyIndex.find(".reply-list").html(html);
}

//点击回复按钮，打开回复框
$(".click-reply").live("click", function () {
    $(".reportReplyEdit-wrap").addClass("editShow");
    $(".reportReplyEdit-input").focus();
    cordova.plugins.Keyboard.show();
    //确定到底是哪一天的日报回复
    replyIndex = $(this).parents(".entire-report");

    //添加蒙层
    var Components = FFA.namespace('Components');
    Components.emptiableInput.init();
    var mask = Components.Popup.Mask('C');
    //蒙层被点击时
    $(".com-popup-mask-c").click(function () {
        $(".com-popup-mask-c").remove();
        $(".reportReplyEdit-wrap").removeClass("editShow");
        cordova.plugins.Keyboard.close();
    });
});


//发送键相关函数，判断是否有回复内容
function isAllowSend($ReplyEdit) {

    if ($.trim($ReplyEdit) != "") {
        return true;
    } else {
        return false;
    }
}

//点击发送键
$(".js-reportReply-send").click(function () {
    //替换回复内容的换行符
    var $ReplyEdit = $(".reportReplyEdit-input").val().trim().replace(/\n/g, "");
    if (isAllowSend($ReplyEdit)) {
        //  cordova.plugins.Keyboard.close();
        //判断是否联网
        /*        if (!loginIsHavaNetWork()) {
         return false;
         }*/
        loadingScreen(true);
        //取出回复日报id
        var replyId = replyIndex.attr('id').split('-')[1];
        //******向后台发送回复内容
        var hashMap = new HashMap();
        hashMap.put(userUUID, get(user_uuid));
        hashMap.put(devUUID, getDeviceUUID());
        hashMap.put("replyContent", $ReplyEdit);
        hashMap.put("id", parseInt(replyId));
        http_post(dailyReport_reply_interface, getJsonStr(hashMap), reply_send_success, reply_send_fail); //向后台发送申请请求
    } else {
        $(".reportReplyEdit-input").focus();
        return false;
    }
});

//发送成功后的回调函数
function reply_send_success(data) {
    var server_code_info = data.codeInfo;
    var server_success_info = data.msgInfo;
    if (server_code_info == "0") {         //表示逻辑上回复成功
        var replyFlag = data.replyFlag;
        if (replyFlag == "0") {             //表示业务上回复成功
            //去掉换行符，换行符会使得上传失败
            var replyContent = $(".reportReplyEdit-input").val().trim().replace(/\n/g, "");
            //显示回复内容
            PrintReply(replyContent);
            //移除蒙层
            loadingScreen(false);

            needReply = data.needReply;
            //清空回复框
            $(".reportReplyEdit-input").val("");
            //重新更新回复框高度
            autosize.update($(".reportReplyEdit-input"));
            //关闭回复框和键盘
            $(".reportReplyEdit-wrap").removeClass("editShow");
            cordova.plugins.Keyboard.close();
            //更新iscoll
            setTimeout(function () {
                reportPullToRefresh.refresh();
            }, 200);
        } else {
            var replyMsg = data.replyMsg;
            loadingScreen(false);
            reply_fail_alert(replyMsg);
        }
    } else {
        loadingScreen(false);
        reply_fail_alert(server_success_info);
    }
}

function reply_send_fail() {}

//回复发送失败的弹窗
function reply_fail_alert(info) {
    var Components = FFA.namespace('Components');
    var alert;
    Components.emptiableInput.init();
    alert = Components.Popup.Alert('A', {
        content: info,  //显示内容
        button: '确定',   //按钮内容
        withMask: 'A'   //蒙层类型
    }, function () {
        console.log('按钮回调');
        $(".reportReplyEdit-input").focus();
    });
}

//点击发送后，等待后台的热气球界面
var loading;
function loadingScreen(isLoading) {
    var Components = FFA.namespace('Components');

    Components.emptiableInput.init();
    if (isLoading) {
        loading = Components.Popup.Loading('A', {
            withMask: 'A'   //蒙层类型       A半透明 B透明 缺省没有蒙层
        });
    } else {
        loading.remove();

    }
}

//回复文本框的相关函数
function optIsEdit() {
    var $ReplyEdit = $(".reportReplyEdit-input").val();

    if (isAllowSend($ReplyEdit)) {
        $(".reportReply-send").removeClass("notAllow");
    } else {
        $(".reportReply-send").addClass("notAllow");
    }
}


var bind_name = 'input';
if (navigator.userAgent.indexOf("MSIE") != -1) {
    bind_name = 'propertychange';
}

//为回复文本框添加input事件
$(".reportReplyEdit-input").bind(bind_name, function () {
    // 判断是否可以发送
    optIsEdit();
    // 判断是否超过了1000字
    if (this.value.length >= 1000) {
        this.value = this.value.substr(0, 1000);
    }
});

//回复文本框获得焦点的事件
$(".reportReplyEdit-input").focus(function () {
    optIsEdit();
});


//退出事件
$(".js-report-back-btn").on("tap", function () {
    if (needReply == "1") {
        exitConfirm();
    } else {
        history.back();
    }
});


//退出弹出确认
function exitConfirm() {
    var Components = FFA.namespace('Components');
    var confirm;
    Components.emptiableInput.init();
    confirm = Components.Popup.Confirm('A', {
        content: '您有需要回复的日报，确定退出吗？',  //显示内容
        leftButton: '取消',   //左按钮内容
        rightButton: '退出',  //右按钮内容
        withMask: 'A'   //蒙层类型
    }, function () {
        console.log('左按钮回调');

    }, function () {
        console.log('右按钮回调');
        history.back();

    });
}

/** 让textarea 自适应高度 */
autosize(document.querySelectorAll('textarea'));












