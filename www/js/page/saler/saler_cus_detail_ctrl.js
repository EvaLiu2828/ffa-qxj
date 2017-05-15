/**
 * Created by v-qizhongfang on 2015/7/21.
 */
var salerCustomerDetailController = (function (){

    var SalerCustomer = FFA.namespace("SalerCustomer");
    var Utils = FFA.namespace("Utils");



    var service = salerCustomerService,
        indexedDBDAO,
        customer;

    //获取并保存本地数据 用于请求取参
    var daoFactory = indexedDBDAOFactory(indexedDB_config.DBName, indexedDB_config.verStorageName, indexedDB_config.salerCustomerStorage);
    $.when(daoFactory)
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
         * 查询客户详细信息
         */
        queryCustomerDetail:function(phonenumber,managerId){
            var deferred =  $.Deferred();
            var params = {};
            params.phonenumber = phonenumber;
            params.managerId = managerId;
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
        }
    };
})();