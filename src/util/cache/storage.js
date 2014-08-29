/*
 * ------------------------------------------
 * 本地存储接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/cache/storage */
NEJ.define([
    'base/global',
    'base/util',
    'base/event',
    'util/event/event',
    '{platform}storage.js'
],function(NEJ,_u,_v,_t,_h,_p,_o,_f,_r){
    var _cache = {}; // dirty flag
    /**
     * 存储数据
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/storage'
     * ],function(_j){
     *     // 设置一个hash值
     *     _j._$setDataInStorage('name','jack');
     *     // 返回jack
     *     var _data = _j._$getDataInStorage('name');
     * });
     * ```
     *
     * @method module:util/cache/storage._$setDataInStorage
     * @see    module:util/cache/storage._$getDataInStorage
     * @param  {String}   arg0 - 存储键值
     * @param  {Variable} arg1 - 存储数据
     * @return {Void}
     */
    _p._$setDataInStorage = function(_key,_value){
        var _sval = JSON.stringify(_value);
        try{
            _h.__setItemToStorage(_key,_sval);
        }catch(ex){
            console.error(ex.message);
            console.error(ex);
        }
        // set failed
        if (_sval!=_h.__getItemInStorage(_key)){
            _cache[_key] = _value;
        }
    };
    /**
     * 取存储数据
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/storage'
     * ],function(_j){
     *     // 设置一个hash值
     *     _j._$setDataInStorage('name','jack');
     *     // 返回jack
     *     var _data = _j._$getDataInStorage('name');
     * });
     * ```
     *
     * @method module:util/cache/storage._$getDataInStorage
     * @see    module:util/cache/storage._$setDataInStorage
     * @param  {String}   arg0 - 存储键值
     * @return {Variable}        存储数据
     */
    _p._$getDataInStorage = function(_key){
        var _data = JSON.parse(
            _h.__getItemInStorage(_key)||'null'
        );
        return _data==null?_cache[_key]:_data;
    };
    /**
     * 取存储数据，如果指定的数据不存在则使用默认数据初始化
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/storage'
     * ],function(_j){
     *     // 取key为name的值，没有则设置一个key为name，value为jack的值
     *     var _data = _j._$getDataInStorageWithDefault('name','jack');
     * });
     * ```
     *
     * @method module:util/cache/storage._$getDataInStorageWithDefault
     * @see    module:util/cache/storage._$setDataInStorage
     * @see    module:util/cache/storage._$getDataInStorage
     * @param  {String}   arg0 - 存储键值
     * @param  {Variable} arg1 - 存储数据
     * @return {Variable}        存储数据
     */
    _p._$getDataInStorageWithDefault = function(_key,_value){
        var _data = _p._$getDataInStorage(_key);
        if (_data==null){
            _data = _value;
            _p._$setDataInStorage(_key,_data);
        }
        return _data;
    };
    /**
     * 删除本地存储数据
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'util/cache/storage'
     *   ],function(_j){
     *       _j._$setDataInStorage('name','jack');
     *       // 删除key为name的hash值
     *       _j._$delDataInStorage('name');
     *   });
     * ```
     *
     * @method module:util/cache/storage._$delDataInStorage
     * @param  {String} arg0 - 存储键值
     * @return {Void}
     */
    _p._$delDataInStorage = function(_key){
        delete _cache[_key];
        _h.__removeItemFromStorage(_key);
    };
    /**
     * 清除本地缓存
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/storage'
     * ],function(_p){
     *     _p._$setDataInStorage('name','jack');
     *     // 清空所有hash值
     *     _p._$clearDataInStorage();
     * });
     * ```
     *
     * @method module:util/cache/storage._$clearDataInStorage
     * @return {Void}
     */
    _p._$clearDataInStorage = (function(){
        var _doRemove = function(_item,_key,_map){
            delete _map[_key];
        };
        return function(){
            _u._$forIn(_cache,_doRemove);
            _h.__clearStorage();
        };
    })();
    /**
     * 持久化存储器准备完毕触发事件，
     * 如果存储器已准备完毕则在添加事件时直接触发回调
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/event'
     *     'util/cache/storage'
     * ],function(_v,_j){
     *     // 直接调用接口存储数据在低版本浏览器下未能保证持久化成功
     *     // 如果此时持久化存储器未准备完毕则先缓存在内存中，等持久化存储器准备好后再持久化
     *     _j._$setDataInStorage('name','jack');
     *
     *     // 在持久化存储器准备完毕事件中存储数据可提高持久化成功概率
     *     _v._$addEvent(
     *         document,'storageready',
     *         function(_event){
     *             _j._$setDataInStorage('name','jack');
     *         }
     *     );
     * });
     * ```
     *
     * @event    external:document.onstorageready
     * @param    {Object} event - 事件信息
     */
    _t._$$CustomEvent._$allocate({
        element:document,
        event:'storageready',
        oneventadd:function(){
            if (_h.__isStorageReady()){
                document.onstorageready();
            }
        }
    });

    // listen storage ready
    var __doFlushTempData = (function(){
        var _doFlush = function(_value,_key,_map){
            _h.__setItemToStorage(
                _key,JSON.stringify(_value));
            delete _map[_key];
        };
        return function(){
            _u._$forIn(_cache,_doFlush);
        };
    })();
    _v._$addEvent(
        document,'storageready',
        __doFlushTempData
    );

    // init storage
    _h.__initStorage();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.j'),_p);
    }

    return _p;
});
