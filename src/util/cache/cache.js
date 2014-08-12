/*
 * ------------------------------------------
 * 缓存管理基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    '{lib}util/event.js',
    './storage.js'
],function(NEJ,_k,_u,_t,_j,_p,_o,_f,_r){
    var _pro,
        _ckey = 'dat-'+(+new Date);
    /**
     * 缓存对象基类<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/klass.js',
     *       '{lib}util/ajax/xdr.js',
     *       '{lib}util/cache/cache.js'
     *   ],function(_k,_j,_t,_p){
     *       var _pro;
     * 
     *       _p._$$CacheCustom = _k._$klass();
     *       _pro = _p._$$CacheCustom._$extend(_t._$$Cache);
     * 
     *       // 取缓存数据，先从内存中取，没有从服务器上取
     *       _pro._$getDataInCache = function(_key){
     *           this.__setDataInCache(_key,_value);
     *       };
     * 
     *       // 取数据
     *       _pro._$getData = function(_key){
     *           var _data = this._$getDataInCache(_key);
     *           // 数据已在缓存中
     *           if (_data!=null){
     *               this._$dispatchEvent('ondataload',{
     *                   key:_key
     *               });
     *               return;
     *           }
     *           // 从服务器端载入数据
     *           // rkey为请求唯一标识，可以是URL，也可以是某种算法的结果
     *           var _rkey = this.__doGenReqKey(_key), 
     *               _callback = this._$dispatchEvent._$bind(
     *                   this,'ondataload',{key:_key}
     *               );
     *           if (!this.__doQueueRequest(_rkey,_callback)){
     *               _j._$request({
     *                   onload:function(_data){
     *                       // 缓存数据
     *                       this.__setDataInCache(_key,_data);
     *                       // 触发队列中同请求的回调逻辑
     *                       this.__doCallbackRequest(_rkey);
     *                   }._$bind(this)
     *               });
     *           }
     *       };
     * 
     *       return _p;
     *   });
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '/path/to/custom/cache.js'
     *   ],function(_p){
     *       // 使用Cache
     *       var _cache = _p._$$CacheCustom._$allocate({
     *           ondataload:function(_event){
     *               // get data in cache
     *               var _data = this._$getDataInCache(_event.key);
     *               // TODO 
     *           }
     *       });
     *       // 第一个请求
     *       _cache._$getData('a');
     *       // 第二个请求
     *       _cache._$getData('b');、
     *       // 不会发请求，直接走缓存
     *       _cache._$getData('a');
     *   });
     * [/code]
     * 
     * @class   {_$$Cache} 
     * @extends {_$$EventTarget}
     * 
     * @param   {Object} 配置参数
     */
    _p._$$Cache = NEJ.C();
    _pro = _p._$$Cache._$extend(_t._$$EventTarget);
    /**
     * 初始化函数
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__cache = this.constructor[_ckey];
        if (!this.__cache){
            this.__cache = {};
            // request loading information
            this.__cache[_ckey+'-l'] = {};
            this.constructor[_ckey] = this.__cache;
        }
    };
    /**
     * 从缓存中取数据
     * @protected
     * @method {__getDataInCache}
     * @param  {String}   缓存键值
     * @return {Variable} 缓存数据
     */
    _pro.__getDataInCache = function(_key){
        return this.__cache[_key];
    };
    /**
     * 数据存入缓存
     * @protected
     * @method {__setDataInCache}
     * @param  {String}   缓存键值
     * @param  {Variable} 缓存数据
     * @return {Void}
     */
    _pro.__setDataInCache = function(_key,_value){
        this.__cache[_key] = _value;
    };
    /**
     * 带默认值取本地数据
     * @protected
     * @method {__getDataInCacheWithDefault}
     * @param  {String}   键值
     * @param  {Variable} 默认值
     * @return {Void}
     */
    _pro.__getDataInCacheWithDefault = function(_key,_default){
        var _data = this.__getDataInCache(_key);
        if (_data==null){
            _data = _default;
            this.__setDataInCache(_key,_data);
        }
        return _data;
    };
    /**
     * 删除缓存数据，不传键值则清除所有缓存
     * @protected
     * @method {__delDataInCache}
     * @param  {String} 缓存键值
     * @return {Void}
     */
    _pro.__delDataInCache = function(_key){
        if (_key!=null){
            delete this.__cache[_key];
            return;
        }
        _u._$forIn(
            this.__cache,function(_item,_key){
                if (_key!=(_ckey+'-l')){
                    this.__delDataInCache(_key);
                }
            },this
        );
    };
    /**
     * 从本地存储中删除数据
     * @protected
     * @method {__delDataInStorage}
     * @param  {String} 存储键值
     * @return {String} 存储数据
     */
    _pro.__delDataInStorage = function(_key){
        return _j._$delDataInStorage(_key);
    };
    /**
     * 从本地存储中取数据
     * @protected
     * @method {__getDataInStorage}
     * @param  {String} 存储键值
     * @return {String} 存储数据
     */
    _pro.__getDataInStorage = function(_key){
        return _j._$getDataInStorage(_key);
    };
    /**
     * 数据存入本地缓存
     * @protected
     * @method {__setDataInStorage}
     * @param  {String}   存储键值
     * @param  {Variable} 存储数据
     * @return {Void}
     */
    _pro.__setDataInStorage = function(_key,_value){
        _j._$setDataInStorage(_key,_value);
    };
    /**
     * 带默认值取本地数据
     * @protected
     * @method {__getDataLocalWithDefault}
     * @param  {String}   键值
     * @param  {Variable} 默认值
     * @return {Variable} 数据
     */
    _pro.__getDataLocalWithDefault = function(_key,_default){
        var _data = this.__getDataLocal(_key);
        if (_data==null){
            _data = _default;
            this.__setDataLocal(_key,_data);
        }
        return _data;
    };
    /**
     * 取本地数据,检测内存和本地存储
     * @protected
     * @method {__getDataLocal}
     * @param  {String}   键值
     * @return {Variable} 数据
     */
    _pro.__getDataLocal = function(_key){
        // get from memory
        var _data = this.__getDataInCache(_key);
        if (_data!=null){
            return _data;
        }
        // get from storage
        _data = this.__getDataInStorage(_key);
        if (_data!=null){
            this.__setDataInCache(_key,_data);
        }
        return _data;
    };
    /**
     * 存本地数据
     * @protected
     * @method {__setDataLocal}
     * @param  {String}   键值
     * @param  {Variable} 数据
     * @return {Void}
     */
    _pro.__setDataLocal = function(_key,_value){
        this.__setDataInStorage(_key,_value);
        this.__setDataInCache(_key,_value);
    };
    /**
     * 清除本地缓存，不传键值则清除所有缓存
     * @protected
     * @method {__delDataLocal}
     * @param  {String} 缓存键值
     * @return {Void}
     */
    _pro.__delDataLocal = function(_key){
        if (_key!=null){
            delete this.__cache[_key];
            _j._$delDataInStorage(_key);
            return;
        }
        _u._$forIn(
            this.__cache,function(_item,_key){
                if (_key!=(_ckey+'-l')){
                    this.__delDataLocal(_key);
                }
            },this
        );
    };
    /**
     * 清除缓存数据<br/>
     * 
     * 脚本举例
     * [code]
     *   var _cache = new c._$$Cache();
     *   j._$clearDataLocal('name','jack');
     *   // 清空所有hash值
     *   j._$clearDataInStorage();
     * [/code]
     * 
     * @method {_$clearDataLocal}
     * @return {Void}
     */
    _pro._$clearDataLocal = function(){
        this.__delDataLocal();
    };
    /**
     * 请求回调
     * @protected
     * @method {__doCallbackRequest}
     * @param  {String} 请求标识
     * @return {Void}
     */
    _pro.__doCallbackRequest = function(_key){
        var _data = this.__cache[_ckey+'-l'],
            _args = _r.slice.call(arguments,1);
        _u._$forEach(
            _data[_key],function(_callback){
                try{
                    _callback.apply(this,_args);
                }catch(ex){
                    // ignore
                    console.error(ex.message);
                    console.error(ex.stack);
                }
            }
        );
        delete _data[_key];
    };
    /**
     * 锁定请求，同样的请求只发送一次
     * @protected
     * @method {__doQueueRequest}
     * @param  {String}   请求标识
     * @param  {Function} 请求回调
     * @return {Boolean}  是否已存在相同请求
     */
    _pro.__doQueueRequest = function(_key,_callback){
        _callback = _callback||_f;
        var _list = this.__cache[_ckey+'-l'][_key];
        if (!_list){
            _list = [_callback];
            this.__cache[_ckey+'-l'][_key] = _list;
            return !1;
        }
        _list.push(_callback);
        return !0;
    };
    /**
     * 检测列表中是否已存在指定片段数据
     * @protected
     * @method {__hasFragment}
     * @param  {Array}   列表
     * @param  {Number}  偏移量
     * @param  {Number}  数量，0表示全列表，默认为0
     * @return {Boolean} 是否已经存在
     */
    _pro.__hasFragment = function(_list,_offset,_limit){
        if (!_list) return !1;
        _offset = parseInt(_offset)||0;
        _limit  = parseInt(_limit)||0;
        if (!_limit){
            if (!_list.loaded)
                return !1;
            _limit = _list.length;
        }
        // length is list total number
        if (!!_list.loaded)
            _limit = Math.min(_limit,
                     _list.length-_offset);
        for(var i=0;i<_limit;i++)
            if (!_list[_offset+i])
                return !1;
        return !0;
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;
});
