var zy_result_cout;//展业计数结果
var zy_result_list_add = [];//展业增加到数据库中的数据
var zy_myScroll;
var updatedate_more;//加载更多用的时间戳
var zy_is_refresh = false;//是否是下拉刷新
var zy_array = new Array();

/**
 *
 * @param identifyings   值为0下拉刷新，值为1上拉加载
 * @param index_timetamp 时间戳
 * @returns {*}
 */
function zy_getParams(identifyings, index_timetamp) {
    var map = {};
    map[devUUID] = getDeviceUUID();
    map[userUUID] = localStorage.getItem(user_uuid);
    map[identifying] = identifyings;
    map[tgroup] = get("zhanye-number");//模板组别
    map[timestamp] = index_timetamp;
    return JSON.stringify(map);
}

/**
 * 模板菜单列表请求参数
 */
function zy_getParams2() {
    var map = {};
    map[devUUID] = getDeviceUUID();
    map[userUUID] = get(user_uuid);
    map[tgroup] = get("zhanye-number");//模板组别
    return JSON.stringify(map);
}

<!--不超过48小时模板文本显示新-->
function compareTime(templateupdate){
    var isExceedTime;
    var now=new Date();
    var localdate=parseInt(now.getTime());
    var red=48*60*60*1000;
    if((localdate-templateupdate)>red){//超过48小时
        isExceedTime=false;
    }else{//不到48小时
        isExceedTime=true;
    }
    return isExceedTime;
}

/**
 * 检查新数据
 */
function checkNewData(firstLoad,isContentRefresh) {
    console.log("展业列表请求参数：" + zy_getParams('0', ""));
    if(!window.zy_myScroll){
        zy_myScroll = initPullToRefresh(pullDownAction, pullUpAction, null, null ,null);
    }
    zy_myScroll.minScrollY = 0;    //最小Y轴滚动距离
    zy_myScroll.scrollTo(0, 0);     //滚动至Y轴顶端 显示出loading
    //$('#pullDown_progress').addClass('loading_progress');
    //$('.pullDownLabel_progress').html('加载中...');
    //$("#pullDownIcon").className = "loading_progress";


    $('#pullDown').addClass('loading');
    $('.pullDownLabel').html('努力加载中...');

    // 首次加载
    if (firstLoad) {

        // 只更新菜单，不更新文章
        if (!isContentRefresh) {
            //菜单列表
            var templateMenuDao = new TemplateMenuDao();
            var hasData = false;
            var tgroupid = get("zhanye-number");
            var cidArr = []; // 记录菜单
            http_post(zy_list_menu_interface, zy_getParams2(), function(data) {

                var codeInfo = data.codeInfo;

                if (codeInfo != null && 0 == codeInfo) {
                    var listArr =  data.menuData.menuList;
                    var len = listArr.length;
                    if (len > 0) {
                        hasData = true;
                        console.log("有菜单，hasData ：true");
                        // 从IndexedDB里查数据 ( 先删后插)
                        templateMenuDao.init(function(){
                            templateMenuDao.deleteData(tgroupid, data.menuData, function(result){
                                templateMenuDao.insertData(result, printTmplMenuList);
                            });
                        });
                        for (var i = 0; i < len; i++) {
                            cidArr.push(listArr[i].categoryId);
                        }

                    } else {
                        console.log('没有二级菜单！！,清空indexedDB');
                        hasData = false;
                        templateMenuDao.init(function(){
                            templateMenuDao.deleteData(tgroupid);
                        });
                    }
                    put("tempCids", cidArr.join(",")); // 存入缓存，供后续用
                } else {
                    console.log('模板菜单网络请求数据失败!');
                }

            }, function() {
                console.log('模板菜单网络请求失败!');

            });//请求葱服务



            // 从indexedDB里获取数据
            if (!hasData) {
                templateMenuDao.init(function(){
                    //console.log('数据库初始化成功');
                    templateMenuDao.queryData(tgroupid, function(result){
                        //console.log('查库');
                        if (result) printTmplMenuList(result);
                    });
                });
            }

        }


       tp.display(firstLoad);
    }else{



        // 展业列表
        http_post(zy_list_interface, zy_getParams('0', ""), zy_list_success, zy_list_fail);//请求网路服务
    }
}

/**
 * 模板菜单列表html渲染
 * @param data  模板菜单列表数据
 */
function printTmplMenuList(data) {
    data = data.menuList;

    var len = data.length;

   if (len > 0) {
       $(".template-menu-tab-outer").show();
       $("#js-menu-tab-ul").html('');

       var li = '', cls = '',
           $menu_o = $("#js-menu-tab-wrap"),
           li_width = $menu_o.width() / 5,
           header_h = $(".js-header").height(),
           $menu_outer_o = $(".template-menu-tab-outer"),
           menu_h = $menu_o.height();
       for (var i = 0; i < len; i++) {
           if( i == 0)
               cls = 'current';
           else
               cls = '';
           li += '<li class="'+cls+'" data-menu-category="'+ data[i].categoryId+'" style="width:'+li_width+'px">'+ data[i].categoryName+'</li>';


       }

       $("#js-menu-tab-ul").width(li_width*len);
       $("#js-menu-tab-ul").append(li);

       // 菜单的top值
       $menu_outer_o.css({
           top: header_h
       });

       $("#wrapper").css({
           top: header_h + menu_h
       });

       new iScroll('js-menu-tab-wrap', {
           hScrollbar:false,
           vScroll: false
       });
   }



}


