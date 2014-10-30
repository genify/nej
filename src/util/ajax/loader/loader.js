/*
 * ------------------------------------------
 * 资源加载器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/ajax/loader/loader */
NEJ.define([
    'base/global',
    'base/klass',
    'base/constant',
    'base/event',
    'base/util',
    'util/event'
],function(NEJ,_k,_g,_v,_u,_t,_p,_o,_f,_r){
    var _pro,
        _timeout = 60000;
    /**
     * 资源加载器
     * 
     * @class    module:util/ajax/loader/loader._$$LoaderAbstract
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object} config  - 可选配置参数
     * @property {String} version - 版本信息
     * @property {Number} timeout - 超时时间，0表示禁止超时监测
     */
    /** 
     * 资源载入失败回调
     * 
     * @event    module:util/ajax/loader/loader._$$LoaderAbstract#onerror
     * @param    {Object} event   - 错误信息
     * @property {Number} code    - 错误码
     * @property {String} message - 错误信息
     */
    /** 
     * 资源载入成功回调
     * 
     * @event  module:util/ajax/loader/loader._$$LoaderAbstract#onload
     * @param  {Variable} event - 请求返回数据
     */
    /** 
     * 资源加载中回调
     * 
     * @event  module:util/ajax/loader/loader._$$LoaderAbstract#onloading
     */
    _p._$$LoaderAbstract = _k._$klass();
    _pro = _p._$$LoaderAbstract._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__qopt = {
            onerror:this.__onQueueError._$bind(this),
            onload:this.__onQueueLoaded._$bind(this)
        };
        if (!this.constructor.__cache){
            // url : {request:script,timer:2,bind:[instance1,instance2 ... ]}
            // key : {error:0,loaded:0,total:0,bind:[instance1,instance2 ... ]}
            this.constructor.__cache = {loaded:{}};
        }
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__version = _options.version;
        this.__timeout = _options.timeout;
        this.__qopt.version = this.__version;
        this.__qopt.timeout = this.__timeout;
    };
    /**
     * 删除加载信息
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__delLoadData
     * @param  {String} arg0 - 标识
     * @return {Object}        加载信息
     */
    _pro.__delLoadData = function(_key){
        delete this.constructor.__cache[_key];
    };
    /**
     * 取加载信息
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__getLoadData
     * @param  {String} arg0 - 标识
     * @return {Object}        加载信息
     */
    _pro.__getLoadData = function(_key){
        return this.constructor.__cache[_key];
    };
    /**
     * 设置加载信息
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__setLoadData
     * @param  {String} arg0 - 标识
     * @param  {Object} arg1 - 加载信息
     * @return {Void}
     */
    _pro.__setLoadData = function(_key,_data){
        this.constructor.__cache[_key] = _data;
    };
    /**
     * 取资源载入控件，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__getRequest
     * @return {Script|Link} 控件
     */
    _pro.__getRequest = _f;
    /**
     * 清理控件
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__doClearRequest
     * @param  {Script|Link} arg0 - 控件
     * @return {Void}
     */
    _pro.__doClearRequest = function(_request){
        _v._$clearEvent(_request);
    };
    /**
     * 资源载入
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__doRequest
     * @param  {Script|Link} arg0 - 控件
     * @return {Void}
     */
    _pro.__doRequest = function(_request){
        _request.src = this.__url;
        document.head.appendChild(_request);
    };
    /**
     * 执行清理任务
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__doClear
     * @return {Void}
     */
    _pro.__doClear = function(){
        var _cache = this.__getLoadData(this.__url);
        if (!_cache) return;
        window.clearTimeout(_cache.timer);
        this.__doClearRequest(_cache.request);
        delete _cache.bind;
        delete _cache.timer;
        delete _cache.request;
        this.__delLoadData(this.__url);
        this.__getLoadData('loaded')[this.__url] = !0;
    };
    /**
     * 执行回调
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__doCallback
     * @param  {String} arg0 - 回调名称
     * @return {Void}
     */
    _pro.__doCallback = function(_name){
        var _cache = this.__getLoadData(this.__url);
        if (!_cache) return;
        var _list = _cache.bind;
        this.__doClear();
        if (!!_list&&_list.length>0){
            var _instance;
            while(_list.length){
                _instance = _list.shift();
                try{
                    _instance._$dispatchEvent(_name,arguments[1]);
                }catch(ex){
                    // ignore
                    if (DEBUG) throw ex;
                    console.error(ex.message);
                    console.error(ex.stack);
                }
                _instance._$recycle();
            }
        }
    };
    /**
     * 资源载入异常事件
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__onError
     * @param  {Object} arg0 - 错误信息
     * @return {Void}
     */
    _pro.__onError = function(_error){
        this.__doCallback('onerror',_error);
    };
    /**
     * 资源载入成功事件
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__onLoaded
     * @return {Void}
     */
    _pro.__onLoaded = function(){
        this.__doCallback('onload');
    };
    /**
     * 载入队列资源
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__doLoadQueue
     * @param  {String} arg0 - 资源地址
     * @return {Void}
     */
    _pro.__doLoadQueue = function(_url){
        this.constructor._$allocate(this.__qopt)._$load(_url);
    };
    /**
     * 检查队列状况
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__onQueueCheck
     * @return {Void}
     */
    _pro.__onQueueCheck = function(_error){
        var _cache = this.__getLoadData(this.__key);
        if (!_cache) return;
        if (!!_error) 
            _cache.error++;
        _cache.loaded ++;
        if (_cache.loaded<_cache.total) return;
        this.__delLoadData(this.__key);
        this._$dispatchEvent(_cache.error>0?'onerror':'onload');
    };
    /**
     * 队列载入资源异常事件
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__onQueueError
     * @param  {Object} arg0 - 错误信息
     * @return {Void}
     */
    _pro.__onQueueError = function(_error){
        this.__onQueueCheck(!0);
    };
    /**
     * 队列载入资源成功事件
     * 
     * @protected
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#__onQueueLoaded
     * @return {Void}
     */
    _pro.__onQueueLoaded = function(){
        this.__onQueueCheck();
    };
    /**
     * 载入资源
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/loader/html',
     *     'util/ajax/loader/style',
     *     'util/ajax/loader/script'
     * ],function(_t0,_t1,_t2){
     *     // 载入指定html,10秒超时
     *     var _loader = _t0._$$LoaderHtml._$allocate({
     *         timeout:10000,
     *         onload:function(){
     *             // 载入资源成功的回调
     *         }
     *     });
     *     // 绝对路径或者当前页面的相对路径
     *     _loader._$load('../../../html/util/formTest.html');
     * 
     *     // 载入指定script,20秒超时
     *     var _loader = _t2._$$LoaderScript._$allocate({
     *         timeout:20000,
     *         onload:function(){
     *             // 载入资源成功的回调
     *         }
     *     });
     *     // 绝对路径或者当前页面的相对路径
     *     _loader._$load('../../../javascript/log.js');
     * 
     *     // 载入指定style,30秒超时
     *     var _loader = _t1._$$LoaderStyle._$allocate({
     *         timeout:30000,
     *         onload:function(){
     *             // 载入资源成功的回调
     *         }
     *     });
     *     // 绝对路径或者当前页面的相对路径
     *     _loader._$load('../../../base/qunit.css');
     * });
     * ```
     * 
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#_$load
     * @param  {String} arg0 - 资源地址
     * @return {Void}
     */
    _pro._$load = function(_url){
        _url = _u._$absolute(_url);
        if (!_url){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_NOTASGN,
                message:'请指定要载入的资源地址！'
            });
            return;
        };
        this.__url = _url;
        if (!!this.__version){
            this.__url += (this.__url.indexOf('?')<0?'?':'&')+this.__version;
        }
        if (this.__getLoadData('loaded')[this.__url]){
            try{
                this._$dispatchEvent('onload');
            }catch(ex){
                // ignore
                if (DEBUG) throw ex;
                console.error(ex.message);
                console.error(ex.stack);
            }
            this._$recycle();
            return;
        }
        var _cache = this.__getLoadData(this.__url),_request;
        if (!!_cache){
            _cache.bind.unshift(this);
            _cache.timer = window.clearTimeout(_cache.timer);
        }else{
            _request = this.__getRequest();
            _cache = {request:_request,bind:[this]};
            this.__setLoadData(this.__url,_cache);
            _v._$addEvent(
                _request,'load',
                this.__onLoaded._$bind(this)
            );
            _v._$addEvent(
                _request,'error',
                this.__onError._$bind(this,{
                    code:_g._$CODE_ERRSERV,
                    message:'无法加载指定资源文件['+this.__url+']！'
                })
            );
        }
        if (this.__timeout!=0){
            _cache.timer = window.setTimeout(
                this.__onError._$bind(this,{
                    code:_g._$CODE_TIMEOUT,
                    message:'指定资源文件['+this.__url+']载入超时！'
                }),
                this.__timeout||_timeout
            );
        }
        if (!!_request){
            this.__doRequest(_request);
        }
        this._$dispatchEvent('onloading');
    };
    /**
     * 队列载入资源
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/loader/html.js'
     * ],function(_t){
     *     var _loader = _t._$$LoaderHtml._$allocate({
     *         onload:function(){
     *             // 载入队列资源成功的回调
     *         }
     *     });
     *     // 路径列表，可以是绝对路径也可以是当前页面的相对路径
     *     var _list = [
     *         '../../../html/util/formTest.html',
     *         '../../../html/util/cacheTest.html'
     *     ];
     *     _loader._$queue(_list);
     * });
     * ```
     * 
     * @method module:util/ajax/loader/loader._$$LoaderAbstract#_$queue
     * @param  {Array} arg0 - 资源地址队列
     * @return {Void}
     */
    _pro._$queue = function(_list){
        if (!_list||!_list.length){
            this._$dispatchEvent('onerror',{
                code:_g._$CODE_NOTASGN,
                message:'请指定要载入的资源队列！'
            });
            return;
        } 
        this.__key = _u._$uniqueID();
        var _cache = {error:0,loaded:0,total:_list.length};
        this.__setLoadData(this.__key,_cache);
        _u._$forEach(
            _list,function(v,i){
                if (!v){
                    _cache.total--;
                    return;
                }
                this.__doLoadQueue(v);
            },this
        );
        this._$dispatchEvent('onloading');
    };
    
    return _p;
});
