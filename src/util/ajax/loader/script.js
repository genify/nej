/*
 * ------------------------------------------
 * 脚本加载器实现文件
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
     * 脚本加载器
     * 
     * @class   {_$$ScriptLoader}
     * @extends {_$$Loader}
     * 
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示
     * @config  {Boolean} async   异步载入并立刻执行，默认为!0
     * @config  {String}  charset 脚本编码
     */
    _p._$$ScriptLoader = _k._$klass();
    _pro = _p._$$ScriptLoader._$extend(_t._$$Loader);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
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
     * @protected
     * @method {__getRequest}
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
     * @protected
     * @method {__clearRequest}
     * @param  {Script|Link} 控件
     * @return {Void}
     */
    _pro.__clearRequest = function(_request){
        _e._$remove(_request);
    };
    
    return _p;
});
