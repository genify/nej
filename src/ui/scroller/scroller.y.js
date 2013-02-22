/*
 * ------------------------------------------
 * 垂直滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var e = NEJ.P('nej.e'),
        p = NEJ.P('nej.ui'),
        __proScrollerY,
        __supScrollerY;
    if (!!p._$$ScrollerY) return;
    // ui css text
    var _seed_css = e._$pushCSSText('\
                     .#<uispace>{position:absolute;z-index:10;$<transform>-origin:0 0;$<transition>-property:opacity;$<transition>-duration:250ms;background-color:rgba(0,0,0,0.6);$<border-radius>:4px;border:1px solid rgba(255,255,255,0.2);opacity:0;overflow:hidden;}\
                     .#<uispace>-view{position:relative;z-index:5;$<transform>:$<translate>;}\
                     .#<uispace>{top:0;right:1px;width:6px;}');
    /**
     * 垂直滚动控件
     * @class   {nej.ui._$$ScrollerY} 垂直滚动控件
     * @extends {nej.ui._$$Scroller}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     */
    p._$$ScrollerY = NEJ.C();
    __proScrollerY = p._$$ScrollerY._$extend(p._$$Scroller);
    __supScrollerY = p._$$ScrollerY._$supro;
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proScrollerY.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 取滚动配置信息
     * @protected
     * @method {__getConfig}
     * @return {Object} 滚动配置信息
     */
    __proScrollerY.__getConfig = function(){
        return {f:'v',a:'top',g:'height',t:'pageY',of:'y',
                ob:'offsetHeight',sb:'scrollHeight',dx:'m42'};
    };
};
NEJ.define('{lib}ui/scroller/scroller.y.js',
      ['{lib}ui/scroller/scroller.js'],f);