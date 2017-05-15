/**
 * Created by 201408040800 on 2016/6/27.
 * 小红点处理
 */

;(function(FFA){

    //
    var RedDot = FFA.namespace("RedDot");

    var RedDotFlag = [1,2,3]; // 1, 普惠金融师; 2,绩效查询; 3,日报,以此往后加(注意要数据库保存一致)

    // 显示right-content
    var RedDotFlagName = {
        1: '',  // 普惠金融师
        2: ''  ,          // 绩效查询
        3: '' //日报
    };

    var redDotObj;

    /**
     * RedDot View
     * @param pObj
     * @param redDotFlag
     * 规则，是在小红点的父级加class： js_red_dot_wrap_拼上redDotFlag的值
     */
    RedDot.init = function(redDotFlag) {
        console.log("redDotFlag="+redDotFlag);
        $.when(RedDot.getRedDot(redDotFlag)).done(function(stateCode, redDotFlag){
            $wrapper =  $(".js_red_dot_wrap_"+ redDotFlag);
            redDotObj = $(" .red-circle", $wrapper);
            var rightContent = $(" .right-content", $wrapper);
            rightContent.text(RedDotFlagName[redDotFlag]);

            RedDot.isShow(redDotFlag, stateCode, redDotObj);

        }).fail(function(e){
            //  RedDot.hideRedDot();
            console.log(e);
        });
    };

    RedDot.isShow = function(redDotFlag, stateCode, redDotObj) {
        if (stateCode == 0) {
            RedDot.showRedDot(redDotObj);
            RedDot.setRedDotState(redDotFlag, 0);
        } else {
            RedDot.setRedDotState(redDotFlag, 1);
            RedDot.hideRedDot(redDotObj);
        }
    };

    RedDot.showRedDot = function(redDotObj) {
        console.log("显示小红点");
        redDotObj.addClass("rate-red-circle");
    };
    RedDot.hideRedDot = function(redDotObj) {
        redDotObj.removeClass("rate-red-circle");
    };

    /**
     * RedDot Model
     * @param currRedDotFlag
     */
    var getCommomParams = function(redDotFlag) {
        var params = {
            devUUID: getDeviceUUID(), //设备ID 用于检测登录状态，标记操作人
            userUUID: get(user_uuid), //这个设备的会话ID 用于检测登录状态，标记操作人
            redDot: redDotFlag   // 用于识别小红点请求来源1：普惠金融师（暂时未开发），2：绩效查询
        };
        return JSON.stringify(params);
    };

    RedDot.getRedDot = function(redDotFlag) {
        var deferred = $.Deferred();
        http_post(red_dot_interface, getCommomParams(redDotFlag), function(data){
            console.log("获取小红点数据");
            console.log(data);
            if (data.codeInfo == 0 ) {

                if (redDotFlag == 1)  {
                    RedDotFlagName[redDotFlag] = data.curLevelName;
                    put("localStorage_rate_LevelName", data.curLevelName);
                }

                if (data.code == 0) {
                    // 显示小红点
                    deferred.resolve(0,redDotFlag);
                    //  return true;
                }
            }
            //  return false;
            deferred.resolve(1,redDotFlag);
        }, function(e) {
            //   return false;
            deferred.reject(e);
        });
        return deferred.promise();
    };
    RedDot.getAllRedDot = function() {
        var l = RedDotFlag.length;
        for (var i = 0; i < l; i++) {
            this.init(RedDotFlag[i]);
        }
    };

    RedDot.setRedDotState = function(redDotFlag, stateCode) {
        put("red_dot_flag_"+redDotFlag, stateCode); //  0，表示未读, 1,表示已读
    }

    RedDot.getRedDotState = function(redDotFlag) {
        return get("red_dot_flag_"+redDotFlag); //  0，表示未读, 1,表示已读
    }
    RedDot.geAlltRedDotState = function() {
        var l = RedDotFlag.length;
        for (var i = 0; i < l; i++) {
            $wrapper =  $(".js_red_dot_wrap_"+ RedDotFlag[i]);
            redDotObj = $(" .red-circle", $wrapper);
            var stateCode = this.getRedDotState(RedDotFlag[i]);
            RedDot.isShow(RedDotFlag[i], stateCode, redDotObj);
            if (RedDotFlag[i] == 1) {
                var rightContent = $(" .right-content", $wrapper);
                rightContent.text(get("localStorage_rate_LevelName"));
            }

        }


    }



}(FFA));
