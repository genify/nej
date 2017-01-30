/*
 * ------------------------------------------
 * 平台接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module base/platform */
NEJ.define([
    './global.js'
],function(NEJ,_p,_o,_f,_r){
    var _platform  = this.navigator.platform,
        _useragent = this.navigator.userAgent;
    /**
     * 平台判断信息
     * 
     * ```javascript
     * NEJ.define([
     *     'base/platform'
     * ],function(_m){
     *     var _is = _m._$IS;
     *     // 是否MAC系统
     *     console.log(_is.mac);
     *     // 是否IPhone
     *     console.log(_is.iphone);
     *     // ...
     * });
     * ```
     * 
     * @const    module:base/platform._$IS
     * @see      module:base/platform._$is
     * @type     {Object}
     * @property {Boolean} mac     - 是否Mac系统
     * @property {Boolean} win     - 是否windows系统
     * @property {Boolean} linux   - 是否linux系统
     * @property {Boolean} ipad    - 是否Ipad
     * @property {Boolean} iphone  - 是否IPhone
     * @property {Boolean} android - 是否Android系统
     * @property {Boolean} ios     - 是否IOS系统
     * @property {Boolean} tablet  - 是否平板
     * @property {Boolean} desktop - 是否桌面系统
     */
    var _is = {
        mac     : _platform,
        win     : _platform,
        linux   : _platform,
        ipad    : _useragent,
        ipod    : _useragent,
        iphone  : _platform,
        android : _useragent
    };
    _p._$IS = _is;
    for(var x in _is){
        _is[x] = new RegExp(x,'i').test(_is[x]);
    }
    _is.ios = _is.ipad||_is.iphone||_is.ipod;
    _is.tablet = _is.ipad;
    _is.desktop = _is.mac||_is.win||(_is.linux&&!_is.android);
    /**
     * 判断是否指定平台
     * 
     * ```javascript
     * NEJ.define([
     *     'base/platform'
     * ],function(_m){
     *     // 是否MAC系统
     *     console.log(_m._$is('mac'));
     *     // 是否iphone
     *     console.log(_m._$is('iphone'));
     *     // ...
     * });
     * ```
     * 
     * @method module:base/platform._$is
     * @see    module:base/platform._$IS
     * @param  {String} arg0 - 平台名称
     * @return {Boolean}       是否指定平台
     */
    _p._$is = function(_platform){
        return !!_is[_platform];
    };
    // parse kernel information
    /**
     * 引擎内核信息
     * 
     * ```javascript
     * NEJ.define([
     *     'base/platform'
     * ],function(_m){
     *     var _kernel = _m._$KERNEL;
     *     // 打印平台信息
     *     console.log(_kernel.engine);
     *     console.log(_kernel.release);
     *     console.log(_kernel.browser);
     *     console.log(_kernel.version);
     * });
     * ```
     * 
     * @const    module:base/platform._$KERNEL
     * @type     {Object}
     * @property {String} engine  - 布局引擎，trident/webkit/gecko/presto...
     * @property {Number} release - 布局引擎版本
     * @property {String} browser - 浏览器名称，ie/chrome/safari/opera/firefox/maxthon...
     * @property {Number} version - 浏览器版本
     * @property {Object} prefix  - 平台前缀，html5/css3 attribute/method/constructor
     */
    var _kernel = {
        engine:'unknow',
        release:'unknow',
        browser:'unknow',
        version:'unknow',
        prefix:{css:'',pro:'',clz:''}
    };
    _p._$KERNEL  = _kernel;
    if (/msie\s+(.*?);/i.test(_useragent)||
        /trident\/.+rv:([\d\.]+)/i.test(_useragent)){
        _kernel.engine  = 'trident';
        _kernel.browser = 'ie';
        _kernel.version = RegExp.$1;
        _kernel.prefix  = {css:'ms',pro:'ms',clz:'MS',evt:'MS'};
        // 4.0-ie8 5.0-ie9 6.0-ie10 7.0-ie11
        // adjust by document mode setting in develop toolbar
        var _test = {6:'2.0',7:'3.0',8:'4.0',9:'5.0',10:'6.0',11:'7.0'};
        _kernel.release = _test[document.documentMode]||
                          _test[parseInt(_kernel.version)];
    }else if(/webkit\/?([\d.]+?)(?=\s|$)/i.test(_useragent)){
        _kernel.engine  = 'webkit';
        _kernel.release = RegExp.$1||'';
        _kernel.prefix  = {css:'webkit',pro:'webkit',clz:'WebKit'};
    }else if(/rv\:(.*?)\)\s+gecko\//i.test(_useragent)){
        _kernel.engine  = 'gecko';
        _kernel.release = RegExp.$1||'';
        _kernel.browser = 'firefox';
        _kernel.prefix  = {css:'Moz',pro:'moz',clz:'Moz'};
        if (/firefox\/(.*?)(?=\s|$)/i.test(_useragent))
            _kernel.version = RegExp.$1||'';
    }else if(/presto\/(.*?)\s/i.test(_useragent)){
        _kernel.engine  = 'presto';
        _kernel.release = RegExp.$1||'';
        _kernel.browser = 'opera';
        _kernel.prefix  = {css:'O',pro:'o',clz:'O'};
        if (/version\/(.*?)(?=\s|$)/i.test(_useragent))
            _kernel.version = RegExp.$1||'';
    }
    if (_kernel.browser=='unknow'){
        var _test = ['chrome','maxthon','safari'];
        for(var i=0,l=_test.length,_name;i<l;i++){

            if (_test[i] === 'safari') {
                _name = 'version';
            } else if (_test[i] === 'chrome') {
                _name = '[chrome|CriOS]'; // CriOS is Google Chrome for iOS
            } else {
                _name = _test[i];
            }

            if (new RegExp(_name+'/(.*?)(?=\\s|$)','i').test(_useragent)){
                _kernel.browser = _test[i];
                _kernel.version = RegExp.$1.trim();
                break;
            }
        }
    }
    /**
     * 引擎特性支持信息
     * 
     * ```javascript
     * NEJ.define([
     *     'base/platform'
     * ],function(_m){
     *     var _support = _m._$SUPPORT;
     *     // 打印平台是否支持CSS3 3D特效
     *     console.log(_support.css3d);
     * });
     * ```
     * @const    module:base/platform._$SUPPORT
     * @see      module:base/platform._$support
     * @type     {Object}
     * @property {Boolean} css3d  - 是否支持CSS3 3D
     */
    _p._$SUPPORT = {};
    /**
     * 判断平台是否支持指定特性
     * 
     * ```javascript
     * NEJ.define([
     *     'base/platform'
     * ],function(_m){
     *     // 是否支持CSS3 3D特效
     *     console.log(_m._$support('css3d'));
     * });
     * ```
     * 
     * @method module:base/platform._$support
     * @see    module:base/platform._$SUPPORT
     * @param  {String} arg0 - 特性标识
     * @return {Boolean}       是否支持指定特性
     */
    _p._$support = function(_feature){
        return !!_p._$SUPPORT[_feature];
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.p'),_p);
    }
    
    return _p;
});