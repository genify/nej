/*
 * ------------------------------------------
 * 弹出卡片封装基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ui'),
        _proMyCardWrapper;
    if (!!_p._$$MyCardWrapper) return;
    /**
     * @class   {nej.ui._$$MyCardWrapper} 弹出卡片封装基类对象
     * @extends {nej.ui._$$LayerWrapper}
     * @param   {Object} 可选配置参数
     *                            
     */
    _p._$$MyCardWrapper = NEJ.C();
    _proMyCardWrapper = _p._$$MyCardWrapper._$extend(_p._$$LayerWrapper);
    /**
     * 构建弹层控件实例，子类实现具体业务逻辑
     * @protected
     * @method {__getLayerInstance}
     * @return {nej.ui._$$Layer} 弹层控件实例
     */
    _proMyCardWrapper.__getLayerInstance = function(){
        return _p._$$MyLayer._$allocate(this.__lopt);
    };
    /**
     * 初始化弹层控件可选配置参数
     * @protected
     * @method {__doInitLayerOptions}
     * @return {Void}
     */
    _proMyCardWrapper.__doInitLayerOptions = function(){
        _p._$$MyCardWrapper._$supro
          .__doInitLayerOptions.apply(this,arguments);
        this.__lopt.top = null;
        this.__lopt.left = null;
    };
};
define('{pro}mylayerwrapper.js',
      ['{lib}ui/layer/layer.wrapper.js'
      ,'{pro}mylayer.js'],f);