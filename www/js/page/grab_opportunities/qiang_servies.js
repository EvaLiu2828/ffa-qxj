/**
 * Created by apple on 16/11/3.
 */
var qiangCusService = (function(){
    /**
     *
     * 获取公共参数
     */
    var getCommomParams = function(){
        var params ={};
        params.devUUID = getDeviceUUID();	//设备ID 用于检测登录状态，标记操作人
        params.userUUID = get(user_uuid);	//这个设备的会话ID 用于检测登录状态，标记操作人
        //  params.compno = compnoSubstr(get(user_uuid));		//员工编号 userUUID把这个设上
        //params.dataSource = '02';           //数据源
        return params;
    };
    /**
     * 获取客户列表接口参数
     * @param flag   0：刷新；1：加载更多
     * @param data
     */
    var getQiangCustomerList = function(data){
        var params ={};
        params.type = 2;	//标识
        return JSON.stringify($.extend(params, getCommomParams()));
    };
    /**
     * 获取客户详情接口参数
     * @param flag   0：刷新；1：加载更多
     * @param data
     */
    var getQiangCusInfo = function(data){
        var params ={};
        cus_nicheId = localStorage.getItem("nicheId");
        params.nicheId = cus_nicheId;	//标识
        return JSON.stringify($.extend(params, getCommomParams()));
    };
    /**
     * 获取抢接口参数
     * @param flag   0：刷新；1：加载更多
     * @param data
     */
    var getGrabNicheInfo = function(data){
        var params ={};
        _this_nicheId = localStorage.getItem("_thisNicheId");

        params.nicheId = _this_nicheId;	//标识
        return JSON.stringify($.extend(params, getCommomParams()));
    };

    return {
        //获取客户列表
        getQCustomerList:function(data,successFun,errorFun){
            http_post(get_allNicheList_interface,getQiangCustomerList(data),successFun,errorFun);
        },

        //获取客户详情
        getQCustomerInfo:function(data,successFun,errorFun){
            http_post(get_nicheInfo_interface,getQiangCusInfo(data),successFun,errorFun);
        },
        //获取抢后详情
        getGNicheInfo:function(data,successFun,errorFun){
            http_post(get_grabNiche_interface,getGrabNicheInfo(data),successFun,errorFun);
        }
    }
})();