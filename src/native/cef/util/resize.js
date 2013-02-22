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
        _v = _('nej.v'),
        _t = _('nej.ut'), 
        _n = _('nej.n'),
        _p = _('nej.cef.ut'),
        _proResize;
    
    /**
     * 窗体框架控件封装
     * <pre>
     *     <div resizedir="topleft">&nbsp;</div>
        <div resizedir="top"></div>
        <div resizedir="topright">&nbsp;</div>
        <div resizedir="left">&nbsp;</div>
        <div resizedir="right">&nbsp;</div>
        <div resizedir="bottomleft">&nbsp;</div>
        <div resizedir="bottom">&nbsp;</div>
        <div resizedir="bottomright">&nbsp;</div>
     * </pre>
     * @class 分页器控件封装
     * @extends {nej.ui._$$Abstract}
     * @param {Object}
     *            _options 可选配置参数，已处理参数列表如下 
     *                     dragNodes
     *                                拖动的8节点，每个节点上都需要有resizedir属性,
     *                                8个节点都是绝对定位，且z-index在样式中控制
     *                     
     */
    _p._$$Resize = NEJ.C();
    _proResize = _p._$$Resize._$extend(_t._$$Event);

    /**
     * 控件重置
     * 
     * @param {Object}
     *            _options 可选配置参数
     * @return {Void}
     */
    _proResize.__reset = function(_options) {
        this.__supReset(_options);
        this.__nodes = _options.nodes||[];
        for ( var i = 0, l = this.__nodes.length; i < l; i++) {
            _v._$addEvent(this.__nodes[i], 'mousedown', this.__onResizeWindow._$bind(this));
        }
    };
    /**
     * 鼠标按下时调整窗体大小
     * @param    {Object}    事件对象
     */
    _proResize.__onResizeWindow = function(_event){
        if (_event.which == 1) {
            var _elm = _v._$getElement(_event);
            var _direction = _elm.getAttribute('resizedir');
            _n._$exec('winhelper.sizeWindow', _direction);
        }
    };
};
NEJ.define('{lib}native/cef/util/resize.js', ['{lib}util/event.js'], f);