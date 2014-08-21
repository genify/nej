/*
 * ------------------------------------------
 * 建议提示控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/suggest/suggest */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/base',
    'util/suggest/suggest',
    'util/template/tpl'
],function(NEJ,_k,_e,_u,_i,_t0,_t1,_p,_o,_f,_r){
    var _seed_css,
        _seed_item,
        _pro;
    /**
     * 提示建议控件
     *
     * 页面结构举例
     * ```html
     * <input type='text' id='suggest-input' />
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/element',
     *     'ui/suggest/suggest',
     * ],function(_e,_i0,_p,_o,_f,_r){
     *     var _input = _e._$get('suggest-input');
     *     // 输入框内容变化回调
     *     var _onchage = function(_value){
     *         // 根据输入框的值，获取需要展示的列表，返回给控件展示
     *         _suggest._$setList(['1','2','3','4']);
     *     };
     *     // 选择某一项的回调
     *     var _onselect = function(_value){
     *         // 返回选中的值
     *     };
     *     // 生成下拉列表实例
     *     var _suggest = _i0._$$Suggest._$allocate({
     *         input:_input,
     *         onchange:_onchage._$bind(this),
     *         onselect:_onselect._$bind(this)
     *     });
     * });
     * ```
     *
     * @class     module:ui/suggest/suggest._$$Suggest
     * @uses      module:util/suggest/suggest._$$Suggest
     * @extends   module:ui/base._$$Abstract
     * @param     {Object}      arg0   - 可选配置参数
     * @property  {Node|String} input - 输入框节点或者ID
     */
    /**
     * 选中触发事件
     *
     * @event  module:ui/suggest/suggest._$$Suggest#onselect
     * @param  {String} arg0 -   选中值
     */
    /**
     * 输入内容变化触发事件
     *
     * @event  module:ui/suggest/suggest._$$Suggest#onchange
     * @param  {String} arg0 -   输入内容
     *
     */
    _p._$$Suggest = _k._$klass();
    _pro = _p._$$Suggest._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/suggest/suggest._$$Suggest#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__sopt = {
            onchange:this.__onChange._$bind(this)
           ,onselect:this.__onSelect._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/suggest/suggest._$$Suggest#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__sopt.input = _e._$get(_options.input);
        this.__sopt.input.insertAdjacentElement('afterEnd',this.__body);
        this.__suggest = _t0._$$Suggest._$allocate(this.__sopt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/suggest/suggest._$$Suggest#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__suggest){
            this.__suggest._$recycle();
            delete this.__suggest;
        }
        this.__super();
        delete this.__sopt.input;
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/suggest/suggest._$$Suggest#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/suggest/suggest._$$Suggest#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__sopt.body = this.__body;
    };
    /**
     * 输入内容变化触发事件
     *
     * @protected
     * @method module:ui/suggest/suggest._$$Suggest#__onChange
     * @param  {String} arg0 - 输入内容
     * @return {Void}
     */
    _pro.__onChange = function(_value){
        this._$dispatchEvent('onchange',_value);
    };
    /**
     * 选中建议项触发事件
     *
     * @protected
     * @method module:ui/suggest/suggest._$$Suggest#__onSelect
     * @param  {String} arg0 - 选中值
     * @return {Void}
     */
    _pro.__onSelect = function(_value,_options){
        this._$dispatchEvent('onselect',_value,_options);
    };
    /**
     * 设置建议列表
     *
     * 脚本举例
     * ```javascript
     * // 设置下拉列表的值
     * _suggest._$setList(['1','2','3','4']);
     * ```
     *
     * @method module:ui/suggest/suggest._$$Suggest#_$setList
     * @param  {String|Array} _html  - 列表html代码或者数据列表
     * @param  {String}       _clazz - 列表项标识样式
     * @return {Void}
     */
    _pro._$setList = function(_html,_clazz){
        if (_u._$isArray(_html))
            _html = _t1._$getHtmlTemplate(
                    _seed_item,{xlist:_html});
        this.__body.innerHTML = _html||'';
        this.__suggest._$setList(!_clazz
            ? _e._$getChildren(this.__body)
            : _e._$getByClassName(this.__body,_clazz));
    };
    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>-parent{position:relative;}\
        .#<uispace>{position:absolute;border:1px solid #aaa;background:#fff;text-align:left;visibility:hidden;}\
        .#<uispace> .zitm{height:20px;line-height:20px;cursor:default;}\
        .#<uispace> .js-selected{background:#1257F9;}\
    ');
    // item html
    _seed_item = _t1._$addHtmlTemplate('\
        {if defined("xlist")&&!!xlist.length}\
          {list xlist as x}<div class="zitm">${x}</div>{/list}\
        {/if}\
    ');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});