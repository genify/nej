/*
 * ------------------------------------------
 * 列表缓存管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/cache/list */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    './cache.js'
],function(NEJ,_k,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 列表缓存管理器
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/ajax/xdr',
     *     'util/cache/list'
     * ],function(_j,_t){
     *     var _cache = _t._$$CacheList._$allocate({
     *         id:'abc',
     *         doloadlist:function(_options){
     *             // 从服务器加载列表
     *             _j._$request(
     *                 '/api/list',{
     *                     data:_options.data,
     *                     onload:function(_list){
     *                         _options.onload(_list);
     *                     }
     *                 }
     *             );
     *         },
     *         doloaditem:function(_options){
     *             // 从服务器加载数据项
     *             _j._$request(
     *                 '/api/get',{
     *                     data:_options.data,
     *                     onload:function(_item){
     *                         _options.onload(_item);
     *                     }
     *                 }
     *             );
     *         },
     *         doadditem:function(_options){
     *             // 往服务器添加数据项
     *             _j._$request(
     *                 '/api/add',{
     *                     data:_options.data,
     *                     onload:function(_item){
     *                         _options.onload(_item);
     *                     }
     *                 }
     *             );
     *         },
     *         dodeleteitem:function(_options){
     *             // 从服务器删除数据项
     *             _j._$request(
     *                 '/api/delete',{
     *                     data:_options.data,
     *                     onload:function(_item){
     *                         _options.onload(_item);
     *                     }
     *                 }
     *             );
     *         },
     *         doupdateitem:function(_options){
     *             // 更新数据项至服务器
     *             _j._$request(
     *                 '/api/update',{
     *                     data:_options.data,
     *                     onload:function(_item){
     *                         _options.onload(_item);
     *                     }
     *                 }
     *             );
     *         },
     *         dopullrefresh:function(_options){
     *             // 从服务器加载列表
     *             _j._$request(
     *                 '/api/pull',{
     *                     data:_options.data,
     *                     onload:function(_list){
     *                         _options.onload(_list);
     *                     }
     *                 }
     *             );
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
     * @class   module:util/cache/list._$$CacheList
     * @extends module:util/cache/cache._$$CacheAbstract
     *
     * @param    {Object}  config  - 可选配置参数
     * @property {String}  id      - 缓存标识，默认使用构造器缓存
     * @property {String}  key     - 列表项标识字段，默认为id
     * @property {Object}  data    - 列表关联数据
     * @property {Boolean} autogc  - 是否自动操作
     */
    /**
     * 列表载入完成回调
     * 
     * @event    module:util/cache/list._$$CacheList#onlistload
     * @param    {Object}   event - 可选配置参数
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /**
     * 缓存项载入完成回调
     * 
     * @event    module:util/cache/list._$$CacheList#onitemload
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /**
     * 缓存项添加完成回调
     * 
     * @event    module:util/cache/list._$$CacheList#onitemadd
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /**
     * 缓存项删除完成回调
     * 
     * @event    module:util/cache/list._$$CacheList#onitemdelete
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /**
     * 缓存项更新完成回调
     * 
     * @event    module:util/cache/list._$$CacheList#onitemupdate
     * @param    {Object}   event - 可选配置参数
     * @property {String}   id    - 项标识
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /**
     * 服务器最新列表拉取完成回调
     * 
     * @event    module:util/cache/list._$$CacheList#onpullrefresh
     * @param    {Object}   event - 可选配置参数
     * @property {String}   key   - 列表标识
     * @property {Variable} ext   - 传入数据原样返回
     */
    /**
     * 从服务器载入列表
     * 
     * @event    module:util/cache/list._$$CacheList#doloadlist
     * @param    {Object}   event  - 可选配置参数
     * @property {String}   key    - 列表标识
     * @property {Variable} ext    - 回调回传数据
     * @property {Number}   data   - 需要提交到服务器的其他信息
     * @property {Number}   offset - 偏移量
     * @property {Number}   limit  - 数量
     * @property {Function} onload - 请求回调
     */
    /**
     * 从服务器载入数据项
     * 
     * @event    module:util/cache/list._$$CacheList#doloaditem
     * @param    {Object}   event  - 可选配置参数
     * @property {String}   id     - 项标识
     * @property {String}   key    - 列表标识
     * @property {Variable} ext    - 回调回传数据
     * @property {Number}   data   - 需要提交到服务器的其他信息
     * @property {Function} onload - 请求回调
     */
    /**
     * 往服务器添加数据项
     * 
     * @event    module:util/cache/list._$$CacheList#doadditem
     * @param    {Object}   event  - 可选配置参数
     * @property {String}   key    - 列表标识
     * @property {Variable} ext    - 回调回传数据
     * @property {String}   data   - 数据项对象
     * @property {Function} onload - 请求回调
     */
    /**
     * 从服务器删除数据项
     * 
     * @event    module:util/cache/list._$$CacheList#dodeleteitem
     * @param    {Object}   event  - 可选配置参数
     * @property {String}   key    - 列表标识
     * @property {Variable} ext    - 回调回传数据
     * @property {String}   data   - 数据项对象
     * @property {Function} onload - 请求回调
     */
    /**
     * 更新服务器数据项
     * 
     * @event    module:util/cache/list._$$CacheList#doupdateitem
     * @param    {Object}   event  - 可选配置参数
     * @property {String}   key    - 列表标识
     * @property {Variable} ext    - 回调回传数据
     * @property {String}   data   - 数据项对象
     * @property {Function} onload - 请求回调
     */
    /**
     * 从服务器拉取最新列表
     * 
     * @event    module:util/cache/list._$$CacheList#dopullrefresh
     * @param    {Object}   event  - 可选配置参数
     * @property {String}   key    - 列表标识
     * @property {Variable} ext    - 回调回传数据
     * @property {Function} onload - 请求回调
     */
    _p._$$CacheList = _k._$klass();
    _pro = _p._$$CacheList._$extend(_t._$$CacheAbstract);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__key = _options.key||'id';
        this.__data = _options.data||_o;
        this.__auto = !!_options.autogc;
        this.__doSwapCache(_options.id);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__destroy
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        // check gc schedule
        if (!!this.__timer){
            this.__doGCAction();
        }
    };
    /**
     * 切换缓存
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doSwapCache
     * @param  {String} arg0 - 缓存标识
     * @return {Void}
     */
    _pro.__doSwapCache = function(_id){
        var _cache;
        if (!!_id){
            _cache = this.__cache[_id];
            if (!_cache){
                _cache = {};
                this.__cache[_id] = _cache;
            }
        }
        _cache = _cache||this.__cache;
        _cache.hash = _cache.hash||{};
        // hash    [Object] - item map by id
        // list    [Array]  - default list
        // x-list  [Array]  - list with key 'x'
        this.__lspl = _cache;
    };
    /**
     * 执行GC行为
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doGCAction
     * @return {Void}
     */
    _pro.__doGCAction = function(){
        this.__timer = window.clearTimeout(this.__timer);
        // dump id map for used items
        var _map = {};
        _u._$forIn(
            this.__lspl,function(_list,_key){
                if (_key=='hash') return;
                if (!_u._$isArray(_list)) return;
                _u._$forEach(_list,function(_item){
                    if (!_item) return;
                    _map[_item[this.__key]] = !0;
                },this);
            },this
        );
        // check used in hash
        _u._$forIn(
            this.__getHash(),
            function(_item,_id,_hash){
                if (!_map[_id]){
                    delete _hash[_id];
                }
            }
        );
    };
    /**
     * 调度执行GC操作，删除不用的数据对象
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doGCSchedule
     * @return {Void}
     */
    _pro.__doGCSchedule = function(){
        if (!!this.__timer){
            this.__timer = window.clearTimeout(this.__timer);
        }
        this.__timer = window.setTimeout(
            this.__doGCAction._$bind(this),150
        );
    };
    /**
     * 缓存列表项
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doSaveItemToCache
     * @param  {Object|Array} arg0 - 列表项或列表
     * @param  {String}       arg1 - 列表标识
     * @return {Object|Array}        缓存中列表项或列表
     */
    _pro.__doSaveItemToCache = function(_item,_lkey){
        // save item to cache
        if (!_u._$isArray(_item)){
            _item = this.__doFormatItem(_item,_lkey)||_item;
            if (!_item) return null;
            var _key = _item[this.__key];
            if (_key!=null){
                var _itm = this.__getHash()[_key];
                if (!!_itm){
                    _item = _u._$merge(_itm,_item);
                }
                this.__getHash()[_key] = _item;
            }
            delete _item.__dirty__;
            return _item;
        }
        // batch save to cache
        var _result = [];
        _u._$forEach(
            _item,function(_it){
                _result.push(
                    this.__doSaveItemToCache(_it,_lkey)
                );
            },this
        );
        return _result;
    };
    /**
     * 从缓存列表删除项
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doRemoveItemFromList
     * @param  {String}       arg0 - 列表标识
     * @param  {String|Array} arg1 - 项标识,['111',{id:'222',...},...]
     * @return {Object|Array}        删除项
     */
    _pro.__doRemoveItemFromList = function(_lkey,_id){
        var _result = null,
            _pkey = this.__key;
        // remove one item
        if (!_u._$isArray(_id)){
            var _result = null,
                _pkey = this.__key;
            _id = _id[_pkey]||_id;
            var _list = this._$getListInCache(_lkey),
                _index = _u._$indexOf(_list,function(_itm){
                    return !!_itm&&_itm[_pkey]==_id;
                });
            if (_index>=0){
                _result = _list[_index];
                _list.splice(_index,1);
            }
            return _result;
        }
        // batch remove items
        var _result = [];
        _u._$reverseEach(
            _id,function(_item){
                _result.unshift(
                    this.__doRemoveItemFromList(_lkey,_item)
                );
            },this
        );
        return _result;
    };
    /**
     * 格式化数据项，子类实现具体业务逻辑
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doFormatItem
     * @param  {Object} arg0 - 列表项
     * @param  {String} arg1 - 列表标识
     * @return {Object}        格式化后的列表项
     */
    _pro.__doFormatItem = _f;
    /**
     * 前向追加列表项至列表
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doUnshiftToList
     * @param  {String}       arg0 - 列表标识
     * @param  {Object|Array} arg1 - 列表项或者列表
     * @return {Void}
     */
    _pro.__doUnshiftToList = function(_key,_item){
        if (!_item) return;
        // item unshift
        if (!_u._$isArray(_item)){
            var _list = this._$getListInCache(_key),
                _item = this.__doSaveItemToCache(_item,_key);
            if (!!_item) _list.unshift(_item);
            return;
        }
        // batch unshift
        _u._$reverseEach(
            _item,function(_it){
                this.__doUnshiftToList(_key,_it);
            }
        );
    };
    /**
     * 设置列表总数
     *
     * 脚本举例
     * ```javascript
     * // 列表总数已知的情况，这时候的total是100
     * // 因为这个100是第一次请求，从服务器带过来的缓存的，后续可能会变化
     * // 但是当前页面的总页面无法做出这种适应，所以不用有相应的变化
     * // 注意：cache是无法保证数据的同步的。如果在别的地方有数据删除，cache无法获知，需要刷新页面
     * _cc._$setTotal('abc',100);
     *
     * // 列表总数未知的情况，这时候的total是list的长度
     * // 未知总长度会有更多选项出现
     * var _total = _cc._$getTotal('abc');
     * // 如果offset+limit>_total说明已经没有数据了，把更多隐藏掉
     * // 否则会继续有一个更多选项在末尾
     * ```
     *
     * @method module:util/cache/list._$$CacheList#_$setTotal
     * @see    module:util/cache/list._$$CacheList#_$getTotal
     * @param  {String} arg0 - 列表缓存键值
     * @param  {Number} arg1 - 列表总数
     * @return {Void}
     */
    _pro._$setTotal = function(_key,_total){
        var _list = this._$getListInCache(_key);
        _list.length = Math.max(_list.length,_total);
        this._$setLoaded(_key);
    };
    /**
     * 取列表总长度
     *
     * 脚本举例
     * ```javascript
     * // 获取列表总长度，未知页码的情况是total和list.length较长的一个
     * // 页面已知的情况，取total的值
     * // 以上值被设置到list的length属性中
     * _cc._$getTotal('abc');
     * ```
     *
     * @method module:util/cache/list._$$CacheList#_$getTotal
     * @see    module:util/cache/list._$$CacheList#_$setTotal
     * @param  {String} arg0 - 列表标识
     * @return {Number}        列表总长度
     */
    _pro._$getTotal = function(_key){
        return this._$getListInCache(_key).length;
    };
    /**
     * 设置未知长度列表的载入完成标志
     *
     * 脚本举例
     * ```javascript
     * // 设置key为abc的完整数据已经载入完成
     * _cc._$setLoaded('abc');
     * ```
     *
     * @method module:util/cache/list._$$CacheList#_$setLoaded
     * @param  {String} arg0 - 列表标识
     * @return {Void}
     */
    _pro._$setLoaded = function(_key,_loaded){
        this._$getListInCache(_key).loaded = _loaded!==!1;
    };
    /**
     * 判断列表是否载入完成
     *
     * @method module:util/cache/list._$$CacheList#_$isLoaded
     * @param  {String}  arg0 - 列表标识
     * @return {Boolean}        是否载入完成
     */
    _pro._$isLoaded = function(_key){
        return !!this._$getListInCache(_key).loaded;
    };
    /**
     * 设置列表，清除原有列表
     *
     * 脚本举例
     * ```javascript
     * // 设置列表
     * _cc._$setListInCache('abc',[]);
     * ```
     *
     * @method module:util/cache/list._$$CacheList#_$setListInCache
     * @param  {String} arg0 - 列表标识
     * @return {Array}         列表
     */
    _pro._$setListInCache = function(_key,_list){
        this._$clearListInCache(_key);
        this.__getList({
            key:_key,
            offset:0,
            limit:_list.length+1
        },{
            list:_list,
            total:_list.length
        });
    };
    /**
     * 直接从缓存中取列表
     *
     * 脚本举例
     * ```javascript
     * // 从cache里取列表数据
     * _cc._$getListInCache('abc');
     * ```
     *
     * @method module:util/cache/list._$$CacheList#_$getListInCache
     * @param  {String} arg0 - 列表标识
     * @return {Array}         列表
     */
    _pro._$getListInCache = (function(){
        var _doFormatKey = function(_key){
            return (_key||'')+(!_key?'':'-')+'list';
        };
        return function(_key){
            var _key = _doFormatKey(_key),
                _list = this.__lspl[_key];
            if (!_list){
                _list = [];
                this.__lspl[_key] = _list;
            }
            return _list;
        };
    })();
    /**
     * 取Hash映射表
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__getHash
     * @return {Object} 映射表
     */
    _pro.__getHash = function(){
        var _hash = this.__lspl.hash;
        if (!_hash){
            _hash = {};
            this.__lspl.hash = _hash;
        }
        return _hash;
    };
    /**
     * 前向刷新列表
     * 
     * @method   module:util/cache/list._$$CacheList#_$pullRefresh
     * @param    {Object} arg0 - 可选配置参数
     * @property {String} key  - 列表标识
     * @property {Number} data - 发送到服务器数据信息
     * @return   {Void}
     */
    _pro._$pullRefresh = (function(){
        var _doFormatKey = function(_options){
            return 'r-'+_options.key;
        };
        return function(_options){
            var _ropt = _u._$merge({},_options),
                _rkey = _doFormatKey(_ropt),
                _callback = this._$dispatchEvent._$bind(this);
            if (!this.__doQueueRequest(_rkey,_callback)){
                _ropt.rkey = _rkey;
                _ropt.onload = this.__pullRefresh._$bind(this,_ropt);
                this._$dispatchEvent('dopullrefresh',_ropt);
            }
        };
    })();
    /**
     * 前向取列表回调
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__pullRefresh
     * @param  {Object} arg0 - 请求信息
     * @param  {Array}  arg1 - 数据列表
     * @return {Void}
     */
    _pro.__pullRefresh = function(_options,_result){
        // list with total
        // {total:12,result:[]} 或者 {total:13,list:[]}
        var _key = _options.key,
            _total = parseInt(_result.total),
            _list = _result.list||_result.result;
        this.__doUnshiftToList(_key,_list||_result);
        if (!isNaN(_total)&&!!_list){
            this._$getListInCache(_key).length = _total;
            this._$setLoaded(_key);
        }
        this.__doCallbackRequest(
            _options.rkey,'onpullrefresh',_options
        );
    };
    /**
     * 取列表
     *
     * 脚本举例
     * ```javascript
     * _cc._$getList({key:'abc',data:{},offset:0,limit:10});
     * ```
     *
     * @method   module:util/cache/list._$$CacheList#_$getList
     * @param    {Object} arg0   - 可选配置参数
     * @property {String} key    - 列表标识
     * @property {Number} data   - 其他数据信息
     * @property {Number} offset - 偏移量
     * @property {Number} limit  - 数量
     * @property {Object} ext    - 回传数据
     * @return   {Void}
     */
    _pro._$getList = (function(){
        var _doFormatKey = function(_options){
            return 'r-'+
                   _options.key+'-'+
                   _options.offset+'-'+
                   _options.limit;
        };
        return function(_options){
            _options = _options||_o;
            var _ropt = {
                    key:(''+_options.key)||'',
                    ext:_options.ext||null,
                    data:_options.data||null,
                    offset:parseInt(_options.offset)||0,
                    limit:parseInt(_options.limit)||0
                },
                _list = this._$getListInCache(_ropt.key),
                _has = this.__hasFragment(
                    _list,_ropt.offset,_ropt.limit
                );
            // hit in memory
            if (_has){
                this._$dispatchEvent('onlistload',_ropt);
                return;
            }
            // load from server
            var _rkey = _doFormatKey(_ropt),
                _callback = this._$dispatchEvent._$bind(this);
            if (!this.__doQueueRequest(_rkey,_callback)){
                _ropt.rkey = _rkey;
                _ropt.onload = this.__getList._$bind(this,_ropt);
                this._$dispatchEvent('doloadlist',_ropt);
            }
        };
    })();
    /**
     * 取列表回调
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__getList
     * @param  {Object}       arg0 - 请求信息
     * @param  {Array|Object} arg1 - 数据列表，或者带总数信息列表
     * @return {Void}
     */
    _pro.__getList = (function(){
        var _doClear = function(_item,_index,_list){
            if (!!_item){
                return !0;
            }
            _list.splice(_index,1);
        };
        return function(_options,_result){
            _options = _options||_o;
            // save list to cache
            var _key = _options.key,
                _offset = _options.offset,
                _chlist = this._$getListInCache(_key);
            // list with total
            // {total:12,result:[]} 或者 {total:13,list:[]}
            var _list = _result||[];
            if (!_u._$isArray(_list)){
                _list = _result.result||_result.list||[];
                var _total = parseInt(_result.total);
                if (!isNaN(_total)||_total>_list.length){
                    this._$setTotal(_key,_total);
                }
            }
            // merge list
            _u._$forEach(
                _list,function(_item,_index){
                    _chlist[_offset+_index] = this.
                         __doSaveItemToCache(_item,_key);
                },this
            );
            // check list all loaded
            if (_list.length<_options.limit){
                this._$setLoaded(_key);
                _u._$reverseEach(_chlist,_doClear);
            }
            // do callback
            this.__doCallbackRequest(
                _options.rkey,'onlistload',_options
            );
        };
    })();
    /**
     * 清除缓存列表
     *
     * 脚本举例
     * ```javascript
     * // 取列表数据
     * _cc._$clearListInCache('abc');
     * ```
     *
     * @method module:util/cache/list._$$CacheList#_$clearListInCache
     * @param  {String} arg0 - 列表标识
     * @return {Void}
     */
    _pro._$clearListInCache = (function(){
        var _doClear = function(_item,_index,_list){
            _list.splice(_index,1);
        };
        return function(_key){
            if (!!_key){
                // clear one list
                var _list = this._$getListInCache(_key);
                _u._$reverseEach(_list,_doClear);
                this._$setLoaded(_key,!1);
                if (this.__auto){
                    this.__doGCSchedule();
                }
            }else{
                // clear all list
                _u._$forIn(
                    this.__lspl,function(_list,_key){
                        if (_key=='hash'||
                           !_u._$isArray(_list)) return;
                        _key = _key.substr(0,_key.length-5);
                        this._$clearListInCache(_key);
                    },this
                );
            }
        };
    })();
    /**
     * 验证项缓存中的项是否有效，子类可重写
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__doCheckItemValidity
     * @param  {Object}  arg0 - 数据项
     * @param  {String}  arg0 - 列表标识
     * @return {Boolean}        是否有效
     */
    _pro.__doCheckItemValidity = function(_item,_lkey){
        return !_item.__dirty__;
    };
    /**
     * 从缓存中取列表项
     *
     * 脚本举例
     * ```javascript
     * // 从cache中取某一项数据
     * _cc._$getItemInCache('abc');
     * ```
     *
     * @method module:util/cache/list._$$CacheList#_$getItemInCache
     * @param  {String}   arg0 - 项标识
     * @return {Variable}        列表项
     */
    _pro._$getItemInCache = function(_id){
        return this.__getHash()[_id];
    };
    /**
     * 清除缓存项
     * 
     * @method module:util/cache/list._$$CacheList#_$clearItemInCache
     * @param  {String} arg0 - 项标识
     * @return {Void}
     */
    _pro._$clearItemInCache = function(_id){
        var _item = this._$getItemInCache(_id);
        if (!!_item) _item.__dirty__ = !0;
    };
    /**
     * 取列表项项
     *
     * 脚本举例
     * ```javascript
     * // 取某一项数据
     * _cc._$getItem({
     *     id:'aaaa',
     *     key:'xxxxxx'
     * });
     * ```
     *
     * @method   module:util/cache/list._$$CacheList#_$getItem
     * @param    {Object} event - 请求信息
     * @property {String} id    - 项标识，该名称与配置的项标识键一致
     * @property {String} key   - 列表标识
     * @property {Object} data  - 发送到服务器的数据
     * @property {Object} ext   - 需要回传的数据信息
     * @return   {Void}
     */
    _pro._$getItem = (function(){
        var _doFormatKey = function(_options){
            return 'r-'+_options.key+'-'+_options.id;
        };
        return function(_options){
            _options = _options||_o;
            var _id = _options[this.__key],
                _ropt = {
                    id:_id,
                    ext:_options.ext,
                    data:_options.data||{},
                    key:(''+_options.key)||''
                };
                _item = this._$getItemInCache(_id);
            _ropt.data[this.__key] = _id;
            // hit in memory
            if (!!_item&&
                this.__doCheckItemValidity(_item,_ropt.key)){
                this._$dispatchEvent('onitemload',_ropt);
                return;
            }
            // load from server
            var _rkey = _doFormatKey(_ropt),
                _callback = this._$dispatchEvent._$bind(this);
            if (!this.__doQueueRequest(_rkey,_callback)){
                _ropt.rkey = _rkey;
                _ropt.onload = this.__getItem._$bind(this,_ropt);
                this._$dispatchEvent('doloaditem',_ropt);
            }
        };
    })();
    /**
     * 取列表项回调
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__getItem
     * @param  {Object} arg0 - 请求信息
     * @param  {Object} arg1 - 列表项对象
     * @return {Void}
     */
    _pro.__getItem = function(_options,_item){
        _options = _options||_o;
        this.__doSaveItemToCache(_item,_options.key);
        this.__doCallbackRequest(
            _options.rkey,'onitemload',_options
        );
    };
    /**
     * 添加列表项
     *
     * 脚本举例
     * ```javascript
     * _cc._$addItem({
     *     key: '123',
     *     item: {},
     *     push: false,
     *     offset:0
     * });
     * ```
     *
     * @method   module:util/cache/list._$$CacheList#_$addItem
     * @param    {Object}  arg0   - 配置信息
     * @property {String}  key    - 列表标识
     * @property {Object}  data   - 列表项数据
     * @property {Boolean} push   - 是否追加到列表尾部
     * @property {Number}  offset - 对于非尾部追加的项可通过此参数指定追加位置
     * @return   {Void}
     */
    _pro._$addItem = function(_options){
        _options = _u._$merge({},_options);
        _options.onload = this.__addItem._$bind(this,_options);
        this._$dispatchEvent('doadditem',_options);
    };
    /**
     * 添加列表项回调
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__addItem}
     * @param  {Object} arg0 - 请求信息
     * @param  {Object} arg1 - 列表项对象
     * @return {Void}
     */
    _pro.__addItem = function(_options,_item){
        var _key = _options.key;
        _item = this.__doSaveItemToCache(_item,_key);
        // add to list
        if (!!_item){
            var _flag = 0,
                _list = this._$getListInCache(_key);
            if (!_options.push){
                _flag = -1;
                var _offset = _options.offset||0;
                _list.splice(_offset,0,_item);
            }else if(_list.loaded){
                _flag = 1;
                _list.push(_item);
            }else{
                // add total
                _list.length++;
            }
        }
        // callback
        var _event = {
            key:_key,
            flag:_flag,
            data:_item,
            action:'add',
            ext:_options.ext
        };
        this._$dispatchEvent('onitemadd',_event);

        return _event;
    };
    /**
     * 删除列表项
     *
     * 脚本举例
     * ```javascript
     * _cc._$deleteItem({
     *     key: '123'
     * });
     * ```
     *
     * @method   module:util/cache/list._$$CacheList#_$deleteItem
     * @param    {Object} arg0 - 配置信息
     * @property {String} key  - 列表标识
     * @property {String} id   - 列表项标识
     * @property {Object} data - 列表项数据信息
     * @property {Object} ext  - 需要回传的数据信息
     * @return   {Void}
     */
    _pro._$deleteItem = function(_options){
        _options = _u._$merge({},_options);
        _options.onload = this.__deleteItem._$bind(this,_options);
        this._$dispatchEvent('dodeleteitem',_options);
    };
    /**
     * 删除列表项回调
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__deleteItem
     * @param  {Object}  arg0 - 请求信息
     * @param  {Boolean} arg1 - 是否删除成功
     * @return {Void}
     */
    _pro.__deleteItem = function(_options,_isok){
        var _item,
            _key = _options.key;
        // sync memory
        if (!!_isok){
            var _id = _options.id;
            _item = this._$getItemInCache(_id)||null;
            this.__doRemoveItemFromList(_key,_id);
        }
        // callback
        var _event = {
            key:_key,
            data:_item,
            action:'delete',
            ext:_options.ext
        };
        this._$dispatchEvent('onitemdelete',_event);

        return _event;
    };
    /**
     * 更新列表项
     *
     * 脚本举例
     * ```javascript
     * _cc._$updateItem({
     *     key:'123',
     *     item:{}
     * });
     * ```
     *
     * @method   module:util/cache/list._$$CacheList#_$updateItem
     * @param    {Object} arg0 - 配置信息
     * @property {String} key  - 列表标识
     * @property {Object} data - 列表项数据
     * @property {Object} ext  - 需要回传的数据信息
     * @return   {Void}
     */
    _pro._$updateItem = function(_options){
        _options = _u._$merge({},_options);
        _options.onload = this.__updateItem._$bind(this,_options);
        this._$dispatchEvent('doupdateitem',_options);
    };
    /**
     * 更新列表项回调
     * 
     * @protected
     * @method module:util/cache/list._$$CacheList#__updateItem
     * @param  {Object} arg0 - 请求信息
     * @param  {Object} arg1 - 列表项对象
     * @return {Void}
     */
    _pro.__updateItem = function(_options,_item){
        var _key = _options.key;
        // update memory
        if (!!_item){
            _item = this.__doSaveItemToCache(_item,_key);
        }
        // callback
        var _event = {
            key:_key,
            data:_item,
            action:'update',
            ext:_options.ext
        };
        this._$dispatchEvent('onitemupdate',_event);

        return _event;
    };

    if (CMPT){
        NEJ.P('nej.ut')._$$ListCache = _p._$$CacheList;
    }

    return _p;
});
