var toBackgroundTime = 0;

function setToBackgroundTime(time) {
    toBackgroundTime = time;
    console.log("setToBackgroundTime-----> " + toBackgroundTime);
}

var getToBackgroundTime=function(){
    console.log("getToBackgroundTime-----> " + toBackgroundTime);
    return toBackgroundTime;
}

var pauseObj = {
    // Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("pause", this.onPause, false);
    },

    onPause: function() {
        //记录下从前台切换到后台的时间
        setToBackgroundTime(new Date().getTime());
        navigator.app.clearCache();
    }

};
pauseObj.initialize();
