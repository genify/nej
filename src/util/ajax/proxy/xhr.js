/*
 * ------------------------------------------
 * XHR方式Ajax代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _h = _('nej.h'),
        _g = _('nej.g'),
        _u = _('nej.u'),
        _p = _('nej.ut.j'),
        _cache = {},
        _proXHRProxy;
    if (!!_p._$$XHRProxy) return;
    /**
     * Ajax代理对象
     * 
     * @class   {nej.ut.j._$$XHRProxy}
     * @extends {nej.ut.j._$$Proxy}
     * 
     * @param   {Object}  构造配置参数
     */
    _p._$$XHRProxy = NEJ.C();
      _proXHRProxy = _p._$$XHRProxy._$extend(_p._$$Proxy);
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proXHRProxy.__destroy = function(){
        this.__supDestroy();
        window.clearTimeout(this.__timer);
        delete this.__timer;
        try{
            this.__xhr.onreadystatechange = _f;
            this.__xhr.abort();
        }catch(e){
            // ignore
        }
        delete this.__xhr;
    };
    /**
     * 往服务器发送请求
     * @protected
     * @method {__doSendRequest}
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proXHRProxy.__doSendRequest = (function(){
        var _doSetHeader = function(_value,_key){
            this.__xhr.setRequestHeader(_key,_value);
        };
        return function(_options){
            var _request = _options.request,
                _headers = _options.headers;
            this.__xhr = _h.__getXMLHttpRequest();
            // add event listener
            // upload progress
            if (_headers[_g._$HEAD_CT]===_g._$HEAD_CT_FILE){
                delete _headers[_g._$HEAD_CT];
                this.__xhr.upload.onprogress = 
                    this.__onStateChange._$bind(this,1);
                if (_request.data.tagName==='FORM')
                    _request.data = new FormData(_request.data);
            }
            // state change
            this.__xhr.onreadystatechange = 
                this.__onStateChange._$bind(this,2);
            // timeout
            if (_request.timeout!=0){
                this.__timer = window.setTimeout(
                    this.__onStateChange._$bind(this,3),
                    _request.timeout
                );
            }
            // prepare and send request
            this.__xhr.open(_request.method,
                            _request.url,
                           !_request.sync);
            _u._$forIn(_headers,_doSetHeader,this);
            // support credential
            if (!!this.__request.cookie&&
               ('withCredentials' in this.__xhr))
                this.__xhr.withCredentials = !0;
            this.__xhr.send(_request.data);
        };
    })();
    /**
     * 请求状态变化事件
     * @protected
     * @method {__onStateChange}
     * @param  {Number} 状态变化类型
     * @return {Void}
     */
    _proXHRProxy.__onStateChange = function(_type){
        switch(_type){
            // upload progress
            case 1 :
                this._$dispatchEvent('onuploading',arguments[1]);
            break;
            // state change
            case 2 :
                if (this.__xhr.readyState==4)
                    this.__onLoadRequest({
                        status:this.__xhr.status,
                        result:this.__xhr.responseText||''
                    });
            break;
            // timeout
            case 3:
                this.__onLoadRequest({status:-1});
            break;
        }
    };
    /**
     * 中断请求
     * @method {_$abort}
     * @return {nej.ut.j._$$XHRProxy}
     */
    _proXHRProxy._$abort = function(){
        this.__onLoadRequest({status:0});
        return this;
    };
};
define('{lib}util/ajax/proxy/xhr.js',
      ['{lib}util/ajax/proxy/proxy.js'],f);