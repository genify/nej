/*
 * ------------------------------------------
 * 弹出窗体封装基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _u = _('nej.u'),
        _p = _('nej.ui'),
        _proWindowWrapper;
    if (!!_p._$$WindowWrapper) return;
    /**
     * 弹出窗体封装基类对象，主要实现层里面内容部分的业务逻辑<br />
     * 脚本举例
     * [code]
     *   // 第一步：继承此类，生成一个新类
     *   _p = NEJ.P('nej.ui');
     *   _p._$$MyWindow = NEJ.C();
     *   var _seed_html = _e._$addNodeTemplate('<div>您要展示的内容部分</div>');
     *   _proMyWindow = _p._$$MyWindow._$extend(_p._$$WindowWrapper);
     *   // 生成窗体的展示内容
     *   _proMyWindow.__initXGui = function(){
     *       this.__seed_html = _seed_html;
     *   };
     *   // 第二步:实例化一个窗体控件
     *   var _myCard = _p._$$MyWindow._$allocate({
     *       parent:document.body,
     *       title:'窗口标题',
     *       draggable:false,
     *       // 是否有盖层
     *       mask:true,
     *       onclose:function(){
     *         // 关闭窗口的回调
     *       }
     *   });
     * [/code]
     * @class   {nej.ui._$$WindowWrapper} 弹出窗体封装基类对象
     * @extends {nej.ui._$$LayerWrapper}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * 
     */
    _p._$$WindowWrapper = NEJ.C();
      _proWindowWrapper = _p._$$WindowWrapper._$extend(_p._$$LayerWrapper);
    /**
     * 构建弹层控件实例，子类实现具体业务逻辑
     * @protected
     * @method {__getLayerInstance}
     * @return {nej.ui._$$Layer} 弹层控件实例
     */
    _proWindowWrapper.__getLayerInstance = function(){
        return _p._$$Window._$allocate(this.__lopt);
    };
    /**
     * 初始化弹层控件可选配置参数
     * @protected
     * @method {__doInitLayerOptions}
     * @return {Void}
     */
    _proWindowWrapper.__doInitLayerOptions = function(){
        _p._$$WindowWrapper._$supro
          .__doInitLayerOptions.apply(this,arguments);
        this.__lopt.mask  = null;
        this.__lopt.title = '标题';
        this.__lopt.align = '';
        this.__lopt.draggable = !1;
        this.__lopt.onclose = null;
    };
};
define('{lib}ui/layer/window.wrapper.js',
      ['{lib}ui/layer/layer.wrapper.js'
      ,'{lib}ui/layer/window.js'],f);