/*
 * ------------------------------------------
 * DWR框架前端引擎实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/constant.js',
    '{lib}base/util.js',
    '{lib}util/ajax/xdr.js',
    '{lib}util/ajax/tag.js',
    '{lib}util/cache/cookie.js'
],function(NEJ,_g,_u,_j0,_j1,_j2,_p,_o,_f,_r){
    var __batchid,      // 请求ID标识
        __filter= _f,   // 全局异常过滤器
        __cache = {},   // 请求缓存
        __cname = 'JSESSIONID',
        __batch = null; // 请求临时构造对象，范例 
                        // {h:{0:{c:function(){},   // callback
                        //        e:function(){}}}, // exception
                        //  p:1,                    // param number
                        //  u:'http://xxxx/x.x.dwr',// url
                        //  r:{script:!1,sync:!1,method:'POST',timeout:null}
                        //                          // request options
                        //  m:{}}                   // send data
    /**
     * 设置全局异常过滤器<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/ajax/dwr.js'
     *   ],function(_p){
     *       // 所有请求对错误码是401的情况不做处理
     *       _p._$setFilter(function(_code){
     *           return _code == 401;
     *       });
     *   });
     * [/code]
     * 
     * @api    {_$setFilter}
     * @param  {Function}  过滤器,过滤器返回值
     * [ntb]
     *  输出 | Boolean    | true  - 不继续执行后续错误处理接口
     *      | Boolean    | false - 继续执行后续错误处理接口
     * [/ntb]
     * @return {Void}
     */
    _p._$setFilter = function(_filter){
        __filter = _u._$isFunction(_filter)?_filter:_f;
    };
    /**
     * 设置CSRF使用的cookie名
     * @api    {_$setCookieName}
     * @param  {String} cookie名
     * @return {Void}
     */
    _p._$setCookieName = function(_name){
        __cname = _name||__cname;
    };
    /**
     * 设置请求标识<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/ajax/dwr.js'
     *   ],function(_p){
     *       // 手动设置请求标识
     *       _p._$setBatchId('batchId-12345');
     *   });
     * [/code]
     * 
     * @api    {_$setBatchId}
     * @param  {String} 请求标识
     * @return {Void}
     */
    _p._$setBatchId = function(_id){
        __batchid = _id||'';
    };
    /**
     * 开始批处理请求<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/ajax/dwr.js'
     *   ],function(_p){
     *       _p._$beginBatch();
     *       _p._$requestByDWR(
     *           'DownloadBean.getDownloadUrlByBrandAndModel1',{
     *               path:'/dwr/call/plaincall/',
     *               script:false,
     *               param:["nokia","n97"],
     *               onload:function(data){
     *                   // TODO
     *               },onerror:function(error){
     *                   // TODO
     *               }
     *           }
     *       );
     *       _p._$requestByDWR(
     *           'DownloadBean.getDownloadUrlByBrandAndModel2',{
     *               path:'/dwr/call/plaincall/',
     *               script:false,
     *               param:["nokia","n98"],
     *               onload:function(data){
     *                   // TODO
     *               },onerror:function(error){
     *                   // TODO
     *               }
     *           }
     *       );
     *       // 最后做一次请求发送
     *       _p._$endBatch();
     *   });
     * [/code]
     * 
     * @api    {_$beginBatch}
     * @see    {#_$endBatch}
     * @return {Void}
     */
    _p._$beginBatch = function(){
        if (!!__batch) return;
        __batch = {
            h:{},p:0,
            m:{
                callCount:0,
                scriptSessionId:'${scriptSessionId}190',
                httpSessionId:_j2._$cookie(__cname)
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
     * 使用DWR方式载入数据<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/ajax/dwr.js'
     *   ],function(_p){
     *       _p._$requestByDWR(
     *           'LogBean.log',{
     *               path:'/dwr/call/plaincall/',
     *               script:true,param:{},
     *               onload:function(data){
     *                   // 正常回调方法
     *               },
     *               onerror:function(error){
     *                   // 异常回调
     *               },
     *               onbeforerequest:function(data){
     *                  // 请求发送前对请求数据进行处理
     *               }
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @api    {_$requestByDWR}
     * @param  {String}  请求地址,格式为class.method
     * @param  {Object}  可选配置参数,已处理参数列表如下：
     * @config {String}  path    请求路径,默认为/dwr/call/plaincall/
     * @config {String}  query   请求地址附带的查询参数,格式a=aaa&b=bbb
     * @config {Array}   param   参数列表,不传或空数组均作为无参数处理
     * @config {String}  proxy   代理标识，使用该代理时忽略script/sync/method/timeout属性
     * @config {Boolean} script  使用脚本方式载入
     * @config {Boolean} sync    是否同步请求,使用脚本载入方式忽略此属性
     * @config {String}  method  请求方式,GET/POST,使用脚本载入方式忽略此属性
     * @config {Number}  timeout 请求超时时间
     * @config {Object}  headers 头信息,批处理请求合并所有头信息,同名的头信息后面请求覆盖前面请求
     * @config {String}  session 
     * @return {Void}
     * 
     * [hr]
     * 
     * 载入回调
     * @event  {onload}
     * @param  {Variable|Object} 请求返回数据，根据请求时type指定格式返回，
     *                           如果请求时指定了result参数，则此处输入为包含额外信息的对象，
     *                           数据结果从此对象的data属性中取，如{headers:{'x-res-0':'12345', ...},data:{a:'aaa', ...}}
     * 
     * [hr]
     * 
     * 出错回调
     * @event  {onerror}  
     * @param  {Object}   错误信息
     * @config {Number}   code    错误代码
     * @config {String}   message 错误描述
     * @config {Variable} data    出错时携带数据
     * 
     * [hr]
     * 
     * 请求之前对数据处理回调
     * @event  {onbeforerequest} 
     * @param  {Object} 请求信息
     * @config {Object} request 请求参数，数据信息 url/sync/cookie/type/method/timeout
     * @config {Object} headers 请求头信息
     */
    _p._$requestByDWR = function(_url,_options){
        var _info = (_url||'').split('.');
        if (!_info||_info.length!=2) return;
        var _single = !1;
        _options = _options||_o;
        if (!__batch){
            _single = !0;
            _p._$beginBatch();
            if (!!_options.session){
                __batch.m.httpSessionId = _j2._$cookie(_options.session);
            }
        }
        __batch.u = (_options.path||'/dwr/call/plaincall/')+
                    (_options.query&&('?'+_options.query)||'');
        _u._$fetch(__batch.r,_options);
        var _headers = _u._$merge(
            __batch.r.headers,_options.headers
        );
        _headers[_g._$HEAD_CT] = _g._$HEAD_CT_PLAN;
        __batch.r.headers = _headers;
        var _prefix = 'c'+__batch.m.callCount;
        __batch.m[_prefix+'-scriptName'] = _info[0];
        __batch.m[_prefix+'-methodName'] = _info[1];
        __batch.m[_prefix+'-id'] = __batch.m.callCount;
        __batch.h[__batch.m.callCount] = {
            c:_options.onload||_f,
            e:_options.onerror||_f
        };
        _u._$forEach(
            _options.param,function(v,i){
                var _value = __doSerialize(v,_prefix);
                if (!!_value){
                    __batch.m[_prefix+'-param'+i] = _value;
                }
            }
        );
        __batch.m.callCount++;
        if (_single){
            _p._$endBatch();
        }
    };
    /**
     * 结束请求批处理，正式发送请求<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/ajax/dwr.js'
     *   ],function(_p){
     *       _p._$beginBatch();
     *       _p._$requestByDWR(
     *           'DownloadBean.getDownloadUrlByBrandAndModel1',{
     *               path:'/dwr/call/plaincall/',
     *               script:false,
     *               param:["nokia","n97"],
     *               onload:function(data){
     *                   // TODO
     *               },onerror:function(error){
     *                   // TODO
     *               }
     *           }
     *       );
     *       _p._$requestByDWR(
     *           'DownloadBean.getDownloadUrlByBrandAndModel2',{
     *               path:'/dwr/call/plaincall/',
     *               script:false,
     *               param:["nokia","n98"],
     *               onload:function(data){
     *                   // TODO
     *               },onerror:function(error){
     *                   // TODO
     *               }
     *           }
     *       );
     *       // 最后做一次请求发送
     *       _p._$endBatch();
     *   });
     * [/code]
     * 
     * @api    {_$endBatch}
     * @see    {#_$beginBatch}
     * @return {Void}
     */
    _p._$endBatch = function(){
        if (!__batch||!__batch.u){
            __batch = null;
            return;
        }
        var _bid = __batchid||_u._$uniqueID();
        __batchid = 0;
        __batch.m.batchId = _bid;
        __cache[_bid] = __batch;
        __batch = null;
        __doRequest(_bid);
    };
    /*
     * 销毁请求对象
     * @param  {String} 请求对象标识
     * @return {Void}
     */
    var __doDestroyBatch = function(_bid){
        var _batch = __cache[_bid];
        if (!_batch) return;
        delete _batch.h;
        delete _batch.m;
        delete __cache[_bid];
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
                __batch.p++;
                var _ref = _prefix+'-e'+__batch.p,
                    _value = __doSerialize(v,_prefix);
                if (!_value) return;
                __batch.m[_ref] = _value;
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
                __batch.p++;
                var _ref = _prefix+'-e'+__batch.p,
                    _value = __doSerialize(v,_prefix);
                if (!_value) return;
                __batch.m[_ref] = _value;
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
        var _batch = __cache[_bid];
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
        var _batch = __cache[_bid];
        if (!_batch||__filter(_error)) return;
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
        var _batch = __cache[_bid];
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
        var _batch = __cache[_bid];
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
        NEJ.copy(NEJ.P('nej.j'),_p);
    }
    
    return _p;
});
