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
    './list.js'
],function(NEJ,_k,_t,_p,_o,_f,_r){
    var _pro;
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
    
    if (CMPT){
        NEJ.P('nej.ut')._$$AbstractListCache = _p._$$CacheListAbstract;
    }
    
    return _p;
});
