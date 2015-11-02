/*
 * ------------------------------------------
 * Ajax代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/proxy/proxy */
NEJ.define([
    'base/klass',
    'base/util',
    'base/element',
    'base/config',
    'base/constant',
    'util/event',
    'util/cache/cookie',
    'util/encode/json'
],function(_k,_u,_e,_c,_g,_t,_j,JSON,_p,_o,_f,_r){
    var _pro;
    /**
     * Ajax代理对象
     * 
     * @class   module:util/ajax/proxy/proxy._$$ProxyAbstract
     * @extends module:util/event._$$EventTarget
     * 
     * @param    {Object}  config  - 构造配置参数
     * @property {String}  url     - 请求地址
     * @property {Boolean} sync    - 是否同步请求
     * @property {String}  type    - 返回数据格式,text/json/xml
     * @property {String}  method  - 请求方式,GET/POST
     * @property {Number}  timeout - 超时时间,0表示禁止超时监测
     * @property {Object}  headers - 头信息
     */
    /** 
     * 载入回调
     * 
     * @event module:util/ajax/proxy/proxy._$$ProxyAbstract#onload
     * @param {Object} event - 服务器返回数据信息
     */
    /** 
     * 异常回调
     * 
     * @event    module:util/ajax/proxy/proxy._$$ProxyAbstract#onerror
     * @param    {Object}   event   - 错误信息
     * @property {Number}   code    - 错误代码
     * @property {String}   message - 错误描述
     * @property {Variable} data    - 出错时携带数据
     */
    /** 
     * [hr]
     * 请求之前对数据处理回调
     * @event    module:util/ajax/proxy/proxy._$$ProxyAbstract#onbeforerequest
     * @param    {Object} event   - 请求信息
     * @property {Object} request - 请求参数，数据信息 url/sync/cookie/type/method/timeout
     * @property {Object} headers - 请求头信息
     */
    _p._$$ProxyAbstract = _k._$klass();
    _pro = _p._$$ProxyAbstract._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/ajax/proxy/proxy._$$ProxyAbstract#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        // reset request information
        this.__request = _u._$fetch({
            url:'',
            sync:!1,
            cookie:!1,
            type:'text',
            method:'GET',
            timeout:60000
        },_options);
        // for csrf attack
        var _csrf = _c._$get('csrf');
        if (!!_csrf.cookie&&!!_csrf.param){
            var _query = encodeURIComponent(_csrf.param)+'='+
                         encodeURIComponent(_j._$cookie(_csrf.cookie)||''),
                _split = this.__request.url.indexOf('?')<0?'?':'&';
            this.__request.url += _split+_query;
        }
        // reset headers
        this.__headers = _options.headers||{};
        var _content = this.__headers[_g._$HEAD_CT];
        if (_content==null){
            this.__headers[_g._$HEAD_CT] = _g._$HEAD_CT_FORM;
        }
    };
    /**
     * 回收控件
     * 
     * @protected
     * @method module:util/ajax/proxy/proxy._$$ProxyAbstract#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__rkey;
        delete this.__request;
        delete this.__headers;
    };
    /**
     * 请求载入回调
     * 
     * @protected
     * @method   module:util/ajax/proxy/proxy._$$ProxyAbstract#__onLoadRequest
     * @param    {Object} arg0   - 数据信息
     * @property {Number} status - 请求状态
     * @property {String} result - 请求结果，纯文本形式
     * @return   {Void}
     */
    _pro.__onLoadRequest = function(_event){
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
                result:_event.result,
                code:_g._$CODE_ERRSERV,
                message:'服务器返回异常状态['+_status+']!'
            });
            return;
        }
        // onload
        this._$dispatchEvent(
             'onload',_e._$text2type(
                 _event.result,
                 this.__request.type
             )
        );
    };
    /**
     * 往服务器发送请求，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/ajax/proxy/proxy._$$ProxyAbstract#__doSendRequest
     * @param  {Object} arg0 - 请求信息
     * @return {Void}
     */
    _pro.__doSendRequest = _f;
    /**
     * 取头信息，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/ajax/proxy/proxy._$$ProxyAbstract#__getResponseHeader
     * @param  {String} arg0 - 要取的头信息名称
     * @return {String}        头信息结果或集合
     */
    _pro.__getResponseHeader = _f;
    /**
     * 请求终止事件
     * @private
     */
    _pro.__onAbort = function(){
        this._$dispatchEvent('onerror',{
            code:_g._$CODE_ERRABRT,
            message:'客户端终止请求'
        });
    };
    /**
     * 发送请求
     * 
     * @method module:util/ajax/proxy/proxy._$$ProxyAbstract#_$send
     * @param  {Variable} arg0 - 要发送的数据
     * @return {Void}
     */
    _pro._$send = function(_data){
        var _url = this.__request.url;
        if (!_url){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_NOTASGN,
                message:'没有输入请求地址！'
            });
            return;
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
    };
    /**
     * 中断请求，子类实现具体业务逻辑
     *
     * @abstract
     * @method module:util/ajax/proxy/proxy._$$ProxyAbstract#_$abort
     * @return {Void}
     */
    _pro._$abort = _f;
    /**
     * 取头信息
     * 
     * @method module:util/ajax/proxy/proxy._$$ProxyAbstract#_$header
     * @param  {String|Array}  arg0 - 要取的头信息名称
     * @return {String|Object}        头信息结果或集合
     */
    _pro._$header = function(_key){
        if (!_u._$isArray(_key)){
            return this.__getResponseHeader(_key)||'';
        }
        var _result = {};
        _u._$forEach(
            _key,function(_value){
                _result[_value] = this._$header(_value);
            },this
        );
        return _result;
    };
    
    return _p;
});