/**
 *
 * @param {Object} value	要打印的数据
 * @param {String} _sortType	当前排序根据索引
 * @param {String} _sortDirection	当前排序方向
 * @param  upOrDown 值为0需要缓存，否则是上拉加载不需要缓存
 */
function printItem(value,upOrDown){
    //var ele;
    //var section1 = '<div class="yrd-one"><a id='+value["templateId"]+' class ="test_share_value" href="javascript:void(0);" ><img  src="" id='+getImgNameWithoutExtension(value["imageUrl"])+' style="width:100%;height:200px;"></a><h2 class="marAuto">';
    //var section2 = value["title"]+'</h2><p><span>转发 '+value["countretweeted"]+'</span><span style="text-align:center">阅读  '+value["countview"]+'</span><span style="text-align:right">咨询  '+value["countapply"]+'</span></p></div>';
    //var section3 = value["title"]+'</h2><p><span style="text-align:left">阅读  '+value["countview"]+'</span></p></div>';
    var isNew = '';
    var w = $(window).width();
    var imgH = w/(640/360);

    var html = '<div class="yrd-one"><a id='+value["templateId"]+' class ="test_share_value" href="javascript:void(0);" >';
    var imgId = getImgNameWithoutExtension(value["imageUrl"]), imgSrc= value["imageUrl"];
    if(upOrDown == 0){
        imgSrc = '';
      //  var section1 = '<div class="yrd-one"><a id='+value["templateId"]+' class ="test_share_value" href="javascript:void(0);" ><img  src="" id='+getImgNameWithoutExtension(value["imageUrl"])+' style="width:100%;height:200px;"></a><h2 class="marAuto">';
    }else{
       // imgSrc = value["imageUrl"];
      //  var section1 = '<div class="yrd-one"><a id='+value["templateId"]+' class ="test_share_value" href="javascript:void(0);" ><img  src='+value["imageUrl"]+' id='+getImgNameWithoutExtension(value["imageUrl"])+' style="width:100%;height:200px;"></a><h2 class="marAuto">';
    }

    html += '<img  src="'+imgSrc+'" id='+imgId+' >';

    var p = '<p><span style="text-align:left">阅读  '+value["countview"]+'</span></p>';
    if(value.tgroupId=="010"||value.tgroupId=="011"||value.tgroupId=="033"|| value.forwardFlag=='2'){
        if(compareTime(value.lastUptDate)) {
            isNew = '<span class="isNew">[新]</span>';
          //  ele = section1+isNew+section3;
        }else{
          //  ele = section1+section3;
        }
   //     p = '<p><span>转发 '+value["countretweeted"]+'</span><span style="text-align:center">阅读  '+value["countview"]+'</span><span style="text-align:right">咨询  '+value["countapply"]+'</span></p>';

    }else{
        if(compareTime(value.lastUptDate)) {
            isNew = '<span class="isNew">[新]</span>';
         //   ele = section1+isNew+section2;
        }else{
         //   ele = section1+section2;
        }
        p = '<p><span>转发 '+value["countretweeted"]+'</span><span style="text-align:center">阅读  '+value["countview"]+'</span><span style="text-align:right">咨询  '+value["countapply"]+'</span></p>';

    }
    html +=  '<h2 class="marAuto">'+isNew + value["title"]+'</h2><span class="category-flag">'+ value["categoryName"] +'</span> </a>'+ p +'</div>';
    $(".yrd-content").append(html);


    if(upOrDown == 0){//下拉需要做缓存
        localFile(getImgName(value["imageUrl"]), value["imageUrl"], getImgNameWithoutExtension(value["imageUrl"]),false);
    }

    $("#"+imgId).height(imgH);
 //   $('#isNew').val();

    //zy_myScroll.refresh();
}

/**
 * 下一页
 */
function nextPage() {
    var _tmpTimestamp = sessionStorage.getItem("zy_list_timestamp");

    //var stime = get('pullRefreshStartTime');
    //var delay = 0;

    http_post(zy_list_interface, zy_getParams('1', _tmpTimestamp), function(data){

        //   console.log("展业加载更多返回数据："+ JSON.stringify(data));
        sessionStorage.setItem("zy_list_timestamp",data.timestamp);
        var zy_more_list = data.newList;
        for(var i=0;i<zy_more_list.length;i++){

            // 防止重复数据
            var isRender = true;
            for (var n = 0, l =  zy_array.length; n < l; n++) {
                if (zy_array[n].templateId == zy_more_list[i].templateId){
                    isRender = false;
                }
            }

            if (isRender) {
                zy_array.push(zy_more_list[i]);
                printItem(zy_more_list[i],1);
            }


        }
        // 上拉加载， 更新
        zy_myScroll.refresh();
      //  iscrollRefresh(zy_myScroll, stime, delay);

        if(zy_more_list.length < 5){
            $('#pullUp').hide();
        }


        //if ((((new Date()).getTime()) - stime) < refreshDelay ) delay = refreshDelay;
        //setTimeout(function(){ zy_myScroll.refresh(); },delay);

    },function(xhr, e){
        //if ((((new Date()).getTime()) - stime) < refreshDelay ) delay = refreshDelay;
        //setTimeout(function(){ zy_myScroll.refresh(); },delay);

        zy_myScroll.refresh();

       // iscrollRefresh(zy_myScroll, stime, delay);
        console.log("展业加载更多失败：");
    });//请求网路服务
}

/**
 * 无数据，显示敬请期待
 */
function zy_wait(){
    document.getElementById("yrd-content").innerHTML = '<div class="temp_no_content" style="text-align: center;margin-top: 20px;">敬请期待</div>';
}

/**
 * 展业列表菜单
 */

