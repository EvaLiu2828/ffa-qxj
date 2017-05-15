/**
 * 弹出框
 * zepto版本
 */
//remove Polyfill
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };
}

    //TODO 整合到Components.Popup
var popup = {
    showQrcode: function (cb) {

        var mask = $('.js-popup-mask'),
            qrcodePop = $('.js-popup-qrcode');

        mask.removeClass('ndis');
        qrcodePop.removeClass('ndis');

        if (typeof cb === 'function') {
            cb();
        }

        mask.one('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.hideQrcode();
        }.bind(this))
    },

    hideQrcode: function () {
        var mask = $('.js-popup-mask'),
            qrcodePop = $('.js-popup-qrcode');

        mask.addClass('ndis');
        qrcodePop.addClass('ndis');
    }
};
/**
 * popup对象放入此js
 *
 * 所有popup对象均使用单例模式
 *
 */

(function (FFA) {


    //popup命名空间 存放所有弹出框对象
    var Popup = FFA.namespace('Components.Popup');

    //单例桥接
    var singleton = function (fn) {
        var result;
        return function () {
            if (result) {
                //如果实例已经存在则调用实例add方法，并将参数传入
                result.add(arguments);
                return result;
            } else {
                //如果实例不存在，则调用构造方法返回实例
                return result = fn.apply(this, arguments)
            }
        }
    };

    /**
     * @description Mash构造
     * @param {String} type 类型  a-z
     * @return {Object} result mask 对象
     */

    Popup.Mask = singleton(function (type) {
        var mask = document.createElement('div');
        mask.className = type ? "com-popup-mask-" + type.toLowerCase() : 'com-popup-mask-a';
        document.body.appendChild(mask);
        return {
            mask: mask,
            name: "mask",
            type: type,
            display: true,
            remove: function () {
                this.mask.remove();
                this.display = !this.display;
            },
            add: function (arguments) {
                this.mask.className = arguments[0] ? "com-popup-mask-" + arguments[0].toLowerCase() : "com-popup-mask-a";
                document.body.appendChild(mask);
                this.display = !this.display;
            }

        }
    });

    /**
     * @author qizhong
     * @constructor Loading
     * @description Loading构造
     * @example Parent('a',{withMask:'a'});
     * @since version 0.1
     * @param {String} type 类型  a-z
     * @return {Object} result loading 对象
     */
    Popup.Loading = singleton(function (type, options) {
        var loading = document.createElement('div'),
            imageBox = document.createElement('div'),
            contentWrapper =  document.createElement('div'),
            content = document.createElement('p');

        var return_obj = {
            loading: loading,
            name: "loading",
            type: type,
            display: true
        };
        content.innerHTML = '';
        if (options) {
            options.content && (content.innerHTML = options.content);

            if (options.withMask && typeof options.withMask === 'string') {
                var mask = this.Mask(options.withMask);
                return_obj.withMask = options.withMask;
                return_obj.mask = mask;
            }

            if (options.width) {
                return_obj.width = options.width;
            }
        }

        return_obj.content = content;

        loading.className = type ? "com-popup-loading-" + type.toLowerCase() : 'com-popup-loading-a';
        if (return_obj.width) {
            loading.style.width = return_obj.width+"px";
            loading.style.marginLeft = -(return_obj.width / 2) +"px";
        }

        if (content.innerHTML != ''){
            loading.appendChild(imageBox);
            contentWrapper.appendChild(content);
            loading.appendChild(contentWrapper);
        }

        document.body.appendChild(loading);

        return_obj.remove = function() {
            if (mask) mask.remove();
            loading.remove();
        };
        return_obj.add = function (arguments) {
            if (arguments[0]) {
                this.loading.className = "com-popup-loading-" + arguments[0].toLowerCase();
            }else if (arguments[0] && arguments[1]) {
                if (arguments[1]['content']) {
                    this.content.innerHTML = arguments[1]['content'];
                }
            }
            if (mask) mask.add(arguments[1]['withMask']);

            document.body.appendChild(loading);
        };

        console.log(return_obj);

        return return_obj;



    });

    /**
     *
     */
    Popup.Alert = singleton(function (type, options, callback) {

        var outerbox = document.createElement('div'),
            contentWrapper =  document.createElement('div'),
            content = document.createElement('p'),
            button = document.createElement('button'),
            mask;
        outerbox.className = type ? "com-popup-alert-" + type.toLowerCase() : 'com-popup-alert-a';
        content.innerHTML = options.content || "请添加内容";
        button.textContent = options.button || "确认";

        if (options.withMask && typeof options.withMask === 'string') {
            mask = this.Mask(options.withMask);
        }

        button.addEventListener('click', function () {
            if (mask) {
                mask.remove();
            }
            outerbox.remove();
        }, false);

        if (typeof callback === 'function') {
            button.onclick = callback;
        }

        contentWrapper.appendChild(content);
        outerbox.appendChild(contentWrapper);
        outerbox.appendChild(button);
        document.body.appendChild(outerbox);
        return {
            alert: outerbox,
            name: "alert",
            type: type,
            outerbox: outerbox,
            content: content,
            button: button,
            withMask: (options && options.withMask),
            mask: mask,
            remove: function () {
                if (mask) {
                    mask.remove();
                }
                outerbox.remove();
            },
            add: function (arguments) {


                if (arguments) {
                    //如果传入了新类型 则修改
                    if (arguments[0]) {
                        this.outerbox.className = "com-popup-alert-" + arguments[0].toLowerCase();
                    }

                    //如果传入新参数 则修改
                    if (arguments[1]) {
                        if (arguments[1]['content']) {
                            this.content.innerHTML = arguments[1]['content'];
                        }
                        if (arguments[1]['button']) {
                            this.button.textContent = arguments[1]['button'];
                        }
                    }

                    if (arguments[2] && typeof arguments[2] === 'function') {
                        this.button.onclick = arguments[2];
                    }
                    //this.withMask =  arguments[1]['withMask'];
                    if (mask) {
                        mask.add(arguments[1]['withMask']);
                    }
                }
                document.body.appendChild(outerbox);
            }
        }
    });


    Popup.Confirm = singleton(function (type, options, leftButtonCb, rightButtonCb) {
        var outerbox = document.createElement('div'),
            contentWrapper =  document.createElement('div'),
            content = document.createElement('p'),
            leftButton = document.createElement('button'),  //左按钮
            rightButton = document.createElement('button'), //右按钮
            mask;

        outerbox.className = type ? "com-popup-confirm-" + type.toLowerCase() : "com-popup-confirm-a";
        content.innerHTML = options.content || "请添加内容";
        leftButton.textContent = options.leftButton || "取消";
        rightButton.textContent = options.rightButton || "确认";

        if (options.withMask && typeof options.withMask === 'string') {
            mask = this.Mask(options.withMask);
        }

        leftButton.addEventListener('click', function () {
            if (mask) {
                mask.remove();
            }
            outerbox.remove();
        }, false);
        rightButton.addEventListener('click', function () {
            if (mask) {
                mask.remove();
            }
            outerbox.remove();
        }, false);


        if (typeof leftButtonCb === 'function') {
            leftButton.onclick = leftButtonCb;
        }

        if (typeof rightButtonCb === 'function') {
            rightButton.onclick = rightButtonCb;
        }
        contentWrapper.appendChild(content);
        outerbox.appendChild(contentWrapper);
        outerbox.appendChild(leftButton);
        outerbox.appendChild(rightButton);

        document.body.appendChild(outerbox);

        return {
            confirm: outerbox,
            name: "confirm",
            type: type,
            outerbox: outerbox,
            content: content,
            leftButton: leftButton,
            rightButton: rightButton,
            withMask: options.withMask,
            mask: mask,
            remove: function () {
                if (mask) {
                    mask.remove();
                }
                outerbox.remove();
            },
            add: function (arguments) {

                if (arguments) {
                    //如果传入了新类型 则修改
                    if (arguments[0]) {
                        this.outerbox.className = "com-popup-confirm-" + arguments[0].toLowerCase();
                    }

                    //如果传入新参数 则修改
                    if (arguments[1]) {
                        if (arguments[1]['content']) {
                            this.content.innerHTML = arguments[1]['content'];
                        }
                        if (arguments[1]['leftButton']) {
                            this.leftButton.textContent = arguments[1]['leftButton'];
                        }
                        if (arguments[1]['rightButton']) {
                            this.rightButton.textContent = arguments[1]['rightButton'];
                        }
                    }

                    if (arguments[2] && typeof arguments[2] === 'function') {
                        this.leftButton.onclick = arguments[2];
                    }

                    if (arguments[3] && typeof arguments[3] === 'function') {
                        this.rightButton.onclick = arguments[3];
                    }

                    //this.withMask =  arguments[1]['withMask'];
                    if (mask) {
                        mask.add(arguments[1]['withMask']);
                    }
                }
                document.body.appendChild(outerbox);
            }
        }
    });

    Popup.Toast = singleton(function(type, options, callback){
        if (!options) return;
        var outerbox = document.createElement('div'),
            content = document.createElement('p');

        outerbox.className = type ? "com-popup-toast-" + type.toLowerCase() : "com-popup-toast-a";
        if (options.width) {
            outerbox.style.width = options.width+"px";
            outerbox.style.marginLeft = -(options.width / 2) +"px";
        }

        content.innerHTML = options.content || '';
        outerbox.appendChild(content);
        var duration = isNaN(options.duration) ? 3000 : options.duration;

    //    m.style.cssText = "font:0.7rem  微软雅黑; width:60%; min-width:50px; background:#000; opacity:0.5; height:40px; color:#fff; line-height:40px; text-align:center; border-radius:5px; position:fixed; bottom:20px; left:20%; z-index:999999;";
        document.body.appendChild(outerbox);
        setTimeout(function() {
            var d = 0.5;
            outerbox.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            outerbox.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(outerbox);
            }, d * 1000);

            callback && callback();
        }, duration);
    });
})(FFA);