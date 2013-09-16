/*
 * ------------------------------------------
 * DWR框架前端引擎实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _ = NEJ.P,
        o = NEJ.O,
        f = NEJ.F,
        g = _('nej.g'),
        j = _('nej.j'),
        u = _('nej.u'),
        w = _('dwr.engine'),
        __batchid,      // 请求ID标识
        __filter= f,    // 全局异常过滤器
        __proxy = {},   // 交互代理
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
     *   // 所有请求对错误码是401的情况不做处理
     *   nej.j._$setFilter(function(_code){
     *       return _code == 401;
     *   });
     * [/code]
     * @api    {nej.j._$setFilter}
     * @param  {Function}  过滤器,过滤器返回值
     * [ntb]
     *  输出 |  Boolean   | true  - 不继续执行后续错误处理接口
     *       | Boolean    | false - 继续执行后续错误处理接口
     * [/ntb]
     *                     
     * @return {nej.j}
     */
    j._$setFilter = function(_filter){
        __filter = u._$isFunction(_filter)?_filter:f;
        return this;
    };
    /**
     * 设置CSRF使用的cookie名
     * @api    {nej.j._$setCookieName}
     * @param  {String} cookie名
     * @return {Void}
     */
    j._$setCookieName = function(_name){
        __cname = _name||__cname;
    };
    /**
     * 设置DWR代理<br/>
     * 脚本举例
     * [code]
     *   var j = nej.j;
     *   // 用xmpp代理
     *   j._$setProxy('xmpp',nej.ut.xmpp._$$SocketProxy._$allocate({}));
     * [/code]
     * @api    {nej.j._$setProxy}
     * @param  {String} 代理标识
     * @param  {Object} 交互代理
     * @return {nej.j}
     */
    j._$setProxy = function(_key,_proxy){
        __proxy[_key] = _proxy;
        return this;
    };
    /**
     * 设置请求标识<br/>
     * 脚本举例
     * [code]
     *   var j = nej.j;
     *   // 手动设置请求标识
     *   j._$setBatchId('batchId-12345');
     * [/code]
     * @api    {nej.j._$setBatchId}
     * @param  {String} 请求标识
     * @return {nej.j}
     */
    j._$setBatchId = function(_id){
        __batchid = _id||'';
        return this;
    };
    /**
     * 开始批处理请求<br/>
     * 脚本举例
     * [code]
     *   var j = nej.j;
     *   j._$beginBatch();
     *   j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
     *          {path:'http://123.163.com/webmail/dwr/call/plaincall/',
     *           script:false,param:["nokia","n97"],onload:function(data){
     *           },onerror:function(error){
     *           }});
     *   j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
     *          {path:'http://123.163.com/webmail/dwr/call/plaincall/',
     *           script:false,param:["nokia","n98"],onload:function(data){
     *           },onerror:function(error){
     *           }});
     *   // 最后做一次请求发送
     *   j._$endBatch();
     * [/code]
     * @see    {#._$endBatch}
     * @api    {nej.j._$beginBatch}
     * @return {nej.j}
     */
    j._$beginBatch = function(){
        if (!!__batch) return this;
        __batch = {h:{},p:0,
                   m:{callCount:0,scriptSessionId:'${scriptSessionId}190',httpSessionId:j._$cookie(__cname)},
                   r:{script:!1,sync:!1,method:'POST',timeout:null,proxy:!0,cookie:!1,onbeforerequest:null}};
        return this;
    };
    /**
     * 使用DWR方式载入数据<br/>
     * 
     * 脚本举例
     * [code]
     *   var j = nej.j;
     *   j._$requestByDWR('LogBean.log',
     *      {path:'http://123.163.com/webmail/dwr/call/plaincall/',
     *       script:true,param:{},onload:function(data){
     *           // 正常回调方法
     *       },onerror:function(error){
     *           // 异常回调
     *       },onbeforerequest:function(data){
     *          // 请求发送前对请求数据进行处理
     *       }
     *       });
     * [/code]
     * @api    {nej.j._$requestByDWR}
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
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onload} 载入完成回调函数
     * @param  {Object} 返回的数据
     * 
     * [hr]
     * 
     * @event  {onerror} 载入出错回调函数
     * @param  {Object}  错误信息
     * 
     * [hr]
     * 
     * @event  {onbeforerequest} 请求之前对数据处理回调
     * 
     */
    j._$requestByDWR = function(_url,_options){
        var _info = (_url||'').split('.');
        if (!_info||_info.length!=2) return this;
        var _single = !1;
        _options = _options||o;
        if (!__batch){
            _single = !0;
            j._$beginBatch();
            if (!!_options.session){
                __batch.m.httpSessionId = j._$cookie(_options.session);
            }
        }
        __batch.u = (_options.path||'/dwr/call/plaincall/')+
                    (_options.query&&('?'+_options.query)||'');
        NEJ.EX(__batch.r,_options);
        var _headers = __batch.r.headers||{};
        if (!!_options.headers)
            for(var x in _options.headers)
                _headers[x] = _options.headers[x];
        _headers[g._$HEAD_CT] = g._$HEAD_CT_PLAN;
        __batch.r.headers = _headers;
        var _prefix = 'c'+__batch.m.callCount;
        __batch.m[_prefix+'-scriptName'] = _info[0];
        __batch.m[_prefix+'-methodName'] = _info[1];
        __batch.m[_prefix+'-id'] = __batch.m.callCount;
        __batch.h[__batch.m.callCount] = {c:_options.onload||f,
                                          e:_options.onerror||f};
        var _params = _options.param;
        if (!!_params&&_params.length>0)
            for(var i=0,l=_params.length,_value;i<l;i++){
                _value = __serialize(_params[i],_prefix);
                !!_value&&(__batch.m[_prefix+'-param'+i]=_value);
            }
        __batch.m.callCount++;
        if (_single) j._$endBatch();
        return this;
    };
    /**
     * 结束请求批处理，正式发送请求<br/>
     * 脚本举例
     * [code]
     *   j._$beginBatch();
     *   j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
     *          {path:'http://123.163.com/webmail/dwr/call/plaincall/',
     *           script:false,param:["nokia","n97"],onload:function(data){
     *           },onerror:function(error){
     *           }});
     *   j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
     *          {path:'http://123.163.com/webmail/dwr/call/plaincall/',
     *           script:false,param:["nokia","n98"],onload:function(data){
     *           },onerror:function(error){
     *           }});
     *   // 最后做一次请求发送
     *   j._$endBatch();
     * [/code]
     * @see    {#._$beginBatch}
     * @api    {nej.j._$endBatch}
     * @return {nej.j}
     */
    j._$endBatch = function(){
        if (!__batch||!__batch.u){
            __batch = null; return this;
        }
        var _bid = __batchid||u._$randNumberString(6);
        __batchid = 0;
        __batch.m.batchId = _bid;
        __cache[_bid] = __batch;
        __batch = null;
        __doRequest(_bid);
        return this;
    };
    /*
     * 销毁请求对象
     * @param  {String} _bid 请求对象标识
     * @return {Void}
     */
    var __destroyBatch = function(_bid){
        var _batch = __cache[_bid];
        if (!_batch) return;
        delete _batch.h;
        delete _batch.m;
        delete __cache[_bid];
    };
    /*
     * 序列化数据
     * @param  {Variable} _data   数据
     * @param  {String}   _prefix 前缀
     * @return {String}           序列化后的字串
     */
    var __serialize = function(_data,_prefix){
        if (_data==null) return 'null:null';
        if (u._$isBoolean(_data))
            return 'boolean:'+!!_data;
        if (u._$isNumber(_data))
            return 'number:'+_data;
        if (u._$isString(_data))
            return 'string:'+encodeURIComponent(_data);
        if (u._$isDate(_data))
            return 'Date:'+_data.getTime();
        if (u._$isArray(_data))
            return __serializeArray(_data,_prefix);
        if (u._$isObject(_data))
            return __serializeObject(_data,_prefix);
        if (u._$isFunction(_data,'function'))
            return '';
        return 'default:'+_data;
    };
    /*
     * 序列化数组
     * @param  {Array}  _data   数组
     * @param  {String} _prefix 前缀
     * @return {String}         序列化后的字串
     */
    var __serializeArray = function(_list,_prefix){
        var _arr = [];
        for(var i=0,l=_list.length,_ref,_value;i<l;i++){
            __batch.p++;
            _ref = _prefix+'-e'+__batch.p;
            _value = __serialize(_list[i],_prefix);
            if (!_value) continue;
            __batch.m[_ref] = _value;
            _arr.push('reference:'+_ref);
        }
        return 'Array:['+_arr.join(',')+']';
    };
    /*
     * 序列化对像
     * @param  {Array}  _data   对像
     * @param  {String} _prefix 前缀
     * @return {String}         序列化后的字串
     */
    var __serializeObject = function(_object,_prefix){
        var _arr = [],_ref,_value;
        for(var p in _object){
            __batch.p++;
            _ref = _prefix+'-e'+__batch.p;
            _value = __serialize(_object[p],_prefix);
            if (!_value) continue;
            __batch.m[_ref] = _value;
            _arr.push(encodeURIComponent(p)+':reference:'+_ref);
        }
        return 'Object_Object:{'+_arr.join(',')+'}';
    };
    /*
     * 序列化要发送的数据
     * @param  {Object} _data 数据对象
     * @param  {String} _sep  数据分隔符
     * @return {String}       数据字符串
     */
    var __serializeSendData = function(_data,_sep){
        if (!_data) return null;
        var _arr=[],_and=_sep=='&';
        for(var p in _data)
            _arr.push(!_and?(p+'='+_data[p]):
                     (encodeURIComponent(p)+'='+
                      encodeURIComponent(_data[p])));
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
            _proxy  = __proxy[_option.proxy];
        // use xmpp proxy
        if (!!_proxy){
            _proxy._$rpc({url:_batch.u,
                          param:__serializeSendData(_batch.m,'&amp;')});
            delete _batch.r;
            return;
        }
        var _script = !!_option.script,
            _ispost = _option.method=='POST';
        delete _batch.r;
        delete _option.script;
        _option.method = _option.method.toUpperCase();
        _option.onerror = __onErrorWithReq._$bind(null,_bid);
        if (_script||!_ispost){
            _batch.u += (_batch.u.indexOf('?')>=0?'&':'?')
                        +__serializeSendData(_batch.m,'&');
        }
        if (_script){
            j._$loadScript(_batch.u,_option);
        }else{
            _option.onload = __onLoadWithXDR._$bind(null,_bid);
            _option.data = _ispost?__serializeSendData(_batch.m):null;
            j._$request(_batch.u,_option);
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
        var _handler = _batch.h;
        for(var x in _handler)
            __onError(_bid,x,_error);
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
            __onError(_bid,_cid,
                     {code:g._$CODE_ERRCABK
                     ,message:'DWR回调执行异常：'+ex.message||ex});
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
            : __onErrorAll(_bid,{code:g._$CODE_ERRSERV
                                ,message:'DWR请求返回数据不合法!'});
        }catch(ex){
            __onErrorAll(_bid,{code:g._$CODE_ERREVAL
                              ,message:'DWR返回脚本执行异常：'+(ex.message||ex)});
        }finally{
            __destroyBatch(_bid);
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
        __destroyBatch(_bid);
    };
    // DWR2 Adapter
    w['_remoteHandleCallback'] = __onLoadFromDWR;
    w['_remoteHandleException'] = __onError;
    w['_remoteHandleBatchException'] = __onErrorAll;
    // DWR3 Adapter
    _('dwr')['_'] = [{
        handleCallback:w['_remoteHandleCallback'],
        handleException:w['_remoteHandleException'],
        handleBatchException:w['_remoteHandleBatchException']
    }];
};
NEJ.define('{lib}util/ajax/dwr.js',
          ['{lib}base/constant.js'
          ,'{lib}base/util.js'
      ,'{lib}util/ajax/xdr.js'
      ,'{lib}util/cache/cookie.js'],f);