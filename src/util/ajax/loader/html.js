/*
 * ------------------------------------------
 * HTML资源加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/loader/html */
NEJ.define([
    './loader.js',
    'base/klass',
    'base/element',
    '{platform}html.js'
],function(_t,_k,_e,_h,_p,_o,_f,_r){
    var _pro;
    /**
     * HTML资源加载器
     * 
     * @class   module:util/ajax/loader/html._$$LoaderHtml
     * @extends module:util/ajax/loader/loader._$$LoaderAbstract
     * 
     * @param   {Object} config - 可选配置参数
     */
    _p._$$LoaderHtml = _k._$klass(); 
    _pro = _p._$$LoaderHtml._$extend(_t._$$LoaderAbstract);
    /**
     * 取资源载入控件
     * 
     * @protected
     * @method module:util/ajax/loader/html._$$LoaderHtml#__getRequest
     * @return {Node} IFrame节点
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
     * 
     * @protected
     * @method module:util/ajax/loader/html._$$LoaderHtml#__doRequest
     * @param  {Node} arg0 - 控件节点
     * @return {Void}
     */
    _pro.__doRequest = function(_request){
        try{
            // append first for history bug
            document.body.appendChild(_request);
            _request.src = this.__url;
        }catch(ex){
            console.log(_request);
            console.error(ex);
        }
    };
    /**
     * 资源载入异常事件
     * 
     * @protected
     * @method module:util/ajax/loader/html._$$LoaderHtml#__onError
     * @param  {Object} arg0 - 错误信息
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
     * 
     * @protected
     * @method module:util/ajax/loader/html._$$LoaderHtml#__onLoaded
     * @return {Void}
     */
    _pro.__onLoaded = function(){
        var _body = null,
            _iframe = (this.__getLoadData(this.__url)||_o).request;
        try{
            if (_iframe.src!=this.__url) return;
            _body = _iframe.contentWindow.document.body;
        }catch(ex){
            // ignore
        }
        this.__doCallback('onload',_body);
        _h.__removeIFrameKeepHistory(_iframe);
    };

    return _p;
});
