/*
 * ------------------------------------------
 * 弹出窗体封装基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/layer/wrapper/window */
NEJ.define([
    'base/global',
    'base/klass',
    'ui/layer/layer.wrapper',
    'ui/layer/window'
],function(NEJ,_k,_i0,_i1,_p,_o,_f,_r){
    var _pro;
    /**
     * 弹出窗体封装基类对象，主要实现层里面内容部分的业务逻辑
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     'util/template/tpl',
     *     'ui/layer/wrapper/window',
     *     'text!./mywindow.html'
     * ],function(_k,_t,_l,_html,_p,_o,_f,_r){
     *     var _pro;
     *     // 第一步：继承此类，生成一个新类
     *     _p._$$MyWindow = _k._$klass();
     *     _pro = _p._$$MyWindow._$extend(_l._$$WindowWrapper);
     *     // 生成窗体的展示内容
     *     _pro.__initXGui = (function(){
     *         var _seed_html = _t._$addNodeTemplate(_html);
     *         return function(){
     *             this.__seed_html = _seed_html;
     *         };
     *     }
     * })();
     *
     * NEJ.define([
     *     '/path/custom/to/mywindow.js'
     * ],function(_i0,_p,_o,_f,_r){
     *     // 第二步:实例化一个窗体控件
     *     var _myCard = _i0._$$MyWindow._$allocate({
     *         parent:document.body,
     *         title:'窗口标题',
     *         draggable:false,
     *         // 是否有盖层
     *         mask:true,
     *         onclose:function(){
     *           // 关闭窗口的回调
     *         }
     *     });
     * });
     * ```
     *
     * @class   module:ui/layer/wrapper/window._$$WindowWrapper
     * @extends module:ui/layer/wrapper/layer._$$LayerWrapper
     * @param   {Object} arg0 - 可选配置参数
     *
     */
    _p._$$WindowWrapper = _k._$klass();
    _pro = _p._$$WindowWrapper._$extend(_i0._$$LayerWrapper);
    /**
     * 构建弹层控件实例，子类实现具体业务逻辑
     *
     * @protected
     * @method module:ui/layer/wrapper/window._$$WindowWrapper#__getLayerInstance
     * @return {module:ui/layer/layer._$$Layer} 弹层控件实例
     */
    _pro.__getLayerInstance = function(){
        return _i1._$$Window._$allocate(this.__lopt);
    };
    /**
     * 初始化弹层控件可选配置参数
     *
     * @protected
     * @method module:ui/layer/wrapper/window._$$WindowWrapper#__doInitLayerOptions
     * @return {Void}
     */
    _pro.__doInitLayerOptions = function(){
        this.__super();
        this.__lopt.mask  = null;
        this.__lopt.title = '标题';
        this.__lopt.align = '';
        this.__lopt.draggable = !1;
        this.__lopt.onclose = null;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});