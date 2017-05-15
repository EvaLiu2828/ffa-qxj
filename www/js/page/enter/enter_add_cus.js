// JavaScript Document

//去掉字符串头尾空格   
function trimStr(str) {   
	return str.replace(/(^\s*)|(\s*$)/g, "");   
}
var addCustomer_rule_p = '';

$(function() {
    var Components = FFA.namespace('Components');
    var loading;
    var complete_switch = true;

    $(".js-addCustomer-complete").click(function() {
        if(complete_switch){
            //检测是否输入了姓名
            var inputCustomerName = $(".js-addCustomer-name").val();
            inputCustomerName = trimStr(inputCustomerName);    //去掉字符串头尾空格

            //验证手机号格式是否正确
            var inputPhoneNumber = $(".js-addCustomer-phone").val();
            inputPhoneNumber = trimStr(inputPhoneNumber);

            //验证身份证号
            idCardValidate();
            var customerIdCard = $(".js-addCustomer-ID").val();
            customerIdCard = trimStr(customerIdCard.replace(/ /g, ""));    //去掉字符串头尾空格

            var addCustomer_id_flag = 0;//标记是否填入了身份证号，弹出占坑结果，0表示未填写，1填写
            if (customerIdCard == "") {
                addCustomer_id_flag = 0;
            } else {
                addCustomer_id_flag = 1;
            }

            var addCustomer_post_flag = 0;

            if (inputCustomerName == "") {
                $(".js-addCustomer-noName").show();
                $(".js-addCustomer-telNone").hide();
                $(".js-addCustomer-telWrong").hide();
                $(".js-addCustomer-idWrong").hide();
                addCustomer_post_flag = 1;
            } else if (inputPhoneNumber == "") {
                $(".js-addCustomer-noName").hide();
                $(".js-addCustomer-telNone").show();
                $(".js-addCustomer-telWrong").hide();
                $(".js-addCustomer-idWrong").hide();
                addCustomer_post_flag = 1;
            } else if (!isPhoneNumber(inputPhoneNumber)) {
                $(".js-addCustomer-noName").hide();
                $(".js-addCustomer-telNone").hide();
                $(".js-addCustomer-telWrong").show();
                $(".js-addCustomer-idWrong").hide();
                addCustomer_post_flag = 1;
            } else if (addCustomer_id_flag == 1 && idCardFlag == 0) {
                $(".js-addCustomer-noName").hide();
                $(".js-addCustomer-telNone").hide();
                $(".js-addCustomer-telWrong").hide();
                $(".js-addCustomer-idWrong").show();
                addCustomer_post_flag = 1;
            } else {
                $(".js-addCustomer-noName").hide();
                $(".js-addCustomer-telNone").hide();
                $(".js-addCustomer-telWrong").hide();
                $(".js-addCustomer-idWrong").hide();
                addCustomer_post_flag = 0;
            }

            //获取参数addCustomer_getParams();
            console.log("接口" + addCustomer_add_interface + ".......参数" + addCustomer_getParams(add_Customer_add));

            if (addCustomer_post_flag == 0 && complete_switch == true) {
                //向后台发送消息请求时弹框加载
                loading = Components.Popup.Loading('A', {
                    withMask: 'B'   //蒙层类型
                });
                //完成置灰
                complete_switch = false;
                $(".js-addCustomer-complete").attr("disabled",true).css("color","#ababab");
                http_post(addCustomer_add_interface, addCustomer_getParams(add_Customer_add), function (data) {
                    //返回数据成功
                    console.log("新增客户服务器返回数据：" + JSON.stringify(data));
                    var addCustomer_result_phone = data.codeInfo;

                    if (addCustomer_result_phone == 11) {
                        //新建客户失败
                        setTimeout(function () {
                            loading.remove();
                            $(".js-addCustomer-fail").show();
                            $("#mask").show();
                            $("#js-addCustomer-p-fail").html(data.msgInfo);//从后台拉取信息
                        }, 500);
                    } else if (addCustomer_result_phone == 0 || addCustomer_result_phone == 22) {
                        //创建成功，返回客户列表
                        setTimeout(function () {
                            loading.remove();
                            $(".js-addCustomer-success").show();
                            $("#mask").show();
                            $("#js-addCustomer-p-success").html(data.msgInfo);//从后台拉取信息
                        }, 500);
                    } else if (addCustomer_result_phone == 13 || addCustomer_result_phone == 14) {
                        //客户手机重复以及客户手机号和姓名都重复
                        setTimeout(function () {
                            loading.remove();
                            $(".js-addCustomer-repeat").show();
                            $("#mask").show();
                            $("#js-addCustomer-repeat-msg").html(data.msgInfo);//从后台拉取信息
                        }, 500);
                    }else{
                        loading.remove();
                    }
                }, function (xhr, e) {
                    //返回数据失败
                    complete_switch = true;//回到页面后，完成按钮恢复
                    $(".js-addCustomer-complete").css("color","white").removeAttr('disabled');
                    loading.remove();
                    console.log("新建客户请求失败" + xhr);
                });//请求网路服务
            }
        }
    });

    $("#js-addCustomer-confirm").click(function(){
        //电话重复以及姓名和电话都重复时确认提交客户信息
        $(".js-addCustomer-repeat").hide();
        $("#mask").hide();
        //向后台发送消息请求时弹框加载
        loading = Components.Popup.Loading('A', {
            withMask: 'B'   //蒙层类型
        });
        http_post(addCustomer_add_interface, addCustomer_getParams_repeat(add_Customer_confirm_all), function (data) {
            //返回数据成功
            console.log("新增客户服务器返回数据："+JSON.stringify(data));
            var addCustomer_result_phone = data.codeInfo;
            if(addCustomer_result_phone == 11){
                //新建客户失败
                setTimeout(function () {
                    loading.remove();
                    $(".js-addCustomer-fail").show();
                    $("#mask").show();
                    $("#js-addCustomer-p-fail").html(data.msgInfo);//从后台拉取信息
                }, 500);
            }else if(addCustomer_result_phone == 0 || addCustomer_result_phone == 22){
                //创建成功，返回客户列表
                setTimeout(function () {
                    loading.remove();
                    $(".js-addCustomer-success").show();
                    $("#mask").show();
                    $("#js-addCustomer-p-success").html(data.msgInfo);//从后台拉取信息
                }, 500);
            }else{
                loading.remove();
            }
        },  function (xhr,e) {
            //返回数据失败
            loading.remove();
            console.log("新建客户请求失败"+xhr);
        });//请求网路服务
    });

    //在输入框中添加删除的图标
    $(".js-add-del input").focus(function() {
        $(this).next().addClass("addCustomer-del-img");
    }).blur(function() {
        $(this).next().removeClass("addCustomer-del-img");
    });

    //点击删除的图标，清除文本框的内容
    $(".js-addCustomer-del").tap(function() {
        $(this).prev().val('');
        $(this).prev().focus();
    });

    //----------------------------------选择性别开始----------------------------------//
    /**
     *页面切换，选择性别
     */
    var chooseGenderFlag = 0;
    Zepto(".js-addCustomer-Gender").click(function() {
        $("#js-addCustomer-rule-img").removeClass('flash');//清除闪动
        $(".addCustomerPage").hide();
        $(".addCustomerChooseGender").show();
        if(chooseGenderFlag == 0){
            $(".js-addCustomer-Gender-content").text("未知");//未选择性别时，将性别设为未知
        }
    });
    /*
     * 选择性别
     * */
    $(".js-chooseGenderNone").click(function() {
        $(this).addClass('checked').siblings().removeClass('checked');
        chooseGenderFlag = 1;
        //选择完性别后，跳转回新建客户页面
        $(".addCustomerPage").show();
        $(".addCustomerChooseGender").hide();
        $(".addCustomerChooseConsult").hide();
        $(".js-addCustomer-Gender-content").text("未知");//未选择性别
    });
    $(".js-chooseGenderMale").click(function() {
        $(this).addClass('checked').siblings().removeClass('checked');
        chooseGenderFlag = 1;
        //选择完性别后，跳转回新建客户页面
        $(".addCustomerPage").show();
        $(".addCustomerChooseGender").hide();
        $(".addCustomerChooseConsult").hide();
        $(".js-addCustomer-Gender-content").text("男");//获取性别男
    });
    $(".js-chooseGenderFemale").click(function() {
        $(this).addClass('checked').siblings().removeClass('checked');
        chooseGenderFlag = 1;
        //选择完性别后，跳转回新建客户页面
        $(".addCustomerPage").show();
        $(".addCustomerChooseGender").hide();
        $(".addCustomerChooseConsult").hide();
        $(".js-addCustomer-Gender-content").text("女");//获取性别女
    });
    $(".js-addCustomer-chg-ret").click(function() {
        $(".addCustomerPage").show();
        $(".addCustomerChooseGender").hide();
        $(".addCustomerChooseConsult").hide();
    });
    //-------------------------选择性别结束-----------------------------//

    //-------------------------选择咨询开始-----------------------------//
    /**
     *页面切换，选择咨询类型
     */
    //var chooseConsult = 0;
    //$(".js-chooseConsult").click(function() {
    //    $("#js-addCustomer-rule-img").removeClass('flash');//清除闪动
    //    $(".addCustomerPage").hide();
    //    $(".addCustomerChooseGender").hide();
    //    $(".addCustomerChooseConsult").show();
    //    if(chooseConsult == 0){
    //        $(".js-chooseConsultContent").text("信贷");//未选择性别时，将性别设为未知
    //    }
    //});
    /*
     * 选择咨询类型
     * */
    //$(".js-chooseConsultCredit").click(function() {
    //    $(this).addClass('checked').siblings().removeClass('checked');
    //    //选择完咨询类型后，跳转回新建客户页面
    //    $(".addCustomerPage").show();
    //    $(".addCustomerChooseGender").hide();
    //    $(".addCustomerChooseConsult").hide();
    //    $(".js-chooseConsultContent").text("信贷");//选择信贷和默认选择信贷
    //});
    //$(".js-chooseConsultCar").click(function() {
    //    $(this).addClass('checked').siblings().removeClass('checked');
    //    //选择完咨询类型后，跳转回新建客户页面
    //    $(".addCustomerPage").show();
    //    $(".addCustomerChooseGender").hide();
    //    $(".addCustomerChooseConsult").hide();
    //    $(".js-chooseConsultContent").text("车贷");//选择车贷
    //});
    //-------------------------咨询类型结束-----------------------------//

    $(".js-addCustomer-cancel").click(function(){
        //信息重复，点击取消，回到新建客户页面
        $(".js-addCustomer-repeat").hide();
        $("#mask").hide();
        $(".addCustomerPage").show();
        $(".addCustomerChooseGender").hide();
        complete_switch = true;//回到页面后，完成按钮恢复
        $(".js-addCustomer-complete").css("color","white").removeAttr('disabled');
    });

    $(".js-addCustomer-success-button").click(function(){
        //新建客户成功
        $(".js-addCustomer-success").hide();
        $("#mask").hide();
        complete_switch = true;//回到页面后，完成按钮恢复
        $(".js-addCustomer-complete").css("color","white").removeAttr('disabled');
        var inputTelNumber = $(".js-addCustomer-phone").val();
        window.location.href="../customer/customerInfo.html?phonenumber="+inputTelNumber;
    });

    $(".js-addCustomer-error-btn").click(function(){
        //新建客户失败，回到新建客户页面
        $(".js-addCustomer-fail").hide();
        $("#mask").hide();
        $(".addCustomerPage").show();
        $(".addCustomerChooseGender").hide();
        complete_switch = true;//回到页面后，完成按钮恢复
        $(".js-addCustomer-complete").css("color","white").removeAttr('disabled');
    });
    //返回时强制关闭键盘
    function addCustomerBackFunc(){
        //Close KeyBoard
        cordova.plugins.Keyboard.close();
        setTimeout(function(){
            window.location.href = '../frame.html'},200);
    }
    //页面左上角的返回键
    $(".js-addCustomerBack").on("click",addCustomerBackFunc);

    //--------------监控返回键start---------------//
    //检测设备是否ready
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", addCustomerBackFunc, false);
    }
    //--------------监控返回键end---------------//

    //---------------占坑规则提示start---------------//
    $(".js-addCustomer-rule").click(function(){
        //点完占坑规则，弹出加载框
        loading = Components.Popup.Loading('A', {
            withMask: 'B'   //蒙层类型
        });

        function getString(array){
            for(var j = 0;j < array.length; j++){
                if(array[j] == ""){
                    array.splice(j,1);//清除空元素
                }
            }
            console.log(array);
            for(var i = 0;i < array.length; i++){
                console.log(array[i]+'\n');
                $("#js-addCustomer-rule-p").append(array[i]+'<br>');
            }
        }
        http_post(addCustomerRule_interface, addCustomer_getParams_rule(), function (data) {
            //返回数据成功
            loading.remove();
            console.log("新增客户服务器返回数据："+JSON.stringify(data));
            var addCustomer_rule = data;
            console.log(addCustomer_rule);
            getString(addCustomer_rule);
            $(".js-addCustomer-rule-alert").show();
            $("#mask").show();
        },function (xhr,e) {
            //返回数据失败
            loading.remove();
            console.log("占坑规则拉取失败"+xhr);
        });//请求网路服务
    });
    $(".js-addCustomer-rule-alt-button").click(function(){
        $("#mask").hide();
        $(".js-addCustomer-rule-alert").hide();
        $("#js-addCustomer-rule-p").html("");
    });
    //---------------占坑规则提示end-----------------//
});

