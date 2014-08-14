/*
 * ------------------------------------------
 * 文本资源加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './loader.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}util/ajax/xdr.js'
],function(_t,_k,_e,_j,_p,_o,_f,_r){
    /**
     * 文本资源加载器
     * 
     * @class   {_$$TextLoader}
     * @extends {_$$Loader}
     * 
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示
     */
    _p._$$TextLoader = _k._$klass(); 
    _pro = _p._$$TextLoader._$extend(_t._$$Loader);
    /**
     * 取资源载入控件
     * @protected
     * @method {__getRequest}
     * @return {Link} 控件
     */
    _pro.__getRequest = function(){
        return null;
    };
    /**
     * 资源载入
     * @protected
     * @method {__doRequest}
     * @param  {Script} 控件
     * @return {Void}
     */
    _pro.__doRequest = function(){
        _j._$request(this.__url,{
            method:'GET',
            type:'text',
            onload:this.__onLoaded._$bind(this),
            onerror:this.__onError._$bind(this)
        });
    };
    /**
     * 资源载入成功事件
     * @protected
     * @method {__onLoaded}
     * @return {Void}
     */
    _pro.__onLoaded = function(_text){
        this.__doCallback('onload',{
            url:this.__url,
            content:_text
        });
    };
    
    return _p;
});
