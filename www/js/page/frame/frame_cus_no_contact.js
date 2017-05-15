/**
 * Created by 201504095248 on 2015/9/10.
 */
(function(FFA, $) {

    var Customer = FFA.namespace('Customer');
    var indexedDBDAO = indexedDBDAOFactory(indexedDB_config);  //dao对象
    var indexName = 'by_nocontact';   //索引

    function getNum(){
        $.when(indexedDBDAO.getCount(indexName))
            .done(function(amount){
                if(amount == 0){
                    $("#customer-remind-circle").css('display', 'none');
                    console.log("无未沟通客户");
                }else if(amount <= 9 && amount > 0) {
                    $("#customer-remind-circle").css('display', 'block');
                    $("#js-customer-remind-num").show().text(amount);
                    console.log("未沟通人数9");
                }else{
                    $("#customer-remind-circle").css('display', 'block');
                    $("#js-customer-remind-num").show().text("9+").css("font-size",0.45 + 'rem');
                    console.log("未沟通人数＞9");
                }
            })
            .fail()
            .always();
    }

    Customer.getNoContactNum = function(){
            $.when(indexedDBDAO.init())
                .done(function(){
                    getNum();
                })
                .fail(function(error){
                    console.log('getCustomerNum fail' + error);
                }
            );
    };


    console.log("计算未联系客户数量");

})(FFA, Zepto);