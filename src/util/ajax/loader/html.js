/*
 * ------------------------------------------
 * HTML资源加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './loader.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{platform}html.js'
],function(_t,_k,_e,_h,_p,_o,_f,_r){
    var _pro;
    /**
     * HTML资源加载器
     * 
     * @class   {_$$HtmlLoader}
     * @extends {_$$Loader}
     * 
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示
     */
    _p._$$HtmlLoader = _k._$klass(); 
    _pro = _p._$$HtmlLoader._$extend(_t._$$Loader);
    /**
     * 取资源载入控件
     * @protected
     * @method {__getRequest}
     * @return {Link} 控件
     */
    _pro.__getRequest = function(){
        var _iframe = _e._$create('iframe');
        _iframe.width = 0;
        _iframe.height = 0;
        _iframe.style.display = 'none';
        return _iframe;
    };
    /**
     * 资源载入
     * @protected
     * @method {__doRequest}
     * @param  {Script} 控件
     * @return {Void}
     */
    _pro.__doRequest = function(_request){
        // append first for history bug
        document.body.appendChild(_request);
        _request.src = this.__url;
    };
    /**
     * 资源载入异常事件
     * @protected
     * @method {__onError}
     * @param  {Object} 错误信息
     * @return {Void}
     */
    _pro.__onError = function(_error){
        var _iframe = (
            this.__getLoadData(this.__url)||_o
        ).request;
        this.__doCallback('onerror',_error);
        _h.__removeIFrameKeepHistory(_iframe);
    };
    /**
     * 资源载入成功事件
     * @protected
     * @method {__onLoaded}
     * @return {Void}
     */
    _pro.__onLoaded = function(){
        var _body = null,
            _iframe = (this.__getLoadData(this.__url)||_o).request;
        if (_iframe.src!=this.__url) return;
        try{_body = _iframe.contentWindow.document.body;}catch(ex){}
        this.__doCallback('onloaded',_body);
        _h.__removeIFrameKeepHistory(_iframe);
    };

    return _p;
});
