/**
 * Created by v-qizhongfang on 2015/11/3.
 */

//客户controller
(function (FFA) {
    var Components = FFA.namespace('Components'),
        SalerCustomer = FFA.namespace('SalerCustomer'),
        salerCustomerModel = SalerCustomer.salerCustomerModel;



    var salerCustomerController = FFA.namespace('SalerCustomer.controller');


    //跳转到详情
    salerCustomerController.toDetail = function (phonenumber) {
         window.location.href = 'salerCustomerInfo.html?phonenumber=' + phonenumber;
    };

    salerCustomerController.processStateData = function (data) {
        //处理参数  只将要显示的内容保留
        var stateList = [], historyList = [], enterStr = '', i;

        var consultList = data.consultList || ''; //咨询记录 Array
        var monetizedList = data.monetizedList || [];//历史进件 Array



        //跟进情况
        //if(consultList && consultList.length > 0){

        //enterState.content = '';
        //consultList && (enterState.content = consultList);
        //for(i=0; i<consultList.length ; i++){
        //    enterState.content += '客户已于'+consultList[i].enterTime+'被'+consultList[i].enterType+'录入系统<br>';
        //}
        //stateList.push(enterState);

        //}
        if(consultList){
            var enterState = {title: "跟进情况", content:""};
            enterState.content = consultList;
            stateList.push(enterState);
        }


        //占坑情况
        stateList.push({title:"占坑状态",
            time:"",
            content:data.progressStatus});

        //历史进件
        if(monetizedList && monetizedList.length > 0){
            for(i=0; i<monetizedList.length ; i++){
                historyList.push({title:monetizedList[i].loanProductType,
                    time:monetizedList[i].intoTime,
                    content:monetizedList[i].approveStatus});
            }

        }else{
            //historyList.push({title:'历史进件',
            //    time:'',
            //    content:'该用户3个月内没有发生进件;'});
        }
        stateList = JSON.stringify(stateList);
        historyList = JSON.stringify(historyList);
        return {
            stateList: stateList,
            historyList: historyList
        }
    };

    salerCustomerController.toState = function(){
        window.location.href = 'customer/state.html?phonenumber=' + phonenumber;    //跳转
    };
    /**
     *
     * @param phonenumber
     */
    salerCustomerController.queryProgress = function (phonenumber) {
        var deferred = $.Deferred();
        if(phonenumber){

            salerCustomerModel.queryProgress(phonenumber)
                .done(function (code, data) {

                    deferred.resolve(code, data);

                })
                .fail(function (code, data) {
                    deferred.reject(code, data);

                });

        }
        return deferred.promise();

    };



    //转换排序方式
    salerCustomerController.switchSortType = function (that, event) {

        if(!that.className.match('actived')){
            $(that).addClass('actived').siblings().removeClass('actived');
            $('#pullUp').show();
            if (that.id === 'customerTabBtnLeft') {
                salerCustomerModel.byCreateTime();
            } else if (that.id === 'customerTabBtnRight') {
                salerCustomerModel.byCommtionTime();
            }
            salerCustomerModel.getPtoRObject().scrollTo(0, -40);
        }
    };

})(FFA);