/**
 *新建客户请求参数
 */
function addCustomer_getParams(optFlags){
    var deviceUUID = getDeviceUUID();
    var userUUIDN = get(user_uuid);
    var compNo = userUUIDN;
    var addPhone = $(".js-addCustomer-phone").val();
    var name = $(".js-addCustomer-name").val();
    var sex = $(".js-addCustomer-Gender-content").text();
    var sex_number = "03";
    var idCard = $(".js-addCustomer-ID").val();
    var remark = $(".js-addCustomer-remark").val();
    //var consult = $(".js-chooseConsultContent").text();
    //var consultNumber = "01";
    var consultNumber = "0";
    var dataSourceNumber = "02";

    var hashMap = new HashMap();

    if(sex == "男"){
        sex_number = "01";
    }else if(sex == "女"){
        sex_number = "02";
    }else{
        sex_number = "03";
    }

    //if(consult == "信贷"){
    //    consultNumber = "0";
    //}else{
    //    consultNumber = "1";
    //}

    //hashMap.put(devUUID, "863583026931577");
    hashMap.put(devUUID, deviceUUID);
    hashMap.put(userUUID, userUUIDN);
    hashMap.put(compno, compnoSubstr(compNo));
    hashMap.put(phonenumber, addPhone);
    hashMap.put(cusName, name);
    hashMap.put(gender, sex_number);
    hashMap.put(idnumber, idCard);
    hashMap.put(remarks, remark);
    hashMap.put(consultType, consultNumber);
    hashMap.put(optFlag, optFlags);
    hashMap.put(dataSource, dataSourceNumber);

    return getJsonStr(hashMap);
}

