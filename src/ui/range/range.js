/*
 * ------------------------------------------
 * 范围选择控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/range/range */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'ui/base',
    'util/range/range',
    'text!./range.css'
],function(NEJ,_k,_e,_i,_t0,_css,_p,_o,_f,_r){
    var _pro,
        _seed_css = _e._$pushCSSText(_css);
    /**
     * 范围选择控件封装
     *
     * @class   module:ui/range/range._$$Range
     * @extends module:ui/base._$$Abstract
     * @param   {Object} arg0 - 可选配置参数
     */
    /**
     * 页码切换事件
     *
     * @event  module:ui/range/range._$$Range#onchange
     * @param  {Object} arg0 -   区域信息
     */
    /**
     * 区域变化之后触发事件
     *
     * @event  module:ui/range/range._$$Range#onafterchange
     */
    /**
     * 区域变化之前触发事件
     *
     * @event  module:ui/range/range._$$Range#onbeforechange
     * @param  {Object} arg0 -   区域信息
     */
    _p._$$Range = _k._$klass();
    _pro = _p._$$Range._$extend(_i._$$Abstract);
    /**
     * 初始化控件
     *
     * @protected
     * @method module:ui/range/range._$$Range#__init
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
     *
     * @protected
     * @method module:ui/range/range._$$Range#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__ropt.parent = this.__parent;
        this.__range = _t0._$$Range._$allocate(this.__ropt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/range/range._$$Range#__destroy
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
     *
     * @protected
     * @method module:ui/range/range._$$Range#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化结构
     *
     * @protected
     * @method module:ui/range/range._$$Range#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__body.innerHTML = '&nbsp;';
        this.__ropt.body = this.__body;
    };
    /**
     * 区域变化触发事件
     *
     * @protected
     * @method module:ui/range/range._$$Range#__onRangeChange
     * @param  {Object} arg0 - 区域信息
     * @return {Void}
     */
    _pro.__onRangeChange = function(_event){
        this._$dispatchEvent('onchange',_event);
    };
    /**
     * 区域变化触发事件
     *
     * @protected
     * @method module:ui/range/range._$$Range#__onBeforeRangeChange
     * @param  {Object} arg0 - 区域信息
     * @return {Void}
     */
    _pro.__onBeforeRangeChange = function(_event){
        this._$dispatchEvent('onbeforchange',_event);
    };
    /**
     * 区域变化触发事件
     *
     * @protected
     * @method module:ui/range/range._$$Range#__onAfterRangeChange
     * @param  {Object} arg0 - 区域信息
     * @return {Void}
     */
    _pro.__onAfterRangeChange = function(){
        this._$dispatchEvent('onafterchange');
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});