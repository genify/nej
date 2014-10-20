/*
 * ------------------------------------------
 * 颜色选择卡片实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/editor/command/color */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'ui/layer/card.wrapper',
    'ui/colorpick/colorpick',
    'text!./color.css'
],function(NEJ,_k,_e,_i0,_i1,_css,_p,_o,_f,_r){
    var _pro,
        _seed_css = _e._$pushCSSText(_css);
    /**
     * 颜色选择卡片
     *
     * @class    module:ui/editor/command/color._$$ColorCard
     * @extends  module:ui/layer/wrapper/card._$$CardWrapper
     * @param    {Object} arg0  - 可选配置参数
     * @property {String} color - 颜色值
     */
    /**
     * 颜色选中回调函数
     *
     * @event  module:ui/editor/command/color._$$ColorCard#onchange
     * @param  {String} color - 颜色值
     *
     */
    _p._$$ColorCard = _k._$klass();
    _pro = _p._$$ColorCard._$extend(_i0._$$CardWrapper);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/editor/command/color._$$ColorCard#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__copt = {
            onselect:this.__onColorSelect._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/editor/command/color._$$ColorCard#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__copt.color = _options.color;
        this.__copt.parent = this.__layer._$getBody();
        this.__copt.defaultColor = _options.defaultColor;
        this.__colorpick = this.__getColorPicker();
    };
    /**
     * 控件回收
     *
     * @protected
     * @method module:ui/editor/command/color._$$ColorCard#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__colorpick){
            this.__colorpick._$recycle();
            delete this.__colorpick;
        }
        delete this.__copt.parent;
        this.__super();
    };
    /**
     * 取取色器实例
     *
     * @protected
     * @method module:ui/editor/command/color._$$ColorCard#__getColorPicker
     * @return {Void}
     */
    _pro.__getColorPicker = function(){
        this.__copt.clazz = _seed_css;
        return _i1._$$ColorPick._$allocate(this.__copt);
    };
    /**
     * 颜色选择回调
     *
     * @protected
     * @method module:ui/editor/command/color._$$ColorCard#__onColorSelect
     * @param    {Object} arg0  - 颜色配置
     * @property {String} color - 颜色值
     * @return   {Void}
     */
    _pro.__onColorSelect = function(_event){
        this._$dispatchEvent('onchange',_event.color);
        this._$hide();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});