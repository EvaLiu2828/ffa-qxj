/**
 * Created by v-qizhongfang on 2015/7/22.
 * service层对象 封装获取参数过滤方法    ajax请求方法
 *
 */
var salerCustomerService = (function(){
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
     * 获取修改客户信息接口参数
     * @param flag  0：修改，1：删除,2:保存沟通时间，3：新增客户，4.确认提交客户信息
     * @param data      //修改后客户对象
     */
    var getUpdateCustomerParams = function(flag, data){
        var params ={};
        var flag = parseInt(flag);

        params.phonenumber = data.phonenumber;	//客户电话
        params.dataSource = "02";

        if(flag === 0){
            //修改客户信息
            params.optFlag = "0";

            params.cusName = data.cusName;	//客户姓名
            params.remarks = data.remarks;	//备注
            params.gender = data.gender;	//性别
            params.fundDemand = data.fundDemand;//资金需求
            params.houseGarage = data.houseGarage;//房屋情况
            params.carGarage = data.carGarage;//车情况
            params.jobType = data.jobType;//职业类型
            params.payrollInfo = data.payrollInfo;//工资发放方式
            params.intentProduct = data.intentProduct;//意向产品
            params.paymentTime = data.paymentTime;//用款时间
            params.isLoans = data.isLoans;//是否办理过贷款
            params.isCreditCard = data.isCreditCard;//是否有信用卡
            params.carAppraisal = data.carAppraisal;//车辆自估价
            params.isMortgageCar = data.isMortgageCar;//是否接受押车
            params.houseAppraisal = data.houseAppraisal;//房屋自估价
            params.houseMortgage = data.houseMortgage;//房屋抵押情况
            params.firstLoanAmount = data.firstLoanAmount;//一抵贷款金额
            params.creditCardLimit = data.creditCardLimit;//信用卡额度
            params.isMarried = data.isMarried;//是否已婚
            params.isHaveChildren = data.isHaveChildren;//是否有孩子
            params.cusAge = data.cusAge;//年龄
            params.annualIncome = data.annualIncome;//年收入
            params.acptMonPayment = data.acptMonPayment;//可接受月还款
            params.cusEducation = data.cusEducation;//学历
            params.position = data.position;//城市

            params.templateId = data.templateId;    //模板id
            params.tgroupId = data.tgroupId;        //模板组id

            params.latiLongi = data.latiLongi;      //地理经纬度
            params.ipaddr = data.ipaddr;            //IP地址
            params.flag = data.flag;                //删除标记
            params.idnumber = data.idnumber;        //客户身份证
            params.occupy = data.occupy;            //是否占坑
            params.cusSource = data.cusSource;      //客户来源
            params.cusState = data.cusState;        //客户状态
            params.delReason = data.delReason;      //删除原因
            params.protectedTime = data.protectedTime;//占坑有效时间
            params.consultType = data.consultType;  //咨询类型
            params.clueId = data.clueId;            //线索ID

            if(params.gender === "男"){
                params.gender = "01";
            }else if(params.gender === "女"){
                params.gender = "02";
            }else if(params.gender === "未知"){
                params.gender = "03";
            }

            if(params.houseGarage === "有车有房"){
                params.houseGarage = "01";
                params.carGarage = "01";
            }else if(params.houseGarage === "有车"){
                params.houseGarage = "02";
                params.carGarage = "01";
            }else if(params.houseGarage === "有房"){
                params.houseGarage = "01";
                params.carGarage = "02";
            }else if(params.houseGarage === "无房无车"){
                params.houseGarage = "02";
                params.carGarage = "02";
            }else if(params.houseGarage === "未知"){
                params.houseGarage = "";
                params.carGarage = "";
            }

            if(params.carGarage === "有车有房"){
                params.houseGarage = "01";
                params.carGarage = "01";
            }else if(params.carGarage === "有车"){
                params.houseGarage = "02";
                params.carGarage = "01";
            }else if(params.carGarage === "有房"){
                params.houseGarage = "01";
                params.carGarage = "02";
            }else if(params.carGarage === "无房无车"){
                params.houseGarage = "02";
                params.carGarage = "02";
            }else if(params.carGarage === "未知"){
                params.houseGarage = "";
                params.carGarage = "";
            }

            if(params.jobType === "上班族"){
                params.jobType = "01";
            }else if(params.jobType === "生意人"){
                params.jobType = "02";
            }else if(params.jobType === "其它" || params.jobType === "其他"){
                params.jobType = "03";
            }else if(params.jobType === "未知"){
                params.jobType = "";
            }

            if(params.payrollInfo === "打卡工资"){
                params.payrollInfo = "01";
            }else if(params.payrollInfo === "现金发薪"){
                params.payrollInfo = "02";
            }else if(params.payrollInfo === "其它" || params.payrollInfo === "其他"){
                params.payrollInfo = "03";
            }else if(params.payrollInfo === "未知"){
                params.payrollInfo = "";
            }

            if(params.intentProduct === "信贷"){
                params.intentProduct = "01";
            }else if(params.intentProduct === "车贷"){
                params.intentProduct = "02";
            }else if(params.intentProduct === "房贷"){
                params.intentProduct = "03";
            }else if(params.intentProduct === "未知"){
                params.intentProduct = "";
            }

            if(params.paymentTime === "3个月"){
                params.paymentTime = "01";
            }else if(params.paymentTime === "6个月"){
                params.paymentTime = "02";
            }else if(params.paymentTime === "9个月"){
                params.paymentTime = "03";
            }else if(params.paymentTime === "12个月"){
                params.paymentTime = "04";
            }else if(params.paymentTime === "24个月"){
                params.paymentTime = "05";
            }else if(params.paymentTime === "36个月"){
                params.paymentTime = "06";
            }else if(params.paymentTime === "未知"){
                params.paymentTime = "";
            }

            if(params.isLoans === "无"){
                params.isLoans = "01";
            }else if(params.isLoans === "有，已还清"){
                params.isLoans = "02";
            }else if(params.isLoans === "有，未还清"){
                params.isLoans = "03";
            }else if(params.isLoans === "其他" || params.isLoans === "其它"){
                params.isLoans = "04";
            }else if(params.isLoans === "未知"){
                params.isLoans = "";
            }

            if(params.isCreditCard === "有"){
                params.isCreditCard = "01";
            }else if(params.isCreditCard === "无"){
                params.isCreditCard = "02";
            }else if(params.isCreditCard === "未知"){
                params.isCreditCard = "";
            }

            if(params.isMortgageCar === "是"){
                params.isMortgageCar = "01";
            }else if(params.isMortgageCar === "否"){
                params.isMortgageCar = "02";
            }else if(params.isMortgageCar === "未知"){
                params.isMortgageCar = "";
            }

            if(params.houseMortgage === "一抵"){
                params.houseMortgage = "01";
            }else if(params.houseMortgage === "二抵"){
                params.houseMortgage = "02";
            }else if(params.houseMortgage === "未知"){
                params.houseMortgage = "";
            }

            if(params.isMarried === "已婚"){
                params.isMarried = "01";
            }else if(params.isMarried === "未婚"){
                params.isMarried = "02";
            }else if(params.isMarried === "离异"){
                params.isMarried = "03";
            }else if(params.isMarried === "丧偶"){
                params.isMarried = "04";
            }else if(params.isMarried === "未知"){
                params.isMarried = "";
            }

            if(params.isHaveChildren === "有"){
                params.isHaveChildren = "01";
            }else if(params.isHaveChildren === "无"){
                params.isHaveChildren = "02";
            }else if(params.isHaveChildren === "未知"){
                params.isHaveChildren = "";
            }

            if(params.cusEducation === "初中及以下"){
                params.cusEducation = "01";
            }else if(params.cusEducation === "高中及中专"){
                params.cusEducation = "02";
            }else if(params.cusEducation === "大专"){
                params.cusEducation = "03";
            }else if(params.cusEducation === "本科"){
                params.cusEducation = "04";
            }else if(params.cusEducation === "硕士"){
                params.cusEducation = "05";
            }else if(params.cusEducation === "博士"){
                params.cusEducation = "06";
            }else if(params.cusEducation === "未知"){
                params.cusEducation = "";
            }

            if(params.occupy === "占坑中"){
                params.occupy = "01";
            }else if(params.occupy === "未占坑"){
                params.occupy = "02";
            }else if(params.occupy === "占坑失败"){
                params.occupy = "03";
            }else if(params.occupy === "占坑已过保护期"){
                params.occupy = "04";
            }

            if(params.consultType === "信贷"){
                params.consultType = "0";
            }else if(params.consultType === "车贷"){
                params.consultType = "1";
            }

            if(params.position === "未知"){
                params.position = "";
            }
            if(params.carAppraisal === null || params.carAppraisal === "null"){
                params.carAppraisal = "";
            }
            if(params.isMortgageCar === null || params.isMortgageCar === "null"){
                params.isMortgageCar = "";
            }
            if(params.houseAppraisal === null || params.houseAppraisal === "null"){
                params.houseAppraisal = "";
            }
            if(params.houseMortgage === null || params.houseMortgage === "null"){
                params.houseMortgage = "";
            }
            if(params.firstLoanAmount === null || params.firstLoanAmount === "null"){
                params.firstLoanAmount = "";
            }
            if(params.creditCardLimit === null || params.creditCardLimit === "null"){
                params.creditCardLimit = "";
            }
            if(params.isHaveChildren === null || params.isHaveChildren === "null"){
                params.isHaveChildren = "";
            }
            if(params.cusAge === null || params.cusAge === "null"){
                params.cusAge = "";
            }
            if(params.annualIncome === null || params.annualIncome === "null"){
                params.annualIncome = "";
            }
            if(params.acptMonPayment === null || params.acptMonPayment === "null"){
                params.acptMonPayment = "";
            }
            if(consultType.acptMonPayment === null || consultType.acptMonPayment === "null"){
                consultType.acptMonPayment = "";
            }
        }else if(flag === 1){
            params.optFlag = "1";
            params.delReason = data.delReason;	//删除原因
        }else if(flag === 2){
            params.optFlag = "2";
            params.commtionTime = data.commtionTime;	//最近沟通时间
        }else if(flag === 3){
            params.optFlag = "3";
            params.idnumber = data.idnumber;    //身份证号
        }else{
            throw Error("未知请求");
        }
        console.log("入参params的Json串---------"+JSON.stringify($.extend(params, getCommomParams())));
        return JSON.stringify($.extend(params, getCommomParams()));
    };
    /**
     * 获取客户列表接口参数
     * @param flag   0：刷新；1：加载更多
     * @param data
     */
    var getCustomerListParams = function(flag, data){
        var params ={};
        var flag = parseInt(flag);
        if(flag === 0){
            params.identifying = "0";	//标识
            params.timestamp = data.timestamp;	//时间戳
            params.cusCount = data.cusCount;
            params.managerId = data.managerId;
            //params.timestamp = "";
        }else{
            throw Error("未知请求");
        }

        return JSON.stringify($.extend(params, getCommomParams()));
    };

    /**
     * 获取查询参数
     * @param flag  ，没用 ？
     * @param data
     */
    var getQueryProgressParams = function(flag, data){
        var params ={};
        var commomParams = _(getCommomParams()).omit('compno');
        params.phonenumber = data.phonenumber;	//标识


        return JSON.stringify($.extend(params, commomParams));
    };

    /**
     * 获取占坑接口参数
     * @param data      //修改后的客户对象
     */
    var getPostOccupationParams = function(data){
        var params ={};
        //接口参数未提供
        params.phonenumber = data.phonenumber;	//客户电话
        params.cusName = data.cusName;	//客户姓名
        params.idnumber = data.idnumber; //身份证号
        return JSON.stringify($.extend(params, getCommomParams()));
    };
    /**
     * 获取添加电话接口参数
     * @param data      //修改后的客户对象
     */
    var getAddPhonenumberParams = function(data){
        var params ={};
        params.firstPhone = data.phonenumber;	//客户电话
        params.newPhone = data.newPhone;	//客户姓名
        return JSON.stringify($.extend(params, getCommomParams()));
    };
    /**
     * 获取查询详情接口参数
     * @param newData      //修改后的数据
     */
    var getQueryCustomerdetailParams = function(newData){
        var params ={};
        var commonParams = getCommomParams();
        params.phonenumber = newData.phonenumber;	//客户电话
        params.managerId = newData.managerId;  // 加密的12位员工编号
        params.positionFlag = get(user_level_flag);

        if(delete commonParams.compno){
            //查询接口不需要员工编号 删除
            return JSON.stringify($.extend(params, commonParams));
        }else{
            throw Error('请求参数构建失败');
        }

    };

    return {
        //获取客户列表
        getCustomerList:function(data,successFun,errorFun){
            http_post(get_salerCustList_interface,getCustomerListParams(0, data),successFun,errorFun);
        },
        /**
         * 查询客户详细信息
         * @param data
         * @param successFun
         * @param errorFun
         */
        queryCustomerDetail:function(data,successFun,errorFun){
            console.log("请求链接："+query_customerdetail_interface);
            console.log("请求参数：");
            console.log(getQueryCustomerdetailParams(data));

            http_post(query_customerdetail_interface,getQueryCustomerdetailParams(data),successFun,errorFun)
        }
    };
})();