/**
 *新建客户电话重复或者姓名和电话都重复时的请求参数
 */
function addCustomer_getParams_repeat(optFlags){
    var deviceUUID = getDeviceUUID();
    var userUUIDN = get(user_uuid);
    var compNo = userUUIDN;
    var addPhone = $(".js-addCustomer-phone").val();
    var name = $(".js-addCustomer-name").val();
    var sex = $(".js-addCustomer-Gender-content").text();
    var sex_number = "03";
    var idCard = $(".js-addCustomer-ID").val();
    var remark = $(".js-addCustomer-remark").val();
    //var consult = $(".js-chooseConsultContent").text();

    //var consultNumber = "01";
    var consultNumber = "0";
    var dataSourceNumber = "02";

    //if(consult == "信贷"){
    //    consultNumber = "0";
    //}else{
    //    consultNumber = "1";
    //}

    if(sex == "男"){
        sex_number = "01";
    }else if(sex == "女"){
        sex_number = "02";
    }else{
        sex_number = "03";
    }

    var hashMap = new HashMap();

    hashMap.put(devUUID, deviceUUID);
    hashMap.put(userUUID, userUUIDN);
    hashMap.put(compno, compnoSubstr(compNo));
    hashMap.put(phonenumber, addPhone);
    hashMap.put(cusName, name);
    hashMap.put(gender, sex_number);
    hashMap.put(idnumber, idCard);
    hashMap.put(remarks, remark);
    hashMap.put(consultType, consultNumber);
    hashMap.put(optFlag, optFlags);
    hashMap.put(dataSource, dataSourceNumber);

    return getJsonStr(hashMap);
}
/**
 *占坑规则的请求参数
 */
