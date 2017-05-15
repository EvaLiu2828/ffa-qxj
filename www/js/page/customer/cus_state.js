/**
 * Created by v-qizhongfang on 2015/9/14.
 */


;(function(){
    //loading
    var Components = FFA.namespace('Components'),
        loading = null;
    $(document).on("ajaxStart ", function(){
        loading = Components.Popup.Loading('A',{})
    });
    $(document).on("ajaxComplete ", function(){
        loading.remove();
    });
}());



;(function(){
    //滑动页面
    var Utils = FFA.namespace('Utils');
    var tabBtns = $(".js-tab-btn");
    var swipe = Swipe(document.getElementById('swipe-container'),{
        bounce:false,
        continuous:false,

        callback: function(index, elem) {
            tabBtns.toggleClass("actived");
        }

    });

    tabBtns.on('tap', function (event) {
        var event = event || window.event;
        Utils.stopEvent(event);
        if(swipe.getPos() !== $(this).index())
            swipe.next();


    });
}());


(function () {

    var Utils = FFA.namespace('Utils'),
        Components = FFA.namespace('Components'),
        Customer = FFA.namespace('Customer');


    var msg = Utils.urlArgs()['msg'];
    if (msg) {
         Components.Popup.Toast('B', {
            content: msg,
            duration: 3000,
            width: 200
        });

        //setTimeout(function(){
        //    loading.remove();
        //}, 3000);
    }


    //var customerModel =  FFA.namespace('Customer.customerModel');
    //var customerController = FFA.namespace('Customer.controller');


    //var phonenumber = Utils.urlArgs()['phonenumber'];
    //if (!phonenumber) {
    //    alert = Components.Popup.Alert('A', {
    //        content: "电话号码获取失败",  //显示内容
    //        withMask: 'A'   //蒙层类型
    //    });
    //    return false;
    //}

    //内容容器
    var containers = $(".swipe-innerBox");
    var stateContainer = containers.eq(0);
    var historyContainer = containers.eq(1);


    var stateTpl = _.template(document.getElementById('stateTpl').innerHTML, {variable: 'list'});
    var consultListStateTpl = _.template(document.getElementById('consultListStateTpl').innerHTML, {variable: 'list'});


    //获取内容
    var stateList = sessionStorage.getItem("stateList") || [];      // 历史查询
    var historyList = sessionStorage.getItem("historyList") || [];  // 历史进件
    stateList = JSON.parse(stateList);
    historyList = JSON.parse(historyList);


    if($.trim(consultListStateTpl(stateList))){
        stateContainer.html(consultListStateTpl(stateList));
    }
    if($.trim(stateTpl(historyList))){
        historyContainer.html(stateTpl(historyList));
    }


    //var indexedDBDAO = customerModel.getIndexedDBDAO();

    //indexedDBDAO.on("inited", function () {
    //    customerController.queryProgress(phonenumber)
    //        .done(function (data) {
    //            var consultList, //咨询记录 Array
    //                monetizedList,//历史进件 Array
    //                i;
    //
    //            if(data){
    //
    //                consultList = data.consultList || []; //咨询记录 Array
    //                monetizedList = data.monetizedList || [];//历史进件 Array
    //
    //                //占坑情况
    //                stateList.push({title:"占坑状态",
    //                    time:"",
    //                    content:data.progressStatus});
    //                //跟进情况
    //                if(consultList && consultList.length > 0){
    //                    for(i=0; i<consultList.length ; i++){
    //                        stateList.push({title:consultList[i].enterType,
    //                            time:consultList[i].compno,
    //                            content:consultList[i].enterTime});
    //                    }
    //
    //                }else {
    //                    stateList.push({title:"跟进情况",
    //                        time:"",
    //                        content:"近期无记录，请尽快跟进!"});
    //                }
    //                //历史进件
    //                if(monetizedList && monetizedList.length > 0){
    //                    for(i=0; i<monetizedList.length ; i++){
    //                        historyList.push({title:monetizedList[i].loanProductType,
    //                            time:monetizedList[i].intoTime,
    //                            content:monetizedList[i].approveStatus});
    //                    }
    //
    //                }

                    //var stateList = sessionStorage.getItem("stateList") || [];
                    //var historyList = sessionStorage.getItem("historyList") || [];
                    //
                    //stateList = JSON.parse(stateList);
                    //historyList = JSON.parse(historyList);
                    //
                    //stateContainer.html(stateTpl(stateList));
                    //historyContainer.html(stateTpl(historyList));
    //            }
    //
    //        })
    //        .fail();
    //});


    //customerModel.init("page-customer-state");


})();