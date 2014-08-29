/*
 * ------------------------------------------
 * DWR框架前端引擎实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/dwr */
NEJ.define([
    'base/global',
    'base/constant',
    'base/util',
    'util/ajax/xdr',
    'util/ajax/tag',
    'util/cache/cookie'
],function(NEJ,_g,_u,_j0,_j1,_j2,_p,_o,_f,_r){
    var _batchid,         // 请求ID标识
        _doFilter = _f,   // 全局异常过滤器
        _xcache   = {},   // 请求缓存
        _cname    = 'JSESSIONID',
        _xbatch   = null; // 请求临时构造对象，范例
                          // {h:{0:{c:function(){},   // callback
                          //        e:function(){}}}, // exception
                          //  p:1,                    // param number
                          //  u:'http://xxxx/x.x.dwr',// url
                          //  r:{script:!1,sync:!1,method:'POST',timeout:null}
                          //                          // request options
                          //  m:{}}                   // send data
    /**
     * 设置全局异常过滤器
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/dwr'
     * ],function(_j){
     *     // 所有请求对错误码是401的情况不做处理
     *     _j._$setFilter(function(_event){
     *         // _event.code
     *         // _event.message
     *
     *         return _event.code == 401;
     *     });
     * });
     * ```
     *
     * @method module:util/ajax/dwr._$setFilter
     * @param  {Function}  arg0 - 过滤器,过滤器返回值
     *
     * * true  - 不继续执行后续错误处理接口
     * * false - 继续执行后续错误处理接口
     *
     * @return {Void}
     */
    _p._$setFilter = function(_filter){
        _doFilter = _u._$isFunction(_filter)?_filter:_f;
    };
    /**
     * 设置CSRF使用的cookie名，请求时会将此cookie对应的值带在参数上发送到服务器
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/dwr'
     * ],function(_j){
     *     _j._$setCookieName('CSRF-CKN');
     *
     *     // 假设cookie里有CSRF-CKN的值为asldjsdi23234asdfasdf
     *     // 则以下请求参数中带有httpSessionId=asldjsdi23234asdfasdf
     *     // 服务器端取请求参数中的httpSessionId值与cookie中的CSRF-CKN值比较，判断是否是伪造请求
     *     _j._$request(
     *         'DownloadBean.getDownloadUrlByBrandAndModel1',{
     *             path:'/dwr/call/plaincall/',
     *             script:false,
     *             param:["nokia","n97"],
     *             onload:function(data){
     *                 // TODO
     *             },onerror:function(error){
     *                 // TODO
     *             }
     *         }
     *     );
     * });
     * ```
     *
     * @method module:util/ajax/dwr._$setCookieName
     * @param  {String} arg0 - cookie名称
     * @return {Void}
     */
    _p._$setCookieName = function(_name){
        _cname = _name||_cname;
    };
    /**
     * 设置请求标识
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/dwr'
     * ],function(_j){
     *     // 手动设置请求标识
     *     _j._$setBatchId('batchId-12345');
     * });
     * ```
     *
     * @method module:util/ajax/dwr._$setBatchId
     * @param  {String} arg0 - 请求标识
     * @return {Void}
     */
    _p._$setBatchId = function(_id){
        _batchid = _id||'';
    };
    /**
     * 开始批处理请求<br/>
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/dwr'
     * ],function(_j){
     *     _j._$begin();
     *     _j._$request(
     *         'DownloadBean.getDownloadUrlByBrandAndModel1',{
     *             path:'/dwr/call/plaincall/',
     *             script:false,
     *             param:["nokia","n97"],
     *             onload:function(data){
     *                 // TODO
     *             },onerror:function(error){
     *                 // TODO
     *             }
     *         }
     *     );
     *     _j._$request(
     *         'DownloadBean.getDownloadUrlByBrandAndModel2',{
     *             path:'/dwr/call/plaincall/',
     *             script:false,
     *             param:["nokia","n98"],
     *             onload:function(data){
     *                 // TODO
     *             },onerror:function(error){
     *                 // TODO
     *             }
     *         }
     *     );
     *     // 最后做一次请求发送
     *     _j._$end();
     * });
     * ```
     *
     * @method module:util/ajax/dwr._$begin
     * @see    module:util/ajax/dwr._$end
     * @return {Void}
     */
    _p._$begin = function(){
        if (!!_xbatch) return;
        _xbatch = {
            h:{},p:0,
            m:{
                callCount:0,
                scriptSessionId:'${scriptSessionId}190',
                httpSessionId:_j2._$cookie(_cname)
            },
            r:{
                script:!1,
                sync:!1,
                method:'POST',
                timeout:null,
                proxy:!0,
                cookie:!1,
                onbeforerequest:null
            }
        };
    };
    /**
     * 使用DWR方式载入数据
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/dwr'
     * ],function(_j){
     *     _j._$request(
     *         'LogBean.log',{
     *             path:'/dwr/call/plaincall/',
     *             script:true,param:{},
     *             onload:function(data){
     *                 // 正常回调方法
     *             },
     *             onerror:function(error){
     *                 // 异常回调
     *             },
     *             onbeforerequest:function(data){
     *                // 请求发送前对请求数据进行处理
     *             }
     *         }
     *     );
     * });
     * ```
     *
     * @method   module:util/ajax/dwr._$request
     * @param    {String}  arg0    - 请求地址,格式为class.method
     * @param    {Object}  arg1    - 可选配置参数
     * @property {String}  path    - 请求路径,默认为/dwr/call/plaincall/
     * @property {String}  query   - 请求地址附带的查询参数,格式a=aaa&b=bbb
     * @property {Array}   param   - 参数列表,不传或空数组均作为无参数处理
     * @property {String}  proxy   - 代理标识，使用该代理时忽略script/sync/method/timeout属性
     * @property {Boolean} script  - 使用脚本方式载入
     * @property {Boolean} sync    - 是否同步请求,使用脚本载入方式忽略此属性
     * @property {String}  method  - 请求方式,GET/POST,使用脚本载入方式忽略此属性
     * @property {Number}  timeout - 请求超时时间
     * @property {Object}  headers - 头信息,批处理请求合并所有头信息,同名的头信息后面请求覆盖前面请求
     * @property {String}  session - CSRF验证的COOKIE名称
     *
     * @property {module:util/ajax/xdr.onload}          onload  - 数据载入回调
     * @property {module:util/ajax/xdr.onerror}         onerror - 请求异常回调
     * @property {module:util/ajax/xdr.onbeforerequest} onbeforerequest - 请求之前回调
     *
     * @return   {Void}
     */
    _p._$request = function(_url,_options){
        var _info = (_url||'').split('.');
        if (!_info||_info.length!=2) return;
        var _single = !1;
        _options = _options||_o;
        if (!_xbatch){
            _single = !0;
            _p._$begin();
            if (!!_options.session){
                _xbatch.m.httpSessionId = _j2._$cookie(_options.session);
            }
        }
        _xbatch.u = (_options.path||'/dwr/call/plaincall/')+
                    (_options.query&&('?'+_options.query)||'');
        _u._$fetch(_xbatch.r,_options);
        var _headers = _u._$merge(
            _xbatch.r.headers,_options.headers
        );
        _headers[_g._$HEAD_CT] = _g._$HEAD_CT_PLAN;
        _xbatch.r.headers = _headers;
        var _prefix = 'c'+_xbatch.m.callCount;
        _xbatch.m[_prefix+'-scriptName'] = _info[0];
        _xbatch.m[_prefix+'-methodName'] = _info[1];
        _xbatch.m[_prefix+'-id'] = _xbatch.m.callCount;
        _xbatch.h[_xbatch.m.callCount] = {
            c:_options.onload||_f,
            e:_options.onerror||_f
        };
        _u._$forEach(
            _options.param,function(v,i){
                var _value = __doSerialize(v,_prefix);
                if (!!_value){
                    _xbatch.m[_prefix+'-param'+i] = _value;
                }
            }
        );
        _xbatch.m.callCount++;
        if (_single){
            _p._$end();
        }
    };
    /**
     * 结束请求批处理，正式发送请求
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/dwr'
     * ],function(_j){
     *     _j._$begin();
     *     _j._$request(
     *         'DownloadBean.getDownloadUrlByBrandAndModel1',{
     *             path:'/dwr/call/plaincall/',
     *             script:false,
     *             param:["nokia","n97"],
     *             onload:function(data){
     *                 // TODO
     *             },onerror:function(error){
     *                 // TODO
     *             }
     *         }
     *     );
     *     _j._$request(
     *         'DownloadBean.getDownloadUrlByBrandAndModel2',{
     *             path:'/dwr/call/plaincall/',
     *             script:false,
     *             param:["nokia","n98"],
     *             onload:function(data){
     *                 // TODO
     *             },onerror:function(error){
     *                 // TODO
     *             }
     *         }
     *     );
     *     // 最后做一次请求发送
     *     _j._$end();
     * });
     * ```
     *
     * @method module:util/ajax/dwr._$end
     * @see    module:util/ajax/dwr._$begin
     * @return {Void}
     */
    _p._$end = function(){
        if (!_xbatch||!_xbatch.u){
            _xbatch = null;
            return;
        }
        var _bid = _batchid||_u._$uniqueID();
        _batchid = 0;
        _xbatch.m.batchId = _bid;
        _xcache[_bid] = _xbatch;
        _xbatch = null;
        __doRequest(_bid);
    };
    /*
     * 销毁请求对象
     * @param  {String} 请求对象标识
     * @return {Void}
     */
    var __doDestroyBatch = function(_bid){
        var _batch = _xcache[_bid];
        if (!_batch) return;
        delete _batch.h;
        delete _batch.m;
        delete _xcache[_bid];
    };
    /*
     * 序列化数据
     * @param  {Variable} 数据
     * @param  {String}   前缀
     * @return {String}   序列化后的字串
     */
    var __doSerialize = function(_data,_prefix){
        if (_data==null){
            return 'null:null';
        }
        if (_u._$isBoolean(_data)){
            return 'boolean:'+!!_data;
        }
        if (_u._$isNumber(_data)){
            return 'number:'+_data;
        }
        if (_u._$isString(_data)){
            return 'string:'+encodeURIComponent(_data);
        }
        if (_u._$isDate(_data)){
            return 'Date:'+_data.getTime();
        }
        if (_u._$isArray(_data)){
            return __doSerializeArray(_data,_prefix);
        }
        if (_u._$isObject(_data)){
            return __doSerializeObject(_data,_prefix);
        }
        if (_u._$isFunction(_data,'function')){
            return '';
        }
        return 'default:'+_data;
    };
    /*
     * 序列化数组
     * @param  {Array}  _data   数组
     * @param  {String} _prefix 前缀
     * @return {String}         序列化后的字串
     */
    var __doSerializeArray = function(_list,_prefix){
        var _arr = [];
        _u._$forEach(
            _list,function(v,i){
                _xbatch.p++;
                var _ref = _prefix+'-e'+_xbatch.p,
                    _value = __doSerialize(v,_prefix);
                if (!_value) return;
                _xbatch.m[_ref] = _value;
                _arr.push('reference:'+_ref);
            }
        );
        return 'Array:['+_arr.join(',')+']';
    };
    /*
     * 序列化对像
     * @param  {Array}  _data   对像
     * @param  {String} _prefix 前缀
     * @return {String}         序列化后的字串
     */
    var __doSerializeObject = function(_object,_prefix){
        var _arr = [];
        _u._$forIn(
            _object,function(v,k){
                _xbatch.p++;
                var _ref = _prefix+'-e'+_xbatch.p,
                    _value = __doSerialize(v,_prefix);
                if (!_value) return;
                _xbatch.m[_ref] = _value;
                _arr.push(encodeURIComponent(k)+':reference:'+_ref);
            }
        );
        return 'Object_Object:{'+_arr.join(',')+'}';
    };
    /*
     * 序列化要发送的数据
     * @param  {Object} _data 数据对象
     * @param  {String} _sep  数据分隔符
     * @return {String}       数据字符串
     */
    var __doSerializeSendData = function(_data,_sep){
        if (!_data) return null;
        var _arr = [],
            _and = _sep=='&';
        _u._$forIn(
            _data,function(v,k){
                _arr.push(
                    !_and ? (p+'='+_data[p]) :
                    (encodeURIComponent(p)+'='+encodeURIComponent(_data[p]))
                );
            }
        );
        return _arr.join(_sep||'\n');
    };
    /*
     * 发送请求
     * @param  {String} _bid 请求标识
     * @return {Void}
     */
    var __doRequest = function(_bid){
        var _batch = _xcache[_bid];
        if (!_batch) return;
        _batch.u = _batch.u.replace(/(\?|$)/,(
                   _batch.m.callCount>1
                   ?'Multiple.'+_batch.m.callCount
                   :_batch.m['c0-scriptName']+'.'+
                    _batch.m['c0-methodName'])+'.dwr$1');
        var _option = _batch.r,
            _script = !!_option.script,
            _ispost = _option.method=='POST';
        delete _batch.r;
        delete _option.script;
        _option.method = _option.method.toUpperCase();
        _option.onerror = __onErrorWithReq._$bind(null,_bid);
        if (_script||!_ispost){
            _batch.u += (_batch.u.indexOf('?')>=0?'&':'?')
                        +__doSerializeSendData(_batch.m,'&');
        }
        if (_script){
            _j1._$loadScript(_batch.u,_option);
        }else{
            _option.onload = __onLoadWithXDR._$bind(null,_bid);
            _option.data = _ispost?__doSerializeSendData(_batch.m):null;
            _j0._$request(_batch.u,_option);
        }
    };
    /*
     * 单个接口出错处理
     * @param  {String} _bid   请求标识
     * @param  {String} _cid   接口标识
     * @param  {Object} _error 错误信息
     * @return {Void}
     */
    var __onError = function(_bid,_cid,_error){
        var _batch = _xcache[_bid];
        if (!_batch||_doFilter(_error)) return;
        var _handler = _batch.h[_cid];
        if (!_handler) return;
        try{
            (_handler.e||f)(_error);
        }catch(ex){
            // ignore
            console.error(ex.message);
            console.error(ex);
        }
    };
    /*
     * 整个请求出错处理
     * @param  {String} _bid   请求标识
     * @param  {Object} _error 错误信息
     * @return {Void}
     */
    var __onErrorAll = function(_bid,_error){
        var _batch = _xcache[_bid];
        if (!_batch) return;
        _u._$forIn(
            _batch.h,function(v,k){
                __onError(_bid,k,_error);
            }
        );
    };
    /*
     * 数据加载成功回调函数
     * @param  {String}   _bid  请求ID
     * @param  {String}   _cid  回调ID
     * @param  {Variable} _data 数据内容
     * @return {Void}
     */
    var __onLoadFromDWR = function(_bid,_cid,_data){
        var _batch = _xcache[_bid];
        if (!_batch) return;
        try{
            (_batch.h[_cid].c||f)(_data);
        }catch(ex){
            __onError(
                _bid,_cid,{
                    code:_g._$CODE_ERRCABK,
                    message:'DWR回调执行异常：'+ex.message||ex
                }
            );
        }
    };
    /*
     * 数据载入回调
     * @param  {String} _bid  请求标识
     * @param  {String} _text 返回数据内容
     * @return {Void}
     */
    var __onLoadWithXDR = function(_bid,_text){
        try{
            !!_text&&_text.search('//#DWR')>=0
            ? (new Function(_text))()
            : __onErrorAll(_bid,{
                  code:_g._$CODE_ERRSERV,
                  message:'DWR请求返回数据不合法!'
              });
        }catch(ex){
            __onErrorAll(_bid,{
                code:_g._$CODE_ERREVAL,
                message:'DWR返回脚本执行异常：'+(ex.message||ex)
            });
        }finally{
            __doDestroyBatch(_bid);
        }
    };
    /*
     * 数据载入异常
     * @param  {String} _bid   请求标识
     * @param  {Object} _error 错误信息
     * @return {Void}
     */
    var __onErrorWithReq = function(_bid,_error){
        __onErrorAll(_bid,_error);
        __doDestroyBatch(_bid);
    };

    // DWR2 Adapter
    this.dwr = this.dwr||{};
    var w = dwr.engine = dwr.engine||{};
    w['_remoteHandleCallback'] = __onLoadFromDWR;
    w['_remoteHandleException'] = __onError;
    w['_remoteHandleBatchException'] = __onErrorAll;
    // DWR3 Adapter
    dwr['_'] = [{
        handleCallback:w['_remoteHandleCallback'],
        handleException:w['_remoteHandleException'],
        handleBatchException:w['_remoteHandleBatchException']
    }];

    if (CMPT){
        var _j = NEJ.P('nej.j');
        _j._$endBatch      = _p._$end;
        _j._$requestByDWR  = _p._$request;
        _j._$beginBatch    = _p._$begin;
        _j._$setFilter     = _p._$setFilter;
        _j._$setBatchId    = _p._$setBatchId;
        _j._$setCookieName = _p._$setCookieName;
    }

    return _p;
});
