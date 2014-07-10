/*
 * ------------------------------------------
 * 文本资源加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _j = _('nej.j'),
        _p = _('nej.ut.j'),
        _pro;
    if (!!_p._$$TextLoader) return;
    /**
     * 文本资源加载器
     * @class   {nej.ut.j._$$TextLoader} HTML资源加载器
     * @extends {nej.ut._$$Loader}
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示
     * 
     */
    _p._$$TextLoader = NEJ.C(); 
    _pro = _p._$$TextLoader._$extend(_p._$$Loader);
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
        this.__doCallback('onloaded',{
            url:this.__url,
            content:_text
        });
    };
};
NEJ.define(
    '{lib}util/ajax/loader/text.js',[
    '{lib}util/ajax/xdr.js',
    '{lib}util/ajax/loader/loader.js'
],f);