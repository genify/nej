/*
 * ------------------------------------------
 * Ajax代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _g = _('nej.g'),
        _e = _('nej.e'),
        _t = _('nej.ut'),
        _p = _('nej.ut.j'),
        _proProxy;
    if (!!_p._$$Proxy) return;
    /**
     * Ajax代理对象
     * 
     * @class   {nej.ut.j._$$Proxy}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object}  构造配置参数
     * @config  {String}  url     请求地址
     * @config  {Boolean} sync    是否同步请求
     * @config  {String}  type    返回数据格式,text/json/xml
     * @config  {String}  method  请求方式,GET/POST
     * @config  {Number}  timeout 超时时间,0表示禁止超时监测
     * @config  {Object}  headers 头信息
     * 
     * [hr]
     * 
     * @event {onload} 载入回调
     * @param {Object} 数据信息
     * 
     * [hr]
     * 
     * @event {onerror} 异常回调
     * @param {Object}  数据信息
     * 
     * [hr]
     * 
     * @event {onbeforerequest} 请求之前对数据处理回调
     * @param {Object}             数据信息
     * 
     */
    _p._$$Proxy = NEJ.C();
      _proProxy = _p._$$Proxy._$extend(_t._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proProxy.__reset = function(_options){
        this.__supReset(_options);
        // reset request information
        this.__request = {
            url:'',
            sync:!1,
            cookie:!1,
            type:'text',
            method:'GET',
            timeout:60000
        };
        NEJ.EX(this.__request,_options);
        // reset headers
        this.__headers = _options.headers||{};
        var _content = this.__headers[_g._$HEAD_CT];
        if (_content==null)
            this.__headers[_g._$HEAD_CT] = 
                           _g._$HEAD_CT_FORM;
    };
    /**
     * 回收控件
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proProxy.__destroy = function(){
        this.__supDestroy();
        delete this.__rkey;
        delete this.__request;
        delete this.__headers;
    };
    /**
     * 请求载入回调
     * @protected
     * @method {__onLoadRequest}
     * @param  {Object} 数据信息
     * @config {Number} status 请求状态
     * @config {String} result 请求结果，纯文本形式
     * @return {Void}
     */
    _proProxy.__onLoadRequest = function(_event){
        var _status = _event.status;
        // timeout error
        if (_status==-1){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_TIMEOUT,
                message:'请求['+this.__request.url+']超时！'
            });
            return;
        }
        // check status
        if ((''+_status).indexOf('2')!=0){
            this._$dispatchEvent('onerror',{
                data:_status,
                code:_g._$CODE_ERRSERV,
                message:'服务器返回异常状态['+_status+']!'
            });
            return;
        }
        // onload
        this._$dispatchEvent('onload',
             _e._$text2type(_event.result,
                      this.__request.type));
    };
    /**
     * 往服务器发送请求，子类实现具体业务逻辑
     * @protected
     * @method {__doSendRequest}
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _proProxy.__doSendRequest = _f;
    /**
     * 发送请求
     * @method {_$send}
     * @param  {Variable} 要发送的数据
     * @return {nej.ut.j._$$Proxy}
     */
    _proProxy._$send = function(_data){
        var _url = this.__request.url;
        if (!_url){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_NOTASGN,
                message:'没有输入请求地址！'
            });
            return this;
        }
        try{
            this.__request.data = _data==null?null:_data;
            var _event = {
                    request:this.__request,
                    headers:this.__headers
                };
            // adjust param before request
            try{
                this._$dispatchEvent('onbeforerequest',_event);
            }catch(ex){
                // ignore exception
                console.error(ex.message);
                console.error(ex.stack);
            }
            this.__doSendRequest(_event);
        }catch(e){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_ERRSERV,
                message:'请求['+_url+']失败:'+e.message+'！'
            });
        }
        return this;
    };
    /**
     * 中断请求，子类实现具体业务逻辑
     * @method {_$abort}
     * @return {Void}
     */
    _proProxy._$abort = _f;
};
NEJ.define('{lib}util/ajax/proxy/proxy.js',
      ['{patch}config.js'
      ,'{lib}base/util.js'
      ,'{lib}base/event.js'
      ,'{lib}base/constant.js'
      ,'{lib}base/element.js'
      ,'{lib}util/event.js'],f);