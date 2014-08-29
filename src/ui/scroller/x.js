/*
 * ------------------------------------------
 * 水平滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/scroller/x */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'ui/scroller/scroller',
    'text!./x.css'
],function(NEJ,_k,_e,_i0,_css,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css = _e._$pushCSSText(_css);
    /**
     * 滚动配置信息
     * @typedef  {Object} module:ui/scroller/x._$$ScrollerX~Config
     * @property {Number} f  - h
     * @property {Number} a  - 方向
     * @property {Number} g  - 宽度
     * @property {Number} t  - pageX
     * @property {Number} of - x
     * @property {Number} ob - offsetWidth
     * @property {Number} sb - scrollWidth
     * @property {Number} dx - m41
     */
    /**
     * 水平滚动控件
     *
     * @class   module:ui/scroller/x._$$ScrollerX
     * @extends module:ui/scroller/scroller._$$Scroller
     * @param   {Object} arg0 - 可选配置参数
     */
    _p._$$ScrollerX = _k._$klass();
    _pro = _p._$$ScrollerX._$extend(_i0._$$Scroller);
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/scroller/x._$$ScrollerX#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 取滚动配置信息
     *
     * @protected
     * @method module:ui/scroller/x._$$ScrollerX#__getConfig
     * @return {module:ui/scroller/x._$$ScrollerX~Config} 滚动配置信息
     */
    _pro.__getConfig = function(){
        return {f:'h',a:'left',g:'width',t:'pageX',of:'x',
                ob:'offsetWidth',sb:'scrollWidth',dx:'m41'};
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});