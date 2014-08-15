/*
 * ------------------------------------------
 * 列表缓存管理基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    './cache.list.js'
],function(NEJ,_k,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 列表缓存管理基类<br/>
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/klass.js',
     *       '{lib}util/ajax/xdr.js',
     *       '{lib}util/cache/cache.list.base.js'
     *   ],function(_k,_j,_t,_p){
     *       // 创建自己的listCache管理类
     *       _p._$$CacheListCustom = _k._$klass();
     *       _pro = _p._$$CacheListCustom._$extend(_t._$$AbstractListCache);
     *       
     *       // 实现取列表的方法
     *       // 根据offset+limit取列表
     *       // data表示取列表可能需要的额外数据信息
     *       // 数据返回的回调是onload
     *       _pro.__doLoadList = function(_options){
     *           var _key    = _options.key;
     *           var _data   = _options.data;
     *           var _offset = _options.offset;
     *           var _limit  = _options.limit;
     *           var _rkey   = _options.rkey;
     *           var _onload = _options.onload;
     *           _j._$request(
     *               '/xhr/list',{
     *                   type:'json',
     *                   method:'POST',
     *                   data:{offset:_offset,limit:_limit},
     *                   timeout:1000,
     *                   onload:_onload._$bind(this),
     *                   onerror:function(_error){
     *                       // TODO
     *                   }
     *               }
     *           );
     *       };
     * 
     *       // 实现取列表的方法
     *       // 根据id和key取一项数据
     *       // 数据返回的回调是onload
     *       _proCacheListCustom.__doLoadItem = function(_options){
     *           var _id     = _options.id;
     *           var _key    = _options.key;
     *           var _rkey   = _options.rkey;
     *           var _onload = _options.onload;
     *           _j._$request(
     *               '/xhr/get',{
     *                   type:'json',
     *                   method:'POST',
     *                   data:{id:_id,key:_key},
     *                   timeout:1000,
     *                   onload:_onload._$bind(this),
     *                   onerror:function(_error){
     *                       // TODO
     *                   }
     *               }
     *           );
     *       };
     *   });
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '/path/to/custom/cache.js'
     *   ],function(_p){
     *       // 实例化一个上面的对象
     *       var _cache = c._$$CacheListCustom._$allocate({
     *           // id作为cache的标识
     *           id:'a',
     *           // 根据key，也就是上面的id，到缓存中取数据，然后处理数据
     *           onlistload:function(_ropt){
     *               _cache._$getListInCache(_ropt.key);
     *           },
     *            // 根据key，也就是上面的id，到缓存中取数据，然后处理数据
     *           onitemload:function(_ropt){
     *               _cache._$getItemInCache(_ropt.key);
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
     * @class   {_$$AbstractListCache}
     * @extends {_$$ListCache}
     * 
     * @param   {Object}   可选配置参数
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
     */
    _p._$$AbstractListCache = _k._$klass();
    _pro = _p._$$AbstractListCache._$extend(_t._$$ListCache);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
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
     * @protected
     * @method {__doLoadList}
     * @param  {Object}   请求信息
     * @config {String}   key      列表标识
     * @config {Number}   offset   偏移量
     * @config {Number}   limit    数量
     * @config {String}   data     请求相关数据
     * @config {Function} onload   列表项载入回调
     * @return {Void}
     */
    _pro.__doLoadList = _f;
    /**
     * 从服务器端前向刷新列表，子类实现具体逻辑
     * @protected
     * @method {__doPullRefresh}
     * @param  {Object}   请求信息
     * @config {String}   key      列表标识
     * @config {String}   data     请求相关数据
     * @config {Function} onload   列表项载入回调
     * @return {Void}
     */
    _pro.__doPullRefresh = _f;
    /**
     * 从服务器端载入列表项，子类实现具体逻辑
     * @protected
     * @method {__doLoadItem}
     * @param   {Object}   请求信息
     * @config  {String}   key      列表标识
     * @config  {Number}   id       列表项标识
     * @config  {String}   data     请求相关数据
     * @config  {Function} onload   列表项载入回调
     * @return {Void}
     */
    _pro.__doLoadItem = _f;
    /**
     * 添加列表项至服务器，子类实现具体逻辑
     * @protected
     * @method {__doAddItem}
     * @param   {Object}   请求信息
     * @config  {String}   key      列表标识
     * @config  {Number}   id       列表项标识
     * @config  {String}   data     请求相关数据
     * @config  {Function} onload   列表项载入回调
     * @return {Void}
     */
    _pro.__doAddItem = _f;
    /**
     * 从服务器上删除列表项，子类实现具体逻辑
     * @protected
     * @method {__doDeleteItem}
     * @param   {Object}   请求信息
     * @config  {String}   key      列表标识
     * @config  {Number}   id       列表项标识
     * @config  {String}   data     请求相关数据
     * @config  {Function} onload   列表项载入回调
     * @return {Void}
     */
    _pro.__doDeleteItem = _f;
    /**
     * 更新列表项至服务器，子类实现具体逻辑
     * @protected
     * @method {__doUpdateItem}
     * @param   {Object}   请求信息
     * @config  {String}   key      列表标识
     * @config  {Number}   id       列表项标识
     * @config  {String}   data     请求相关数据
     * @config  {Function} onload   列表项载入回调
     * @return {Void}
     */
    _pro.__doUpdateItem = _f;
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;
});
