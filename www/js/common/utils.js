// JavaScript Document
/**判断是否是手机号*/
function isPhoneNumber($inputPhoneNumber) {
    if ($inputPhoneNumber != null && $inputPhoneNumber.length == 11) {
        return isMobile($inputPhoneNumber);
    } else {
        return false;
    }
}
/**判断是否是密码*/
function isPassword($inputPassword) {
    if ($inputPassword != null && $inputPassword.length >= 6 && $inputPassword.length <= 20) {
        return true
    } else {
        return false;
    }
}
/**判断页面获取的手机号，是否和手机中拿到的手机号相等*/
function isPhoneNumberEquals($pagePhoneNumber) {
    var phoneNumber = getPhoneNumber();
    if (phoneNumber != null && phoneNumber == $pagePhoneNumber) {
        return true;
    } else {
        return false;
    }
}
/**判断密码是否相等*/
function isPassEquals($inputPassword, $inputPassword2) {
    //判断密码是否为空

    if (isPassword($inputPassword) && isPassword($inputPassword2)) {
        //判断密码是否相等
        if ($inputPassword === $inputPassword2) {
            return true;
        }
    }
}
/**判断是否可以注册*/
function checkPaswordAndPhone($inputPhoneNumber, $inputPassword, $inputPassword2) {
    if (isPhoneNumber($inputPhoneNumber)) {
        if (isPassEquals($inputPassword, $inputPassword2)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
/**验证码输入是否有误*/
function isCaptcha($captcha) {
    if (isEmpty($captcha)) {
        return false;
    } else {
        return true;
    }
}
function isAllowLogin($phoneNumber, $Password) {
    if (isPhoneNumber($phoneNumber)) {
        return isPassword($Password);
    } else {
        return false;
    }
}
/**判断是否可以进行注册*/
function isAllowRegister($inputPhoneNumber, $inputPassword, $inputPassword2, $captcha) {
    if (isPhoneNumber($inputPhoneNumber)) {
        if (isPassEquals($inputPassword, $inputPassword2)) {
            if (isPhoneNumberEquals($inputPhoneNumber)) {
                return true;
            } else {
                if (isCaptcha($captcha)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
/**是否可以离开*/
function isAllowLeave($inputPhoneNumber, $inputPassword, $inputPassword2) {
    if (isEmpty($inputPhoneNumber) && isEmpty($inputPassword) && isEmpty($inputPassword2)) {
        return true;
    } else {
        return false;
    }
}
/**判断是否为空*/
function isEmpty(str) {
    if (str != null && str.length > 0) {
        return false;
    } else {
        return true;
    }
}
/**当前当前的时间*/
function getCurrentTime() {
    var date = new Date().getTime();
    return date;
}
/**截取url中图片的名字*/
function getImgName(url) {
    var imageName = "";
    if (url != null && url.length > 0) {
        var imageArray = url.match(/\/(\w+\.(?:png|jpg|gif|bmp))$/i);
        if (imageArray != null && imageArray.length > 1) {
            imageName = imageArray[1];
        }
    }
    return imageName;
}

function getImgNameWithoutExtension(url) {
    var imageName = "";
    if (url != null && url.length > 0) {
        imageName = url.replace(/.*\/([^\/]+)\..+/, '$1');
    }
    return imageName;
}

function equalsIgnoreCase(str1, str2) {
    if (str1.toUpperCase() == str2.toUpperCase()) {
        return true;
    }
    return false;
}

function isInRootDirectory(url) {
    var flag = false;
    console.log("isInRootDirectory url: " + url);
    var startPos = url.lastIndexOf('html/');
    var endPos = url.lastIndexOf('/');
    console.log("isInRootDirectory startPos: " + startPos);
    console.log("isInRootDirectory endPos: " + endPos);
    if ((startPos != -1) && (endPos != -1) && (endPos - startPos == 4)) {
        flag = true;
    }
    return flag;
}

/**控制页面的跳转*/
function redirect(itemTag) {
    console.log("utils redirect itemTag: " + itemTag);
    if (itemTag != "") {
        sessionStorage.setItem("pageName", itemTag);
    }
    if (isInRootDirectory(window.location.href)) {
        window.location.href = 'frame.html';
    } else {
        window.location.href = '../frame.html';
    }
}
function isMobile(aPhone) {
    var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|17[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(aPhone);
    if (bValidate) {
        return true;
    } else {
        return false;
    }
}
function isInvalidityTime() {
    var flag = true;
    var lastLoginTime = localStorage.getItem(last_login_time);
    var curTime = new Date().getTime();
    console.log("isInvalidityTime -> lastLoginTime: " + lastLoginTime);
    if (lastLoginTime != "") {
        var days = (curTime - lastLoginTime) / (24 * 3600 * 1000);
        console.log("isInvalidityTime -> days: " + days);
        if (days >= 30) {
            localStorage.setItem(last_login_time, curTime);
            flag = false;
        }
    }
    return flag;
}

/**
 * 截取字符串
 * @param str    字符串
 * @param index  截取的开始位置
 * @param length 截取的长度
 */
function substr(str, index, length) {
    var newStr = '';
    if (str && str.length > 0) {
        str = str.replace(/^\s*/g,""); // 去前面的空格
        newStr = str.substr(index, length);
    }
    return newStr;
}

/** 截取12位员工编号 **/
function compnoSubstr(str) {
    return substr(str, 0, 12);
}

/** 判断元素是否在数组内 **/
function contains(arr, value) {
    var l = arr.length;
    while (l--) {
        if (arr[l] === value) {
            return true;
        }
    }
    return false;
};

//--------------------------- 用下面的格式定义工具方法或工具类-----------------------------------/


/**
 * 创建一个子对象 继承p
 * @param p
 * @returns {*}
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.inherit = function (p) {
        if (p == null) throw TypeError();
        if (Object.create)
            return Object.create(p);
        var t = typeof p;
        if (t !== "object" && t !== "function") throw TypeError();
        function f() {s};
        f.prototype = p;
        return new f();
    }

})(FFA);


/**
 * 取消默认事件
 * @param event
 * @returns {boolean}
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.cancelHandler = function (event) {
        event = event || window.event;

        if (event.preventDefault) event.preventDefault();
        if (event.returnValue) event.returnValue = false;
        return false;
    };

    Utils.stopEvent = function (event) {

        Utils.cancelHandler(event);
        event.stopPropagation();
    }

})(FFA);


/**
 * 格式化时间    返回时分秒
 * @param milli        距GMT时间1970年1月1日午夜之间的毫秒数
 * @param sep        分隔符
 * @param to        3 精确到秒
 * @returns {*}
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.formatTime = function(milli, sep, to) {
        var DtObj = new Date(parseInt(milli));
        var h = DtObj.getHours();
        var m = DtObj.getMinutes();
        h = h <= 9 ? "0" + h : h;
        m = m <= 9 ? "0" + m : m;
        if (to && to.toString() === '3') {
            var s = DtObj.getSeconds();
            s = s <= 9 ? "0" + s : s;
            return h + sep + m + sep + s;
        } else {
            return h + sep + m;
        }
    };
})(FFA);


/**
 * 格式化日期
 * @param milli        距GMT时间1970年1月1日午夜之间的毫秒数
 * @param sep        分隔符
 * @returns {*}
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.formatDate = function(milli, sep, to) {
        var DtObj = new Date(parseInt(milli));
        var y = DtObj.getFullYear();
        var m = DtObj.getMonth() + 1;
        var d = DtObj.getDate();
        m = m <= 9 ? "0" + m : m;
        d = d <= 9 ? "0" + d : d;
        if (sep && !to) {
            return y + sep + m + sep + d;
        }else if (to && to.toString() === '2') {
            return m + sep + d;
        }else {
            return y + '年' + m + '月' + d + '日';
        }
    };
})(FFA);

/**
 * 获取url中的参数
 * @returns {{}}        格式：Object {id: "1", flag: "2"}
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.urlArgs = function () {
        var args = {};
        var query = location.search.substring(1);
        var pairs = query.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var name = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[name] = value;
        }
        return args;
    };
})(FFA);
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.getMillisecond = function (time) {
        console.log(time);
        if(!time){
            return 0;
        }
        time = time.replace(new RegExp("-","gm"),"/");
        var millisecond = (new Date(time)).getTime();
        console.log(millisecond);
        if(!millisecond){
            return 0;
        }
        return millisecond;

    };
})(FFA);
/**
 * 空字段过滤
 * @param o
 * @returns {*}
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.filter = function(o) {
        if (o && typeof o === 'object') {
            //对象或数组
            var ro = {};
            var p;
            for (p in o) {
                if (!o.hasOwnProperty(p))continue;	//跳过继承的字段
                if (typeof o[p] === 'function')continue;	//跳过方法

                if (o[p] || (o[p] === 0)) {
                    //过滤掉空字符串 null undefine，但不过滤0
                    ro[p] = o[p];
                }
            }
            return ro;
        } else {
            return o;
        }
    };
})(FFA);



/**
 * 校验身份证号   获取身份证号中的信息
 * 对身份证号的操作请直接在此类里添加方法
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    // 构造函数，变量为15位或者18位的身份证号码
    var IDCard = function(CardNo) {
        this.Valid = false;
        this.ID15 = '';
        this.ID18 = '';
        this.Local = '';
        if (CardNo != null)this.SetCardNo(CardNo);
    };

    // 设置身份证号码，15位或者18位
    IDCard.prototype.SetCardNo = function (CardNo) {
        this.ID15 = '';
        this.ID18 = '';
        this.Local = '';
        CardNo = CardNo.replace(" ", "");
        var strCardNo;
        if (CardNo.length == 18) {
            pattern = /^\d{17}(\d|x|X)$/;
            if (pattern.exec(CardNo) == null)return;
            strCardNo = CardNo.toUpperCase();
        } else {
            pattern = /^\d{15}$/;
            if (pattern.exec(CardNo) == null)return;
            strCardNo = CardNo.substr(0, 6) + '19' + CardNo.substr(6, 9)
            strCardNo += this.GetVCode(strCardNo);
        }
        this.Valid = this.CheckValid(strCardNo);
    };
    // 校验身份证有效性
    IDCard.prototype.IsValid = function () {
        return this.Valid;
    };
    // 返回生日字符串，格式如下，1981-10-10
    IDCard.prototype.GetBirthDate = function () {
        var BirthDate = '';
        if (this.Valid)BirthDate = this.GetBirthYear() + '-' + this.GetBirthMonth() + '-' + this.GetBirthDay();
        return BirthDate;
    };
    // 返回生日中的年，格式如下，1981
    IDCard.prototype.GetBirthYear = function () {
        var BirthYear = '';
        if (this.Valid)BirthYear = this.ID18.substr(6, 4);
        return BirthYear;
    };
    // 返回生日中的月，格式如下，10
    IDCard.prototype.GetBirthMonth = function () {
        var BirthMonth = '';
        if (this.Valid)BirthMonth = this.ID18.substr(10, 2);
        if (BirthMonth.charAt(0) == '0')BirthMonth = BirthMonth.charAt(1);
        return BirthMonth;
    };
    // 返回生日中的日，格式如下，10
    IDCard.prototype.GetBirthDay = function () {
        var BirthDay = '';
        if (this.Valid)BirthDay = this.ID18.substr(12, 2);
        return BirthDay;
    };
    // 返回性别，1：男，0：女
    IDCard.prototype.GetSex = function () {
        var Sex = '';
        if (this.Valid)Sex = this.ID18.charAt(16) % 2;
        return Sex;
    };
    // 返回15位身份证号码
    IDCard.prototype.Get15 = function () {
        var ID15 = '';
        if (this.Valid)ID15 = this.ID15;
        return ID15;
    };
    // 返回18位身份证号码
    IDCard.prototype.Get18 = function () {
        var ID18 = '';
        if (this.Valid)ID18 = this.ID18;
        return ID18;
    };
    // 返回所在省，例如：上海市、浙江省
    IDCard.prototype.GetLocal = function () {
        var Local = '';
        if (this.Valid)Local = this.Local;
        return Local;
    };
    IDCard.prototype.GetVCode = function (CardNo17) {
        var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
        var Ai = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardNoSum = 0;
        for (var i = 0; i < CardNo17.length; i++)cardNoSum += CardNo17.charAt(i) * Wi[i];
        var seq = cardNoSum % 11;
        return Ai[seq];
    };
    IDCard.prototype.CheckValid = function (CardNo18) {
        if (this.GetVCode(CardNo18.substr(0, 17)) != CardNo18.charAt(17))return false;
        if (!this.IsDate(CardNo18.substr(6, 8)))return false;
        var aCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        if (aCity[parseInt(CardNo18.substr(0, 2))] == null)return false;
        this.ID18 = CardNo18;
        this.ID15 = CardNo18.substr(0, 6) + CardNo18.substr(8, 9);
        this.Local = aCity[parseInt(CardNo18.substr(0, 2))];
        return true;
    };
    IDCard.prototype.IsDate = function (strDate) {
        var r = strDate.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);
        if (r == null)return false;
        var d = new Date(r[1], r[2] - 1, r[3]);
        return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[2] && d.getDate() == r[3]);
    };
    Utils.IDCard = IDCard;

})(FFA);


/**
 * 将on 和 fire 功能注册到对象上  使其具有通用事件方法
 * @param that
 * @returns {*}
 */
(function (FFA) {
    var Utils = FFA.namespace("Utils");

    Utils.eventuality = function (that) {
        var registry = {};
        that.fire = function (event) {
            // Fire an event on an object. The event can be either
            // a string containing the name of the event or an
            // object containing a type property containing the
            // name of the event. Handlers registered by the 'on'
            // method that match the event name will be invoked.
            var array,
                func,
                handler,
                i,
                type = typeof event === 'string' ?
                    event : event.type;

            // If an array of handlers exist for this event, then
            // loop through it and execute the handlers in order.

            if (registry.hasOwnProperty(type)) {
                array = registry[type];
                for (i = 0; i < array.length; i += 1) {
                    handler = array[i];

                    // A handler record contains a method and an optional
                    // array of parameters. If the method is a name, look
                    // up the function.

                    func = handler.method;
                    if (typeof func === 'string') {
                        func = this[func];
                    }

                    // Invoke a handler. If the record contained
                    // parameters, then pass them. Otherwise, pass the
                    // event object.

                    func.apply(this,
                        handler.parameters || [event]);
                }
            }
            return this;
        };

        that.on = function (type, method, parameters) {

            // Register an event. Make a handler record. Put it
            // in a handler array, making one if it doesn't yet
            // exist for this type.

            var handler = {
                method: method,
                parameters: parameters
            };
            if (registry.hasOwnProperty(type)) {
                registry[type].push(handler);
            } else {
                registry[type] = [handler];
            }
            return this;
        };
        return that;
    };
})(FFA);


/**
 * 处理HTML的Encode(转码)和Decode(解码)
 * @param str
 */
(function(FFA){
    var Utils = FFA.namespace("Utils");

    /*1.用正则表达式实现html转码*/
    Utils.htmlEncodeByRegExp = function(str) {
        var s = '';
        if (str.length > 0) {
            s = str.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39");
            s = s.replace(/\"/g, "&quot;");
        }
        return s;
    };
    /*2.用正则表达式实现html解码*/
    Utils.htmlDecodeByRegExp = function(str) {
        var s = '';
        if (str.length > 0) {
            s = str.replace(/&amp;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39/g, "\'");
            s = s.replace(/&quot;/g, "\"");
        }
        return s;
    }
})(FFA);

