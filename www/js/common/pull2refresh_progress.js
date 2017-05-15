(function(){
	//var pullDownEl, pullDownOffset,
	//		pullUpEl, pullUpOffset,
	//		generatedCount = 0;

		/**
		 * 初始化iScroll控件
		 */
		 initP2R_progress = function(pullDownAction, pullUpAction, pullDownEle, pullUpEle, container) {
			var pullDownEl = document.getElementById(pullDownEle);
			var pullDownOffset = pullDownEl.offsetHeight;
			var pullUpEl = document.getElementById(pullUpEle);
			var pullUpOffset = pullUpEl.offsetHeight;

			myScroll = new iScroll(container, {
				vScrollbar:false,
				/* 重要样式 */
				useTransition: false,
				/* 此属性不知用意，本人从true改为false */
				topOffset: pullDownOffset,
				onRefresh: function() {
					if (pullDownEl.className.match('loading_progress')) {
						pullDownEl.className = '';
                        updatePersonIcon(false,true);
						// pullDownEl.querySelector('.pullDownLabel_progress').innerHTML = '下拉即可刷新';
					} else if (pullUpEl.className.match('loading_progress')) {
						pullUpEl.className = '';
                        updatePersonIcon(false,false);
                        // pullUpEl.querySelector('.pullUpLabel_progress').innerHTML = '上拉即可刷新';
					}
				},
				onScrollMove: function() {
					if (this.y > 3 && !pullDownEl.className.match('flip')) {
						pullDownEl.className = 'flip';
                        updatePersonIcon(false,true);
						// pullDownEl.querySelector('.pullDownLabel_progress').innerHTML = '释放即可刷新';
						this.minScrollY = 0;
					} else if (this.y < 3 && pullDownEl.className.match('flip')) {
						pullDownEl.className = '';
                        updatePersonIcon(false,true);
						// pullDownEl.querySelector('.pullDownLabel_progress').innerHTML = '下拉即可刷新';
						this.minScrollY = -pullDownOffset;
					} else if (this.y < (this.maxScrollY - 3) && !pullUpEl.className.match('flip')) {
						pullUpEl.className = 'flip';
                        updatePersonIcon(false,false);

                        // pullUpEl.querySelector('.pullUpLabel_progress').innerHTML = '释放即可刷新.';
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 3) && pullUpEl.className.match('flip')) {
						pullUpEl.className = '';
                        updatePersonIcon(false,false);
                        // pullUpEl.querySelector('.pullUpLabel_progress').innerHTML = '上拉即可刷新.';
						this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd: function() {
					if (pullDownEl.className.match('flip')) {
						pullDownEl.className = 'loading_progress';
                        updatePersonIcon(true,true);
                        // pullDownEl.querySelector('.pullDownLabel_progress').innerHTML = '努力加载中...';
						pullDownAction(); // Execute custom function (ajax call?)
					} else if (pullUpEl.className.match('flip')) {
						pullUpEl.className = 'loading_progress';
                        updatePersonIcon(true,false);
                        // pullUpEl.querySelector('.pullUpLabel_progress').innerHTML = '努力加载中...';
						pullUpAction(); // Execute custom function (ajax call?)
					}
				}
			});
             function updatePersonIcon(isUpdateIcon ,isTop) {
                 if(isTop){
                     if(isUpdateIcon){
                         pullDownEl.querySelector('.pullDownIcon_progress').className='pullDownIcon_progress small-person-icon';//设置loading为替换图片
                     }else{
                         pullDownEl.querySelector('.pullDownIcon_progress').className='pullDownIcon_progress';//设置loading为替换图片
                     }
                 }else{
                     if(isUpdateIcon){
                         pullUpEl.querySelector('.pullUpIcon_progress').className='pullUpIcon_progress small-person-icon';//设置loading为替换图片
                     }else{
                         pullUpEl.querySelector('.pullUpIcon_progress').className='pullUpIcon_progress';//设置loading为替换图片
                     }
                 }
             }
			setTimeout(function() {
				document.getElementById(container).style.left = '0';
			}, 800);

			return myScroll;
		}
})(window, document);