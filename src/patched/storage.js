/**
 * ------------------------------------------
 * 本地存储接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _h = _('nej.h');
    /**
     * 取缓存信息
     * @param  {String} _key 缓存标识
     * @return {String}      缓存信息
     */
    _h.__getItemInStorage = function(_key){
        return localStorage.getItem(_key);
    };
    /**
     * 设置缓存信息
     * @param  {String} _key   缓存标识
     * @param  {String} _value 缓存信息
     * @return {Void}
     */
    _h.__setItemToStorage = function(_key,_value){
        localStorage.setItem(_key,_value);
    };
    /**
     * 删除缓存信息
     * @param  {String} _key 缓存标识
     * @return {Void}
     */
    _h.__removeItemFromStorage = function(_key){
        localStorage.removeItem(_key);
    };
    /**
     * 清除缓存
     * @return {Void}
     */
    _h.__clearStorage = function(){
        localStorage.clear();
    };
    /**
     * 取所有缓存键列表
     * @return {Array} 复制结果
     */
    _h.__getAllKeys = function(){
        var _result = [];
        for(var i=0,l=localStorage.length;i<l;i++)
            _result.push(localStorage.key(i));
        return _result;
    };
    /**
     * 初始化本地存储系统
     * @return {Void}
     */
    _h.__initStorage = function(){
        (document.onstorageready||_f)();
    };
    /**
     * 检测本地存储系统是否准备完毕
     * @return {Boolean} 是否准备完毕
     */
    _h.__isStorageReady = function(){
        return !0;
    };
};
NEJ.define('{lib}patched/storage.js',
      ['{lib}base/platform.js'],f);