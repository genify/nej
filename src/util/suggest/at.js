/*
 * ------------------------------------------
 * @提示控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/suggest/at */
NEJ.define([
    'base/klass',
    'base/element',
    'base/event',
    'util/event',
    'util/helper/select',
    'util/cursor/cursor'
],function(_k,_e,_v,_t,_t0,_t1,_p,_o,_f,_r,_pro){
    /**
     * AT提示控件
     * 
     * 样式举例
     * ```css
     *  textarea{width:300px;height:200px;margin:0;padding:0;}
     *  .tbox{position:relative;}
     *  .tip{position:absolute;background:#fff;border:1px solid #aaa;}
     *  .tip .it{height:20px;line-height:20px;}
     *  .tip .it.js-selected{background:#1257F9;}
     * ```
     * 
     * 结构举例
     * ```html
     * <div class="tbox" tabindex="10005">
     *   <textarea id="efg"></textarea>
     *   <div class="tip" id="hij"></div>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     *  NEJ.define([
     *      'util/suggest/at'
     *  ],function(_t){
     *      _t._$$At._$allocate({
     *          input:'efg',
     *          tip:'hij',
     *          onatchange:function(_event){
     *              var _arr = [];
     *              for(var i=9,v;i>=0;i--){
     *                  v = _event.value+'-'+i;
     *                  _arr.push('<div class="it" data-value="'+v+'">'+v+'</div>');
     *              }
     *              this._$update(_arr.join(''));
     *          }
     *      });
     *  });
     * ```
     * 
     * @class    module:util/suggest/at._$$At
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object}        config   - 可选配置参数
     * @property {Node|String}   input    - 输入节点
     * @property {Node|String}   tip      - 提示列表节点
     * @property {String|RegExp} keychar  - 触发提示的关键字符，默认为'@'
     * @property {String}        selected - 提示选中样式
     */
    _p._$$At = _k._$klass();
    _pro = _p._$$At._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/suggest/at._$$At#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__sopt = {
            loopable:!0,
            onselect:this.__onSelect._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/suggest/at._$$At#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__keyword = _options.keychar||'@';
        this.__input = _e._$get(_options.input);
        this.__sopt.parent = _e._$get(_options.tip);
        this.__sopt.selected = _options.selected||'js-selected';
        // init event
        this.__doInitDomEvent([[
            this.__input,'input',
            this.__onInput._$bind(this)
        ],[
            this.__input,'keydown',
            this.__onKeyCheck._$bind(this)
        ],[
            this.__input,'mouseup',
            this.__onInput._$bind(this)
        ]]);
        // init helper
        this._$visibile(!1);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/suggest/at._$$At#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        if (!!this.__helper){
            this.__helper._$recycle();
            delete this.__helper;
        }
        delete this.__input;
        delete this.__sopt.parent;
    };
    /**
     * 更新提示控件位置
     * @return {Void}
     */
    _pro.__doUpdateTipPosition = function(){
        var _pos = _t1._$coordinate(this.__input);
        _e._$style(
            this.__sopt.parent,{
                top:_pos.top+_pos.height+'px',
                left:_pos.left+'px'
            }
        );
    };
    /**
     * 输入变化事件
     * 
     * @protected
     * @method module:util/suggest/at._$$At#__onInput
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onInput = (function(){
        var _reg0 = /[\s\b]/;
        return function(_event){
            var _pos = _t1._$cursor(this.__input),
                _value = this.__input.value,
                _arr = [];
            for(var i=_pos.start,c;i>=0;i--){
                c = _value.charAt(i);
                if (_reg0.test(c)){
                    break;
                }
                _arr.unshift(c);
                if (c===this.__keyword){
                    break;
                }
            }
            // not find keyword
            if (_arr[0]!=this.__keyword){
                this._$update();
                return;
            }
            // with keyword
            _arr.shift();
            this.__doUpdateTipPosition();
            this._$dispatchEvent('onatchange',{
                keyword:this.__keyword,
                value:_arr.join('')
            });
        };
    })();
    /**
     * 提示选中事件
     * 
     * @protected
     * @method module:util/suggest/at._$$At#__onSelect
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onSelect = function(_event){
        var _value = _e._$dataset(_event.target,'value');
        if (!!_value){
            _value += ' ';
            var _pos = _t1._$cursor(this.__input),
                _str = this.__input.value,
                _start = _pos.start;
            for(;_start>=0;_start--){
                if (_str.charAt(_start)==this.__keyword){
                    break;
                }
            }
            this.__input.value = _str.substr(0,_start+1)+
                                 _value+_str.substr(_pos.end);
            _t1._$cursor(this.__input,{
                start:_start+_value.length+1
            });
        }
        this._$update();
    };
    /**
     * ESC键取消选择
     * 
     * @protected
     * @method module:util/suggest/at._$$At#__onKeyCheck
     * @param  {Event} 事件对象@return {Void}
     */
    _pro.__onKeyCheck = function(_event){
        if (_event.keyCode==27){
            _v._$stop(_event);
            this._$update();
        }
    };
    /**
     * 更新建议列表的可见性
     * 
     * 脚本举例
     * ```javascript
     * // 设置选择列表可见
     * _at._$visibile(true);
     * // 设置选择列表不可见
     * _at._$visibile(false);
     * ```
     *
     * @method module:util/suggest/at._$$At#_$visibile
     * @param  {Boolean} arg0 - 是否可见
     * @return {Void}
     */
    _pro._$visibile = function(_visible){
        _e._$setStyle(
            this.__sopt.parent,'visibility',
            !_visible ? 'hidden' : 'visible'
        );
        // reset select helper
        if (!_visible&&!!this.__helper){
            this.__helper = this.__helper._$recycle();
        }
        if(!!_visible&&!this.__helper){
            this.__helper = _t0._$$SelectHelper._$allocate(this.__sopt);
        }
    };
    /**
     * 更新可选列表
     * 
     * 脚本举例
     * ```javascript
     * // 更新选择列表内容
     * var _arr = [];
     * for(var i=0;i<10;i++){
     *     _arr.push('<div>'+i+'</div>');
     * }
     * _at._$update(_arr.join(''));
     * ```
     * 
     * @method module:util/suggest/at._$$At#_$update
     * @param  {String} arg0 - 列表HTML代码
     * @return {Void}
     */
    _pro._$update = function(_html){
        this.__sopt.parent.innerHTML = _html||'&nbsp;';
        this._$visibile(!!_html);
    };

    return _p;
});
