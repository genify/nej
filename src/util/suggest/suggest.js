/*
 * ------------------------------------------
 * 建议提示控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/suggest/suggest */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'util/event',
    'util/helper/select'
],function(NEJ,_k,_e,_t0,_t1,_p,_o,_f,_r){
    var _pro;
    /**
     * 建议提示控件
     *
     * 样式举例
     * ```css
     * .box{position:relative;width:100px;}
     * .xuanzhong{background:pink;}
     * #suggest-input{height:24px;line-height:24px;}
     * #card0{position:absolute;top:40px;left:0;width:100%;height:auto;background:#ccc;}
     * ```
     * 
     * 结构举例
     * ```html
     * <div class="box" tabindex="10005">
     *   <input id="suggest-input" type="text" />
     *   <div id="suggest-list"></div>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/suggest/suggest'
     * ],function(_t){
     *     var _suggest = _t._$$Suggest._$allocate({
     *         input:'suggest-input',
     *         body:'suggest-list',
     *         selected:'xuanzhong',
     *         onchange:function(_value){
     *             var _arr = [];
     *             for(var i = 1; i < 10;i++){
     *                 // 选项中设置data-value来触发选项变化时自动同步到输入框中
     *                 // 默认选中第一项，只需在第一项加选中样式即可
     *                 _arr.push('<p '+(i==1?'xuanzhong':'')+' data-value="'+i+'">'+i+'</p>');
     *             }
     *             // 输入框改变，改变select的列表内容
     *             this._$update(_arr.join(''));
     *         },
     *         onselect:function(_value){
     *             // 选择一个值的回调
     *         }
     *     });
     * });
     * ```
     * @class    module:util/suggest/suggest._$$Suggest
     * @extends  module:util/event._$$EventTarget
     * @param    {Object}      config   - 可选配置参数
     * @property {Node|String} input    - 输入框
     * @property {Node|String} body     - 提示卡片节点
     * @property {String}      clazz    - 可选节点样式标识，默认为所有子节点
     * @property {String}      selected - 提示项选中样式，默认为js-selected
     */
    /** 
     * 输入内容变化触发事件
     * @event  module:util/suggest/suggest._$$Suggest#onchange
     * @param  {String} event - 输入框去前后空格后的内容
     */
    /** 
     * 选中建议项触发事件
     * @event  module:util/suggest/suggest._$$Suggest#onselect
     * @param  {String} event - 节点的data-value值，没有则取节点的value
     */
    _p._$$Suggest = _k._$klass();
    _pro = _p._$$Suggest._$extend(_t0._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/suggest/suggest._$$Suggest#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__sopt = {
            loopable:!0,
            onselect:this.__onSelect._$bind(this),
            onchange:this.__onSelectionChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/suggest/suggest._$$Suggest#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        // init node
        this.__input = _e._$get(_options.input);
        this.__sopt.clazz = _options.clazz;
        this.__sopt.parent = _e._$get(_options.body);
        this.__sopt.selected = _options.selected||'js-selected';
        // init event
        this.__doInitDomEvent([[
            this.__input,'input',
            this.__onInput._$bind(this)
        ],[
            this.__input,'focus',
            this.__onInput._$bind(this)
        ],[
            this.__input,'blur',
            this.__onBlur._$bind(this)
        ]]);
        // init helper
        this._$visibile(!1);
        this.__helper = _t1._$$SelectHelper._$allocate(this.__sopt);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/suggest/suggest._$$Suggest#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        if (!!this.__helper){
            this.__helper._$recycle();
            delete this.__helper;
        }
        delete this.__xxx;
        delete this.__input;
        delete this.__sopt.parent;
    };
    /**
     * 输入框失去焦点事件
     * @return {Void}
     */
    _pro.__onBlur = function(){
        this.__onSelect({
            target:this.__helper._$getSelectedNode()
        });
    };
    /**
     * 输入内容变化触发事件
     * 
     * @protected
     * @method module:util/suggest/suggest._$$Suggest#__onInput
     * @return {Void}
     */
    _pro.__onInput = function(){
        var _value = this.__input.value.trim();
        if (!_value){
            this._$visibile(!1);
        }else if(!this.__xxx){
            this._$dispatchEvent('onchange',_value);
        }
    };
    /**
     * 更新输入框内容
     *
     * @protected
     * @method module:util/suggest/suggest._$$Suggest#__doUpdateValue
     * @param  {Object} arg0 - 值信息
     * @return {Void} 
     */
    _pro.__doUpdateValue = function(_value){
        // lock onchange for input value setting
        if (!!this.__xxx){
            return;
        }
        this.__xxx = !0;
        if (!!_value&&_value!=this.__input.value){
            this.__input.value = _value;
        }
        this.__xxx = !1;
    };
    /**
     * 建议项选中事件
     *
     * @protected
     * @method module:util/suggest/suggest._$$Suggest#__onSelect
     * @param  {Object} arg0 - 事件信息
     * @return {Void} 
     */
    _pro.__onSelect = function(_event){
        var _value = _e._$dataset(_event.target,'value')||'';
        this.__doUpdateValue(_value);
        _value = _value||this.__input.value;
        this._$update('');
        this._$dispatchEvent('onselect',_value);
    };
    /**
     * 建议卡片选择变化事件
     * 
     * @protected
     * @method module:util/suggest/suggest._$$Suggest#__onSelectionChange
     * @param  {Object} Object 事件信息
     * @return {Void}
     */
    _pro.__onSelectionChange = function(_event){
        this.__doUpdateValue(
            _e._$dataset(_event.target,'value')||''
        );
    };
    /**
     * 设置列表，用于切换列表选择卡片是否可见，不建议使用
     * 
     * 脚本举例
     * ```javascript
     * // _list是节点列表
     * _suggest._$setList(_list);
     * ```
     *
     * @deprecated 
     * @method module:util/suggest/suggest._$$Suggest#_$setList
     * @see    module:util/suggest/suggest._$$Suggest#_$visibile
     * @param  {Array} arg0 - 建议项节点列表
     * @return {Void}
     */
    _pro._$setList = function(_list){
        this._$visibile(!!_list&&_list.length>0);
    };
    /**
     * 更新建议列表的可见性
     * 
     * 脚本举例
     * ```javascript
     * // 设置选择列表可见
     * _suggest._$visibile(true);
     * // 设置选择列表不可见
     * _suggest._$visibile(false);
     * ```
     *
     * @method module:util/suggest/suggest._$$Suggest#_$visibile
     * @param  {Boolean} arg0 - 是否可见
     * @return {Void}
     */
    _pro._$visibile = function(_visible){
        var _visible = !_visible?'hidden':'visible';
        this.__sopt.parent.style.visibility = _visible;
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
     * _suggest._$update(_arr.join(''));
     * ```
     * 
     * @method module:util/suggest/suggest._$$Suggest#_$update
     * @param  {String} arg0 - 列表HTML代码
     * @return {Void}
     */
    _pro._$update = function(_html){
        this.__sopt.parent.innerHTML = _html||'&nbsp;';
        this._$visibile(!!_html);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
