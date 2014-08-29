/*
 * ------------------------------------------
 * 临时内存数据共享管理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/cache/share */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'util/event'
],function(NEJ,_k,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 临时内存数据共享管理器
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/share'
     * ],function(_t){
     *     // 重新开辟共享存储空间
     *     var _share = _t._$$CacheShare._$allocate({
     *         oncachechange:function(_event){
     *             // _event.key
     *             // _event.type
     *             // _event.oldValue
     *             // _event.newValue
     *             
     *             // TODO
     *         }
     *     });
     * 
     *     // 写入数据
     *     _share._$set('abc',{a:'aaaaa',b:'bbbbbb'});
     *     // 读取数据
     *     var _data = _share._$get('abc');
     *     // 删除数据
     *     _share._$remove('abc');
     * });
     * ```
     * 
     * @class   module:util/cache/share._$$CacheShare
     * @extends module:util/event._$$EventTarget
     */
    /** 
     * 缓存变化出发事件
     * 
     * @event    module:util/cache/share._$$CacheShare#oncachechange
     * @param    {Object}   event    - 事件信息
     * @property {String}   key      - 缓存标识
     * @property {String}   type     - 操作类型，set/delete
     * @property {Variable} oldValue - 原数据
     * @property {Variable} newValue - 新数据
     */
    _p._$$CacheShare = _k._$klass();
    _pro = _p._$$CacheShare._$extend(_t._$$EventTarget);
    /**
     * 初始化函数
     * 
     * @protected
     * @method module:util/cache/share._$$CacheShare#__init
     * @return {Void}
     */
    _pro.__init = (function(){
        var _seed = +new Date,
            _ckey = 'dat-'+_seed;
        return function(){
            this.__super();
            var _cache = this.constructor[_ckey];
            if (!_cache){
                _cache = {};
                this.constructor[_ckey] = _cache;
            }
            this.__cache = _cache;
        };
    })();
    /**
     * 取缓存数据
     * 
     * @method module:util/cache/share._$$CacheShare#_$get
     * @param  {Object}   arg0 - 缓存标识
     * @return {Variable}        缓存数据
     */
    _pro._$get = function(_key){
        return this.__cache[_key];
    };
    /**
     * 设置缓存数据
     * 
     * @method module:util/cache/share._$$CacheShare#_$set
     * @param  {String}   arg0 - 缓存标识
     * @param  {Variable} arg1 - 缓存数据
     * @return {Void}
     */
    _pro._$set = function(_key,_value){
        var _old = this.__cache[_key];
        this.__cache[_key] = _value;
        this._$dispatchEvent(
            'oncachechange',{
                key:_key,
                type:'set',
                oldValue:_old,
                newValue:_value
            }
        );
    };
    /**
     * 删除缓存项
     *
     * @method module:util/cache/share._$$CacheShare#_$remove
     * @param  {String}   arg0 - 缓存标识
     * @return {Variable}        删除项的值
     */
    _pro._$remove = function(_key){
        var _old = this.__cache[_key];
        _u._$safeDelete(this.__cache,_key);
        this._$dispatchEvent(
            'oncachechange',{
                key:_key,
                type:'delete',
                oldValue:_old,
                newValue:undefined
            }
        );
        return _old;
    };
    /**
     * 查询指定名字空间路径的值
     *
     * @method module:util/cache/share._$$CacheShare#_$query
     * @param  {String}   arg0 - 查询串，如：a.b.c
     * @return {Variable}        结果
     */
    _pro._$query = function(_namespace){
        return _u._$query(this.__cache,_namespace);
    };
    /**
     * 系统统一共享内存存储空间
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/share'
     * ],function(_t){
     *     // 使用系统统一存储空间
     *     var _localCache = _t.localCache;
     *     // 添加缓存变化监测事件
     *     _localCache._$addEvent(
     *         'oncachechange',function(_event){
     *             // _event.key
     *             // _event.type
     *             // _event.oldValue
     *             // _event.newValue
     *
     *             // TODO
     *         }
     *     );
     * 
     *     // 写入数据
     *     _localCache._$set('abc',{a:'aaaaa',b:'bbbbbb'});
     *     // 读取数据
     *     var _data = _localCache._$get('abc');
     *     // 删除数据
     *     _localCache._$remove('abc');
     * });
     * ```
     *
     * @static
     * @member {module:util/cache/share._$$CacheShare} localCache
     */
    _p.localCache = _p._$$CacheShare._$allocate();
    
    if (CMPT){
        this.localCache = _p.localCache;
        NEJ.P('nej.ut')._$$ShareCache = _p._$$CacheShare;
    }
    
    return _p;
});
