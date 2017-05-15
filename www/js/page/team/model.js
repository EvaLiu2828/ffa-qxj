/**
 * Created by 201408040800 on 2016/6/23.
 * 团队经理-Model
 */

;(function(FFA){

    // 公有方法
    var getCommomParams = function(){
        var params = {};
        params.devUUID = getDeviceUUID();	//设备ID 用于检测登录状态，标记操作人
        params.userUUID = get(user_uuid);	 //这个设备的会话ID 用于检测登录状态，标记操作人
      //  params.cusManager = compnoSubstr(get(user_uuid));		//员工编号 userUUID把这个设上
        return params;
    };

    /**
     * 获取团队数据接口参数
     * @param flag   0：刷新；1：加载更多
     * @param data
     */
    var getManagerDataParams = function(level,managerId){
        var params = {};
        params.positionFlag = level;
        if (managerId)  params.managerId = managerId;
      //  params.managerId = compnoSubstr(get(user_uuid))
        return JSON.stringify($.extend(params, getCommomParams()));
    };
    // 获取当前团队经理的数据 以及 获取当前团队经理下的客户经理列表数据
    var getTeamData = function(successFun, errorFun) {
        console.log("传参：");
        console.log(getManagerDataParams(team_level_flag));
        console.log("url:");
        console.log(get_teamData_interface);
        http_post(get_teamData_interface, getManagerDataParams(team_level_flag), successFun, errorFun);
    };

    // 获取营业部数据
    var getDepartmentData = function(successFun, errorFun) {
        http_post(get_departmentData_interface, getManagerDataParams(dep_level_flag), successFun, errorFun);
    };



    var TeamModel = FFA.namespace("Team.TeamModel");
    TeamModel.getUserLevelFlag = function(level) {
        //  return parseInt(get(user_level_flag), 10) || 3; TODO: 到时候要改回来
    //    console.log(level || (parseInt(get(user_level_flag), 10) || team_level_flag));
        return level || (parseInt(get(user_level_flag), 10));
    };
    /**
     * 级别树
     * @param level
     * @returns {{subLevel: *, curLevel: *, parentLevel: *}}
     */
    TeamModel.getLevelThree = function(level) {
        var curLevel;
        if (level) {
            curLevel = level;
        } else {
            curLevel = TeamModel.getUserLevelFlag();
        }

        var userLevel = parseInt(get(user_level_flag), 10);

        var subLevel, parentLevel;
        switch (curLevel) {
            case dep_level_flag:
                subLevel = team_level_flag;
                parentLevel = null;
                break;
            case team_level_flag:
                subLevel = customer_level_falg;
                parentLevel = dep_level_flag;
                if (curLevel == userLevel) {
                    parentLevel = null;
                }
                break;
            case customer_level_falg:
            default :
                subLevel = null;
                parentLevel = team_level_flag;
                if (curLevel == userLevel) {
                    parentLevel = null;
                }

        }

        return {
            subLevel: subLevel,
            curLevel: curLevel,
            parentLevel: parentLevel
        };

    };
    TeamModel.getPageData= function(successFun, errorFun) {
        var level = get(user_level_flag);
        if (level == team_level_flag) {
            // 团队经理
            getTeamData(successFun, errorFun);

        }  else if (level == dep_level_flag) {
            // 营业部经理
            var params = {};
            getDepartmentData(successFun, errorFun);
        }
    };
})(FFA);
