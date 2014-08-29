/*
 * ------------------------------------------
 * 垂直滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/scroller/y */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'ui/scroller/scroller',
    'text!./y.css'
],function(NEJ,_k,_e,_i0,_css,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css = _e._$pushCSSText(_css);
    /**
     * 滚动配置信息
     * @typedef  {Object} module:ui/scroller/y._$$ScrollerY.Config
     * @property {Number} f  - v
     * @property {Number} a  - 方向
     * @property {Number} g  - 高度
     * @property {Number} t  - pageY
     * @property {Number} of - y
     * @property {Number} ob - offsetHeight
     * @property {Number} sb - scrollHeight
     * @property {Number} dx - m42
     */
    /**
     * 垂直滚动控件
     *
     * @class   module:ui/scroller/y._$$ScrollerY 垂直滚动控件
     * @extends module:ui/scroller/scroller._$$Scroller
     * @param   {Object} arg0 - 可选配置参数
     */
    _p._$$ScrollerY = _k._$klass();
    _pro = _p._$$ScrollerY._$extend(_i0._$$Scroller);
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/scroller/y._$$ScrollerY#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 取滚动配置信息
     *
     * @protected
     * @method module:ui/scroller/y._$$ScrollerY#__getConfig
     * @return {Object} 滚动配置信息
     */
    _pro.__getConfig = function(){
        return {f:'v',a:'top',g:'height',t:'pageY',of:'y',
                ob:'offsetHeight',sb:'scrollHeight',dx:'m42'};
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});