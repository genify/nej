/*
 * ------------------------------------------
 * 列表缓存管理基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/cache/abstract */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'base/event',
    'util/ajax/xdr',
    'util/ajax/rest',
    'util/ajax/jsonp',
    './list.js'
],function(NEJ,_k,_u,_v,_j,_jj,_jjj,_t,_p,_o,_f,_r,_pro){
    // request config cache
    var config = {},
        seed = _u._$uniqueID();
    /**
     * 调度事件
     * @param name
     * @param event
     */
    var dispatch = function(name,event){
        event = event||{};
        _u._$forEach(
            config[name+'-'+seed],function(func){
                func.call(this,event);
                if (event.stopped){
                    return !0;
                }
            },this
        );
    };
    /**
     * 列表缓存管理基类
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     'util/ajax/xdr',
     *     'util/cache/abstract'
     * ],function(_k,_j,_t,_p){
     *     // 创建自己的listCache管理类
     *     _p._$$CacheListCustom = _k._$klass();
     *     _pro = _p._$$CacheListCustom._$extend(_t._$$CacheListAbstract);
     *     
     *     // 实现取列表的方法
     *     // 根据offset+limit取列表
     *     // data表示取列表可能需要的额外数据信息
     *     // 数据返回的回调是onload
     *     _pro.__doLoadList = function(_options){
     *         var _key    = _options.key;
     *         var _data   = _options.data;
     *         var _offset = _options.offset;
     *         var _limit  = _options.limit;
     *         var _rkey   = _options.rkey;
     *         var _onload = _options.onload;
     *         _j._$request(
     *             '/xhr/list',{
     *                 type:'json',
     *                 method:'POST',
     *                 data:{offset:_offset,limit:_limit},
     *                 timeout:1000,
     *                 onload:_onload._$bind(this),
     *                 onerror:function(_error){
     *                     // TODO
     *                 }
     *             }
     *         );
     *     };
     * 
     *     // 实现取列表的方法
     *     // 根据id和key取一项数据
     *     // 数据返回的回调是onload
     *     _proCacheListCustom.__doLoadItem = function(_options){
     *         var _id     = _options.id;
     *         var _key    = _options.key;
     *         var _rkey   = _options.rkey;
     *         var _onload = _options.onload;
     *         _j._$request(
     *             '/xhr/get',{
     *                 type:'json',
     *                 method:'POST',
     *                 data:{id:_id,key:_key},
     *                 timeout:1000,
     *                 onload:_onload._$bind(this),
     *                 onerror:function(_error){
     *                     // TODO
     *                 }
     *             }
     *         );
     *     };
     * });
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     '/path/to/custom/cache.js'
     * ],function(_p){
     *     // 实例化一个上面的对象
     *     var _cache = c._$$CacheListCustom._$allocate({
     *         // id作为cache的标识
     *         id:'a',
     *         // 根据key，也就是上面的id，到缓存中取数据，然后处理数据
     *         onlistload:function(_ropt){
     *             _cache._$getListInCache(_ropt.key);
     *         },
     *          // 根据key，也就是上面的id，到缓存中取数据，然后处理数据
     *         onitemload:function(_ropt){
     *             _cache._$getItemInCache(_ropt.key);
     *         }
     *     });
     * 
     *     // 第一个列表的请求
     *     _cache._$getList({key:'abc',data:{},offset:0,limit:10})
     *     // 不会发请求，直接走缓存
     *     _cache._$getList({key:'abc',data:{},offset:0,limit:10})
     *     // 第一个项请求
     *     _cache._$getItem({id:'abc',key:'123',data:{})
     *     // 不会发请求，直接走缓存
     *     _cache._$getItem({id:'abc',key:'123',data:{})
     * });
     * ```
     * 
     * @class   module:util/cache/abstract._$$CacheListAbstract
     * @extends module:util/cache/list._$$CacheList
     * 
     * @param   {Object} config - 可选配置参数
     */
    /** 
     * 列表载入完成回调
     * 
     * @event    module:util/cache/abstract._$$CacheListAbstract#onlistload
     * @param    {Object}   event - 可选配置参数
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /** 
     * 缓存项载入完成回调
     * 
     * @event    module:util/cache/abstract._$$CacheListAbstract#onitemload
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /** 
     * 缓存项添加完成回调
     * 
     * @event    module:util/cache/abstract._$$CacheListAbstract#onitemadd
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /** 
     * 缓存项删除完成回调
     * 
     * @event    module:util/cache/abstract._$$CacheListAbstract#onitemdelete 
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /** 
     * 缓存项更新完成回调
     * 
     * @event    module:util/cache/abstract._$$CacheListAbstract#onitemupdate
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /** 
     * 服务器最新列表拉取完成回调
     * 
     * @event    module:util/cache/abstract._$$CacheListAbstract#onpullrefresh
     * @param    {Object}   event - 可选配置参数
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    _p._$$CacheListAbstract = _k._$klass();
    _pro = _p._$$CacheListAbstract._$extend(_t._$$CacheList);
    /**
     * 发送请求
     *
     * @protected
     * @method module:util/cache/abstract._$$CacheListAbstract#__doSendRequest
     * @param  {String} key - 请求配置标识
     * @param  {Object} options - 请求信息
     * @return {Void}
     */
    _pro.__doSendRequest = function(key,options){
        // check config
        var conf = config[key];
        if (!conf){
            console.error('not found request config for '+key);
            return;
        }
        // onerror event
        var onerror = function(error){
            var event = {
                cnf:conf,
                req:options,
                error:error||{}
            };
            // check global error handler
            dispatch.call(this,'error',event);
            if (event.stopped){
                return;
            }
            // dispatch error config event
            var onerror = options.onerror||conf.onerror||'onerror';
            if (_u._$isFunction(onerror)){
                onerror.call(this,event);
            }else if(_u._$isString(onerror)){
                this._$dispatchEvent(onerror,event);
            }
        };
        // onload event
        var onload = function(result){
            var event = {
                req:options,
                res:result,
                cnf:conf
            };
            // check post handler
            if (_u._$isFunction(conf.post)){
                conf.post.call(this,event);
            }
            dispatch.call(this,'post',event);
            if (!!event.error){
                onerror.call(this,event.error);
                return;
            }
            // check global format handler
            if (_u._$isFunction(conf.format)){
                conf.format.call(this,event);
            }
            dispatch.call(this,'format',event);
            // callback
            var callback = options.onload||conf.onload;
            if (event.result!=null){
                result = event.result;
            }
            if (_u._$isFunction(callback)){
                callback.call(this,result);
            }else if(_u._$isString(callback)){
                this._$dispatchEvent(callback,result);
            }
            // finally action
            if (_u._$isFunction(conf.finaly)){
                conf.finaly.call(this,event);
            }
        };
        // before request
        var event = {
            url:conf.url||options.url,
            req:options,
            cnf:conf,
            key:key
        };
        dispatch.call(this,'filter',event);
        if (_u._$isFunction(conf.filter)){
            conf.filter.call(this,event);
            // not request if filter has result
            if (!!event.result){
                onload.call(this,event.result);
                return;
            }
        }
        // send request
        var opt = _u._$merge({},options,{
            type:conf.type||'json',
            method:conf.method||'POST',
            onload:onload._$bind(this),
            onerror:onerror._$bind(this)
        });
        // do request
        var _req = _j;
        if (conf.rest){
            _req = _jj;
        }
        if (conf.jsonp){
            _req = _jjj;
        }
        _req._$request(event.url,opt);
    };
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/cache/abstract._$$CacheListAbstract#__init
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this._$batEvent({
            doloadlist:this.__doLoadList._$bind(this),
            doloaditem:this.__doLoadItem._$bind(this),
            doadditem:this.__doAddItem._$bind(this),
            dodeleteitem:this.__doDeleteItem._$bind(this),
            doupdateitem:this.__doUpdateItem._$bind(this),
            dopullrefresh:this.__doPullRefresh._$bind(this)
        });
    };
    /**
     * 从服务器端载入列表，子类实现具体逻辑
     * 
     * @abstract
     * @method   module:util/cache/abstract._$$CacheListAbstract#__doLoadList
     * @param    {Object}   arg0   - 请求信息
     * @property {String}   key    - 列表标识
     * @property {Number}   offset - 偏移量
     * @property {Number}   limit  - 数量
     * @property {String}   data   - 请求相关数据
     * @property {Function} onload - 列表项载入回调
     * @return   {Void}
     */
    _pro.__doLoadList = _f;
    /**
     * 从服务器端前向刷新列表，子类实现具体逻辑
     * 
     * @abstract
     * @method   module:util/cache/abstract._$$CacheListAbstract#__doPullRefresh
     * @param    {Object}   arg0   - 请求信息
     * @property {String}   key    - 列表标识
     * @property {String}   data   - 请求相关数据
     * @property {Function} onload - 列表项载入回调
     * @return   {Void}
     */
    _pro.__doPullRefresh = _f;
    /**
     * 从服务器端载入列表项，子类实现具体逻辑
     * 
     * @abstract
     * @method   module:util/cache/abstract._$$CacheListAbstract#__doLoadItem
     * @param    {Object}   arg0   - 请求信息
     * @property {String}   key    - 列表标识
     * @property {Number}   id     - 列表项标识
     * @property {String}   data   - 请求相关数据
     * @property {Function} onload - 列表项载入回调
     * @return   {Void}
     */
    _pro.__doLoadItem = _f;
    /**
     * 添加列表项至服务器，子类实现具体逻辑
     * 
     * @abstract
     * @method   module:util/cache/abstract._$$CacheListAbstract#__doAddItem
     * @param    {Object}   arg0   - 请求信息
     * @property {String}   key    - 列表标识
     * @property {Number}   id     - 列表项标识
     * @property {String}   data   - 请求相关数据
     * @property {Function} onload - 列表项载入回调
     * @return   {Void}
     */
    _pro.__doAddItem = _f;
    /**
     * 从服务器上删除列表项，子类实现具体逻辑
     * 
     * @abstract
     * @method    module:util/cache/abstract._$$CacheListAbstract#__doDeleteItem
     * @param     {Object}   event  - 请求信息
     * @property  {String}   key    - 列表标识
     * @property  {Number}   id     - 列表项标识
     * @property  {String}   data   - 请求相关数据
     * @property  {Function} onload - 列表项载入回调
     * @return    {Void}
     */
    _pro.__doDeleteItem = _f;
    /**
     * 更新列表项至服务器，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/cache/abstract._$$CacheListAbstract#__doUpdateItem
     * @param    {Object}   event  - 请求信息
     * @property {String}   key    - 列表标识
     * @property {Number}   id     - 列表项标识
     * @property {String}   data   - 请求相关数据
     * @property {Function} onload - 列表项载入回调
     * @return   {Void}
     */
    _pro.__doUpdateItem = _f;
    /**
     * 全局预处理事件配置
     *
     * @param  {Object}   map - 事件配置信息
     * @param  {function} map.filter - 请求发送之前统一预处理事件，输入为{req:options,url:'url'}
     * @param  {function} map.post   - 请求返回之后统一预处理事件，输入为{req:options,res:result}
     * @param  {function} map.format - 请求返回数据统一格式化事件, 输入为{req:options,res:result}
     * @param  {function} map.error  - 请求返回异常统一预处理事件, 输入为{req:options,error:error}
     * @return {Void}
     */
    _p._$on = (function(){
        var _doAdd = function(name,func){
            if (!_u._$isFunction(func)){
                return;
            }
            var key = name+'-'+seed,
                list = config[key]||[];
            list.push(func);
            config[key] = list;
        };
        return function(map){
            // for name and func
            if (_u._$isString(map)){
                _doAdd.apply(null,arguments);
                return;
            }
            // for batch add
            _u._$loop(map,function(func,key){
                _doAdd(key,func);
            });
        };
    })();
    /**
     * 执行缓存的同步方法，执行完毕后立即回收缓存
     *
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     'util/cache/abstract'
     * ],function(k,t,p,pro){
     *     // 定义自己的缓存类
     *     p._$$Cache = k._$klass();
     *     pro = p._$$Cache._$extend(t._$$CacheListAbstract);
     *
     *     // 对外接口
     *     pro._$getDataForCheck = function(){
     *         // TODO something
     *         return 'result';
     *     }
     *
     *     // 重写_$do方法，绑定缓存构造器
     *     p._$do = t._$do._$bind(
     *         null,p._$$Cache
     *     );
     * });
     * ```
     *
     * ```javascript
     * NEJ.define([
     *     'path/to/cache'
     * ],function(t){
     *
     *     // 使用缓存
     *     var ret = t._$do(function(cache){
     *         return cache._$getDataForCheck();
     *     });
     *
     *     // TODO something
     * }
     * ```
     *
     * @method module:util/cache/abstract._$do
     * @param  {Function} Klass - 缓存构造器
     * @param  {function} func  - 执行回调
     * @return {Variable} 回调返回结果
     */
    _p._$do = function(Klass,func){
        if (!_u._$isFunction(func)){
            return;
        }
        var cache = Klass._$allocate(),
            ret = func.call(null,cache);
        cache._$recycle();
        return ret;
    };
    /**
     * 请求配置信息，项目中可以统一配置请求信息，可配置项如下表所示
     *
     * | 名称    | 类型     | 描述  |
     * | :----:  | :----:   | :---- |
     * | url     | String   | 请求地址 |
     * | method  | String   | 请求方式，GET/POST/PUT等，默认为POST |
     * | rest    | Boolean  | 是否REST接口 |
     * | filter  | Function | 请求发送之前配置信息过滤接口 |
     * | post    | Function | 请求返回之后结果检查接口 |
     * | format  | Function | 请求返回结果格式化接口 |
     * | finaly  | Function | 回调结束后执行业务逻辑接口 |
     * | onerror | Function | 异常处理接口 |
     * | onload  | Function | 回调处理接口 |
     *
     * @method module:util/cache/abstract._$config
     * @see    module:util/cache/abstract._$on
     * @param  {Object} map - 配置映射关系，如{'key1':{url:'url'},'key2':'url'}
     * @return {Void}
     */
    _p._$config = function(map){
        _u._$forIn(map,function(value,key){
            if (typeof value==='string'){
                value = {url:value};
            }
            config[key] = value;
        });
    };
    /**
     * 合并请求配置信息
     *
     * @method module:util/cache/abstract._$merge
     * @see    module:util/cache/abstract._$config
     * @param  {String} key - 配置标识
     * @param  {Object} map - 配置信息
     * @return {Void}
     */
    _p._$merge = function(key,map){
        var conf = config[key];
        if (!conf){
            config[key] = map;
        }else{
            config[key] = _u._$merge(conf,map);
        }
    };

    /**
     * 导出配置信息对象
     *
     * @method module:util/cache/abstract._$dump
     * @returns {Object} 配置信息对象
     */
    _p._$dump = function(){
        return config;
    };

    if (CMPT){
        NEJ.P('nej.ut')._$$AbstractListCache = _p._$$CacheListAbstract;
    }
    
    return _p;
});
