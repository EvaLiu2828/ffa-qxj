/**
 * Created by v-qizhongfang on 2015/10/13.
 */
/**
 * Created by v-qizhongfang on 2015/9/1.
 */
/***************************************input***********************************************/

(function (FFA) {
    var Components = FFA.namespace('Components');

    Components.emptiableInput = {
        wrapper: $('.js-emptiableinput-wrapper'),

        _inputHandler: function (evt) {
            evt = evt || window.event;
            var target = evt.target,
                parent = target.parentNode;

            if ($(target).val()) {
                $(parent).removeClass('empty');
            } else {
                $(parent).addClass('empty');
            }
        },

        empty: function (evt) {
            evt = evt || window.event;
            var target = evt.target,
                parent = target.parentNode,
                input = target.previousElementSibling;

            $(parent).addClass('empty');
            $(input).val('');
            setTimeout(function () {
                $(input).focus()
            }, 0);
        },

        //传入清空回调
        init: function (wrapper) {
            if (wrapper && typeof wrapper !== "function") this.wrapper = wrapper;
            var i,wrapper,input;

            if (!this.wrapper) {
                return;
            }
            //初始状态
            for (i = 0; i < this.wrapper.length; i++) {
                wrapper = this.wrapper.eq(i);
                input = $("input", wrapper);
                if (input.val()) {
                    wrapper.removeClass('empty');
                }


            }

            //输入事件处理
            this.wrapper.on('input', 'input', function (evt) {
                this._inputHandler(evt);
            }.bind(this));

            //获取焦点
            this.wrapper.on('focus', 'input', function (evt) {
                this._inputHandler(evt);
            }.bind(this));

            //change事件
            this.wrapper.on('change', 'input', function (evt) {
                this._inputHandler(evt);
            }.bind(this));

            //点击事件处理
            this.wrapper.on('click', 'span', function (evt) {
                this.empty(evt);
            }.bind(this));

            var _self = this;
            setTimeout(function(){
                $("input", _self.wrapper.eq(0)).trigger("focus");
            },200);
        }

    };
})(FFA);

$(function () {
    var Components = FFA.namespace('Components');
    Components.emptiableInput.init();
});


/***************************************button***********************************************/