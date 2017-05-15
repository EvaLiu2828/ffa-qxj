/**
 * Created by Administrator on 2015/10/9.
 */
(function (FFA) {
    //popup命名空间 存放所有弹出框对象
    var noRead = FFA.namespace('NoReadFrame');
    noRead.readLocalDataUpload=function( ){
        var frameNoReadTempleteDao = FFA.namespace('frame_no_read_templete_dao');
        var leftBracket="[";
        var rightBracket="]";
        var jsonData=""+leftBracket;
        frameNoReadTempleteDao.init(function(){
            frameNoReadTempleteDao.query(function(value){
                    if(value){
                      var valueOpt={
                          "tgroupId": value.tgroupId,
                          "createDate": value.createDate,
                          "flag": value.flag
                      }
                      var valueOptJson=JSON.stringify(valueOpt);
                        if(jsonData!=null&&jsonData.length>1){
                            valueOptJson=","+valueOptJson;
                        }
                       jsonData=jsonData+valueOptJson;
                    }else{
                        jsonData=jsonData+rightBracket;
                       // alert("value_null")
                        noRead.uploadFrameData(jsonData);
                    }
            });
        });
        console.log("jsondata"+jsonData);
    }

    noRead.uploadFrameData=function(templeteStr){
        console.log(templeteStr);
        var noReadTemplete = FFA.namespace('callback.http.frame_no_read_templete_callback');
        var hashMap = new HashMap();
        hashMap.put(devUUID,getDeviceUUID());
        hashMap.put(userUUID,get(user_uuid));
        hashMap.put(templateOptReqList,templeteStr);
        console.log(getJsonStr(hashMap));
        http_post(frame_un_read_templete,getJsonStr(hashMap),noReadTemplete.success,noReadTemplete.fail);
    }

})(FFA);