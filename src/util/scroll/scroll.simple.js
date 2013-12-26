/**
 * ------------------------------------------
 * 滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _pro,_sup;
    if (!!_p._$$SimpleScroll) return;
    /**
     * 滚动控件
     * 
     * @class   {nej.ut._$$SimpleScroll}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} _options 可选配置参数
     * @config  {String|Node} xbar   水平滚动条节点
     * @config  {String|Node} ybar   垂直滚动条节点
     * @config  {String|Node} parent 滚动容器节点，默认为滚动条的父容器
     * 
     * [hr]
     * 滚动过程触发事件
     * @event   {onscroll}
     * @param   {Object} 滚动信息
     * 
     */
    _p._$$SimpleScroll = NEJ.C();
    _pro = _p._$$SimpleScroll._$extend(_p._$$Event);
    /**
     * 初始化控件
     * @return {Void}
     */
    _pro.__init = function(){
        this.__supInit();
        
    };
    /**
     * 控件重置
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__xbar = _e._$get(_options.xbar);
        this.__ybar = _e._$get(_options.ybar);
        this.__parent = _e._$get(_options.parent)||
            (this.__ybar||this.__xbar||_o).parentNode;
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        delete this.__xbar;
        delete this.__ybar;
        delete this.__parent;
    };
};
NEJ.define(
    '{lib}util/scroll/scroll.js',[
    '{lib}util/event.js'
],f);
