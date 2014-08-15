/*
 * ------------------------------------------
 * XDR控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/xdr */
NEJ.define([
    'base/global',
    'base/constant',
    'base/util',
    'base/element',
    './proxy/xhr.js',
    '{platform}xdr.js'
],function(NEJ,_g,_u,_e,_t,_h,_p,_o,_f,_r){
    /** 
     * 载入回调
     * 
     * @callback module:util/ajax/xdr.onload
     * @param    {Variable|Object} event - 请求返回数据，根据请求时type指定格式返回，
     *                                     如果请求时指定了result参数，则此处输入为包含额外信息的对象，
     *                                     数据结果从此对象的data属性中取，如{headers:{'x-res-0':'12345', ...},data:{a:'aaa', ...}}
     */
    /** 
     * 出错回调
     * 
     * @callback module:util/ajax/xdr.onerror
     * @param    {Object}   event   - 错误信息
     * @property {Number}   code    - 错误代码
     * @property {String}   message - 错误描述
     * @property {Variable} data    - 出错时携带数据
     */
    /** 
     * 请求之前对数据处理回调
     * 
     * @callback module:util/ajax/xdr.onbeforerequest
     * @param    {Object} event   - 请求信息
     * @property {Object} request - 请求参数，数据信息 url/sync/cookie/type/method/timeout
     * @property {Object} headers - 请求头信息
     */
    /** 
     * 上传进度回调
     * 
     * @callback module:util/ajax/xdr.onuploading
     * @param    {Object} event  - 进度信息
     * @property {Number} loaded - 载入数量
     * @property {Number} total  - 总量
     */
    // sn:{req:proxy,onload:function(){},onerror:function(){}}
    var _xcache = {},
        _doFilter = _f;
    /**
     * 中断请求
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/xdr'
     * ],function(_j){
     *     var _id = _j._$request(
     *         'http://123.163.com/xhr/',{
     *             type:'json',
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
     * @method module:util/ajax/xdr._$abort
     * @param  {String} arg0 - 请求标识
     * @return {Void}
     */
    _p._$abort = function(_sn){
        var _cache = _xcache[_sn];
        if (!!_cache){
            _cache.req._$abort();
        }
    };
    /**
     * 全局请求过滤器，过滤器中可以通过设置输入事件对象的stopped值阻止继续回调
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/xdr'
     * ],function(_j){
     *     _j._$filter(function(_event){
     *         // _event.type     请求过滤类型
     *         // _event.result   请求结果
     *         // _event.stopped  是否阻止后续逻辑
     *         
     *         // 过滤掉404的异常，如果type是onload不做处理
     *         if (_event.type == 'onerror'){
     *             if (_event.result.data == 404){
     *                 _event.stopped = false;
     *             }
     *         }
     *     });
     *     _j._$request('xxxx',{
     *         type:'json',
     *         method:'POST',
     *         data:{name:'abc'},
     *         timeout:3000,
     *         onload:function(_data){
     *             // TODO
     *         },
     *         onerror:function(_error){
     *             // TODO
     *         }
     *     });
     * });
     * ```
     * 
     * @method module:util/ajax/xdr._$filter
     * @param  {Function} arg0 - 过滤器
     * @return {Void}
     */
    _p._$filter = function(_filter){
        _doFilter = _filter||_f;
    };
    /**
     * 发送ajax请求
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/xdr'
     * ],function(_p){
     *     var _id = _p._$request(
     *         'http://a.b.com/api',{
     *             sync:true,
     *             type:'json',
     *             data:'hello',
     *             query:'a=1&b=2',
     *             method:'post',
     *             timeout:3000,
     *             mode:0||1||2||3,
     *             onload:function(_data){
     *                 // 正常回调处理
     *             },
     *             onerror:function(_error){
     *                 // 异常处理
     *             },
     *             onbeforerequest:function(_data){
     *                 // 请求发送前，对请求数据处理
     *             }
     *         }
     *     );
     * });
     * ```
     * 
     * @method   module:util/ajax/xdr._$request
     * @param    {String}   arg0    - 请求地址
     * @param    {Object}   arg1    - 配置参数
     * @property {Boolean}  sync    - 是否同步请求
     * @property {String}   type    - 返回数据格式,text/json/xml
     * @property {Variable} data    - 要发送的数据
     * @property {Variable} query   - 查询参数,字符串格式a=b&c=d,对象格式{a:'b',c:'d'}
     * @property {String}   method  - 请求方式,GET/POST
     * @property {Number}   timeout - 超时时间,0 禁止超时监测
     * @property {Object}   headers - 头信息表
     * @property {Boolean}  cookie  - 跨域请求是否带cookie，仅对CORS方式有效
     * @property {Number}   mode    - 请求模式,针对跨域请求采用的请求方式
     * 
     * * 0 - 自动模式，高版本使用HTML5的CORS协议，低版本采用Frame代理方式
     * * 1 - 高版本使用HTML5的CORS协议，低版本采用Flash代理方式
     * * 2 - 全部使用Frame代理方式
     * * 3 - 全部使用Flash代理方式
     *                             
     * @property {Object}   result  - onload回调输入时需包含的额外信息，已处理额外数据
     * 
     * * headers - 服务器返回头信息，如{headers:'x-res-0'}或者{headers:['x-res-0','x-res-1']}
     * 
     * @property {module:util/ajax/xdr.onload}          onload  - 数据载入回调
     * @property {module:util/ajax/xdr.onerror}         onerror - 请求异常回调
     * @property {module:util/ajax/xdr.onbeforerequest} onbeforerequest - 请求之前回调
     * 
     * @return   {String} 分配给请求的ID
     */
    _p._$request = (function(){
        var _location = (location.protocol+'//'
                        +location.host).toLowerCase();
        // check cross-domain request
        var _isXDomain = function(_url){
            var _origin = _u._$url2origin(_url);
            return !!_origin&&_origin!=_location;
        };
        // check file upload
        var _isUpload = function(_headers){
            return (_headers||_o)[_g._$HEAD_CT]==_g._$HEAD_CT_FILE;
        };
        // get ajax proxy
        var _getProxy = function(_options){
            var _upload = _isUpload(_options.headers);
            if (!_isXDomain(_options.url)&&!_upload)
                return _t._$$ProxyXHR._$allocate(_options);
            return _h.__getProxyByMode(_options.mode,_upload,_options);
        };
        // parse ext result
        var _doParseExtData = function(_cache,_result){
            var _data = {
                data:_result
            };
            // parse ext headers
            var _keys = _cache.result.headers;
            if (!!_keys){
                _data.headers = _cache.req._$header(_keys);
            }
            // TODO parse other ext data
            return _data;
        };
        // clear cache
        var _doClear = function(_sn){
            var _cache = _xcache[_sn];
            if (!_cache) return;
            if (!!_cache.req)
                _cache.req._$recycle();
            delete _xcache[_sn];
        };
        // do callback
        var _doCallback = function(_sn,_type){
            var _cache = _xcache[_sn];
            if (!_cache) return;
            var _data = arguments[2];
            if (_type=='onload'&&!!_cache.result){
                _data = _doParseExtData(_cache,_data);
            }
            _doClear(_sn);
            try{
                var _event = {
                    type:_type,
                    result:_data
                };
                _doFilter(_event);
                if (!_event.stopped){
                   (_cache[_type]||_f)(_event.result);
                }
            }catch(ex){
                // ignore
                console.error(ex.message);
                console.error(ex);
            }
        };
        // onload callback
        var _onLoad = function(_sn,_data){
            _doCallback(_sn,'onload',_data);
        };
        // onerror callback
        var _onError = function(_sn,_error){
            _doCallback(_sn,'onerror',_error);
        };
        // function body
        return function(_url,_options){
            _options = _options||{};
            // cache request callback
            var _sn = _u._$uniqueID(),
                _cache = {
                    result:_options.result,
                    onload:_options.onload||_f,
                    onerror:_options.onerror||_f
                };
            _xcache[_sn] = _cache;
            _options.onload = _onLoad._$bind(null,_sn);
            _options.onerror = _onError._$bind(null,_sn);
            // append request query
            if (!!_options.query){
                var _sep = _url.indexOf('?')<0?'?':'&',
                    _query = _options.query;
                if (_u._$isObject(_query))
                    _query = _u._$object2query(_query);
                if (!!_query) _url += _sep+_query;
            }
            _options.url = _url;
            _cache.req = _getProxy(_options);
            _cache.req._$send(_options.data);
            return _sn;
        };
    })();
    /**
     * 文件上传
     * 
     * 结构举例
     * ```html
     * <form id="upload" name="upload" action="http://123.163.com:3000/xhr/uploadCallback">
     *    <input type="text" id="progress" />
     *    <input type="hidden" name="nej_mode" value="2" />
     *    <input type="hidden" name="nej_query" value="http://123.163.com:3000/xhr/progress" />
     * </form>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/xdr'
     * ],function(_j){
     *     _j._$upload('upload',{
     *         mode:2,
     *         cookie:true,
     *         onuploading:function(_data){
     *             // 后台处理http://123.163.com:3000/xhr/progress，返回一个json对象
     *             // 前台会去轮询此接口获取进度
     *             if(!!_data.total&&_data.progress){
     *                 _progress.value = _data.progress;
     *             }
     *         },
     *         onload:function(_url){
     *             // 此前会把进度轮询终止掉。如果要显示进度100%，可在此设置一次
     *             // 后台处理http://123.163.com:3000/xhr/uploadCallback，返回url
     *             // 文件上传完成的回调,url为返回的地址
     *         }
     *     });
     * });
     * ```
     * 
     * @method   module:util/ajax/xdr._$upload
     * @see      module:util/ajax/xdr._$request
     * @param    {HTMLFormElement}  arg0    - 表单对象，待上传的文件及目标地址信息封装在此对象中
     * @param    {Object}           arg1    - 可选配置参数
     * @property {String}           type    - 返回数据格式
     * @property {Variable}         query   - 查询参数
     * @property {Number}           mode    - 跨域类型，0/2，见_$request接口说明
     * @property {Object}           headers - 头信息
     * @property {Boolean}          cookie  - 跨域请求是否带cookie，仅对CORS方式有效
     * 
     * @property {module:util/ajax/xdr.onload}          onload  - 数据载入回调
     * @property {module:util/ajax/xdr.onerror}         onerror - 请求异常回调
     * @property {module:util/ajax/xdr.onuploading}     onuploading     - 上传进度回调
     * @property {module:util/ajax/xdr.onbeforerequest} onbeforerequest - 请求之前回调
     * 
     * @return   {String}                     分配给请求的ID
     */
    _p._$upload = function(_form,_options){
        _form = _e._$get(_form);
        if (!_form){
            return '';
        }
        // init param
        var _option = _u._$fetch({
            mode:0,
            type:'json',
            query:null,
            cookie:!1,
            headers:{},
            onload:null,
            onerror:null,
            onuploading:null,
            onbeforerequest:null
        },_options);
        _option.data = _form;
        _option.method = 'POST';
        _option.timeout = 0;
        _option.headers[_g._$HEAD_CT] = 
                        _g._$HEAD_CT_FILE;
        return _p._$request(_form.action,_option);
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.j'),_p);
    }
    
    return _p;
});
