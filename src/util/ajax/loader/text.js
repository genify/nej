/*
 * ------------------------------------------
 * 文本资源加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/loader/text */
NEJ.define([
    './loader.js',
    'base/klass',
    'base/element',
    'util/ajax/xdr'
],function(_t,_k,_e,_j,_p,_o,_f,_r){
    /**
     * 文本资源加载器
     * 
     * @class   module:util/ajax/loader/text._$$LoaderText
     * @extends module:util/ajax/loader/loader._$$LoaderAbstract
     * 
     * @param   {Object} config - 可选配置参数
     */
    _p._$$LoaderText = _k._$klass(); 
    _pro = _p._$$LoaderText._$extend(_t._$$LoaderAbstract);
    /**
     * 取资源载入控件
     * 
     * @protected
     * @method module:util/ajax/loader/style._$$LoaderText#__getRequest
     * @return {Node} 控件节点
     */
    _pro.__getRequest = function(){
        return null;
    };
    /**
     * 资源载入
     * 
     * @protected
     * @method module:util/ajax/loader/style._$$LoaderText#__doRequest
     * @param  {Node} 控件节点
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
     * 
     * @protected
     * @method module:util/ajax/loader/style._$$LoaderText#__onLoaded
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
