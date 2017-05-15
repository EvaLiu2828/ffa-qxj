/**
 * Created by v-qizhongfang on 2015/7/21.
 */
var customerDetailController = (function (){

    var Customer = FFA.namespace("Customer");
    var Utils = FFA.namespace("Utils");



    var service = customerService,
        indexedDBDAO,
        customer;

    //获取并保存本地数据 用于请求取参
    $.when(indexedDBDAOFactory(indexedDB_config))
        .done(function(indexedDBDaoObj){
            indexedDBDAO = indexedDBDaoObj;
            console.log('customerDetailController inited');
        })
        .fail(function(e){
            console.log('customerDetailController init fail' + e);
        }
    );

//     错误代码
//     0: ajax请求失败 1: 服务端返回修改失败信息
//     2: 参数为空     3: 参数格式错误
//     5: 服务器修改成功，本地存库错误

    return {
        /**
         *修改信息
         */
        updateInfo:function(fieldName,value){
            var deferred = $.Deferred();
            //创建一个customer的子对象用于传参
            var params = Utils.inherit(customer);
            var changeFieldName = fieldName;
            if(changeFieldName === "cusName"){
                //姓名
                params.cusName = value;
            }else if(changeFieldName === "remarks"){
                //备注
                params.remarks = value;
            }else if(changeFieldName === "gender"){
                //性别
                params.gender = value;
            }else if(changeFieldName === "fundDemand"){
                //资金需求
                params.fundDemand = value;
            }else if(changeFieldName[0] === "houseGarage" && changeFieldName[1] === "carGarage"){
                //车房情况
                params.houseGarage = value[0];
                params.carGarage = value[1];
            }else if(changeFieldName === "jobType"){
                //职业类型
                params.jobType = value;
            }else if(changeFieldName === "payrollInfo"){
                //工资发放方式
                params.payrollInfo = value;
            }else if(changeFieldName === "intentProduct"){
                //意向产品
                params.intentProduct = value;
            }else if(changeFieldName === "paymentTime"){
                //用款时间
                params.paymentTime = value;
            }else if(changeFieldName === "isLoans"){
                //是否办理过贷款
                params.isLoans = value;
            }else if(changeFieldName === "isCreditCard"){
                //是否有信用卡
                params.isCreditCard = value;
            }else if(changeFieldName === "carAppraisal"){
                //车辆自估价
                params.carAppraisal = value;
            }else if(changeFieldName === "isMortgageCar"){
                //是否接受押车
                params.isMortgageCar = value;
            }else if(changeFieldName === "houseAppraisal"){
                //房屋自估价
                params.houseAppraisal = value;
            }else if(changeFieldName === "houseMortgage"){
                //房屋抵押情况
                params.houseMortgage = value;
            }else if(changeFieldName === "firstLoanAmount"){
                //一抵贷款金额
                params.firstLoanAmount = value;
            }else if(changeFieldName === "creditCardLimit"){
                //信用卡额度
                params.creditCardLimit = value;
            }else if(changeFieldName === "isMarried"){
                //是否已婚
                params.isMarried = value;
            }else if(changeFieldName === "isHaveChildren"){
                //是否有孩子
                params.isHaveChildren = value;
            }else if(changeFieldName === "cusAge"){
                //年龄
                params.cusAge = value;
            }else if(changeFieldName === "annualIncome"){
                //年收入
                params.annualIncome = value;
            }else if(changeFieldName === "acptMonPayment"){
                //可接受月还款
                params.acptMonPayment = value;
            }else if(changeFieldName === "cusEducation"){
                //学历
                params.cusEducation = value;
            }else if(changeFieldName === "position"){
                //城市
                params.position = value;
            }

            console.log("params+++++++++++++++++++++"+JSON.stringify(params));


            service.updateCustomer(params,
                function(data){
                    if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                        //修改成功
                        deferred.resolve(0, data);
                    }else{
                        deferred.resolve(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });
            return deferred.promise();
        },
        /**
         * 占坑
         */
        occupyCustomer:function(idnumber){
            var deferred =  $.Deferred();
            var params = Utils.inherit(customer);
            params.idnumber = idnumber;
            service.occupyCustomer(params,
                function(data){
                    if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                        deferred.resolve(0, data);
                    }
                    //else if(data.hasOwnProperty('codeInfo') && data.codeInfo === '11'){
                    //    //无效占坑
                    //    deferred.resolve(11, data);
                    //}
                    else{
                        deferred.resolve(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });
            return deferred.promise();
        },
        /**
         * 保存沟通时间
         */
        updateCommtionTime:function(newCommtionTime){
            var deferred =  $.Deferred();
            var params = Utils.inherit(customer);
            params.commtionTime = newCommtionTime;
            service.updateCommtionTime(params,
                function(data){
                    if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                        deferred.resolve(data);
                    }else{
                        deferred.resolve(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });
            return deferred.promise();
        },
        /**
         * 删除
         */
        deleteCustomer:function(delReason){
            var deferred =  $.Deferred();
            var params = Utils.inherit(customer);
            params.delReason = delReason;
            service.deleteCustomer(params,
                function(data){
                    if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                        deferred.resolve(0, data);
                    }else{
                        deferred.resolve(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });
            return deferred.promise();
        },
        /**
         * 添加用户
         */
        addCustomer:function(newCustomer){
            var deferred =  $.Deferred();
            service.addCustomer(newCustomer,
                function(data){
                    if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                        indexedDBDAO.updateItem(newCustomer)
                            .done(function() {
                                deferred.resolve(0, data);
                            })
                            .fail(function (e) {
                                deferred.reject(5, e);
                            });
                    }else{
                        deferred.reject(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });
            return deferred.promise();
        },

        /**
         * 添加电话
         */
        addPhone:function(newPhone){
            var deferred =  $.Deferred();
            var params = Utils.inherit(customer);
            params.newPhone = newPhone;
            service.addPhone(params,
                function(data){
                    if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                        deferred.resolve(0, data);
                    }
                    //else if(data.hasOwnProperty('codeInfo') && data.codeInfo === '17'){
                    //    //手机号码重复
                    //    deferred.resolve(17, data);
                    //}
                    else {
                        //手机号码添加失败
                        deferred.resolve(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });
            return deferred.promise();
        },
        /**
         * 查询进度
         * 成功无code值 只有数据
         * 失败返回错误代码和数据
         * 0是404
         */
        queryProgress : function (phoneNumber) {
            var deferred =  $.Deferred();
            var progressCount, openToast;
            //    执行查询操作
            var params = Utils.inherit(customer);
            customerService.queryProgress(params,
                function(data){
                    if(data.hasOwnProperty('codeInfo') && data.codeInfo === '0'){
                        //查询成功
                        if(data.hasOwnProperty('progressCount')){ // 查询次数
                            progressCount = data.progressCount;
                            openToast = data.openToast;

                            // 之前的逻辑
                            //if (typeof progressCount === 'string'){
                            //    switch (progressCount){
                            //        case 'yes':
                            //            //弹框 跳转
                            //            deferred.resolve(1, data);
                            //            break;
                            //        case 'no':
                            //            //不弹框 跳转
                            //            deferred.resolve(2, data);
                            //            break;
                            //    }
                            //
                            //}

                            if (typeof openToast === 'string') {
                                switch (openToast) {
                                    case 'yes':
                                        // 弹框(1,次数用完；2，多少次)
                                        if (progressCount <= 0) {
                                            // 弹框，不跳转
                                            deferred.resolve(1, data);
                                        } else {
                                            //不弹框 跳转,弹toast
                                             deferred.resolve(2, data);
                                        }
                                        break;
                                    case 'no':
                                        // //不弹框 跳转
                                        deferred.resolve(3, data);
                                        break;

                                }
                            }

                        }

                    }else{
                        deferred.reject(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });

            return deferred.promise();
        },

        /**
         * 查询客户详细信息
         */
        queryCustomerDetail:function(phonenumber){
            var deferred =  $.Deferred();
            var params = {};
            params.phonenumber = phonenumber;
            service.queryCustomerDetail(params,
                function(data){
                    console.log(JSON.stringify(data));
                    //codeInfo为0时成功
                    if(data.hasOwnProperty('customerApply') && data.customerApply && data.customerApply.codeInfo === '0'){
                        customer = data.customerApply;
                        deferred.resolve(0, data);
                    }else{
                        if(data.customerApply.codeInfo === '11'){
                            //此客户已被删除则删除本地客户
                            indexedDBDAO.deleteItem(phonenumber);
                        }
                        deferred.reject(1, data);
                    }
                },
                function(e){
                    deferred.reject(0, e);
                });

            return deferred.promise();
        },

        toState: function (msg) {
            msg = msg || '';
            window.location.href = 'state.html?phonenumber=' + phonenumber+'&msg='+msg;    //跳转
        }
    };
})();