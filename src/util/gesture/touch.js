/**
 * ------------------------------------------
 * 触摸事件对象实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _v = _('nej.v'),
        _p = _('nej.ut.g'),
        __proTouch;
    if (!!_p._$$Touch) return;
    /**
     * 触摸事件实现对象
     * @class   {nej.ut.g._$$Touch} 触摸事件实现对象
     * @extends {nej.ut.g._$$Gesture}
     */
    _p._$$Touch = NEJ.C();
    __proTouch = _p._$$Touch._$extend(_p._$$Gesture);
    __supTouch = _p._$$Touch._$supro;
    /**
     * 初始化控件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proTouch.__init = function(_options){
        this.__supInit(_options);
        this.__interval = 500; // touch down check interval
    };
    /**
     * 开始触摸事件
     * @param  {Object} _options 事件相关信息
     * @return {Void}
     */
    __proTouch.__doTouchStart = function(_touch,_event){
        this.__timer = window.setInterval(this.__onTouchDown._$bind(this,_touch),this.__interval);
    };
    /**
     * 结束触摸事件
     * @param  {Object} _options 事件相关信息
     * @return {Void}
     */
    __proTouch.__doTouchEnd = function(_options){
        this.__timer = window.clearInterval(this.__timer);
    };
    /**
     * 触摸按下触发事件，间隔一段时间触发一次
     * @return {Void}
     */
    __proTouch.__onTouchDown = function(_touch){
        this.__doDispatchEvent('touchdown',_touch);
    };
    
    // instance
    _p._$$Touch._$allocate();
};
NEJ.define('{lib}util/gesture/touch.js',
      ['{lib}util/gesture/gesture.js'],f);