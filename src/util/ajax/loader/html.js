/*
 * ------------------------------------------
 * HTML资源加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _h = _('nej.h'),
        _p = _('nej.ut.j'),
        _proHtmlLoader;
    if (!!_p._$$HtmlLoader) return;
    /**
     * HTML资源加载器
     * @class   {nej.ut.j._$$HtmlLoader} HTML资源加载器
     * @extends {nej.ut._$$Loader}
     * @param   {Object} 可选配置参数，已处理的参数列表如下所示
     * 
     */
    _p._$$HtmlLoader = NEJ.C(); 
      _proHtmlLoader = _p._$$HtmlLoader._$extend(_p._$$Loader);
    /**
     * 取资源载入控件
     * @protected
     * @method {__getRequest}
     * @return {Link} 控件
     */
    _proHtmlLoader.__getRequest = function(){
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
    _proHtmlLoader.__doRequest = function(_request){
        _request.src = this.__url;
        document.body.appendChild(_request);
    };
    /**
     * 资源载入异常事件
     * @protected
     * @method {__onError}
     * @param  {Object} 错误信息
     * @return {Void}
     */
    _proHtmlLoader.__onError = function(_error){
        var _iframe = (this.__getLoadData
                      (this.__url)||_o).request;
        this.__doCallback('onerror',_error);
        _h.__removeIFrameKeepHistory(_iframe);
    };
    /**
     * 资源载入成功事件
     * @protected
     * @method {__onLoaded}
     * @return {Void}
     */
    _proHtmlLoader.__onLoaded = function(){
        var _body = null,
            _iframe = (this.__getLoadData(this.__url)||_o).request;
        try{_body = _iframe.contentWindow.document.body;}catch(ex){}
        this.__doCallback('onloaded',_body);
        _h.__removeIFrameKeepHistory(_iframe);
    };
};
NEJ.define('{lib}util/ajax/loader/html.js',
          ['{platform}html.js'
          ,'{lib}util/ajax/loader/loader.js'],f);