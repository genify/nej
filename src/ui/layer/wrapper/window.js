/*
 * ------------------------------------------
 * 弹出窗体封装基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/layer/wrapper/window */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}ui/layer/layer.wrapper.js',
    '{lib}ui/layer/window.js'
],function(NEJ,_k,_i0,_i1,_p,_o,_f,_r){
    var _pro;
    /**
     * 弹出窗体封装基类对象，主要实现层里面内容部分的业务逻辑
     *
     * 脚本举例
     * ```javascript
     * // 第一步：继承此类，生成一个新类
     * _p = NEJ.P('nej.ui');
     * _p._$$MyWindow = NEJ.C();
     * var _seed_html = _e._$addNodeTemplate('<div>您要展示的内容部分</div>');
     * _proMyWindow = _p._$$MyWindow._$extend(_p._$$WindowWrapper);
     * // 生成窗体的展示内容
     * _proMyWindow.__initXGui = function(){
     *     this.__seed_html = _seed_html;
     * };
     * // 第二步:实例化一个窗体控件
     * var _myCard = _p._$$MyWindow._$allocate({
     *     parent:document.body,
     *     title:'窗口标题',
     *     draggable:false,
     *     // 是否有盖层
     *     mask:true,
     *     onclose:function(){
     *       // 关闭窗口的回调
     *     }
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
     * @return {nej.ui._$$Layer} 弹层控件实例
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