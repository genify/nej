/*
 * ------------------------------------------
 * Ajax代理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/klass.js',
    '{lib}base/util.js',
    '{lib}base/element.js',
    '{lib}base/config.js',
    '{lib}base/constant.js',
    '{lib}util/event.js',
    '{lib}util/cache/cookie.js',
    '{lib}util/encode/json.js'
],function(_k,_u,_e,_c,_g,_t,_j,JSON,_p,_o,_f,_r){
    var _pro;
    /**
     * Ajax代理对象
     * 
     * @class   {_$$Proxy}
     * @extends {_$$Event}
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
     * 载入回调
     * @event {onload}
     * @param {Object} 数据信息
     * 
     * [hr]
     * 异常回调
     * @event {onerror}
     * @param {Object}  数据信息
     * 
     * [hr]
     * 请求之前对数据处理回调
     * @event {onbeforerequest}
     * @param  {Object} 请求信息
     * @config {Object} request 请求参数，数据信息 url/sync/cookie/type/method/timeout
     * @config {Object} headers 请求头信息
     */
    _p._$$Proxy = _k._$klass();
    _pro = _p._$$Proxy._$extend(_t._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
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
     * @protected
     * @method {__destroy}
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
     * @protected
     * @method {__onLoadRequest}
     * @param  {Object} 数据信息
     * @config {Number} status 请求状态
     * @config {String} result 请求结果，纯文本形式
     * @return {Void}
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
     * @protected
     * @method {__doSendRequest}
     * @param  {Object} 请求信息
     * @return {Void}
     */
    _pro.__doSendRequest = _f;
    /**
     * 取头信息，子类实现具体业务逻辑
     * @protected
     * @method {__getResponseHeader}
     * @param  {String} 要取的头信息名称
     * @return {String} 头信息结果或集合
     */
    _pro.__getResponseHeader = _f;
    /**
     * 发送请求
     * @method {_$send}
     * @param  {Variable} 要发送的数据
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
     * @method {_$abort}
     * @return {Void}
     */
    _pro._$abort = _f;
    /**
     * 取头信息
     * @method {_$header}
     * @param  {String|Array}  要取的头信息名称
     * @return {String|Object} 头信息结果或集合
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
