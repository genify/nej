/*
 * ------------------------------------------
 * REST交互接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/rest */
NEJ.define([
    'base/global',
    'base/event',
    'base/util',
    'base/constant',
    'util/ajax/xdr',
    'util/event/event'
],function(NEJ,_v,_u,_g,_j,_t,_p,_o,_f,_r){
    /**
     * 使用REST进行数据交互接口
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/event',
     *     'util/ajax/rest'
     * ],function(_v,_j){
     *     // 通用错误处理，所有请求异常均会调用此回调处理
     *     _v._$addEvent(
     *         window,'resterror',function(_error){
     *             // _error.code
     *             // _error.message
     *             // _error.data
     *             // 通过设置_error.stopped阻止事件回调到请求的onerror中
     *         }
     *     );
     *
     *     var url = "http://a.b.com/rest/list";
     *     var opt = {
     *          param:{brand:'nokia',model:'9'},
     *          data:'123',
     *          method:'post',
     *          onload:function(_data){
     *              // 请求正常回调
     *          },
     *          onerror:function(_error){
     *              // _error.code
     *              // _error.message
     *              // _error.data
     *              // 如果window的resterror回调中stopped了事件则不会进入此回调
     *          },
     *          onbeforerequest:function(_event){
     *              // _event.request
     *              // _event.headers
     *          }
     *     }
     *     _j._$request(url,opt);
     * });
     * ```
     *
     * @method module:util/ajax/rest._$request
     * @param    {String}  arg0 - 请求地址
     * @param    {Object}  arg1 - 可选配置参数
     * @property {Boolean}  sync    - 是否同步请求
     * @property {Variable} data    - 要发送的数据
     * @property {Object}   param   - 请求参数,包括模板地址里使用的参数
     * @property {String}   method  - 请求方式,GET/POST/PUT/DELETE
     * @property {Number}   timeout - 超时时间,0 禁止超时监测
     * @property {Object}   headers - 头信息，标准HTTP头字段
     * @property {Object}   result  - onload回调输入时需包含的额外信息
     *
     * @property {module:util/ajax/xdr.onload} onload   - 请求载入成功回调
     * @property {module:util/ajax/xdr.onerror} onerror - 请求载入失败回调
     * @property {module:util/ajax/xdr.onbeforerequest} onbeforerequest - 发起请求之前回调
     *
     * @return   {String} 请求标识
     */
    _p._$request = (function(){
        var _cache = {},  // request cache - sn:{s:funciton(){},f:function(){}}
            _reg0 = /\{(.*?)\}/gi, // /api/{appid}/question/{id}
            _reg2 = /\/:([\w]+?)(?=\/|$)/gi, // /api/:appid/question/:id
            _reg1 = /^get|delete|head$/i,
            _jsn = /json/i,
            _xml = /xml/i;
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
                if (DEBUG) throw ex;
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
            _v._$dispatchEvent(
                window,'resterror',_error
            );
            if (!!_error.stopped){
                _doClear(_key);
                return;
            }
            // do request fail callback
            _doCallback(_key,'f',_error);
        };
        // check default headers
        var _doCheckWithDefault = function(_headers,_key,_default){
            var _value = _headers[_key]||
                         _headers[_key.toLowerCase()];
            if (!_value){
                _value = _default;
                _headers[_key] = _value;
            }
            return _value;
        };
        // pre convert array
        var _doCheckData = function(_data,_key,_map){
            if (_u._$isArray(_data)){
                _map[_key] = JSON.stringify(_data);
            }
        };
        // format rest url
        var _doFormatURL = function(url, param, data, exist){
            var getVal = function(key){
                var _value = param[key];
                if (_value!=null){
                    exist[key] = !0;
                }else{
                    _value = data[key];
                }
                return encodeURIComponent(_value||'');
            };
            var ret = url.replace(_reg0,function($1,$2){
                    return getVal($2)||$1;
                }),
                ret = ret.replace(_reg2,function($1,$2){
                    var val = getVal($2);
                    return !val?$1:('/'+val);
                });
            return ret;
        };
        return function(_url,_options){
            _options = _u._$merge({},_options);
            var _exist = {},
                _param = _options.param||_o,
                _data  = _options.data||{};
            // parse uri template
            _url = _doFormatURL(
                _url,_param,
                _data,_exist
            );
            // parse remain param
            _u._$loop(
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
            var _key = _u._$uniqueID();
            _cache[_key] = {
                s:_options.onload||_f,
                f:_options.onerror||_f
            };
            // add params to url with GET/HEAD/DELETE method
            // fix rest can't send null bug
            _options.method = _options.method||'GET';
            if (_reg1.test(_options.method.trim())||
                _options.data==null){
                _u._$forIn(_data,_doCheckData);
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
            return _j._$request(_url,_options);
        };
    })();
    /**
     * 中断请求
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/rest'
     * ],function(_j){
     *     var _id = _j._$request(
     *         'http://123.163.com/rest/add',{
     *             method:'POST',
     *             data:{name:'ABC'},
     *             timeout:60000,
     *             onload:function(_data){
     *                 // TODO
     *             },
     *             onerror:function(_error){
     *                 // TODO
     *             }
     *         }
     *     );
     *     // 1秒后中断掉这个请求
     *     window.setTimeout(
     *         function(){
     *             _j._$abort(_id);
     *         },1000
     *     );
     * });
     * ```
     *
     * @method module:util/ajax/rest._$abort
     * @param  {String} arg0 - 请求标识
     * @return {Void}
     */
    _p._$abort = function(_sn){
        _j._$abort(_sn);
    };
    /**
     * 通用载入出错回调函数，所有REST请求的异常均会进入此事件的回调逻辑中
     *
     * @event    external:window.onresterror
     * @param    {Object}   event   - 错误信息
     * @property {Number}   code    - 错误代码
     * @property {String}   message - 错误描述
     * @property {Variable} data    - 出错时携带数据
     * @property {Boolean}  stopped - 是否阻止单个请求中的onerror回调
     */
    _t._$$CustomEvent._$allocate({
        element:window,
        event:'resterror'
    });

    if (CMPT){
        NEJ.P('nej.j')._$requestByREST = _p._$request;
    }

    return _p;
});
