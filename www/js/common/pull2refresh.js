/**
 * 初始化iScroll
 * @param pullDownAction	//下拉刷新
 * @param pullUpAction		//上拉加载
 * @param pullDownEle		//刷新动画节点
 * @param pullUpEle			//加载动画节点
 * @param container		//容器ID
 * @returns {*|iScroll}
 */
function initPullToRefresh(pullDownAction, pullUpAction, pullDownEle, pullUpEle ,container){

	var  myScroll, pullDownEl, pullDownOffset, pullUpEl,pullUpOffset, containerID;
		pullDownEl = pullDownEle || document.getElementById('pullDown');
		pullDownOffset = pullDownEl.offsetHeight;
		pullUpEl = pullUpEle || document.getElementById('pullUp');
		if (pullUpEl) pullUpOffset = pullUpEl.offsetHeight;
		containerID = container || "wrapper";
		myScroll = new iScroll(containerID, {
			vScrollbar:false,
			/* 重要样式 */
			//useTransition: false,
			/* 此属性不知用意，本人从true改为false */
			topOffset: pullDownOffset,
			//checkDOMChanges: true,
			onRefresh: function() {
                //console.log('aaaaaaaaaaaaaaaaa');
				if (pullDownEl.className.match('loading')) {
					pullDownEl.className = '';
                    updatePersonIcon(false,true);
					// pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉即可刷新';
				} else if (pullUpEl && pullUpEl.className.match('loading')) {
					pullUpEl.className = '';
                    updatePersonIcon(false,false);
					// pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉即可刷新';
				}
			},
			onScrollMove: function() {
                //console.log('bbbbbbbbbbbbbbbbbb');
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    //console.log('bbbbbbbbbbbbbbbbbb111111');
                    pullDownEl.className = 'flip';
                    updatePersonIcon(false,true);
                    // pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放即可刷新';
					this.minScrollY = 0;
				} else if (this.y < 5 && pullDownEl.className.match('flip')) {
                    //console.log('bbbbbbbbbbbbbbbbbb2222');
                    pullDownEl.className = '';
                    updatePersonIcon(false,true);
                    // pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉即可刷新';
					this.minScrollY = -pullDownOffset;
				} else if (this.y < (this.maxScrollY - 5) && (pullUpEl && !pullUpEl.className.match('flip'))) {
					pullUpEl.className = 'flip';
                    updatePersonIcon(false,false);
					// pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放即可刷新';
					this.maxScrollY = this.maxScrollY;
				} else if (this.y > (this.maxScrollY + 5) && (pullUpEl &&pullUpEl.className.match('flip'))) {
					pullUpEl.className = '';
                    updatePersonIcon(false,false);
					// pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉即可刷新';
					this.maxScrollY = pullUpOffset;
				}
			},
			onScrollEnd: function() {
                console.log('pullUpEl.className'+pullUpEl.className);
                if (pullDownEl.className.match('flip')) {
					pullDownEl.className = 'loading';
                    updatePersonIcon(true,true);
                    // pullDownEl.querySelector('.pullDownLabel').innerHTML = '努力加载中...';
					pullDownAction(); // Execute custom function (ajax call?)

				} else if (pullUpEl && pullUpEl.className.match('flip')) {
					pullUpEl.className = 'loading';
                    updatePersonIcon(true,false);
					// pullUpEl.querySelector('.pullUpLabel').innerHTML = '努力加载中...';
					pullUpAction(); // Execute custom function (ajax call?)
				}
			}
            //-----------1.5版本添加

            //-----------1.5版本添加
			//使用阴影效果需要这个东东控制一下
			//onBeforeScrollStart: function (e) {
			//	var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase() : ( e.target ? e.target.nodeName.toLowerCase() : '' );
			//	if( nodeType != 'select'&& nodeType != 'option' && nodeType != 'input' && nodeType != 'textarea' && nodeType != 'li' && nodeType != 'span' )  e.preventDefault();
			//}
		});
     function updatePersonIcon(isUpdateIcon ,isTop) {
         if(isTop){
             if(isUpdateIcon){
                 pullDownEl.querySelector('.pullDownIcon').className='pullDownIcon small-person-icon-gif';//设置loading为替换图片
             }else{
                 pullDownEl.querySelector('.pullDownIcon').className='pullDownIcon';//设置loading为替换图片
             }
         }else{
             if(isUpdateIcon){
                 pullUpEl.querySelector('.pullUpIcon').className='pullUpIcon small-person-icon-gif';//设置loading为替换图片
             }else{
                 pullUpEl.querySelector('.pullUpIcon').className='pullUpIcon';//设置loading为替换图片
             }
         }
    }
	return myScroll;
};