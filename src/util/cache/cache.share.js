/*
 * ------------------------------------------
 * 临时内存数据共享管理实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    '{lib}util/event.js',
    '{lib}util/event/event.js'
],function(NEJ,_k,_u,_t0,_t1,_p,_o,_f,_r){
    var _pro;
    /**
     * 临时内存数据共享管理器<br/>
     * 
     * 脚本示例：
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js',
     *       '{lib}util/cache/cache.share.js'
     *   ],function(_v,_p){
     *       // 添加缓存变化监测事件
     *       _v._$addEvent(
     *           localCache,'cachechange',
     *           function(_event){
     *               // _event.key
     *               // _event.type
     *               // _event.oldValue
     *               // _event.newValue
     *           }
     *       );
     * 
     *       // 写入数据
     *       localCache._$set('abc',{a:'aaaaa',b:'bbbbbb'});
     * 
     *       // 读取数据
     *       var _data = localCache._$get('abc');
     * 
     *       // 删除数据
     *       localCache._$remove('abc');
     *   });
     * [/code]
     * 
     * @class   {_$$ShareCache}
     * @extends {_$$Event}
     * 
     * [hr]
     * 缓存变化出发事件
     * @event  {oncachechange}
     * @param  {Object}            事件信息
     * @config {String}   key      缓存标识
     * @config {String}   type     操作类型，set/delete
     * @config {Variable} oldValue 原数据
     * @config {Variable} newValue 新数据
     */
    _p._$$ShareCache = _k._$klass();
    _pro = _p._$$ShareCache._$extend(_t0._$$Event);
    /**
     * 初始化函数
     * @protected
     * @method {__init}
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
     * @method {_$get}
      * @param  {Object}   缓存标识
      * @return {Variable} 缓存数据
     */
    _pro._$get = function(_key){
        return this.__cache[_key];
    };
    /**
     * 设置缓存数据
     * @method {_$set}
      * @param  {String}   缓存标识
      * @param  {Variable} 缓存数据
      * @return {Void}
     */
    _pro._$set = function(_key,_value){
        var _old = this.__cache[_key];
        this.__cache[_key] = _value;
        _v._$dispatchEvent(
            localCache,'cachechange',{
                key:_key,
                type:'set',
                oldValue:_old,
                newValue:_value
            }
        );
    };
    /**
     * 删除缓存项
     * @param  {String}   缓存标识
     * @return {Variable} 删除项的值
     */
    _pro._$remove = function(_key){
        var _old = this.__cache[_key];
        _u._$safeDelete(this.__cache,_key);
        _v._$dispatchEvent(
            localCache,'cachechange',{
                key:_key,
                type:'delete',
                oldValue:_old,
                newValue:undefined
            }
        );
        return _old;
    };
    /**
     * 查询
     * @param  {String}   查询串，如：a.b.c
     * @return {Variable} 结果
     */
    _pro._$query = function(_namespace){
        return _u._$query(this.__cache,_namespace);
    };
    
    // local cache instance
    if (!this.localCache){
        this.localCache = _p._$$ShareCache._$allocate();
    }
    // custom event
    _t1._$$CustomEvent._$allocate({
        element:localCache,
        event:'cachechange'
    });
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;
});
