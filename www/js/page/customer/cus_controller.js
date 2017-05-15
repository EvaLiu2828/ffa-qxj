/**
 * Created by v-qizhongfang on 2015/11/3.
 */

//客户controller
(function (FFA) {
    var Components = FFA.namespace('Components'),
        Customer = FFA.namespace('Customer'),
        customerModel = Customer.customerModel,
        searchModel = Customer.searchModel;



    var confirm = null,
        alert = null;
    var customerController = FFA.namespace('Customer.controller');

    //进入搜索
    customerController.willSearch = function () {
        var footer = document.getElementsByClassName('js-footer')[0];
        if (footer)  footer.style.display = 'none';
        setTimeout(function () {
            $('body').addClass('searching');
        }, 0);
    };

    //取消搜索
    customerController.cancelSearch = function () {
        var footer = document.getElementsByClassName('js-footer')[0];
        if (footer)  footer.style.display = 'block';
      //  document.getElementsByClassName('js-footer')[0].style.display = 'block';
        $('body').removeClass('searching');
        $('#searchInput').val('');
        $('.js-rm-del').removeClass("delete");
        $('#search-container').html('');
    };

    //跳转到详情
    customerController.toDetail = function (phonenumber) {
        var cusCount = get("team-customer-count") || '';
        if (cusCount != '') {
            window.location.href = '../customer/customerInfo.html?phonenumber=' + phonenumber;
        } else {
            window.location.href = 'customer/customerInfo.html?phonenumber=' + phonenumber;
        }
    };


    customerController.processStateData = function (data) {
        //处理参数  只将要显示的内容保留
        var stateList = [], historyList = [];

       // var consultList = data.consultList || ''; //咨询记录 Array
        var consultList = data.consultList || []; //咨询记录 Array
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
        //if(consultList){
        //    var enterState = {title: "跟进情况", content:""};
        //    enterState.content = consultList;
        //    stateList.push(enterState);
        //}


        //占坑情况
        //stateList.push({title:"占坑状态",
        //    time:"",
        //    content:data.progressStatus});



        // 历史查询
        if ( typeof consultList  === 'string') {
            consultList = consultList.split("</br>");
        }
        var consultListLength = consultList.length;
        if (consultList && consultList.length > 0) {

            for ( var i = 0; i < consultListLength; i++) {
                stateList.push({content:consultList[i]});
            }
        }


        //历史进件
        if(monetizedList && monetizedList.length > 0){
            for(var i=0; i<monetizedList.length ; i++){
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

    customerController.toState = function(){
        window.location.href = 'customer/state.html?phonenumber=' + phonenumber;    //跳转
    };
    /**
     *
     * @param phonenumber
     */
    customerController.queryProgress = function (phonenumber) {
        var deferred = $.Deferred();
        if(phonenumber){

            customerModel.queryProgress(phonenumber)
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
    customerController.switchSortType = function (that, event) {

        if(!that.className.match('actived')){
            $(that).addClass('actived').siblings().removeClass('actived');
            $('#pullUp').show();
            if (that.id === 'customerTabBtnLeft') {
                customerModel.byCreateTime();
            } else if (that.id === 'customerTabBtnRight') {
                customerModel.byCommtionTime();
            }
            customerModel.getPtoRObject().scrollTo(0, -40);
        }

    };


    customerController.search = {

        //搜索
        handleSearch: (function () {

            var lastSearchTime = 0;
            return function (event) {
                if (event.timeStamp - lastSearchTime < 50) {
                    return;
                }
                lastSearchTime = event.timeStamp;

                var keyword = event.target.value;
                //调用搜索方法
                searchModel.search(keyword);

            };

        })(),


        //搜索翻页
        handleNextPage: function (that, event) {
            var pos = that.scrollTop + that.clientHeight,
                scrollHeight = that.scrollHeight;

            this._nextPage(pos, scrollHeight);
        },

        _nextPage: function (pos, scrollHeight) {

            if (pos > scrollHeight - 100) {
                searchModel.nextPage();
            }
        }
    };

    customerController.call = {
        handleCall: function (that, event) {
            var contacter = $(that).parents('.contacter'),
                toCallName = contacter.data('name') && contacter.data('name').toString(),
                toCallUpNum = contacter.data('phonenumber') && contacter.data('phonenumber').toString();

            this.telImg = $(that);

            event.preventDefault();
            event.stopPropagation();
            if (typeof toCallUpNum === 'string' && toCallUpNum !== '') {
                this._callCustomer(toCallName, toCallUpNum);
            }

        },
        //拨打电话
        _callCustomer: function (toCallName, toCallUpNum) {

            confirm = Components.Popup.Confirm('A', {
                content: '拨打电话给' + toCallName + '?',  //显示内容
                withMask: 'A', //蒙层类型
                leftButton: '取消',
                rightButton: '确认'
            }, function () {
                console.log('左按钮回调');
            }, function () {
                $.when(customerModel.saveCommunictionTime(toCallUpNum))
                    .done(function () {
                     //   if (get(user_level_flag) == customer_level_falg) {
                            this._updateState();
                     //   }
                    }.bind(this))
                    .fail(function(code,error){

                    })
                    .always(function(){

                    });
                window.location.href = 'tel:' + toCallUpNum;
            }.bind(this));

        },
        //更新用户状态
        _updateState: function () {
            var dot = this.telImg.hasClass('dot');
            if (dot) {
                //TODO 加延时之后才显示正确
                setTimeout(function () {
                    if (get(user_level_flag) == customer_level_falg) {
                        FFA.Customer.getNoContactNum(); //保存
                    }
                    this.telImg.removeClass('dot');
                }.bind(this), 500);
            }
        }
    };

    customerController.sms = {

        //短信
        handleSms: function(that, event){
            var contacter = $(that).parents('.contacter');
            var toSmsName = contacter.data('name') && contacter.data('name').toString();
            var toSmsNum = contacter.data('phonenumber') && contacter.data('phonenumber').toString();

            this.smsImg = $(that);

            event.preventDefault();
            event.stopPropagation();

            if(typeof toSmsName === 'string' && toSmsName !== ''){
                this.sendSms(toSmsName, toSmsNum);
            }
        },
        //发送短信
        sendSms: function (toSmsName, toSmsNum) {

            if (get(user_level_flag) == customer_level_falg) {
                window.location.href = 'customer/smsTemp.html?toSmsName='+toSmsName+'&toSmsNum='+toSmsNum;
            } else {
                window.location.href = '../customer/smsTemp.html?toSmsName='+toSmsName+'&toSmsNum='+toSmsNum;
            }

        }
    };

})(FFA);
