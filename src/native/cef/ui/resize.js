/**
 * ------------------------------------------ 
 * 窗体拖动缩放控件实现文件
 * @version 1.0
 * @author yuqijun(yuqijun@corp.netease.com)
 *         ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _ = NEJ.P, 
        _o = NEJ.O, 
        _r = NEJ.R, 
        _e = _('nej.e'), 
        _i = _('nej.ui'), 
        _t = _('nej.cef.ut'), 
        _c = _('nej.c'), 
        _p = _('nej.cef.ui'), 
        _proResize;
    // ui css text
    var _seed_css = _e._$pushCSSText('.#<uispace>-topleft{position:absolute;top:0;left:0;width:3px;height:3px;line-height:3px;background:transparent;z-index:100;cursor:nw-resize;overflow:hidden}\
        .#<uispace>-top{position:absolute;top:0;width:100%;height:3px;line-height:3px;background:transparent;z-index:99;cursor:n-resize;overflow:hidden}\
        .#<uispace>-topright{position:absolute;top:0;right:0;width:3px;height:3px;line-height:3px;background:transparent;z-index:100;cursor:ne-resize;overflow:hidden}\
        .#<uispace>-left{position:absolute;left:0;top:0;width:3px;height:100%;background:transparent;z-index:99;cursor:w-resize;overflow:hidden}\
        .#<uispace>-right{position:absolute;right:0;top:0;width:3px;height:100%;background:transparent;z-index:99;cursor:e-resize;overflow:hidden}\
        .#<uispace>-bottomleft{position:absolute;left:0;bottom:0;width:3px;height:3px;line-height:3px;background:transparent;z-index:100;cursor:sw-resize;overflow:hidden}\
        .#<uispace>-bottom{position:absolute;bottom:0;left:0;width:100%;height:3px;line-height:3px;background:transparent;z-index:99;cursor:s-resize;overflow:hidden}\
        .#<uispace>-bottomright{position:absolute;bottom:0;right:0;width:3px;height:3px;line-height:3px;background:transparent;z-index:100;cursor:se-resize;overflow:hidden}');
    // ui html code
    var _seed_html = _e._$addNodeTemplate('\
        <div class="'+_seed_css+'-topleft '+_seed_css+'-dtag" resizedir="topleft">&nbsp;</div>\
        <div class="'+_seed_css+'-top '+_seed_css+'-dtag" resizedir="top"></div>\
        <div class="'+_seed_css+'-topright '+_seed_css+'-dtag" resizedir="topright">&nbsp;</div>\
        <div class="'+_seed_css+'-left '+_seed_css+'-dtag" resizedir="left">&nbsp;</div>\
        <div class="'+_seed_css+'-right '+_seed_css+'-dtag" resizedir="right">&nbsp;</div>\
        <div class="'+_seed_css+'-bottomleft '+_seed_css+'-dtag" resizedir="bottomleft">&nbsp;</div>\
        <div class="'+_seed_css+'-bottom '+_seed_css+'-dtag" resizedir="bottom">&nbsp;</div>\
        <div class="'+_seed_css+'-bottomright '+_seed_css+'-dtag" resizedir="bottomright">&nbsp;</div>');
    /**
     * 窗体框架控件封装
     * 
     * @class 分页器控件封装
     * @extends {nej.ui._$$Abstract}
     * @param {Object}
     *            _options 可选配置参数，已处理参数列表如下 
     *                    clazz  控件样式 
     *                    parent 控件所在容器节点或者追加控件节点执行函数 
     */
    _p._$$Resize = NEJ.C();
    _proResize = _p._$$Resize._$extend(_i._$$Abstract);

    /**
     * 控件重置
     * 
     * @param {Object}
     *            _options 可选配置参数
     * @return {Void}
     */
    _proResize.__reset = function(_options) {
        this.__supReset(_options);
        this.__resize = _t._$$Resize._$allocate({nodes:this.__dragNodes});
    };
    /**
     * 控件外观
     * 
     * @return {Void}
     */
    _proResize.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     * 
     * @return {Void}
     */
    /**
     * 添加事件
     */
    _proResize.__initNode = function(){
        this.__supInitNode();
        this.__dragNodes = _e._$getByClassName(this.__body,_seed_css+'-dtag');
    };
};
define('{lib}native/cef/ui/resize.js', ['{patch}config.js'
                                       ,'{lib}ui/base.js'
                                       ,'{lib}native/cef/util/resize.js'
                                       ,'{lib}util/template/tpl.js'
                                       ,'{lib}native/cef/util/frame.js'], f);