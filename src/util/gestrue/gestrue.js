/*
 * ------------------------------------------
 * 手势基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/gestrue/gestrue */
NEJ.define([
    'base/klass',
    'base/event',
    'util/event'
],function(_k,_v,_t,_p,_o,_f,_r,_pro){
    /**
     * 
     * 
     * 
     * @class    module:util/gestrue/gestrue._$$Gestrue
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object}      config  - 配置参数
     * 
     * 
     */
    _p._$$Gestrue = _k._$klass();
    _pro = _p._$$Gestrue._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/gestrue/gestrue._$$Gestrue#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__touches = {};
        this.__doInitDomEvent([[
            document,'touchstart',
            this.__onTouchStart._$bind(this)
        ],[
            document,'touchmove',
            this.__onTouchMove._$bind(this)
        ],[
            document,'touchend',
            this.__onTouchEnd._$bind(this)
        ],[
            document,'touchcancel',
            this.__onTouchEnd._$bind(this)
        ]]);
    };
    /**
     * 开始触摸
     * 
     * @protected
     * @method module:util/gestrue/gestrue._$$Gestrue#__onTouchStart
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onTouchStart = function(_event){
        
    };
    /**
     * 触摸进行中
     * 
     * @protected
     * @method module:util/gestrue/gestrue._$$Gestrue#__onTouchMove
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onTouchMove = function(_event){
        
    };
    /**
     * 触摸结束
     * 
     * @protected
     * @method module:util/gestrue/gestrue._$$Gestrue#__onTouchEnd
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onTouchEnd = function(_event){
        
    };
    /**
     * 触发手势事件
     * 
     * @method module:util/gestrue/gestrue._$$Gestrue#_$fire
     * @param  {String}   arg0 - 事件类型
     * @param  {Variable} arg1 - 详细参数
     * @return {Void}
     */
    _pro._$fire = function(_type,_detail){
        
    };
    
    
    
    return _p._$$Gestrue._$allocate();
});
