/*
 * ------------------------------------------
 * 文件上传代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/proxy/upload */
NEJ.define([
    './proxy.js',
    'base/klass',
    'base/util',
    'base/event',
    'base/element',
    'base/constant',
    'util/ajax/xdr',
    'util/ajax/message'
],function(_t,_k,_u,_v,_e,_g,_j0,_j1,_p,_o,_f,_r){
    var _pro,
        _cache = {},
        _xflag = 'NEJ-UPLOAD-RESULT:';
    /**
     * 文件上传代理
     *
     * @class   module:util/ajax/proxy/upload._$$ProxyUpload
     * @extends module:util/ajax/proxy/proxy._$$ProxyAbstract
     *
     * @param   {Object}  config - 构造配置参数
     */
    _p._$$ProxyUpload = _k._$klass();
    _pro = _p._$$ProxyUpload._$extend(_t._$$ProxyAbstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/ajax/proxy/upload._$$ProxyUpload#__init
     * @return {Void}
     */
    _pro.__init = (function(){
        var _init = !1;
        // receive message callback
        var _doReceiveMessage = function(_event){
            var _data = _event.data;
            if (_data.indexOf(_xflag)!=0) return;
            _data = JSON.parse(_data.replace(_xflag,''));
            var _proxy = _cache[_data.key];
            if (!_proxy) return;
            delete _cache[_data.key];
            _proxy.__onLoadRequest(
                decodeURIComponent(_data.result)
            );
        };
        // init message listener
        var _doInitMessage = function(){
            if (!_init){
                _init = !0;
                _v._$addEvent(
                    window,'message',
                    _doReceiveMessage
                );
            }
        };
        return function(){
            this.__super();
            _doInitMessage();
        };
    })();
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/ajax/proxy/upload._$$ProxyUpload#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        _e._$remove(this.__frame);
        delete this.__frame;
        window.clearTimeout(this.__timer);
        delete this.__timer;
    };
    /**
     * 请求载入回调
     * 
     * @protected
     * @method module:util/ajax/proxy/upload._$$ProxyUpload#__onLoadRequest
     * @param  {String} arg0 - 数据信息
     * @return {Void}
     */
    _pro.__onLoadRequest = function(_text){
        try{
            var _ret = _e._$text2type(
                _text,this.__request.type
            );
            this._$dispatchEvent('onload',_ret);
        }catch(ex){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_ERREVAL,
                message:_text
            });
        }
    };
    /**
     * 往服务器发送请求
     * 
     * @protected
     * @method module:util/ajax/proxy/upload._$$ProxyUpload#__doSendRequest
     * @param  {Object} arg0 - 请求信息
     * @return {Void}
     */
    _pro.__doSendRequest = (function(){
        // same domain upload result check
        var _doCheckResult = function(){
            var _body,_text;
            try{
                var _body = this.__frame.contentWindow.document.body,
                    _text = (_body.innerText||_body.textContent||'').trim();
                // check result for same domain with upload proxy html
                if (_text.indexOf(_xflag)>=0||
                    _body.innerHTML.indexOf(_xflag)>=0){
                    // use post message path
                    return;
                }
            }catch(ex){
                // ignore if not same domain
                return;
            }
            this.__onLoadRequest(_text);
        };
        // check upload progress
        var _doProgress = function(_url,_mode,_cookie){
            _j0._$request(_url,{
                type:'json',
                method:'POST',
                cookie:_cookie,
                mode:parseInt(_mode)||0,
                onload:function(_data){
                    if (!this.__timer) return;
                    this._$dispatchEvent('onuploading',_data);
                    this.__timer = window.setTimeout(
                        _doProgress._$bind(
                            this,_url,_mode,_cookie
                        ),1000
                    );
                }._$bind(this),
                onerror:function(_error){
                    if (!this.__timer) return;
                    this.__timer = window.setTimeout(
                        _doProgress._$bind(
                            this,_url,_mode,_cookie
                        ),1000
                    );
                }._$bind(this)
            });
        };
        return function(_options){
            var _request = _options.request,
                _headers = _options.headers,
                _form = _request.data,
                _name = _u._$uniqueID();
            _cache[_name]  = this;
            _form.target   = _name;
            _form.method   = 'POST';
            _form.enctype  = _g._$HEAD_CT_FILE;
            _form.encoding = _g._$HEAD_CT_FILE;
            var _url = _form.action||'',
                _sep = _url.indexOf('?')<=0?'?':'&';
            _form.action = _url+_sep+'_proxy_=form';
            this.__frame = _e._$createXFrame({
                name:_name,
                onload:function(_event){
                    var _frame = _v._$getElement(_event);
                    _v._$addEvent(
                        _frame,'load',
                        _doCheckResult._$bind(this)
                    );
                    _form.submit();
                    var _qurl = (_form.nej_query||_o).value;
                    if (!_qurl) return;
                    var _mode = (_form.nej_mode||_o).value,
                        _cookie = (_form.nej_cookie||_o).value==='true';
                    this.__timer = window.setTimeout(
                        _doProgress._$bind(
                            this,_qurl,_mode,_cookie
                        ),100
                    );
                }._$bind(this)
            });
        };
    })();
    /**
     * 中断请求
     * 
     * @method module:util/ajax/proxy/upload._$$ProxyUpload#_$abort
     * @return {Void}
     */
    _pro._$abort = function(){
        this.__onAbort();
    };

    return _p;
});
