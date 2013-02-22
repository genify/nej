/*
 * ------------------------------------------
 * 卡片控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _v = _('nej.v'),
        _e = _('nej.e'),
        _p = _('nej.ui'),
        _proMyLayer;
    if (!!_p._$$MyLayer) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('.#<uispace>{position:absolute;background:#fff;}');
    /**
     * 卡片控件
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} top  卡片垂直位置
     * @config  {String} left 卡片水平位置
     */
    _p._$$MyLayer = NEJ.C();
    _proMyLayer = _p._$$MyLayer._$extend(_p._$$Layer);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proMyLayer.__reset = function(_options){
        this.__supReset(_options);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proMyLayer.__destroy = function(){
        this.__supDestroy();
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proMyLayer.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proMyLayer.__initNode = function(){
        this.__supInitNode();
        this.__ncnt = this.__body;
    };
};
define('{pro}ui/mylayer.js',
      ['{lib}ui/layer/layer.js'],f);
