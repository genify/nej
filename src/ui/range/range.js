/*
 * ------------------------------------------
 * 范围选择控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}ui/base.js',
    '{lib}util/range/range.js'
],function(NEJ,_k,_e,_i,_t0,_p,_o,_f,_r){
    var _pro,
        _seed_css;
    /**
     * 范围选择控件封装
     * @class   {nej.ui._$$Range} 范围选择控件封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     * [hr]
     *
     * @event  {onchange} 页码切换事件
     * @param  {Object}   区域信息
     *
     * [hr]
     *
     * @event  {onafterchange} 区域变化之后触发事件
     *
     * [hr]
     *
     * @event  {onbeforechange} 区域变化之前触发事件
     * @param  {Object}   区域信息
     */
    _p._$$Range = _k._$klass();
    _pro = _p._$$Range._$extend(_i._$$Abstract);
    /**
     * 初始化控件
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__ropt = {
            onchange:this.__onRangeChange._$bind(this)
           ,onafterchange:this.__onAfterRangeChange._$bind(this)
           ,onbeforechange:this.__onBeforeRangeChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 重置控件
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__ropt.parent = this.__parent;
        this.__range = _t0._$$Range._$allocate(this.__ropt);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__range._$recycle();
        delete this.__range;
        delete this.__ropt.parent;
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化结构
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__body.innerHTML = '&nbsp;';
        this.__ropt.body = this.__body;
    };
    /**
     * 区域变化触发事件
     * @protected
     * @method {__onRangeChange}
     * @param  {Object} 区域信息
     * @return {Void}
     */
    _pro.__onRangeChange = function(_event){
        this._$dispatchEvent('onchange',_event);
    };
    /**
     * 区域变化触发事件
     * @protected
     * @method {__onBeforeRangeChange}
     * @param  {Object} 区域信息
     * @return {Void}
     */
    _pro.__onBeforeRangeChange = function(_event){
        this._$dispatchEvent('onbeforchange',_event);
    };
    /**
     * 区域变化触发事件
     * @protected
     * @method {__onAfterRangeChange}
     * @param  {Object} 区域信息
     * @return {Void}
     */
    _pro.__onAfterRangeChange = function(){
        this._$dispatchEvent('onafterchange');
    };
    // ui css text
    _seed_css = _e._$pushCSSText('.#<uispace>{position:absolute;top:0;left:0;width:0;height:0;overflow:hidden;border:1px solid #0C32F6;background:#B8D4F0;_filter:alpha(opacity=70);opacity:0.7;}');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});