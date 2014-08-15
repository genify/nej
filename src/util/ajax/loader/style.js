/*
 * ------------------------------------------
 * 样式加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/loader/style */
NEJ.define([
    './loader.js',
    'base/klass',
    'base/element'
],function(_t,_k,_e,_p,_o,_f,_r){
    var _pro;
    /**
     * 样式加载器
     * 
     * @class   module:util/ajax/loader/style._$$LoaderStyle
     * @extends module:util/ajax/loader/loader._$$LoaderAbstract
     * 
     * @param   {Object} config - 可选配置参数
     */
    _p._$$LoaderStyle = _k._$klass();
    _pro = _p._$$LoaderStyle._$extend(_t._$$LoaderAbstract);
    /**
     * 取资源载入控件
     * 
     * @protected
     * @method module:util/ajax/loader/style._$$LoaderStyle#__getRequest
     * @return {Node} 控件节点
     */
    _pro.__getRequest = function(){
        return _e._$create('link');
    };
    /**
     * 资源载入
     * 
     * @protected
     * @method module:util/ajax/loader/style._$$LoaderStyle#__doRequest
     * @param  {Node} 控件节点
     * @return {Void}
     */
    _pro.__doRequest = function(_request){
        _request.href = this.__url;
        document.head.appendChild(_request);
    };
    
    return _p;
});
