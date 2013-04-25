/*
 * ------------------------------------------
 * 缓存管理基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _r = NEJ.R,
        _f = NEJ.F,
        _u = _('nej.u'),
        _j = _('nej.j'),
        _p = _('nej.ut'),
        _ckey = 'dat-'+(+new Date),
        _proCache;
    if (!!_p._$$Cache) return;
    /**
     * 缓存对象基类,支持以下回调事件<br/>
     * 脚本举例
     * [code]
     *   var c = NEJ.P('nej.ut');
     *   // 第一步，创建一个继承自Cache的CacheCustom类
     *   _p._$$CacheCustom = NEJ.C();
     *   _proCacheCustom = _p._$$CacheCustom._$extend(_p._$$Cache);
     *   _proCacheCustom.__reset = function(_options){
     *       this.__supReset(_options);
     *       // 根据id生成一个cache对象
     *       this.__getCache(_options._id);
     *   };
     *   
     *   // 根据id生成一个cache对象
     *   _proCacheCustom.__getCache = function(_id){
     *       var _cache = {};
     *       if (!!_id){
     *           _cache = this.__cache[_id];
     *           if (!_cache){
     *               _cache = {};
     *               this.__cache[_id] = _cache;
     *           }
     *       }
     *       this.__myCache = _cache;
     *   };
     *   // 对外开放的接口，接受id+key，可以生成唯一标识符
     *   _proCacheCustom._$getData = (function(_id,_key){
     *       return function(_id,_key){
     *           // 生成唯一标识符
     *           var _rkey = _id+_key;
     *           // 保存参数对象
     *           var _rpot = {id:_id,key:key};
     *           // 从公有接口取缓存中的数据
     *           var _data = this._$getDataInCache(_rkey);
     *           // 如果缓存中已经有数据
     *           if(!!_data){
     *                // 最终对获取数据的处理方法
     *                // 可以通过传过来的标识符来从cache中取到数据进行处理
     *                this._$dispatchEvent('ondataload',_ropt);
     *                return this;
     *           }
     *           // 如果缓存中没有数据
     *           // 先缓存请求，如果根据标识此请求没有缓存过,先缓存起来，然后返回false，触发if里面的语句
     *           // 如果根据标识，请求已经在缓存中存在，把回调方法ondataload推送到缓存列表中
     *           // 这样第一次的请求回调回来了，调用_ropt.onload。参照下面的getData方法
     *           if (!this.__doQueueRequest(_rkey,
     *               this._$dispatchEvent._$bind(this,'ondataload'))){
     *               _ropt.rkey = _rkey;
     *               _ropt.onload = this.__getData._$bind(this,_ropt);
     *               this._$dispatchEvent('dodataload',_ropt);
     *           }
     *           return this;
     *       } 
     *   });
     *   
     *   // 第一次请求的回调回来了
     *   // 先把回调的标识和数据，缓存到cache中
     *   // 然后利用__doCallbackRequest，调用根据标识的找到的所有回调方法，用cache里的数据去回调
     *   // 这样只要是同一请求标识，发了几次就有几次回调，真正跟后台交换数据只有第一次
     *   _proCacheCustom.__getData = function(){
     *       _ropt = _ropt||_o;
     *       // 这里缓存到列表中去
     *       this.__doSaveToCache(_ropt.rkey,_data);
     *       this.__doCallbackRequest(_ropt.rkey,_ropt);
     *   }
     *   
     *   // 根据标识和服务器返回的数据，缓存到cache中
     *   _proCacheCustom.__doSaveToCache = function(_rkey,_data){
     *       if(!this.__myCache[_rkey])
     *           this.__myCache[_rkey] = _data;
     *   }
     *   
     *   
     *   // 根据标识符从缓存中取数据
     *   _proCacheCustom._$getDataInCache = function(_rkey){
     *       return this.__myCache[_rkey];
     *   };
     *   
     * [/code]
     * [code]
     *   // 第二步生成一个上面的实例对象
     *   var _cc = c._$$CacheCustom._$allocate({
     *       // 接受id和key的信息,组成标识符来取数据
     *       // 此方法可以用_cc._$setEvent('ondataload',this.__onDataLoad._$bind(this))来注册
     *       ondataload:function(_ropt){
     *           // 获取数据用来展示
     *           var _data = _cc._$getDataInCache(_ropt.id+_ropt.key);
     *       },
     *       // 此方法在第一次cache中没缓存的情况，负责做一次真正的数据交互
     *       dodataload:function(_ropt){
     *           j._$request('http://123.163.com:3000/xhr/getLog',{
     *               type:'json',
     *               method:'POST',
     *               data:{name:'cheng-lin'},
     *               timeout:1000,
     *               // 数据返回的回调,返交给cache对象进行cache处理
     *               onload:_ropt.onload._$bind(this),
     *               onerror:function(_error){
     *                  // 错误信息处理
     *              }
     *         }
     *       }
     *   });
     * [/code]
     * 
     * [code]
     *   // 第三步：发送请求
     *   // 第一个请求
     *   _cc._$getData('a','b');
     *   // 第二个请求
     *   _cc._$getData('a','c');、
     *   // 不会发请求，直接走缓存
     *   _cc._$getData('a','b');
     * [/code]
     * 
     * @class   {nej.ut._$$Cache} 缓存对象基类
     * @extends {nej.ut._$$Event}
     * 
     * 
     */
    _p._$$Cache = NEJ.C();
      _proCache = _p._$$Cache._$extend(_p._$$Event);
    /**
     * 初始化函数
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proCache.__init = function(){
        this.__supInit();
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
    _proCache.__getDataInCache = function(_key){
        return this.__cache[_key];
    };
    /**
     * 数据存入缓存
     * @protected
     * @method {__setDataInCache}
     * @param  {String}     缓存键值
     * @param  {Variable}   缓存数据
     * @return {Void}
     */
    _proCache.__setDataInCache = function(_key,_value){
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
    _proCache.__getDataInCacheWithDefault = function(_key,_default){
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
    _proCache.__delDataInCache = function(_key){
        if (_key!=null){
            delete this.__cache[_key];
            return;
        }
        _u._$forIn(this.__cache,
            function(_item,_key){
                if (_key==(_ckey+'-l')) return;
                this.__delDataInCache(_key);
            },this);
    };
    /**
     * 从本地存储中取数据
     * @protected
     * @method {__getDataInStorage}
     * @param  {String} 存储键值
     * @return {String} 存储数据
     */
    _proCache.__getDataInStorage = function(_key){
        if (!!_j._$getDataInStorage)
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
    _proCache.__setDataInStorage = function(_key,_value){
        if (!!_j._$setDataInStorage)
            _j._$setDataInStorage(_key,_value);
    };
    /**
     * 带默认值取本地数据
     * @protected
     * @method {__getDataLocalWithDefault}
     * @param  {String}   键值
     * @param  {Variable} 默认值
     * @return {Void}
     */
    _proCache.__getDataLocalWithDefault = function(_key,_default){
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
    _proCache.__getDataLocal = function(_key){
        var _data = this.__getDataInCache(_key);
        if (_data!=null) return _data;
        _data = this.__getDataInStorage(_key);
        if (_data!=null)
            this.__setDataInCache(_key,_data);
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
    _proCache.__setDataLocal = function(_key,_value){
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
    _proCache.__delDataLocal = function(_key){
        if (_key!=null){
            delete this.__cache[_key];
            if (!!_j._$delDataInStorage)
                _j._$delDataInStorage(_key);
            return;
        }
        _u._$forIn(this.__cache,
            function(_item,_key){
                if (_key==(_ckey+'-l')) return;
                this.__delDataLocal(_key);
            },this);
    };
    /**
     * 清除缓存数据<br/>
     * 脚本举例
     * [code]
     *   var _cache = new c._$$Cache();
     *   j._$clearDataLocal('name','jack');
     *   // 清空所有hash值
     *   j._$clearDataInStorage();
     * [/code]
     * @method {_$clearDataLocal}
     * @return {nej.ut._$$Cache}
     */
    _proCache._$clearDataLocal = function(){
        this.__delDataLocal();
        return this;
    };
    /**
     * 请求回调
     * @protected
     * @method {__doCallbackRequest}
     * @param  {String} 请求标识
     * @return {Void}
     */
    _proCache.__doCallbackRequest = function(_key){
        var _data = this.__cache[_ckey+'-l'],
            _args = _r.slice.call(arguments,1);
        _u._$forEach(_data[_key],
            function(_callback){
                try{
                    _callback.apply(null,_args);
                }catch(ex){
                    // ignore
                    console.error(ex.message);
                    console.error(ex.stack);
                }
            });
        delete _data[_key];
    };
    /**
     * 缓存请求
     * @protected
     * @method {__doQueueRequest}
     * @param  {String}   请求标识
     * @param  {Function} 请求回调
     * @return {Boolean}  是否已存在相同请求
     */
    _proCache.__doQueueRequest = function(_key,_callback){
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
    _proCache.__hasFragment = function(_list,_offset,_limit){
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
};
NEJ.define('{lib}util/cache/cache.js',['{lib}util/event.js'],f);