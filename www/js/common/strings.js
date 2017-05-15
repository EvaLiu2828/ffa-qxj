var strings = {

    "network_exception": "网络异常",
    "password_null": "密码不能为空",
    "user_null": "用户名不能为空",
    "user_login": "用户登录中...",
    "select_server": "系统异常请重新选择系统",
    "locks_creen_info": "密码错了，还可输入3次",
    "loading_data": "正在获取数据...",
    "cancel_collect": "正在取消收藏...",
    "add_collect": "正在添加收藏...",
    "pwd_less":"密码不足六位",
    "phone_error":"Oh,No…居然有人会输错自己的手机号码？",
    "pwd_no_same":"两次输入的密码不一致，请重新输入",
	"login_wod_left":"注册",
	"login_phone_number":"手机号",
	"login_phone_password":"密码",
	"login_forget_pasword":"忘记密码？",
	"login_wod_right":"登录",
	"version_info":"1.75",
    "version_info_show":"1.7.5",

    modify_name_success: "姓名修改成功",
    modify_remarks_success:"备注修改成功",
    save_commition_time_success:"保存通话成功",
    modify_name_err: "姓名修改失败",
    modify_remarks_err:"备注修改失败",
    save_commition_time_err:"保存通话失败",
    modify_err: "修改失败",

    modify_gender_err:"性别保存失败",
    add_phone_err:"电话保存失败",
    add_phone_err_dupl:"电话号码已存在",
    modify_id_err:"占坑失败",

    occupy_tip:"输入客户身份证号就能占坑啦",
    id_card_err:"客户身份证号码有误，请重新输入",

    del_customer_err:"删除联系人失败",

    gender : ["男", "女" ,"未知"],
    occupy : ["占坑中", "未占坑", "占坑失败", "占坑失效"],
    cusSource : ["手动录入", "网上展业", "抢小姨", "微店获客","我的名片","微信"]
};

    function getString(key) {
        var jsonstr = JSON.stringify(strings, [key]);
        var jsonobj = JSON.parse(jsonstr);
        return jsonobj[key];
    }