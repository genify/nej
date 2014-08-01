/*
 * ------------------------------------------
 * 样式加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './loader.js',
    '{lib}base/klass.js',
    '{lib}base/element.js'
],function(_t,_k,_e,_p,_o,_f,_r){
    var _pro;
    /**
     * 样式加载器
     * 
     * @class   {_$$StyleLoader}
     * @extends {_$$Loader}
     * 
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示
     */
    _p._$$StyleLoader = _k._$klass();
    _pro = _p._$$StyleLoader._$extend(_t._$$Loader);
    /**
     * 取资源载入控件
     * @protected
     * @method {__getRequest}
     * @return {Link} 控件
     */
    _pro.__getRequest = function(){
        return _e._$create('link');
    };
    /**
     * 资源载入
     * @protected
     * @method {__doRequest}
     * @param  {Script} 控件
     * @return {Void}
     */
    _pro.__doRequest = function(_request){
        _request.href = this.__url;
        document.head.appendChild(_request);
    };
    
    return _p;
});
