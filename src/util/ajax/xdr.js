/*
 * ------------------------------------------
 * XDR控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/util.js'
],function(NEJ,_u,_p,_o,_f,_r){
    // sn:{req:proxy,onload:function(){},onerror:function(){}}
    var _xcache = {},
        _doFilter = _f;
    /**
     * 中断请求<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/event.js'
     *   ],function(_p){
     *       var _id = _p._$request('http://123.163.com/xhr/',{
     *           type:'json',
     *           method:'POST',
     *           data:{name:'ABC'},
     *           timeout:60000,
     *           onload:function(_data){
     *               // TODO
     *           },
     *           onerror:function(_error){
     *               // TODO
     *           }
     *       });
     *       // 1秒后中断掉这个请求
     *       setTimeout(function(){
     *           _p._$abort(_id);
     *       },1000);
     *   });
     * [/code]
     * 
     * @api    {_$abort}
     * @param  {String} 请求标识
     * @return {THIS}   调用对象
     */
    _p._$abort = function(_sn){
        var _cache = _xcache[_sn];
        if (!!_cache){
            _cache.req._$abort();
        }
        return this;
    };
    /**
     * 全局请求过滤器，过滤器中可以通过设置输入事件对象的stopped值阻止继续回调<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/event.js'
     *   ],function(_p){
     *       _p._$filter(function(_event){
     *           // 过滤掉404的异常，如果type是onload不做处理
     *           if (_event.type == 'onerror'){
     *               if (_event.result.data == 404){
     *                   _event.stopped = false;
     *               }
     *           }
     *       });
     *       _p._$request('xxxx',{
     *           type:'json',
     *           method:'POST',
     *           data:{name:'abc'},
     *           timeout:3000,
     *           onload:function(_data){
     *               // TODO
     *           },
     *           onerror:function(_error){
     *               // TODO
     *           }
     *       });
     *   });
     * [/code]
     * 
     * @api    {_$filter}
     * @param  {Function} 过滤器
     * @return {THIS}     调用对象
     */
    _p._$filter = function(_filter){
        _doFilter = _filter||_f;
        return this;
    };
    /**
     * 发送ajax请求<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/event.js'
     *   ],function(_p){
     *       var _id = _p._$request(
     *           'http://a.b.com/api',{
     *               sync:true,
     *               type:'json',
     *               data:'hello',
     *               query:'a=1&b=2',
     *               method:'post',
     *               timeout:3000,
     *               mode:0||1||2||3,
     *               onload:function(_data){
     *                   // 正常回调处理
     *               },
     *               onerror:function(_error){
     *                   // 异常处理
     *               },
     *               onbeforerequest:function(_data){
     *                   // 请求发送前，对请求数据处理
     *               }
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @api    {_$request}
     * @param  {String}   请求地址
     * @param  {Object}   配置参数
     * @config {Boolean}  sync     是否同步请求
     * @config {String}   type     返回数据格式,text/json/xml
     * @config {Variable} data     要发送的数据
     * @config {Variable} query    查询参数,字符串格式a=b&c=d,对象格式{a:'b',c:'d'}
     * @config {String}   method   请求方式,GET/POST
     * @config {Number}   timeout  超时时间,0 禁止超时监测
     * @config {Object}   headers  头信息表
     * @config {Boolean}  cookie   跨域请求是否带cookie，仅对CORS方式有效
     * @config {Number}   mode     请求模式,针对跨域请求采用的请求方式<br/>
     *                             0 - 自动模式，高版本使用HTML5的CORS协议，低版本采用Frame代理方式<br/>
     *                             1 - 高版本使用HTML5的CORS协议，低版本采用Flash代理方式<br/>
     *                             2 - 全部使用Frame代理方式<br/>
     *                             3 - 全部使用Flash代理方式
     * @config {Object}   result   onload回调输入时需包含的额外信息，已处理额外数据
     *                             headers  服务器返回头信息，如{headers:'x-res-0'}或者{headers:['x-res-0','x-res-1']}
     * @return {String} 分配给请求的ID
     * 
     * [hr]
     * 载入回调
     * @event  {onload}
     * @param  {Variable|Object} 请求返回数据，根据请求时type指定格式返回，
     *                           如果请求时指定了result参数，则此处输入为包含额外信息的对象，
     *                           数据结果从此对象的data属性中取，如{headers:{'x-res-0':'12345', ...},data:{a:'aaa', ...}}
     * 
     * [hr]
     * 出错回调
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
                return _p._$$XHRProxy._$allocate(_options);
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
     * 文件上传<br/>
     * 页面结构举例
     * [code type="html"]
     *   <form id="upload" name="upload" action="http://123.163.com:3000/xhr/uploadCallback">
     *      <input type="text" id="progress" />
     *      <input type="hidden" name="nej_mode" value="2" />
     *      <input type="hidden" name="nej_query" value="http://123.163.com:3000/xhr/progress" />
     *   </form>
     * [/code]
     * 脚本举例
     * [code]
     *   var _j = NEJ.P('nej.j');
     *   var _upload = this._e._$get('upload');
     *   var _progress = this._e._$get('progress');
     *   _p._$upload(_upload,{
     *   mode:2,
     *   cookie:true,
     *   onuploading:function(_data){
     *       // 后台处理http://123.163.com:3000/xhr/progress，返回一个json对象
     *       // 前台会去轮询此接口获取进度
     *       if(!!_data.total&&_data.progress){
     *           _progress.value = _data.progress;
     *       }
     *   },
     *   onload:function(_url){
     *       // 此前会把进度轮询终止掉。如果要显示进度100%，可在此设置一次
     *       // 后台处理http://123.163.com:3000/xhr/uploadCallback，返回url
     *       // 文件上传完成的回调,url为返回的地址
     *   }});
     * [/code]
     * @api    {_$upload}
     * @param  {HTMLFormElement}   表单对象，待上传的文件及目标地址信息封装在此对象中
     * @param  {Object}            可选配置参数,已处理参数列表如下：
     * @config {String}   type     返回数据格式
     * @config {Variable} query    查询参数
     * @config {Number}   mode     跨域类型，0/2，见_$request接口说明
     * @config {Object}   headers  头信息
     * @config {Boolean}  cookie   跨域请求是否带cookie，仅对CORS方式有效
     * @return {String}            分配给请求的ID
     * 
     * [hr]
     * 
     * @event  {onload}   载入回调
     * @param  {Variable} 请求返回数据，根据请求时type指定格式返回
     * 
     * [hr]
     * 
     * @event  {onerror}  出错回调
     * @param  {Object}   错误信息
     * @config {Number}   code    错误代码
     * @config {String}   message 错误描述
     * @config {Variable} data    出错时携带数据
     * 
     * [hr]
     * 
     * @event  {onuploading} 上传进度回调
     * @param  {Object} 数据对象
     * 
     * [hr]
     * 
     * @event  {onbeforerequest} 请求之前对数据处理回调
     * @param  {Object} 数据对象
     * 
     */
    _p._$upload = function(_form,_options){
        var _option = {
            mode:0,
            type:'json',
            query:null,
            cookie:!1,
            headers:{},
            onload:null,
            onerror:null,
            onuploading:null,
            onbeforerequest:null
        };
        _u._$fetch(_option,_options);
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
