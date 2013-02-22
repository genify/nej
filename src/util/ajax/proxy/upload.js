/*
 * ------------------------------------------
 * 文件上传代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _g = _('nej.g'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _j = _('nej.j'),
        _p = _('nej.ut.j'),
        _cache = {},
        _proUploadProxy;
    if (!!_p._$$UploadProxy) return;
    /**
     * 文件上传代理
     * 
     * @class   {nej.ut.j._$$UploadProxy}
     * @extends {nej.ut._$$Proxy}
     * @param   {Object}  构造配置参数
     * 
     */
    _p._$$UploadProxy = NEJ.C();
      _proUploadProxy = _p._$$UploadProxy._$extend(_p._$$Proxy);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proUploadProxy.__init = (function(){
        var _flag = 'NEJ-UPLOAD-RESULT:',
            _init = !1;
        // receive message callback
        var _doReceiveMessage = function(_event){
            var _data = _event.data;
            if (_data.indexOf(_flag)!=0) return;
            _data = JSON.parse(_data.replace(_flag,''));
            var _proxy = _cache[_data.key];
            if (!_proxy) return;
            delete _cache[_data.key];
            _proxy.__onLoadRequest(
                decodeURIComponent(_data.result));
        };
        // init message listener
        var _doInitMessage = function(){
            if (!_init){
                _init = !0;
                _v._$addEvent(window,'message',_doReceiveMessage);
            }
        };
        return function(){
            this.__supInit();
            _doInitMessage();
        };
    })();
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proUploadProxy.__destroy = function(){
        this.__supDestroy();
        _e._$remove(this.__frame);
        delete this.__frame;
        window.clearTimeout(this.__timer);
        delete this.__timer;
    };
    /**
     * 请求载入回调
     * @protected
     * @method {__onLoadRequest}
     * @param  {String} 数据信息
     * @return {Void}
     */
    _proUploadProxy.__onLoadRequest = function(_text){
        var _json;
        try{
            _json = JSON.parse(_text);
            this._$dispatchEvent('onload',_json);
        }catch(e){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_ERREVAL,
                message:_text
            });
        }
    };
    /**
     * 往服务器发送请求
     * @protected
     * @method {__doSendRequest}
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proUploadProxy.__doSendRequest = (function(){
        // same domain upload result check
        var _doCheckResult = function(){
            var _body,_text;
            try{
                var _body = this.__frame.contentWindow.document.body,
                    _text = _body.innerText||_body.textContent;
            }catch(e){
                // ignore if not same domain
                return;
            }
            this.__onLoadRequest(_text);
        };
        // check upload progress
        var _doProgress = function(_url,_mode,_cookie){
            _j._$request(_url,{
                type:'json',
                method:'POST',
                cookie:_cookie,
                mode:parseInt(_mode)||0,
                onload:function(_data){
                    if (!this.__timer) return;
                    this._$dispatchEvent('onuploading',_data);
                    this.__timer = window.setTimeout(
                          _doProgress._$bind(this,_url,_mode,_cookie),1000);
                }._$bind(this),
                onerror:function(_error){
                    if (!this.__timer) return;
                    this.__timer = window.setTimeout(
                          _doProgress._$bind(this,_url,_mode,_cookie),1000);
                }._$bind(this)
            });
        };
        return function(_options){
            var _request = _options.request,
                _headers = _options.headers,
                _form = _request.data,
                _name = 'fom-'+_u._$randNumberString();
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
                    _v._$addEvent(_frame,'load',
                       _doCheckResult._$bind(this));
                    _form.submit();
                    var _qurl = (_form.nej_query||_o).value;
                    if (!_qurl) return;
                    var _mode = (_form.nej_mode||_o).value,
                        _cookie = (_form.nej_cookie||_o).value=='true';
                    this.__timer = window.setTimeout(
                          _doProgress._$bind(this,_qurl,_mode,_cookie),100);
                }._$bind(this)
            });
        };
    })();
};
NEJ.define('{lib}util/ajax/proxy/upload.js',
      ['{lib}util/ajax/message.js'
      ,'{lib}util/ajax/proxy/proxy.js'],f);