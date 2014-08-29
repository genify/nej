/*
 * ------------------------------------------
 * 本地存储接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define(function(_p,_o,_f,_r){
    /**
     * 取缓存信息
     * @param  {String} 缓存标识
     * @return {String} 缓存信息
     */
    _p.__getItemInStorage = function(_key){
        return localStorage.getItem(_key);
    };
    /**
     * 设置缓存信息
     * @param  {String} 缓存标识
     * @param  {String} 缓存信息
     * @return {Void}
     */
    _p.__setItemToStorage = function(_key,_value){
        localStorage.setItem(_key,_value);
    };
    /**
     * 删除缓存信息
     * @param  {String} 缓存标识
     * @return {Void}
     */
    _p.__removeItemFromStorage = function(_key){
        localStorage.removeItem(_key);
    };
    /**
     * 清除缓存
     * @return {Void}
     */
    _p.__clearStorage = function(){
        localStorage.clear();
    };
    /**
     * 初始化本地存储系统
     * @return {Void}
     */
    _p.__initStorage = function(){
        (document.onstorageready||_f)();
    };
    /**
     * 检测本地存储系统是否准备完毕
     * @return {Boolean} 是否准备完毕
     */
    _p.__isStorageReady = function(){
        return !0;
    };

    return _p;
});
