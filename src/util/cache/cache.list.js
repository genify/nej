/*
 * ------------------------------------------
 * 列表缓存管理基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proListCache,
        _supListCache;
    if (!!_p._$$ListCache) return;
    /**
     * 列表缓存管理基类<br/>
     * 脚本举例
     * [code]
     *   // 第一步：先创建自己的listCache管理类
     *   _p._$$CacheListCustom = NEJ.C();
     *   _proCacheListCustom = _p._$$CacheListCustom._$extend(_p._$$ListCache);
     *   _supCacheListCustom = _proCacheListCustom._$supro;
     *   
     *   // 注册事件
     *   _proCacheListCustom.__init = function(){
     *   this.__supInit();
     *   this._$batEvent({
     *            doloadlist:this.__doLoadList._$bind(this)
     *           ,doloaditem:this.__doLoadItem._$bind(this)
     *           ,doadditem:this.__doAddItem._$bind(this)
     *           ,dodeleteitem:this.__doDeleteItem._$bind(this)
     *           ,doupdateitem:this.__doUpdateItem._$bind(this)
     *       });
     *   };
     *   // 实现取列表的方法
     *   // 根据offset+limit取列表
     *   // data表示取列表可能需要的额外数据信息
     *   // 数据返回的回调是onload
     *   _proCacheListCustom.__doLoadList = function(_options){
     *       var _key    = _options.key;
     *       var _data   = _options.data;
     *       var _offset = _options.offset;
     *       var _limit  = _options.limit;
     *       var _rkey   = _options.rkey;
     *       var _onload = _options.onload;
     *       _j._$request('http://123.163.com:3000/xhr/getLog',{
     *              type:'json',
     *              method:'POST',
     *              data:{offset:_offset,limit:_limit},
     *              timeout:1000,
     *              onload:_onload._$bind(this),
     *              onerror:function(_error){}
     *          }
     *      );
     *    };
     *    // 实现取列表的方法
     *    // 根据id和key取一项数据
     *    // 数据返回的回调是onload
     *    _proCacheListCustom.__doLoadItem = function(_options){
     *        var _id     = _options.id;
     *        var _key    = _options.key;
     *        var _rkey   = _options.rkey;
     *        var _onload = _options.onload;
     *        _j._$request('http://123.163.com:3000/xhr/getLog',{
     *               type:'json',
     *               method:'POST',
     *               data:{id:_id,key:_key},
     *               timeout:1000,
     *               onload:_onload._$bind(this),
     *               onerror:function(_error){}
     *          }
     *        );
     *    };
     * [/code]
     * 
     * [code]
     *   // 第二步：实例化一个上面的对象
     *   var _cc = c._$$CacheListCustom._$allocate({
     *       // id作为cache的标识
     *       id:'a',
     *       // 根据key，也就是上面的id，到缓存中取数据，然后处理数据
     *       onlistload:function(_ropt){
     *           _cc._$getListInCache(_ropt.key);
     *       },
     *        // 根据key，也就是上面的id，到缓存中取数据，然后处理数据
     *       onitemload:function(_ropt){
     *           _cc._$getItemInCache(_ropt.key);
     *       }
     *   });
     * [/code]
     * 
     * [code]
     *   // 第三步：发送请求
     *   // 第一个列表的请求
     *   _cc._$getList({key:'abc',data:{},offset:0,limit:10})
     *   // 不会发请求，直接走缓存
     *   _cc._$getList({key:'abc',data:{},offset:0,limit:10})
     *   // 第一个项请求
     *   _cc._$getItem({id:'abc',key:'123',data:{})
     *   // 不会发请求，直接走缓存
     *   _cc._$getItem({id:'abc',key:'123',data:{})
     * [/code]
     * @class   {nej.ut._$$ListCache} 列表缓存管理基类
     * @extends {nej.ut._$$Cache}
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {String} id      缓存标识，默认使用构造器缓存
     * @config {String} key     列表项标识字段，默认为id
     * @config {Object} data    列表关联数据
     * 
     * [hr]
     * 
     * @event  {onlistload} 列表载入完成回调
     * @param  {Object} 可选配置参数
     * @config {String} key      列表标识
     * @config {Number} data     其他数据信息
     * @config {Number} offset   偏移量
     * @config {Number} limit    数量
     * 
     * [hr]
     * 
     * @event  {onitemload} 缓存项载入完成回调
     * @param  {Object} 可选配置参数
     * @config {String} 项标识
     * @config {String} 列表标识
     * 
     * [hr]
     * 
     * @event  {doloadlist} 列表载入回调
     * @param  {Object} 可选配置参数
     * @config {String} key      列表标识
     * @config {Number} data     其他数据信息
     * @config {Number} offset   偏移量
     * @config {Number} limit    数量
     * 
     * [hr]
     * 
     * @event {doloaditem} 缓存项载入回调
     * @param  {Object} 可选配置参数
     * @config {String} key 列表标识
     * @config {String} id  项标识
     * 
     * [hr]
     * @event  {doadditem}
     * @param  {Object} 可选配置参数
     * @config {String} key  项标识
     * @config {String} item 项对象
     * 
     */
    _p._$$ListCache = NEJ.C();
      _proListCache = _p._$$ListCache._$extend(_p._$$Cache);
      _supListCache = _p._$$ListCache._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {String} 列表标识
     * @config {Object} 列表关联数据
     * @return {Void}
     */
    _proListCache.__reset = function(_options){
        this.__supReset(_options);
        this.__key = _options.key||'id';
        this.__data = _options.data||_o;
        this.__doSwapCache(_options.id);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proListCache.__destroy = function(){
        this.__supDestroy();
        delete this.__key;
        delete this.__data;
        delete this.__lspl;
    };
    /**
     * 切换缓存
     * @protected
     * @method {__doSwapCache}
     * @param  {String} 缓存标识
     * @return {Void}
     */
    _proListCache.__doSwapCache = function(_id){
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
     * 缓存列表项
     * @protected
     * @method {__doSaveItemToCache}
     * @param  {Object} 列表项
     * @param  {String} 列表标识
     * @return {Object} 缓存中列表项
     */
    _proListCache.__doSaveItemToCache = function(_item,_lkey){
        _item = this.__doFormatItem(
                      _item,_lkey)||_item;
        if (!_item) return null;
        var _key = _item[this.__key];
        if (!!_key)
            this.__getHash()[_key] = _item;
        return _item;
    };
    /**
     * 格式化数据项，子类实现具体业务逻辑
     * @protected
     * @method {__doFormatItem}
     * @param  {Object} 列表项
     * @param  {String} 列表标识
     * @return {Object} 格式化后的列表项
     */
    _proListCache.__doFormatItem = _f;
    /**
     * 删除列表项
     * @protected
     * @method {__doRemoveItemInCache}
     * @param  {String} 列表项
     * @return {Object} 删除的列表项
     */
    _proListCache.__doRemoveItemInCache = function(_id){
        var _item = this.__getHash()[_id];
        delete this.__getHash()[_id];
        return _item;
    };
    /**
     * 设置列表总数<br/>
     * 脚本举例
     * [code]
     *   // 列表总数已知的情况，这时候的total是100
     *   // 因为这个100是第一次请求，从服务器带过来的缓存的，后续可能会变化
     *   // 但是当前页面的总页面无法做出这种适应，所以不用有相应的变化
     *   // 注意：cache是无法保证数据的同步的。如果在别的地方有数据删除，cache无法获知，需要刷新页面
     *   _cc._$setTotal('abc',100);
     *   
     *   // 列表总数未知的情况，这时候的total是list的长度
     *   // 未知总长度会有更多选项出现
     *   var _total = _cc._$getTotal('abc');
     *   // 如果offset+limit>_total说明已经没有数据了，把更多隐藏掉
     *   // 否则会继续有一个更多选项在末尾
     * [/code]
     * @see    {#._$getTotal}
     * @method {_$setTotal}
     * @param  {String} 列表缓存键值
     * @param  {Number} 列表总数
     * @return {nej.ut._$$ListCache}
     */
    _proListCache._$setTotal = function(_key,_total){
        var _list = this._$getListInCache(_key);
        _list.length = Math.max(_list.length,_total);
        this._$setLoaded(_key);
        return this;
    };
    /**
     * 取列表总长度<br/>
     * 脚本举例
     * [code]
     *   // 获取列表总长度，未知页码的情况是total和list.length较长的一个
     *   // 页面已知的情况，取total的值
     *   // 以上值被设置到list的length属性中
     *   _cc._$getTotal('abc');
     * [/code]
     * @see    {#._$setTotal}
     * @method {_$getTotal}
     * @param  {String} 列表标识
     * @return {Number} 列表总长度
     */
    _proListCache._$getTotal = function(_key){
        return this._$getListInCache(_key).length;
    };
    /**
     * 设置未知长度列表的载入完成标志<br/>
     * 脚本举例
     * [code]
     *   // 设置key为abc的完整数据已经载入完成
     *   _cc._$setLoaded('abc');
     * [/code]
     * @method {_$setLoaded}
     * @param  {String} 列表标识
     * @return {nej.ut._$$ListCache}
     */
    _proListCache._$setLoaded = function(_key,_loaded){
        this._$getListInCache(_key).loaded = _loaded!=!1;
        return this;
    };
    /**
     * 直接从缓存中取列表<br/>
     * 脚本举例
     * [code]
     *   // 从cache里取列表数据
     *   _cc._$getListInCache('abc');
     * [/code]
     * @method {_$getListInCache}
     * @param  {String} 列表标识
     * @return {Array}  列表
     */
    _proListCache._$getListInCache = (function(){
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
     * @return {Object} 映射表
     */
    _proListCache.__getHash = function(){
        var _hash = this.__lspl.hash;
        if (!_hash){
            _hash = {};
            this.__lspl.hash = _hash;
        }
        return _hash;
    };
    /**
     * 取列表<br/>
     * 脚本举例
     * [code]
     *   _cc._$getList({key:'abc',data:{},offset:0,limit:10});
     * [/code]
     * @method {_$getList}
     * @param  {Object} 可选配置参数
     * @config {String} key      列表标识
     * @config {Number} data     其他数据信息
     * @config {Number} offset   偏移量
     * @config {Number} limit    数量
     * @return {nej.ut._$$ListCache}
     */
    _proListCache._$getList = (function(){
        var _doFormatKey = function(_options){
            return 'r-'+
                   _options.key+'-'+
                   _options.offset+'-'+
                   _options.limit;
        };
        return function(_options){
            _options = _options||_o;
            var _ropt = {key:_options.key||''
                        ,data:_options.data||null
                        ,offset:parseInt(_options.offset)||0
                        ,limit:parseInt(_options.limit)||0},
                _list = this._$getListInCache(_ropt.key);
            if (this.__hasFragment(_list,
                      _ropt.offset,_ropt.limit)){
                this._$dispatchEvent('onlistload',_ropt);
                return this;
            }
            var _rkey = _doFormatKey(_ropt);
            if (!this.__doQueueRequest(_rkey,
                 this._$dispatchEvent._$bind(this,'onlistload'))){
                _ropt.rkey = _rkey;
                _ropt.onload = this.__getList._$bind(this,_ropt);
                this._$dispatchEvent('doloadlist',_ropt);
            }
            return this;
        };
    })();
    /**
     * 取列表回调
     * @protected
     * @method {__getList}
     * @param  {Object}        请求信息
     * @param  {Array|Object}  数据列表，或者带总数信息列表
     * @return {Void}
     */
    _proListCache.__getList = function(_options,_result){
        _options = _options||_o;
        // save list to cache
        var _key = _options.key,
            _offset = _options.offset,
            _chlist = this._$getListInCache(_key);
        // list with total
        // {total:12,result:[]} 或者 {total:13,list:[]}
        var _list = _result;
        if (!_u._$isArray(_list)){
            _list = _result.result||_result.list||[];
            var _total = parseInt(_result.total)||0;
            if (_total>_list.length){
                this._$setTotal(_key,_total);
            }
        }
        // merge list
        _u._$forEach(_list,
            function(_item,_index){
                _chlist[_offset+_index] = this.
                     __doSaveItemToCache(_item,_key);
            },this);
        // check list all loaded
        if (_list.length<_options.limit)
            this._$setLoaded(_key);
        // do callback
        this.__doCallbackRequest(_options.rkey,_options);
    };
    /**
     * 清除缓存列表<br/>
     * 脚本举例
     * [code]
     *   // 取列表数据
     *   _cc._$clearListInCache('abc');
     * [/code]
     * @method {_$clearListInCache}
     * @param  {String} 列表标识
     * @return {nej.ut._$$ListCache}
     */
    _proListCache._$clearListInCache = (function(){
        var _doClear = function(_item,_index,_list){
            _list.splice(_index,1);
        };
        return function(_key){
            var _list = this._$getListInCache(_key);
            _u._$reverseEach(_list,_doClear);
            this._$setLoaded(_key,!1);
            return this;
        };
    })();
    /**
     * 从缓存中取列表项<br/>
     * 脚本举例
     * [code]
     *   // 从cache中取某一项数据
     *   _cc._$getItemInCache('abc');
     * [/code]
     * @method {_$getItemInCache}
     * @param  {String}   项标识
     * @return {Variable} 列表项
     */
    _proListCache._$getItemInCache = function(_id){
        return this.__getHash()[_id];
    };
    /**
     * 取列表项项<br/>
     * 脚本举例
     * [code]
     *   // 取某一项数据
     *   _cc._$getItemInCache('abc','123');
     * [/code]
     * @method {_$getItem}
     * @param  {String} 项标识
     * @param  {String} 列表标识
     * @return {nej.ut._$$ListCache}
     */
    _proListCache._$getItem = (function(){
        var _doFormatKey = function(_options){
            return 'r-'+_options.key+'-'+_options.id;
        };
        return function(_id,_key){
            var _ropt = {id:_id,key:_key||''};
                _item = this._$getItemInCache(_id);
            if (!!_item){
                this._$dispatchEvent('onitemload',_ropt);
                return this;
            }
            var _rkey = _doFormatKey(_ropt);
            if (!this.__doQueueRequest(_rkey,
                 this._$dispatchEvent._$bind(this,'onitemload'))){
                _ropt.rkey = _rkey;
                _ropt.onload = this.__getItem._$bind(this,_ropt);
                this._$dispatchEvent('doloaditem',_ropt);
            }
            return this;
        };
    })();
    /**
     * 取列表项回调
     * @protected
     * @method {__getItem}
     * @param  {Object} 请求信息
     * @param  {Object} 列表项对象
     * @return {Void}
     */
    _proListCache.__getItem = function(_options,_item){
        _options = _options||_o;
        this.__doSaveItemToCache(_item,_options.key);
        this.__doCallbackRequest(_options.rkey,_options);
    };
    /**
     * 添加列表项<br />
     * 脚本举例
     * [code]
     *   _cc._$addItem({
     *       key: '123',
     *       item: {},
     *       push: false
     *   });
     * [/code]
     * @method {_$addItem}
     * @param  {Object} 配置信息
     * @config {String}  key  列表标识
     * @config {Object}  data 列表项数据
     * @config {Boolean} push 是否追加到列表尾部
     * @return {nej.ut._$$ListCache}
     */
    _proListCache._$addItem = function(_options){
        _options = NEJ.X({},_options);
        _options.onload = this.__addItem._$bind(this,_options);
        this._$dispatchEvent('doadditem',_options);
    };
    /**
     * 添加列表项回调
     * @protected
     * @method {__addItem}
     * @param  {Object} 请求信息
     * @param  {Object} 列表项对象
     * @return {Void}
     */
    _proListCache.__addItem = function(_options,_item){
        var _key = _options.key;
        _item = this.__doSaveItemToCache(_item,_key);
        if (!!_item){
            var _flag = 0,
                _list = this._$getListInCache(_key);
            if (!_options.push){
                _flag = -1;
                _list.unshift(_item);
            }else if(_list.loaded){
                _flag = 1;
                _list.push(_item);
            }else{
                // add total
                _list.length++;
            }
        }
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
     * 删除列表项<br />
     * 脚本举例
     * [code]
     *   _cc._$deleteItem({
     *       key: '123'
     *   });
     * [/code]
     * @method {_$deleteItem}
     * @param  {Object} 配置信息
     * @config {String} key  列表标识
     * @config {String} id   列表项标识
     * @config {Object} data 列表项数据信息 
     * @config {Object} ext  需要回传的数据信息
     * @return {Void}
     */
    _proListCache._$deleteItem = function(_options){
        _options = NEJ.X({},_options);
        _options.onload = this.__deleteItem._$bind(this,_options);
        this._$dispatchEvent('dodeleteitem',_options);
    };
    /**
     * 删除列表项回调
     * @protected
     * @method {__deleteItem}
     * @param  {Object}  请求信息
     * @param  {Boolean} 是否删除成功
     * @return {Void}
     */
    _proListCache.__deleteItem = function(_options,_isok){
        var _item,
            _key = _options.key;
        if (!!_isok){
            _item = this.__doRemoveItemInCache(_options.id)||null;
            var _list = this._$getListInCache(_key),
                _index = _u._$indexOf(_list,_item);
            if (_index>=0) _list.splice(_index,1);
        }
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
     * 更新列表项<br />
     * 脚本举例
     * [code]
     *   _cc._$updateItem({
     *       key:'123',
     *       item:{}
     *   });
     * [/code]
     * @method {_$updateItem}
     * @param  {Object} 配置信息
     * @config {String} key  列表标识
     * @config {Object} data 列表项数据
     * @config {Object} ext  需要回传的数据信息
     * @return {nej.ut._$$ListCache}
     */
    _proListCache._$updateItem = function(_options){
        _options = NEJ.X({},_options);
        _options.onload = this.__updateItem._$bind(this,_options);
        this._$dispatchEvent('doupdateitem',_options);
    };
    /**
     * 更新列表项回调
     * @protected
     * @method {__updateItem}
     * @param  {Object} 请求信息
     * @param  {Object} 列表项对象
     * @return {Void}
     */
    _proListCache.__updateItem = function(_options,_item){
        var _key = _options.key;
        if (!!_item){
            var _id = _item[this.__key],
                _old = this.__doRemoveItemInCache(_id),
                _list = this._$getListInCache(_key),
                _index = _u._$indexOf(_list,_old);
            if (_index>=0) _list[_index] = _item;
            _item = this.__doSaveItemToCache(_item,_key);
        }
        var _event = {
                key:_key,
                data:_item,
                action:'update',
                ext:_options.ext
            };
        this._$dispatchEvent('onitemupdate',_event);
        return _event;
    };
};
NEJ.define('{lib}util/cache/cache.list.js',
      ['{lib}util/cache/cache.js'],f);
