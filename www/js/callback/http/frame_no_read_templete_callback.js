/**
 * Created by Administrator on 2015/10/9.
 */
(function (FFA) {
    //popup命名空间 存放所有弹出框对象
    var noReadTemplete = FFA.namespace('callback.http.frame_no_read_templete_callback');
    noReadTemplete.success= function (data) {
      //  alert("success"+JSON.stringify(data));
        var frameNoReadTempleteDao = FFA.namespace('frame_no_read_templete_dao');
        if(data.codeInfo==0){
            frameNoReadTempleteDao.init(function(){
                frameNoReadTempleteDao.insert(data.tempOptResList,function(obj){
                    var redId="js-read-circle-"+obj.tgroupId;//通过拼接获取红点的id用来显示
                    if(obj.flag==1){
                        $("."+redId).show();
                    }else{
                        $("."+redId).hide();
                    }
                });//插入数据
            });
        }

    }
    noReadTemplete.fail=function(){

    }
})(FFA);