var addCustomer_getParams_rule = function(){
    var deviceUUID = getDeviceUUID();
    var userUUIDN = get(user_uuid);
    var hashMap = new HashMap();

    hashMap.put(devUUID, deviceUUID);
    hashMap.put(userUUID, userUUIDN);
    return getJsonStr(hashMap);
};

//-------------------------验证身份证号是否正确开始-------------------------------//
var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子   
var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X
var idCardFlag = 0;

function idCardValidate() {
    var customerIdCard = $(".js-addCustomer-ID").val();
    customerIdCard = trimStr(customerIdCard.replace(/ /g, ""));    //去掉字符串头尾空格
    if (customerIdCard.length == 18) {   
        var a_idCard = customerIdCard.split("");                // 得到身份证数组   
        if(isValidityBrithBy18IdCard(customerIdCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
            idCardFlag = 1;
			return true;  
		}else {
			idCardFlag = 0;
			return false;   
			}   
	}else {
		idCardFlag = 0;
		return false; 
		}   
}   
/**  
 * 判断身份证号码为18位时最后的验证位是否正确  
 * @param a_idCard 身份证号码数组  
 * @return  
 */  
function isTrueValidateCodeBy18IdCard(a_idCard) {   
    var sum = 0;                             // 声明加权求和变量   
    if (a_idCard[17].toLowerCase() == 'x') {   
        a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
    }   
    for ( var i = 0; i < 17; i++) {   
        sum += Wi[i] * a_idCard[i];            // 加权求和   
    }   
    valCodePosition = sum % 11;                // 得到验证码所位置   
    if (a_idCard[17] == ValideCode[valCodePosition]) {   
        return true;   
    }else {   
        return false;   
    	}   
}   
/**  
  * 验证18位数身份证号码中的生日是否是有效生日  
  * @param idCard 18位书身份证字符串  
  * @return  
  */  
function isValidityBrithBy18IdCard(customerIdCard){
    var year =  customerIdCard.substring(6,10);   
    var month = customerIdCard.substring(10,12);   
    var day = customerIdCard.substring(12,14);   
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
    // 这里用getFullYear()获取年份，避免千年虫问题   
    if(temp_date.getFullYear()!=parseFloat(year)
        || temp_date.getMonth()!=parseFloat(month)-1
        || temp_date.getDate()!=parseFloat(day)){
            return false;   
    }else {   
        return true;   
    	}   
} 
//---------------------------------验证身份证号是否正确结束-----------------------------------//


