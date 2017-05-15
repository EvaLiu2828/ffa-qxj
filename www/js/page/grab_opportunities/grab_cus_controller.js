/**
 * Created by v-yuxinliu  on 16/10/31.
 */
/** 抢商机客户controller*/

(function (FFA){
    var QiangCustomerController = FFA.namespace('QiangCustomer.controller');

    //跳转到详情
    QiangCustomerController.toDetail = function (nicheId) {
        console.log(nicheId);
        window.location.href = './grab_cus_Info.html?nicheId=' + nicheId;
    };
})(FFA);

