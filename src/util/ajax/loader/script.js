/*
 * ------------------------------------------
 * 脚本加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/loader/script */
NEJ.define([
    './loader.js',
    'base/klass',
    'base/element'
],function(_t,_k,_e,_p,_o,_f,_r){
    var _pro;
    /**
     * 脚本加载器
     * 
     * @class    module:util/ajax/loader/script._$$LoaderScript
     * @extends  module:util/ajax/loader/loader._$$LoaderAbstract
     * 
     * @param    {Object} config   - 可选配置参数
     * @property {Boolean} async   - 异步载入并立刻执行，默认为!0
     * @property {String}  charset - 脚本编码
     */
    _p._$$LoaderScript = _k._$klass();
    _pro = _p._$$LoaderScript._$extend(_t._$$LoaderAbstract);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/ajax/loader/script._$$LoaderScript#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__async = _options.async;
        this.__charset = _options.charset;
        this.__qopt.async = !1;
        this.__qopt.charset = this.__charset;
    };
    /**
     * 取资源载入控件
     * 
     * @protected
     * @method module:util/ajax/loader/script._$$LoaderScript#__getRequest
     * @return {Script} 控件
     */
    _pro.__getRequest = function(){
        var _request = _e._$create('script');
        if (this.__async!=null){
            _request.async = !!this.__async;
        }
        if (this.__charset!=null){
            _request.charset = this.__charset;
        }
        return _request;
    };
    /**
     * 删除控件
     * 
     * @protected
     * @method module:util/ajax/loader/script._$$LoaderScript#__doClearRequest
     * @param  {Node} arg0 - 控件节点
     * @return {Void}
     */
    _pro.__doClearRequest = function(_request){
        _e._$remove(_request);
    };
    
    return _p;
});
