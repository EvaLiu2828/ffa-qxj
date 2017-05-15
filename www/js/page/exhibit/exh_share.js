// JavaScript Document
/**微信分享的接口*/
var Share = function () {
    this.wxShare = function (shareType, share_url, share_title, share_thumnail) {
        this.hideShareDialog();
        var webpageUrl = this.removeFlag(share_url);// shareItem.url;//get("webpageUrl");
        var title = share_title;///shareItem.title;//get("title");
        var description = share_title;//shareItem.title;// get("description");
        var mediaTagName = share_title;//shareItem.title;//get("mediaTagName");
        var thumb = share_thumnail;//shareItem.thumbnailUlr;//get("thumb");
        Wechat.share({
            message: {
                title: title,
                description: description,
                mediaTagName: mediaTagName,
                thumb: thumb,
                media: {
                    type: Wechat.Type.WEBPAGE,   // webpage
                    webpageUrl: webpageUrl   // webpage
                }
            },
            scene: shareType   // share to Timeline
        }, function () {
            console.log("success");
        }, function (reason) {
            console.log("fail");
        });
    };
    /**转发计数的接口*/
    this.statistics = function (share_type, shareItem) {
        //hideShareDialog();
        console.log("shareItem.templateId" + shareItem.templateId);
        /**
         * 模板id_xxx，是为区分不同组的模板
         * 转发计数时，需要截掉模板id后面的_xxx
         */
        var tid = shareItem.templateId.split('_')[0];

        $.ajax({
            url: statistics_interface,
            type: 'get',
            data: {
                type: share_type,
                salerid: get(user_uuid),

                templateid: tid
            },
            success: function (result, status) {
                console.log("success");
            }
        });
    };
    this.shareToQQ = function (share_url, share_title, share_thumnail) {
        this.hideShareDialog();
        var args = {};
        args.url = this.removeFlag(share_url);
        args.title = share_title;
        args.description = share_title;
        args.imageUrl = share_thumnail;
        args.appName = "指尖金融家";
        YCQQ.shareToQQ(function () {
            //alert("share success");
        }, function (failReason) {
            //alert(failReason);
        }, args);
    };
    this.shareToQzone = function (share_url, share_title, share_thumnail) {
        this.hideShareDialog();
        var args = {};
        args.url = this.removeFlag(share_url);
        args.title = share_title;
        args.description = share_title;
        var imgs = [share_thumnail,
            share_thumnail,
            share_thumnail];
        args.imageUrl = imgs;
        YCQQ.shareToQzone(function () {
            //alert("share success");
        }, function (failReason) {
            //alert(failReason);
        }, args);
    };
    this.shareToWeibo = function (share_url, share_title, share_thumnail) {
        console.log("share to sina weiBo");
        this.hideShareDialog();
        var imgUrl = https_url+weibo_share_icon;
        var params = {};
        params.url = this.removeFlag(share_url);
        params.title = share_title;
        params.description = share_title;
        params.imageUrl = imgUrl;
        params.defaultText = "";
		YCWeibo.ssoLogin(function(args){
			YCWeibo.shareToWeibo(function () {
	            //alert("share success");
	        }, function (failReason) {
	            //alert(failReason);
	        }, params);
		},function(){			
		});
    };

    this.hideShareDialog = function () {
        $(".share-alt").removeClass("show");
    };
    this.removeFlag = function (shareUrl) {
        var url = shareUrl.replace(/&flag=1/g, "");
        console.log(url);
        return url;
    }
}; 


