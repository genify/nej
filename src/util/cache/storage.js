/*
 * ------------------------------------------
 * 本地存储接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _u = _('nej.u'),
        _v = _('nej.v'),
        _h = _('nej.h'),
        _j = _('nej.j'),
        _t = _('nej.ut'),
        _cache = {}; // dirty flag
    /**
     * 存储数据<br/>
     * 脚本举例
     * [code]
     *   var j = NEJ.P('nej.j');
     *   // 设置一个hash值
     *   j._$setDataInStorage('name','jack');
     *   // 返回jack
     *   j._$getDataInStorage('name');
     * [/code]
     * @see    {nej.j._$getDataInStorage}
     * @api    {nej.j._$setDataInStorage}
     * @param  {String}   存储键值
     * @param  {Variable} 存储数据
     * @return {nej.j}
     */
    _j._$setDataInStorage = function(_key,_value){
        var _sval = JSON.stringify(_value);
        try{
	        _h.__setItemToStorage(_key,_sval);
        }catch(ex){
        	console.error(ex.message);
        	console.error(ex);
        }
        // set failed
        if (_sval!=_h.__getItemInStorage(_key))
            _cache[_key] = _value;
        return this;
    };
    /**
     * 取存储数据<br/>
     * 脚本举例
     * [code]
     *   var j = NEJ.P('nej.j');
     *   // 设置一个hash值
     *   j._$setDataInStorage('name','jack');
     *   // 返回jack
     *   j._$getDataInStorage('name');
     * [/code]
     * @see    {nej.j._$setDataInStorage}
     * @api    {nej.j._$getDataInStorage}
     * @param  {String}   存储键值
     * @return {Variable} 存储数据
     */
    _j._$getDataInStorage = function(_key){
        var _data = JSON.parse(_h.
            __getItemInStorage(_key)||'null');
        return _data==null?_cache[_key]:_data;
    };
    /**
     * 取存储数据，如果指定的数据不存在则使用默认数据初始化<br/>
     * 脚本举例
     * [code]
     *   var j = NEJ.P('nej.j');
     *   // 取key为name的值，没有则设置一个key为name，value为jack的值
     *   j._$getDataInStorageWithDefault('name','jack');
     * [/code]
     * @see    {nej.j._$setDataInStorage}
     * @see    {nej.j._$getDataInStorage}
     * @api    {nej.j._$getDataInStorageWithDefault}
     * @param  {String}   存储键值
     * @param  {Variable} 存储数据
     * @return {Variable} 存储数据
     */
    _j._$getDataInStorageWithDefault = function(_key,_value){
        var _data = _j._$getDataInStorage(_key);
        if (_data==null){
            _data = _value;
            _j._$setDataInStorage(_key,_data);
        }
        return _data;
    };
    /**
     * 删除本地存储数据<br/>
     * 脚本举例
     * [code]
     *   var j = NEJ.P('nej.j');
     *   j._$setDataInStorage('name','jack');
     *   // 删除key为name的hash值
     *   j._$delDataInStorage('name');
     * [/code]
     * @api    {nej.j._$delDataInStorage}
     * @param  {String} 存储键值
     * @return {nej.j}
     */
    _j._$delDataInStorage = function(_key){
        delete _cache[_key];
        _h.__removeItemFromStorage(_key);
        return this;
    };
    /**
     * 清除本地缓存<br/>
     * 脚本举例
     * [code]
     *   var j = NEJ.P('nej.j');
     *   j._$setDataInStorage('name','jack');
     *   // 清空所有hash值
     *   j._$clearDataInStorage();
     * [/code]
     * @api    {nej.j._$clearDataInStorage}
     * @return {nej.j}
     */
    _j._$clearDataInStorage = (function(){
        var _doRemove = function(_item,_key,_map){
            delete _map[_key];
        };
        return function(){
            _u._$forIn(_cache,_doRemove);
            _h.__clearStorage();
            return this;
        };
    })();
    /**
     * 拷贝本地缓存数据<br/>
     * 脚本举例
     * [code]
     *   var j = NEJ.P('nej.j');
     *   j._$setDataInStorage('name','jack');
     *   j._$setDataInStorage('name1','jack1');
     *   // 复制一份数据result = {name:'jack',name1:'jack1'}
     *   var _result = j._$cloneDataInStorage({name:'',name:''});
     * [/code]
     * @api    {nej.j._$cloneDataInStorage}
     * @param  {Object} 拷贝对象
     * @return {Object} 拷贝结果
     */
    _j._$cloneDataInStorage = function(_result){
        _result = _result||{};
        _u._$forEach(_h.__getAllKeys(),
            function(_key){
                _result[_key] = _j._$getDataInStorage(_key);
            });
        return _result;
    };
    // extend onready event on localStorage
    _t._$$CustomEvent._$allocate({
        element:document
       ,event:'storageready'
       ,oneventadd:function(){
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
    _v._$addEvent(document,'storageready',__doFlushTempData);
    // init storage
    _h.__initStorage();
};
NEJ.define(
    '{lib}util/cache/storage.js',[
    '{patch}storage.js',
    '{lib}util/event/event.js'
],f);