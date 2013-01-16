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
        _proAbstractListCache,
        _supAbstractListCache;
    if (!!_p._$$AbstractListCache) return;
    /**
     * 列表缓存管理基类<br/>
     * 脚本举例
     * [code]
     *   // 第一步：先创建自己的listCache管理类
     *   _p._$$CacheListCustom = NEJ.C();
     *   _proCacheListCustom = _p._$$CacheListCustom._$extend(_p._$$AbstractListCache);
     *   _supCacheListCustom = _proCacheListCustom._$supro;
     *   
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
     * @class   {nej.ut._$$AbstractListCache} 列表缓存管理基类
     * @extends {nej.ut._$$ListCache}
     * @param   {Object}   可选配置参数，已处理参数列表如下
     * @config  {String}   key    列表标识
     * @config  {Number}   offset 偏移量
     * @config  {Number}   limit  数量
     * @config  {String}   data   请求相关数据
     * 
     * [hr]
     * @event {onload} 列表项载入回调
     * @param {Object} 根据情况自己配置
     * 
     */
    _p._$$AbstractListCache = NEJ.C();
      _proAbstractListCache = _p._$$AbstractListCache._$extend(_p._$$ListCache);
      _supAbstractListCache = _p._$$AbstractListCache._$supro;
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proAbstractListCache.__reset = function(_options){
        this.__supReset(_options);
        this._$batEvent({
            doloadlist:this.__doLoadList._$bind(this)
           ,doloaditem:this.__doLoadItem._$bind(this)
           ,doadditem:this.__doAddItem._$bind(this)
           ,dodeleteitem:this.__doDeleteItem._$bind(this)
           ,doupdateitem:this.__doUpdateItem._$bind(this)
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
    _proAbstractListCache.__doLoadList = _f;
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
    _proAbstractListCache.__doLoadItem = _f;
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
    _proAbstractListCache.__doAddItem = _f;
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
    _proAbstractListCache.__doDeleteItem = _f;
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
    _proAbstractListCache.__doUpdateItem = _f;
};
define('{lib}util/cache/cache.list.base.js',
      ['{lib}util/cache/cache.list.js'],f);