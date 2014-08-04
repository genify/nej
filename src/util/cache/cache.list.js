/*
 * ------------------------------------------
 * 列表缓存管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    './cache.js'
],function(NEJ,_k,_u,_t,_p,_o,_f,_r){
    /**
     * 列表缓存管理器<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/ajax/xdr.js',
     *       '{lib}util/cache/cache.list.js'
     *   ],function(_j,_p){
     *       var _cache = _p._$$ListCache._$allocate({
     *           id:'abc',
     *           doloadlist:function(_options){
     *               // 从服务器加载列表
     *               _j._$request(
     *                   '/api/list',{
     *                       data:_options.data,
     *                       onload:function(_list){
     *                           _options.onload(_list);
     *                       }
     *                   }
     *               );
     *           },
     *           doloaditem:function(_options){
     *               // 从服务器加载数据项
     *               _j._$request(
     *                   '/api/get',{
     *                       data:_options.data,
     *                       onload:function(_item){
     *                           _options.onload(_item);
     *                       }
     *                   }
     *               );
     *           },
     *           doadditem:function(_options){
     *               // 往服务器添加数据项
     *               _j._$request(
     *                   '/api/add',{
     *                       data:_options.data,
     *                       onload:function(_item){
     *                           _options.onload(_item);
     *                       }
     *                   }
     *               );
     *           },
     *           dodeleteitem:function(_options){
     *               // 从服务器删除数据项
     *               _j._$request(
     *                   '/api/delete',{
     *                       data:_options.data,
     *                       onload:function(_item){
     *                           _options.onload(_item);
     *                       }
     *                   }
     *               );
     *           },
     *           doupdateitem:function(_options){
     *               // 更新数据项至服务器
     *               _j._$request(
     *                   '/api/update',{
     *                       data:_options.data,
     *                       onload:function(_item){
     *                           _options.onload(_item);
     *                       }
     *                   }
     *               );
     *           },
     *           dopullrefresh:function(_options){
     *               // 从服务器加载列表
     *               _j._$request(
     *                   '/api/pull',{
     *                       data:_options.data,
     *                       onload:function(_list){
     *                           _options.onload(_list);
     *                       }
     *                   }
     *               );
     *           }
     *       });
     * 
     *       // 第一个列表的请求
     *       _cache._$getList({key:'abc',data:{},offset:0,limit:10})
     *       // 不会发请求，直接走缓存
     *       _cache._$getList({key:'abc',data:{},offset:0,limit:10})
     *       // 第一个项请求
     *       _cache._$getItem({id:'abc',key:'123',data:{})
     *       // 不会发请求，直接走缓存
     *       _cache._$getItem({id:'abc',key:'123',data:{})
     *   });
     * [/code]
     * 
     * @class   {_$$ListCache}
     * @extends {_$$Cache}
     * 
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {String}  id      缓存标识，默认使用构造器缓存
     * @config {String}  key     列表项标识字段，默认为id
     * @config {Object}  data    列表关联数据
     * @config {Boolean} autogc  是否自动操作
     * 
     * [hr]
     * 列表载入完成回调
     * @event  {onlistload} 
     * @param  {Object} 可选配置参数
     * @config {String}   key 列表标识
     * @config {Variable} ext 传入数据原样返回
     * 
     * [hr]
     * 缓存项载入完成回调
     * @event  {onitemload} 
     * @param  {Object} 可选配置参数
     * @config {String}   id  项标识
     * @config {String}   key 列表标识
     * @config {Variable} ext 传入数据原样返回
     * 
     * [hr]
     * 缓存项添加完成回调
     * @event  {onitemadd} 
     * @param  {Object} 可选配置参数
     * @config {String}   id  项标识
     * @config {String}   key 列表标识
     * @config {Variable} ext 传入数据原样返回
     * 
     * [hr]
     * 缓存项删除完成回调
     * @event  {onitemdelete} 
     * @param  {Object} 可选配置参数
     * @config {String}   id  项标识
     * @config {String}   key 列表标识
     * @config {Variable} ext 传入数据原样返回
     * 
     * [hr]
     * 缓存项更新完成回调
     * @event  {onitemupdate} 
     * @param  {Object} 可选配置参数
     * @config {String}   id  项标识
     * @config {String}   key 列表标识
     * @config {Variable} ext 传入数据原样返回
     * 
     * [hr]
     * 服务器最新列表拉取完成回调
     * @event  {onpullrefresh} 
     * @param  {Object} 可选配置参数
     * @config {String}   key 列表标识
     * @config {Variable} ext 传入数据原样返回
     * 
     * [hr]
     * 从服务器载入列表
     * @event  {doloadlist} 
     * @param  {Object} 可选配置参数
     * @config {String}   key    列表标识
     * @config {Variable} ext    回调回传数据
     * @config {Number}   data   需要提交到服务器的其他信息
     * @config {Number}   offset 偏移量
     * @config {Number}   limit  数量
     * @config {Function} onload 请求回调
     * 
     * [hr]
     * 从服务器载入数据项
     * @event  {doloaditem} 
     * @param  {Object} 可选配置参数
     * @config {String}   id     项标识
     * @config {String}   key    列表标识
     * @config {Variable} ext    回调回传数据
     * @config {Number}   data   需要提交到服务器的其他信息
     * @config {Function} onload 请求回调
     * 
     * [hr]
     * 往服务器添加数据项
     * @event  {doadditem}
     * @param  {Object} 可选配置参数
     * @config {String}   key    列表标识
     * @config {Variable} ext    回调回传数据
     * @config {String}   data   数据项对象
     * @config {Function} onload 请求回调
     * 
     * [hr]
     * 从服务器删除数据项
     * @event  {dodeleteitem}
     * @param  {Object} 可选配置参数
     * @config {String}   key    列表标识
     * @config {Variable} ext    回调回传数据
     * @config {String}   data   数据项对象
     * @config {Function} onload 请求回调
     * 
     * [hr]
     * 更新服务器数据项
     * @event  {doupdateitem}
     * @param  {Object} 可选配置参数
     * @config {String}   key    列表标识
     * @config {Variable} ext    回调回传数据
     * @config {String}   data   数据项对象
     * @config {Function} onload 请求回调
     * 
     * [hr]
     * 从服务器拉取最新列表
     * @event  {dopullrefresh}
     * @param  {Object} 可选配置参数
     * @config {String}   key    列表标识
     * @config {Variable} ext    回调回传数据
     * @config {Function} onload 请求回调
     */
    _p._$$ListCache = _k._$klass();
    _pro = _p._$$ListCache._$extend(_t._$$Cache);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
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
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
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
     * @protected
     * @method {__doSwapCache}
     * @param  {String} 缓存标识
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
     * @protected
     * @method {__doGCAction}
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
     * @protected
     * @method {__doGCSchedule}
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
     * @protected
     * @method {__doSaveItemToCache}
     * @param  {Object|Array} 列表项或列表
     * @param  {String}       列表标识
     * @return {Object|Array} 缓存中列表项或列表
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
     * @protected
     * @method {__doRemoveItemFromList}
     * @param  {String}       列表标识
     * @param  {String|Array} 项标识,['111',{id:'222',...},...]
     * @return {Object|Array} 删除项
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
     * @protected
     * @method {__doFormatItem}
     * @param  {Object} 列表项
     * @param  {String} 列表标识
     * @return {Object} 格式化后的列表项
     */
    _pro.__doFormatItem = _f;
    /**
     * 前向追加列表项至列表
     * @protected
     * @method {__doUnshiftToList}
     * @param  {String} 列表标识
     * @param  {Object|Array} 列表项或者列表
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
     * 设置列表总数<br/>
     * 
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
     * 
     * @method {_$setTotal}
     * @see    {_$getTotal}
     * @param  {String} 列表缓存键值
     * @param  {Number} 列表总数
     * @return {Void}
     */
    _pro._$setTotal = function(_key,_total){
        var _list = this._$getListInCache(_key);
        _list.length = Math.max(_list.length,_total);
        this._$setLoaded(_key);
    };
    /**
     * 取列表总长度<br/>
     * 
     * 脚本举例
     * [code]
     *   // 获取列表总长度，未知页码的情况是total和list.length较长的一个
     *   // 页面已知的情况，取total的值
     *   // 以上值被设置到list的length属性中
     *   _cc._$getTotal('abc');
     * [/code]
     * 
     * @method {_$getTotal}
     * @see    {_$setTotal}
     * @param  {String} 列表标识
     * @return {Number} 列表总长度
     */
    _pro._$getTotal = function(_key){
        return this._$getListInCache(_key).length;
    };
    /**
     * 设置未知长度列表的载入完成标志<br/>
     * 
     * 脚本举例
     * [code]
     *   // 设置key为abc的完整数据已经载入完成
     *   _cc._$setLoaded('abc');
     * [/code]
     * 
     * @method {_$setLoaded}
     * @param  {String} 列表标识
     * @return {Void}
     */
    _pro._$setLoaded = function(_key,_loaded){
        this._$getListInCache(_key).loaded = _loaded!==!1;
    };
    /**
     * 判断列表是否载入完成<br/>
     * 
     * @method {_$isLoaded}
     * @param  {String}  列表标识
     * @return {Boolean} 是否载入完成
     */
    _pro._$isLoaded = function(_key){
        return !!this._$getListInCache(_key).loaded;
    };
    /**
     * 设置列表，清除原有列表<br/>
     * 
     * 脚本举例
     * [code]
     *   // 设置列表
     *   _cc._$setListInCache('abc',[]);
     * [/code]
     * 
     * @method {_$setListInCache}
     * @param  {String} 列表标识
     * @return {Array}  列表
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
     * 直接从缓存中取列表<br/>
     * 
     * 脚本举例
     * [code]
     *   // 从cache里取列表数据
     *   _cc._$getListInCache('abc');
     * [/code]
     * 
     * @method {_$getListInCache}
     * @param  {String} 列表标识
     * @return {Array}  列表
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
     * @protected
     * @method {__getHash}
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
     * @method {_$pullRefresh}
     * @param  {Object} 可选配置参数
     * @config {String} key   列表标识
     * @config {Number} data  发送到服务器数据信息
     * @return {Void}
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
     * @protected
     * @method {__pullRefresh}
     * @param  {Object} 请求信息
     * @param  {Array}  数据列表
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
     * 取列表<br/>
     * 
     * 脚本举例
     * [code]
     *   _cc._$getList({key:'abc',data:{},offset:0,limit:10});
     * [/code]
     * 
     * @method {_$getList}
     * @param  {Object} 可选配置参数
     * @config {String} key    列表标识
     * @config {Number} data   其他数据信息
     * @config {Number} offset 偏移量
     * @config {Number} limit  数量
     * @config {Object} ext    回传数据
     * @return {Void}
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
     * @protected
     * @method {__getList}
     * @param  {Object}        请求信息
     * @param  {Array|Object}  数据列表，或者带总数信息列表
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
     * 清除缓存列表<br/>
     * 
     * 脚本举例
     * [code]
     *   // 取列表数据
     *   _cc._$clearListInCache('abc');
     * [/code]
     * 
     * @method {_$clearListInCache}
     * @param  {String} 列表标识
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
     * @protected
     * @method {__doCheckItemValidity}
     * @param  {Object}  数据项
     * @param  {String}  列表标识
     * @return {Boolean} 是否有效
     */
    _pro.__doCheckItemValidity = function(_item,_lkey){
        return !_item.__dirty__;
    };
    /**
     * 从缓存中取列表项<br/>
     * 
     * 脚本举例
     * [code]
     *   // 从cache中取某一项数据
     *   _cc._$getItemInCache('abc');
     * [/code]
     * 
     * @method {_$getItemInCache}
     * @param  {String}   项标识
     * @return {Variable} 列表项
     */
    _pro._$getItemInCache = function(_id){
        return this.__getHash()[_id];
    };
    /**
     * 清除缓存项
     * @method {_$clearItemInCache}
     * @param  {String} 项标识
     * @return {Void}
     */
    _pro._$clearItemInCache = function(_id){
        var _item = this._$getItemInCache(_id);
        if (!!_item) _item.__dirty__ = !0;
    };
    /**
     * 取列表项项<br/>
     * 
     * 脚本举例
     * [code]
     *   // 取某一项数据
     *   _cc._$getItem({
     *       id:'aaaa',
     *       key:'xxxxxx'
     *   });
     * [/code]
     * 
     * @method {_$getItem}
     * @param  {Object} 请求信息
     * @config {String} id   项标识，该名称与配置的项标识键一致
     * @config {String} key  列表标识
     * @config {Object} data 发送到服务器的数据
     * @config {Object} ext  需要回传的数据信息
     * @return {Void}
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
     * @protected
     * @method {__getItem}
     * @param  {Object} 请求信息
     * @param  {Object} 列表项对象
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
     * 添加列表项<br/>
     * 
     * 脚本举例
     * [code]
     *   _cc._$addItem({
     *       key: '123',
     *       item: {},
     *       push: false,
     *       offset:0
     *   });
     * [/code]
     * 
     * @method {_$addItem}
     * @param  {Object} 配置信息
     * @config {String}  key    列表标识
     * @config {Object}  data   列表项数据
     * @config {Boolean} push   是否追加到列表尾部
     * @config {Number}  offset 对于非尾部追加的项可通过此参数指定追加位置
     * @return {Void}
     */
    _pro._$addItem = function(_options){
        _options = _u._$merge({},_options);
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
     * 删除列表项<br/>
     * 
     * 脚本举例
     * [code]
     *   _cc._$deleteItem({
     *       key: '123'
     *   });
     * [/code]
     * 
     * @method {_$deleteItem}
     * @param  {Object} 配置信息
     * @config {String} key  列表标识
     * @config {String} id   列表项标识
     * @config {Object} data 列表项数据信息 
     * @config {Object} ext  需要回传的数据信息
     * @return {Void}
     */
    _pro._$deleteItem = function(_options){
        _options = _u._$merge({},_options);
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
     * 更新列表项<br/>
     * 
     * 脚本举例
     * [code]
     *   _cc._$updateItem({
     *       key:'123',
     *       item:{}
     *   });
     * [/code]
     * 
     * @method {_$updateItem}
     * @param  {Object} 配置信息
     * @config {String} key  列表标识
     * @config {Object} data 列表项数据
     * @config {Object} ext  需要回传的数据信息
     * @return {Void}
     */
    _pro._$updateItem = function(_options){
        _options = _u._$merge({},_options);
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
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;    
});
