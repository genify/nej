/*
 * ------------------------------------------
 * 本地存储接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './storage.js'
],function(_h,_p,_o,_f,_r){
    // for ie7-
    NEJ.patch('TR<=3.0',[
        '{lib}base/config.js',
        '{lib}util/flash/flash.js'
    ],function(_c,_e){
        var _localStorage;
        /*
         * 初始化本地存储系统
         * @return {Void}
         */
        var _doInitFlash = function(){
            if (!!_localStorage) return;
            // append storage flash
            _e._$flash({
                hidden:!0,
                src:_c._$get('storage.swf'),
                params:{
                    AllowScriptAccess:'sameDomain'
                },
                onready:function(_flash){
                    if (!_flash){
                        console.log('flash for localStorage unavailable');
                    }
                    _localStorage = _flash;
                    _localStorage.initStorage('nej-storage');
                    (document.onstorageready||_f)();
                }
            });
        };
        /**
         * 取缓存信息
         * @param  {String} 缓存标识
         * @return {String} 缓存信息
         */
        _h.__getItemInStorage = function(_key){
            if (!!_localStorage){
                return _localStorage.getItem(_key);
            }
        };
        /**
         * 设置缓存信息
         * @param  {String} 缓存标识
         * @param  {String} 缓存信息
         * @return {Void}
         */
        _h.__setItemToStorage = function(_key,_value){
            if (!!_localStorage){
                _localStorage.setItem(_key,_value);
            }
        };
        /**
         * 删除缓存信息
         * @param  {String} 缓存标识
         * @return {Void}
         */
        _h.__removeItemFromStorage = function(_key){
            if (!!_localStorage){
                _localStorage.removeItem(_key);
            }
        };
        /**
         * 清除缓存
         * @return {Void}
         */
        _h.__clearStorage = function(){
            if (!!_localStorage){
                _localStorage.clear();
            }
        };
        /**
         * 初始化本地存储系统
         * @return {Void}
         */
        _h.__initStorage = function(){
            _doInitFlash();
        };
        /**
         * 检测本地存储系统是否准备完毕
         * @return {Boolean} 是否准备完毕
         */
        _h.__isStorageReady = function(){
            return !!_localStorage;
        };
    });
    
    return _h;
});
