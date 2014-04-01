/**
 * ------------------------------------------
 * 本地存储接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _c = _('nej.c'),
        _h = _('nej.h'),
        _localStorage;
    if (_p._$NOT_PATCH.trident||
       !!window.localStorage) return;
    /*
     * 初始化本地存储系统
     * @return {Void}
     */
    var __doInitFlash = (function(){
        var _div,_timer;
        var _doInitDOM = function(){
            _div = document.createElement('div');
            NEJ.X(_div.style,
                 {position:'absolute'
                 ,top:0,left:0
                 ,width:'1px',height:'1px'
                 ,zIndex:10000,overflow:'hidden'});
            document.body.insertAdjacentElement('afterBegin',_div);
            _div.innerHTML = '\
                  <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="1" height="1"\
                          id="f-'+(+new Date)+'" codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">\
                    <param name="movie" value="'+_c._$get('storage.swf')+'"/>\
                    <param name="AllowScriptAccess" value="sameDomain"/>\
                  </object>';
        };
        var _doCheckFlash = function(){
            _timer = window.clearTimeout(_timer);
            var _flash = _div.getElementsByTagName('object')[0];
            if (!!_flash.initStorage){
                delete _div;
                _localStorage = _flash;
                _localStorage.initStorage('nej-storage');
                (document.onstorageready||_f)();
                return;
            }
            _timer = window.setTimeout(_doCheckFlash,500);
        };
        return function(){
            if (!!_localStorage) 
                return;
            _doInitDOM();
            _doCheckFlash();
        };
    })();
    /**
     * 取缓存信息
     * @param  {String} _key 缓存标识
     * @return {String}      缓存信息
     */
    _h.__getItemInStorage = 
    _h.__getItemInStorage._$aop(function(_event){
        _event.stopped = !0;
        if (!_localStorage) return;
        _event.value = _localStorage.getItem(_event.args[0]);
    });
    /**
     * 设置缓存信息
     * @param  {String} _key   缓存标识
     * @param  {String} _value 缓存信息
     * @return {Void}
     */
    _h.__setItemToStorage = 
    _h.__setItemToStorage._$aop(function(_event){
        _event.stopped = !0;
        if (!_localStorage) return;
        var _args = _event.args;
        _localStorage.setItem(_args[0],_args[1]);
    });
    /**
     * 删除缓存信息
     * @param  {String} _key 缓存标识
     * @return {Void}
     */
    _h.__removeItemFromStorage = 
    _h.__removeItemFromStorage._$aop(function(_event){
        _event.stopped = !0;
        if (!_localStorage) return;
        _localStorage.removeItem(_event.args[0]);
    });
    /**
     * 清除缓存
     * @return {Void}
     */
    _h.__clearStorage = 
    _h.__clearStorage._$aop(function(_event){
        _event.stopped = !0;
        if (!!_localStorage)
            _localStorage.clear();
    });
    /**
     * 初始化本地存储系统
     * @return {Void}
     */
    _h.__initStorage = 
    _h.__initStorage._$aop(function(_event){
        _event.stopped = !0;
        __doInitFlash();
    });
    /**
     * 检测本地存储系统是否准备完毕
     * @return {Boolean} 是否准备完毕
     */
    _h.__isStorageReady = 
    _h.__isStorageReady._$aop(function(_event){
        _event.stopped = !0;
        _event.value = !!_localStorage;
    });
};
NEJ.define(
    '{lib}patched/trident/storage.js',[
    '{lib}patched/trident/config.js',
    '{lib}patched/storage.js',
    '{patch}json.js'
],f);