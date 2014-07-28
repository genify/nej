/*
 * ------------------------------------------
 * 平台接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './global.js'
],function(NEJ,_p,_o,_f,_r){
    var _platform  = this.navigator.platform,
        _useragent = this.navigator.userAgent;
    /**
     * 平台判断信息
     * 
     * [ntb]
     *  名称          | 类型              | 描述
     *  ------------------------------------
     *  mac      | Boolean    | is mac os
     *  win      | Boolean    | is windows os
     *  linux    | Boolean    | is linux os
     *  ipad     | Boolean    | is ipad device
     *  iphone   | Boolean    | is iphone device
     *  android  | Boolean    | is android system
     *  ios      | Boolean    | is ios system
     *  tablet   | Boolean    | is tablet
     *  desktop  | Boolean    | is desktop env
     * [/ntb]
     * 
     * @const {_$IS}
     * @type  {Object}
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
    // parse kernel information
    /**
     * 引擎内核信息
     * 
     * [ntb]
     *  名称          | 类型         | 描述
     *  ------------------------------------
     *  engine   | String  | layout engine, trident/webkit/gecko/presto...
     *  release  | Number  | layout engine version
     *  browser  | String  | browser name, ie/chrome/safari/opera/firefox/maxthon...
     *  version  | Number  | browser version
     *  prefix   | Object  | prefix for html5/css3 attribute/method/constructor name
     * [/ntb]
     * 
     * @const {_$KERNEL}
     * @type  {Object}
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
            _name = _test[i]=='safari'?'version':_test[i];
            if (new RegExp(_name+'/(.*?)(?=\\s|$)','i').test(_useragent)){
                _kernel.browser = _test[i];
                _kernel.version = RegExp.$1.trim();
                break;
            }
        }
    }
    /**
     * 引擎属性支持信息
     * 
     * [ntb]
     *  名称       | 类型          | 描述
     *  ------------------------------------
     *  css3d  | Boolean  | 是否支持CSS3 3D动画
     * [/ntb]
     * 
     * @const {_$SUPPORT}
     * @type  {Object}
     */
    _p._$SUPPORT = {};
    /**
     * 平台补丁判断信息
     * 
     * [ntb]
     *  名称       | 类型          | 描述
     *  ------------------------------------
     *  gecko    | Boolean  | not gecko
     *  webkit   | Boolean  | not webkit
     *  presto   | Boolean  | not presto
     *  trident  | Boolean  | not trident(ie6-9)
     *  trident0 | Boolean  | not trident0(ie6-)
     *  trident1 | Boolean  | not trident1(ie10+)
     * [/ntb]
     * 
     * @const  {_$NOT_PATCH}
     * @type   {Object}
     */
    var _notd = _kernel.engine!='trident';
    _p._$NOT_PATCH = {
        gecko : _kernel.engine!='gecko',
        webkit: _kernel.engine!='webkit',
        presto: _kernel.engine!='presto',
        // fix for ie6-
        trident0 : _notd||_kernel.release>'2.0',
        // fix for ie10+ (html5/css3 support)
        trident1 : _notd||_kernel.release<'6.0',
        // fix for ie7-
        trident2 : _notd||_kernel.release>'3.0',
        // fix for ie6-ie9
        trident  : _notd||_kernel.release>='6.0'
    };
    
    if (CMPT){
        this.copy(NEJ.P('nej.p'),_p);
    }
    
    return _p;
});