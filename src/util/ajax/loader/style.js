/*
 * ------------------------------------------
 * 样式加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ut.j'),
        _proStyleLoader;
    if (!!_p._$$StyleLoader) return;
    /**
     * 样式加载器
     * @class   {nej.ut.j._$$StyleLoader} 样式加载器
     * @extends {nej.ut._$$Loader}
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示
     * 
     */
    _p._$$StyleLoader = NEJ.C();
      _proStyleLoader = _p._$$StyleLoader._$extend(_p._$$Loader);
    /**
     * 取资源载入控件
     * @protected
     * @method {__getRequest}
     * @return {Link} 控件
     */
    _proStyleLoader.__getRequest = function(){
        return _e._$create('link');
    };
    /**
     * 资源载入
     * @protected
     * @method {__doRequest}
     * @param  {Script} 控件
     * @return {Void}
     */
    _proStyleLoader.__doRequest = function(_request){
        _request.href = this.__url;
        document.head.appendChild(_request);
    };
};
define('{lib}util/ajax/loader/style.js',
      ['{lib}util/ajax/loader/loader.js'],f);