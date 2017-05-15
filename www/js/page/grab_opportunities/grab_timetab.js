/**
 * Created by apple on 16/11/4.
 */
(function (FFA){
    var QiangTimetab = FFA.namespace('QiangCustomer.timetab');
    // Customer = FFA.namespace('Customer');

    // var customerController = FFA.namespace('Customer.controller');

    //跳转到详情
    QiangTimetab.toGo = {
        timer : [],
        /**
         * 倒计时
         */
        setTime: function (system,distribute,valid,warmup,index){
            var distribute_T,
                distributeT,
                systemT,
                startT,
                endT,
                warmupT;
            distribute_T = distribute.substring(0,distribute.length-2);
            distributeT = new Date(distribute_T.replace(/-/g,'/')).getTime();  //派发时间
            systemT = new Date(system.replace(/-/g,'/')).getTime();    //系统时间
            startT = new Date(distribute_T.replace(/-/g,'/')).getTime()+warmup*60*1000;
            endT = new Date(distribute_T.replace(/-/g,'/')).getTime()+valid*60*1000+warmup*60*1000;

            warmupT = warmup*60;
            var text = ['','','抢','后结束','结束'];
            // timer = null;
            // clearInterval(timer);
            this.countDown(systemT,startT,endT,warmupT,text,index);
        },

        //各种情况下
        countDown: function (systemT,startT,endT,warmupT,text,index){
            var sDiff = '';
            sDiff = parseInt((startT - systemT)/1000);
            qiangBtn = false;
            $('button')[index].className = "btn-nodesabled";
            var _this = this;
            (function(sDiff){
                $('button')[index].innerHTML = '抢';
                if(_this.timer[index]){
                    // console.log(_this.timer[index]);
                    clearInterval(_this.timer[index]);
                }

                _this.timer[index] = setInterval(function(){
                    sDiff--;

                    if(sDiff >0){
                        if(sDiff > warmupT){
                            $('button')[index].innerHTML = _this.timeFromat(sDiff)+text[0];
                            $('button')[index].className = "btn-nodesabled ";
                        }else if(sDiff <= warmupT){
                            $('button')[index].innerHTML = _this.timeFromat(sDiff)+text[1];
                            $('button')[index].className = "btn-nodesabled";
                        }
                    } else {
                        qiangBtn = true;
                        $('button')[index].innerHTML = text[2];
                        $('button')[index].className = "btn-desabled js-qiang-btn";
                    }
                },1000);
            })(sDiff);
        },

        //计时器
        timeFromat:function (s){
            var str = '';
            var d = parseInt(s/86400);  //天
            s%=86400;
            var h = parseInt(s/3600); //小时
            s%=3600;
            var m = parseInt(s/60);   //分
            s%=60;
            if(d > 0){
                str = d+'天';
            } else
            if(h > 0 || d<0){
                str = h+'小时';
            } else
            if(m >0 || h<0){
                str = m+'分钟';
            } else
            if(s >0 || m<0){
                str = s+'S';
            }
            return str;
        },
    };

    //Q
})(FFA);
