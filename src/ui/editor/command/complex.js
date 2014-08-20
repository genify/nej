/*
 * ------------------------------------------
 * 颜色选择卡片实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/editor/command/complex */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'ui/editor/command/color',
    'ui/colorpick/colorpick.complex'
],function(NEJ,_k,_e,_i0,_i1,_p,_o,_f,_r){
    var _pro,
        _seed_css;
    /**
     * 颜色选择卡片
     *
     * @class    module:ui/editor/command/complex._$$ComplexColorCard
     * @extends  module:ui/editor/command/color._$$ColorCard
     * @param    {Object} arg0  - 可选配置参数
     * @property {String} color - 颜色值
     */
    /**
     * 颜色选中回调函数
     *
     * @event  module:ui/editor/command/complex._$$ComplexColorCard#onchange
     * @param  {String} color - 颜色值
     *
     */
    _p._$$ComplexColorCard = _k._$klass();
    _pro = _p._$$ComplexColorCard._$extend(_i0._$$ColorCard);
    /**
     * 取取色器实例
     *
     * @protected
     * @method module:ui/editor/command/complex._$$ComplexColorCard#__getColorPicker
     * @return {Void}
     */
    _pro.__getColorPicker = function(){
        this.__copt.clazz = _seed_css;
        return _i1._$$ComplexColorPick._$allocate(this.__copt);
    };

    // ui css seed
    _seed_css = _e._$pushCSSText('.#<uispace>{width:238px;padding:5px 0 8px;border:1px solid #9FAC87;}');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});