/*
 * ------------------------------------------
 * REST交互接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _ = NEJ.P,
        _r = NEJ.R,
        _o = NEJ.O,
        _f = NEJ.F,
        _g = _('nej.g'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _j = _('nej.j'),
        _t = _('nej.ut'),
        _cache = {};  // request cache - sn:{s:funciton(){},f:function(){}}
    /**
     * 使用REST进行数据交互接口<br/>
     * 脚本举例
     * [code]
     *   // 通用错误处理，所有请求异常均会调用此回调处理
     *   nej.v._$addEvent(
     *       window,'resterror',function(_error){
     *           // _error.code
     *           // _error.message
     *           // _error.data
     *           // 通过设置_error.stopped阻止事件回调到请求的onerror中
     *       }
     *   );
     * 
     *   var url = "http://a.b.com/rest/list";
     *   var opt = {
     *        param:{brand:'nokia',model:'9'}
     *       ,data:'123'
     *       ,method:'post'
     *       ,onload:function(_data){
     *           // 请求正常回调
     *       }
     *       ,onerror:function(_error){
     *           // _error.code
     *           // _error.message
     *           // _error.data
     *           // 如果window的resterror回调中stopped了事件则不会进入此回调
     *       },
     *       onbeforerequest:function(_event){
     *           // _event.request
     *           // _event.headers
     *       }
     *   }
     *   nej.j._$requestByREST(url,opt);
     * [/code]
     * @api    {nej.j._$requestByREST}
     * @param  {String} 请求地址
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {Boolean}  sync    是否同步请求
     * @config {Variable} data    要发送的数据
     * @config {Object}   param   请求参数,包括模板地址里使用的参数
     * @config {String}   method  请求方式,GET/POST/PUT/DELETE
     * @config {Number}   timeout 超时时间,0 禁止超时监测
     * @config {Object}   headers 头信息
     * @config {Object}   result  onload回调输入时需包含的额外信息
     * @return {nej.j}
     * 
     * [hr]
     * 载入完成回调函数
     * @event  {onload} 
     * @param  {Variable} 服务器返回的数据
     * 
     * [hr]
     * 载入出错回调函数
     * @event  {onerror} 
     * @param  {Object}   错误信息
     * @config {Number}   code    错误代码
     * @config {String}   message 错误描述
     * @config {Variable} data    出错时携带数据
     * 
     * [hr]
     * 请求之前对数据处理回调
     * @event  {onbeforerequest} 
     * @param  {Object} 数据对象
     * @config {Object} headers 要发送的请求的头信息
     * @config {Object} request 请求信息，{url:'',sync:!1,cookie:!1,type:'text',method:'GET',timeout:60000}
     * 
     * [hr]
     * 通用载入出错回调函数，所有请求的异常均会进入此事件的回调逻辑中
     * @event  {window.onresterror}
     * @param  {Object}   错误信息
     * @config {Number}   code    错误代码
     * @config {String}   message 错误描述
     * @config {Variable} data    出错时携带数据
     * @config {Boolean}  stopped 是否阻止当个请求中的onerror回调
     */
    _j._$requestByREST = (function(){
        var _reg0 = /\{(.*?)\}/gi,
            _reg1 = /^get|delete|head$/i,
            _jsn = /json/i,
            _xml = /xml/i,
            _seed = +new Date;
        // clear request
        var _doClear = function(_key){
            var _request = _cache[_key];
            if (!_request) return;
            delete _request.s;
            delete _request.f;
            delete _cache[_key];
        };
        // request callback
        var _doCallback = function(_key,_type){
            var _request = _cache[_key];
            if (!_request) return;
            var _callback = _request[_type],
                _args = _r.slice.call(arguments,2);
            try{
                (_callback||_f).apply(null,_args);
            }catch(ex){
                // ignore
                console.error(ex.message);
                console.error(ex);
            }
            _doClear(_key);
        };
        // request success
        var _onLoad = function(_key,_data){
            _doCallback(_key,'s',_data);
        };
        // request error
        var _onError = function(_key,_error){
            _error = _error||{};
            // status 204 is ok
            if (_error.code==_g._$CODE_ERRSERV&&
                _error.data==204){
                _onLoad(_key,null);
                return;
            }
            // do error filter
            // set error attr stopped=!0 will stop request error callback
            _v._$dispatchEvent(window,'resterror',_error);
            if (!!_error.stopped){
                _doClear(_key);
                return;
            }
            // do request fail callback
            _doCallback(_key,'f',_error);
        };
        // check default headers
        var _doCheckWithDefault = function(_headers,_key,_default){
            var _value = _headers[_key]||_headers[_key.toLowerCase()];
            if (!_value){
                _value = _default;
                _headers[_key] = _value;
            }
            return _value;
        };
        return function(_url,_options){
            _options = NEJ.X({},_options);
            var _exist = {},
                _param = _options.param||_o;
            // parse uri template
            _url = _url.replace(_reg0,function($1,$2){
                var _value = _param[$2];
                if (_value!=null) _exist[$2] = !0;
                return encodeURIComponent(_value||'')||$1;
            });
            // parse remain param 
            var _data = _options.data||{};
            _u._$forIn(
                _param,function(_value,_key){
                    if (!_exist[_key]){
                        _data[_key] = _value;
                    }
                }
            );
            // parse headers
            var _type = 'text',
                _headers = _options.headers||{},
                _accept  = _doCheckWithDefault(_headers,'Accept','application/json'),
                _content = _doCheckWithDefault(_headers,'Content-Type','application/json');
            // response data format
            if (_jsn.test(_accept)){
                _type = 'json';
            }else if(_xml.test(_accept)){
                _type = 'xml';
            }
            // do request
            var _key = 'rest-'+(_seed++);
            _cache[_key] = {
                s:_options.onload||_f,
                f:_options.onerror||_f
            };
            // add params to url with GET/HEAD/DELETE method
            _options.method = _options.method||'GET';
            if (_reg1.test(_options.method.trim())){
                _options.query = _data;
                _data = null;
            }else if (_jsn.test(_content)){
                _data = JSON.stringify(_data);
            }
            _options.type    = _type;
            _options.data    = _data;
            _options.headers = _headers;
            _options.onload  = _onLoad._$bind(null,_key);
            _options.onerror = _onError._$bind(null,_key);
            _j._$request(_url,_options);
            return this;
        };
    })();
    // custom event on window.onresterror
    _t._$$CustomEvent._$allocate({
        element:window,
        event:'resterror'
    });
};
// define dependency
NEJ.define(
    '{lib}util/ajax/rest.js',[
    '{lib}base/event.js',
    '{lib}util/ajax/xdr.js',
    '{lib}util/event/event.js'
],f);