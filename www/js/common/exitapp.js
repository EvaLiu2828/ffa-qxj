var exitappObj = {
    // Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },

    // app-infomation Event Handler 
    onBackKeyDown : function(){
            /* if($.mobile.activePage.is('#frame')){
                console.log("onBackKeyDown-----> " + "exitApp");
                navigator.app.exitApp();
            }
            else {
                console.log("onBackKeyDown-----> " + "go to last page");
                navigator.app.backHistory();
            } */
            if($(document.body).hasClass("searching")) {
                document.getElementsByClassName('js-footer')[0].style.display = 'block';
                $('body').removeClass('searching');
                $('#searchInput').val('');
                $('.js-rm-del').removeClass("delete");
                $('#search-container').html('');
            }else {
                navigator.app.clearHistory();
                navigator.app.clearCache();
                navigator.app.exitApp();
            }
    }
};

exitappObj.initialize();
