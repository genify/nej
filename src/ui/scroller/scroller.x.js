/*
 * ------------------------------------------
 * 水平滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var e = NEJ.P('nej.e'),
        p = NEJ.P('nej.ui'),
        __proScrollerX,
        __supScrollerX;
    if (!!p._$$ScrollerX) return;
    // ui css text
    var _seed_css = e._$pushCSSText('\
                     .#<uispace>{position:absolute;z-index:10;$<transform>-origin:0 0;$<transition>-property:opacity;$<transition>-duration:250ms;background-color:rgba(0,0,0,0.6);$<border-radius>:4px;border:1px solid rgba(255,255,255,0.2);opacity:0;overflow:hidden;}\
                     .#<uispace>-view{position:relative;z-index:5;$<transform>:$<translate>;}\
                     .#<uispace>{bottom:1px;left:0;height:4px;}');
    /**
     * 水平滚动控件
     * @class   {nej.ui._$$ScrollerX} 水平滚动控件
     * @extends {nej.ui._$$Scroller}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     */
    p._$$ScrollerX = NEJ.C();
    __proScrollerX = p._$$ScrollerX._$extend(p._$$Scroller);
    __supScrollerX = p._$$ScrollerX._$supro;
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proScrollerX.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 取滚动配置信息
     * @protected
     * @method {__getConfig}
     * @return {Object} 滚动配置信息
     */
    __proScrollerX.__getConfig = function(){
        return {f:'h',a:'left',g:'width',t:'pageX',of:'x',
                ob:'offsetWidth',sb:'scrollWidth',dx:'m41'};
    };
};
define('{lib}ui/scroller/scroller.x.js',
      ['{lib}ui/scroller/scroller.js'],f);