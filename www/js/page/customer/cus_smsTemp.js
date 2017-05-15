/**
 * Created by 201507270184 on 2016/5/12.
 */

;(function (FFA) {

    //页面跳转太快时会触发下一个页面相同位置上的点击事件
    /*var lastClickTime = new Date().getTime();
    var clickTime;
    document.addEventListener('click', function (e) {
        clickTime = e['timeStamp'];
        if (clickTime && (clickTime - lastClickTime) < 500) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
        //lastClickTime = clickTime;
    }, true);*/

    // 命名空间引入
    var Components = FFA.namespace('Components'),
        Utils = FFA.namespace('Utils'),
        UI = FFA.namespace("UI");
    var alert;

    //左滑标识，0表示没有左滑，1表示左滑了
    var flag = 0;
    //var clickFlag=0;


    // 获取url参数
    var toSmsName = Utils.urlArgs()['toSmsName'],
        toSmsNum = Utils.urlArgs()['toSmsNum'];


    //TODO数据库操作,实例化
    var smsTmpDao = new SmsTmpDao();


    //iScroll初始化
    var smsPullToRefresh = initPullToRefresh(function () {
        //console.log("下拉刷新");
    }, function () {
        //console.log("上拉加载");
    }, null, null, 'sms-wrapper');


    /**
     * 返回逻辑
     */
    var backFun = function(){
        var title = $('.js-header-title'),
            leftBtn = $('.js-back'),
            rightBtn = $('.js-new-btn');
        if(($('.js-has-temp').hasClass('smsDisplayBlock'))||($('.js-no-temp').hasClass('smsDisplayBlock'))) {
           // window.location.href = '../frame.html';
            history.back();
        }else if(($('.js-new-temp').hasClass('smsDisplayBlock'))||($('.js-edit-temp').hasClass('smsDisplayBlock'))){
            $('.js-textarea').val('短信模板限制300字').css('color','#c3c3d1');
            leftBtn.addClass('icon-left-arrow').css({'left':'0','font-size':'1rem'}).text('');
            title.text('短信模板');
            rightBtn.text('新建');

            if(cordova.plugins.Keyboard.isVisible){
                cordova.plugins.Keyboard.close();
            }

            smsTmpDao.init(function(){
                smsTmpDao.queryAllData(function(result){
                    if ((result!=null)&&(result.length!=0)) {
                        $('.js-has-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');
                        //使用模板插入数据
                        var data = result;
                        var smsInfoContainer = $('#smsInfoContainer');
                        var smsInfoTemplate = _.template($('#smsTemplate').html(), {variable: 'data'});
                        var smsInfoBuffer = '';//数据缓存字符串，避免单条打印影响渲染速度
                        smsInfoBuffer += smsInfoTemplate(data);
                        smsInfoContainer.html(smsInfoBuffer);

                        renderSmsInfoItem($(".item"));

                        setTimeout(function(){
                            smsPullToRefresh.refresh();
                        },0);
                    } else {
                        $('.js-no-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');
                    }

                });
            });

        }
    };

    // 短信模板ItemRender
    var renderSmsInfoItem = function(itemObjs) {
        itemObjs.each(function(i){
            // 控制按钮垂直居中
            var h = $(".js-touch-item", $(this)).height();
            $(".js-item-btn", $(this)).css({
                height: h+"px",
                lineHeight: h+"px"
            });

            // 绑定左滑事件

            var id = $(".js-touch-item", $(this)).attr("id");

            //创建一个新的hammer对象并且在初始化时指定要处理的dom元素
            var hammertime = new Hammer(document.getElementById(id));
            //为该dom元素指定触屏滑动事件 （左滑）
            hammertime.on("swipeleft", function (e) {
                //控制台输出
                //console.log("左滑");
                var x = e.deltaX, y = e.deltaY;
                if((x < -35)){
                    $(e.target).parent().animate({left:"-120px"},200);
                    flag = 1;
                    //clickFlag=1;
                }

            });

            var that = $(this);
            //为该dom元素指定触屏滑动事件 （右滑）
            hammertime.on("swiperight", function (e) {
                //console.log("右滑");
                var left = parseInt($(".js-touch-item", that).css("left")) || 0;
                //console.log("left="+left);
                if (left < 0 && Math.abs(left) == 120) {
                    // 左滑了，做处理
                    var x = e.deltaX;
                    if (x > 35){
                        $(e.target).parent().animate({left:0},200);
                    }
                }

            });
        });
    };

    /**
     * 点击header右侧按钮逻辑
     */
    var rBtnFun=function(){
        var title = $('.js-header-title'),
            leftBtn = $('.js-back'),
            rightBtn = $('.js-new-btn');
        if(($('.js-has-temp').hasClass('smsDisplayBlock'))||($('.js-no-temp').hasClass('smsDisplayBlock'))) {
            leftBtn.removeClass('icon-left-arrow').css({'left':'12px','font-size':'0.75rem'}).text('取消');
            title.text('新建模板');
            rightBtn.text('保存');
            $('.js-new-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');

        }
        else if($('.js-new-temp').hasClass('smsDisplayBlock')){
            $('.js-touch-item').css('left','0');
            var newTemp=$('.js-textarea').val();
            //console.log(newTemp);
            if((newTemp=='短信模板限制300字')||(newTemp=='')){
                //console.log('请输入新短信模板');
                $('.js-textarea').blur();
                setTimeout(function(){
                    alert = Components.Popup.Alert('A', {
                        content:'请输入新的短信模板',
                        button:'确定',
                        withMask: 'A'   //蒙层类型
                    });
                },0);

            }
            else{

                if(cordova.plugins.Keyboard.isVisible){
                    cordova.plugins.Keyboard.close();
                }

                leftBtn.addClass('icon-left-arrow').css({'left':'0','font-size':'1rem'}).text('');
                title.text('短信模板');
                rightBtn.text('新建');

                $('.js-has-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');

                //将新的短信模板保存到indexDB
                smsTmpDao.init(function(){
                    smsTmpDao.getLastId(function(id){
                        // 设置id
                        id = id || 0;
                        var insertTemp = {content:newTemp,id: ++id};

                        smsTmpDao.insertData(insertTemp, function(data){

                            //将新的短信模板放在最上面
                            var _tempArr = [],_tempObj = {};
                            _tempObj.value = data.content;
                            _tempObj.key = data.id;
                            _tempArr.push(_tempObj);
                            data = _tempArr;

                            var smsInfoContainer = $('#smsInfoContainer');
                            var smsInfoTemplate = _.template($('#smsTemplate').html(), {variable: 'data'});
                            var smsInfoBuffer = '';//数据缓存字符串，避免单条打印影响渲染速度
                            smsInfoBuffer += smsInfoTemplate(data);
                            smsInfoContainer.prepend(smsInfoBuffer);


                            renderSmsInfoItem($(".item"));

                            setTimeout(function(){
                                smsPullToRefresh.refresh();
                            },0);


                        });
                    });
                });

                $('.js-textarea').val('短信模板限制300字').css('color','#c3c3d1');

            }
        }
        else if($('.js-edit-temp').hasClass('smsDisplayBlock')){

            if(cordova.plugins.Keyboard.isVisible){
                cordova.plugins.Keyboard.close();
            }

            //更新数据库
            var editTextarea = $('.js-edit-temp .js-textarea');
            var key = Number(editTextarea.data('k').substr(4));
            var newContent = editTextarea.val();


            leftBtn.addClass('icon-left-arrow').css({'left':'0','font-size':'1rem'}).text('');
            title.text('短信模板');
            rightBtn.text('新建');

            $('.js-has-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');



            smsTmpDao.init(function(){
                var updateTemp = {content:newContent,id:key};
                smsTmpDao.updateData(key,updateTemp,function(data){
                    //updateTemp    render page
                    var touchItem = $('#sms-'+key+' .touch-item');
                    touchItem.children('p').text(data.content);
                    renderSmsInfoItem($(".item"));

                    setTimeout(function(){
                        smsPullToRefresh.refresh();
                    },0);

                });
            });
        }
    };


    // dom加载完成准备工作
    $(function(){

        //设置短信模板内容高度
        //$('#smsInfoContainer').height(UI.pageHeight-UI.headerHeight-46);

        //header取消按钮
        $('.js-back').on('click',backFun);

        //header保存按钮
        $('.js-new-btn').on('click',rBtnFun);

        //touchItem左滑后自动恢复
        $('#sms-wrapper').on('touchstart',function(){
           if(flag == 1){
               $('.js-touch-item').animate({left:"0"},200);
               flag = 0;

           }
        });



        var smsTempContent = $(".js-has-temp");

        smsTempContent.on('click','.js-touch-item',function(e){
           // $('.js-touch-item').removeClass('active');
            $(this).addClass('active');
            var that = $(this);
            setTimeout(function(){
                that.removeClass('active');
            }, 300);

            //点击短信模板发送短信
            Utils.stopEvent(event);
            confirm = Components.Popup.Confirm('A', {
                content: '发送短信给' + toSmsName + '?',  //显示内容
                withMask: 'A', //蒙层类型
                leftButton: '取消',
                rightButton: '确认'
            }, function () {
                console.log('左按钮回调');
            }, function () {
                var smsCon=$(this).children('p').text();
                setTimeout(function(){
                    //window.location.href = 'sms:' + toSmsNum+'?body='+smsCon;
                    window.location.href = FFA.os.ios?('sms:' + toSmsNum+'&body='+smsCon):('sms:' + toSmsNum+'?body='+smsCon);
                },0);

            }.bind(this));
        });

        //点击删除按钮删除模板
        $('.js-item-del-btn').live('click',function(e){
            e.preventDefault();
            var touchItem=$(this).siblings('.touch-item');
            touchItem.css('left','0');
            //弹出浮层
            $('.js-popup-mask').show();
            //弹出删除和取消按钮
            $('.del-btn').show();
            //点击取消按钮，恢复前一个状态
            $('.js-not-del-temp').on('click',function(e){
                $('.del-btn').hide();
                $('.js-popup-mask').hide();
            });
            //点击删除按钮
            $('.js-del-temp-btn').on('click',function(e){
                var key=Number((touchItem.parent().attr('id')).substr(4));
                touchItem.parent().remove();
                $('.del-btn').hide();
                $('.js-popup-mask').hide();
                //从IndexDB中删除模板
                smsTmpDao.init(function(){
                    smsTmpDao.deleteData(key,function(){

                    });

                    var itemCount = $('#smsInfoContainer').children().length;
                    //console.log('count='+itemCount);
                    if(itemCount == 0){
                        $('.js-no-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');
                    }

                    setTimeout(function(){
                        smsPullToRefresh.refresh();
                    },0);

                });
            });
        });

        var allTextarea = $('.js-textarea');
        //短信模板输入框点击时清空
        allTextarea.on('click',function(e){
            if($(this).val()=='短信模板限制300字'){
                $(this).val('');
                $(this).css('color','#2d2d2d');
            }
        });
        //短信模板输入框字数限制
        allTextarea.on('input',function(){
            var MAX_LENGTH = 300;
            var content = $(this).val().trim();
            var length = content.length;

            //截取字符串
            if(length >= MAX_LENGTH){
                content = content.substr(0, MAX_LENGTH);
            }
            $(this).val(content);
        });



        //点击编辑按钮编辑模板
        $('.js-item-edit-btn').live('click',function(e){
            e.preventDefault();
            var backBtn = $('.js-back');
            var rightBtn = $('.js-new-btn');
            var headerTitle = $('.js-header-title');
            backBtn.removeClass('icon-left-arrow').css({'left':'12px','font-size':'0.75rem'}).text('取消');
            headerTitle.text('编辑模板');
            rightBtn.text('保存');

            $('.js-edit-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');
            var touchItem = $(this).siblings('.touch-item');
            var tempCon = touchItem.children('p').text();
            var key = 'sms-'+(touchItem.parent().attr('id')).substr(4);
            var editTextarea = $('.js-edit-temp .js-textarea');
            editTextarea.data('k',key);
            editTextarea.val(tempCon).css('color','#2d2d2d').focus();
            //左滑模板位置复原
            touchItem.css('left','0');

        });


        //自定义短信按钮
        $('.js-custom-sms').on('click',function(e){
            $('.js-touch-item').css('left','0');
            confirm = Components.Popup.Confirm('A', {
                content: '发送短信给' + toSmsName + '?',  //显示内容
                withMask: 'A', //蒙层类型
                leftButton: '取消',
                rightButton: '确认'
            }, function () {
                console.log('左按钮回调');
            }, function () {
                window.location.href = 'sms:' + toSmsNum;
            }.bind(this));
        });


        // 页面初始化短信列表数据获取
        smsTmpDao.init(function(){
            smsTmpDao.queryAllData(function(result){
                if ((result!=null)&&(result.length!=0)) {
                    $('.js-has-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');
                    //使用模板插入数据
                    var data = result;
                    var smsInfoContainer = $('#smsInfoContainer');
                    var smsInfoTemplate = _.template($('#smsTemplate').html(), {variable: 'data'});
                    var smsInfoBuffer = '';//数据缓存字符串，避免单条打印影响渲染速度
                    smsInfoBuffer += smsInfoTemplate(data);
                    smsInfoContainer.html(smsInfoBuffer);
                    renderSmsInfoItem($(".item"));
                    setTimeout(function(){
                        smsPullToRefresh.refresh();
                    },0);

                } else {
                    $('.js-no-temp').addClass('smsDisplayBlock').siblings().removeClass('smsDisplayBlock');
                }

            });
        });




    });
})(FFA);