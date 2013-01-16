/*
 * ------------------------------------------
 * 范围选择控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        t = NEJ.P('nej.ut'),
        p = NEJ.P('nej.ui'),
        __proRange,
        __supRange;
    if (!!p._$$Range) return;
    // ui css text
    var _seed_css = e._$pushCSSText('.#<uispace>{position:absolute;top:0;left:0;width:0;height:0;overflow:hidden;border:1px solid #0C32F6;background:#B8D4F0;_filter:alpha(opacity=70);opacity:0.7;}');
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
    p._$$Range = NEJ.C();
    __proRange = p._$$Range._$extend(p._$$Abstract);
    __supRange = p._$$Range._$supro;
    /**
     * 初始化控件
     * @protected
     * @method {__init}
     * @return {Void}
     */
    __proRange.__init = function(){
        this.__ropt = {
            onchange:this.__onRangeChange._$bind(this)
           ,onafterchange:this.__onAfterRangeChange._$bind(this)
           ,onbeforechange:this.__onBeforeRangeChange._$bind(this)
        };
        this.__supInit();
    };
    /**
     * 重置控件
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proRange.__reset = function(_options){
        this.__supReset(_options);
        this.__ropt.parent = this.__parent;
        this.__range = t._$$Range._$allocate(this.__ropt);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proRange.__destroy = function(){
        this.__supDestroy();
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
    __proRange.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化结构
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    __proRange.__initNode = function(){
        this.__supInitNode();
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
    __proRange.__onRangeChange = function(_event){
        this._$dispatchEvent('onchange',_event);
    };
    /**
     * 区域变化触发事件
     * @protected
     * @method {__onBeforeRangeChange}
     * @param  {Object} 区域信息
     * @return {Void}
     */
    __proRange.__onBeforeRangeChange = function(_event){
        this._$dispatchEvent('onbeforchange',_event);
    };
    /**
     * 区域变化触发事件
     * @protected
     * @method {__onAfterRangeChange}
     * @param  {Object} 区域信息
     * @return {Void}
     */
    __proRange.__onAfterRangeChange = function(){
        this._$dispatchEvent('onafterchange');
    };
};
define('{lib}ui/range/range.js',
      ['{lib}ui/base.js'
      ,'{lib}util/range/range.js'],f);