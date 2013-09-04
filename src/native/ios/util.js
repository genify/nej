/**
 * ------------------------------------------
 * 工具函数
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        u = NEJ.P('nej.u'),
        e = NEJ.P('nej.e'),
        v = NEJ.P('nej.v'),
        c = NEJ.P('navigator.n2j'),
        p = NEJ.P('nej.mb'),
        __cache = {};
    /**
     * 执行回调
     * @param  {String} _key 回调标识
     * @return {Void}
     */
    var __callback = function(_key,_result){
        var _cb = __cache[_key]||f;
        try{_cb((_result||o).result,(_result||o).data);}catch(ex){}
        delete c[_key];
        delete __cache[_key];
    };
    /**
     * 日志输出
     * @param  {String} _message 日志信息
     * @return {Void}
     */
    p._$log = function(_message){
        PhoneGap._$exec('DebugConsole.log',
                       {param:[_message||'']});
    };
    /**
     * 执行载入完成事件
     * @return {Void}
     */
    p._$doLoadFinish = function(){
       PhoneGap._$exec('InitCallback.loaded');
    };
    /**
     * 显示操作菜单
     * @param  {Object} _options 配置参数，已处理参数
     *                           layout   [Array]    - 按钮名称列表
     *                           cancel   [Number]   - 取消按钮索引
     *                           destroy  [Number]   - 销毁按钮索引
     *                           onaction [Function] - 动作触发回调
     * @return {Void}
     */
    p._$showActionSheet = function(_options){
        _options = _options||o;
        var _key = 'an_'+u._$randNumberString();
        c[_key] = _options.onaction||f;
        PhoneGap._$exec('ActionSheet.show',
                       {param:['navigator.n2j.'+_key],
                        query:{layout:_options.layout,
                               cancelBtn:_options.cancel,
                               destructBtn:_options.destroy}});
    };
    /**
     * 获得系统信息
     * @param {Object} _callback 回调函数
     * @return {Void}
     */
    p._$getSystemInfo = function(_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('Device.getSystemInfo',
                       {param:['navigator.n2j.'+_sn]});
    };
    /**
     * 浏览器打开地址
     * @param {Object} _callback 回调函数
     * @return {Void}
     */
    p._$openURL = function(_url,_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('Device.openURL',
                       {param:[_url,'navigator.n2j.'+_sn]});
    };
    /**
     * 弹出窗口
     * @param {Object} _callback    回调地址
     * @param {Object} _url            要打开的url
     * @param {Object} _rurl        要截获的url
     * @param {Object} _curl        截获后回调地址
     * @return {Void}
     */
    p._$showPopupWebView = function(_callback,_url,_rurl,_curl){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('PopupWebView.show',
                       {param:['navigator.n2j.'+_sn,_url,_rurl,_curl]});
    };
    /**
     * 获得系统参数值
     * @param {Object}   _key       系统参数键值
     * @param {Function} _callback  回调函数
     * @return {Void}
     */
    p._$closePopupWebView = function(){
        PhoneGap._$exec('PopupWebView.destroy');
    };
    /**
     * 发布新浪微薄
     * @param {Object} _callback    回调函数
     * @param {Object} _postUrl        发布微薄url
     * @param {Object} _oauthHeader    oauth头
     * @param {Object} _content        微薄内容
     * @param {Object} _imageUrl    图片地址
     * @return {Void}
     */
    p._$publishSinaWeibo = function(_callback,_postUrl,_oauthHeader,_content,_imageUrl){
        var _sn='pf_'+u._$randNumberString(4);
        __cache[_sn]=_callback||f;
        c[_sn]=__callback._$bind(null,_sn);
        PhoneGap._$exec('Weibo.postWeibo',{param:['navigator.n2j.'+_sn,_postUrl,_oauthHeader,_content,_imageUrl]});
    };
    /**
     * 添加要截获的url地址
     * @param {Object} _callback    回调函数
     * @param {Object} _url            要截获的url地址
     * @return {Void}
     */
    p._$addInterceptUrl = function(_callback,_url){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('RequestIntercept.addUrl',
                       {param:['navigator.n2j.'+_sn,_url]});
    };
    /**
     * 移除截获的url地址
     * @return {Void}
     */
    p._$removeInterceptUrl = function(_url){
        PhoneGap._$exec('RequestIntercept.removeUrl',{param:[_url]});
    };
    /**
     * 弹出WebView
     * @param {Object} _options    callback            回调函数
     *                             startUrl            打开的WebView地址
     *                             fullScreen            是否全屏
     *                             needNavigationBar    是否存在导航条
     * @return {Void}                            
     */
    p._$popupWebview = function(_options){
        _options = _options||o;
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _options.callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('PopupWebView.show',{param:['navigator.n2j.'+_sn],
                                             query:{StartUrl:_options.startUrl
                                                    ,FullScreen:_options.fullScreen
                                                    ,NeedNavigationBar:_options.needNavigationBar
                                                    ,NavigationBarTitle:_options.navigationBarTitle
                                                     }});
    };
    /**
     * 保存图片到本地相册
     * @param {String} _url            图片地址
     * @param {Function} _callback    回调函数
     * @return {Void}
     */
    p._$savePhotoToAlbum = function(_url,_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('Device.writeImageToSavedPhotosAlbum',
                       {param:[_url,'navigator.n2j.'+_sn]});
        
    };
    /**
     * 获取应用的Device Token
     * @param {Object} _callback 回调函数 
     * @return {Void}
     */
    p._$notifyDeviceToken = function(_callback){
        var _sn = 'pf_'+u._$randNumberString(4);
        __cache[_sn] = _callback||f;
        c[_sn] = __callback._$bind(null,_sn);
        PhoneGap._$exec('Device.registerForRemoteNotificationTypes',
                       {param:['navigator.n2j.'+_sn]});
    };
    /**
     * 高亮显示
     * @param  {String|Node} _element 节点
     * @return {Void}
     */
    p._$hightlight = (function(){
        var __element;
        var __isElement = function(_element){
            return !!e._$dataset(_element,'hightlight')||
                   !!e._$dataset(_element,'hightlighted');
        };
        var __onTapStart = function(_event){
            __element = v._$getElement(_event,__isElement);
            var _class = e._$dataset(__element,'hightlight');
            if (!!_class) e._$addClassName(__element,_class);
    };
    var __onTapCancel = function(_event){
        if (!__element) return;
        e._$delClassName(__element,
            e._$dataset(__element,'hightlight'));
    };
    return function(_element){
        if (!!e._$dataset(_element,'hightlighted')) return;
        e._$dataset(_element,'hightlighted',true);
        v._$addEvent(_element,'tapend',__onTapCancel);
        v._$addEvent(_element,'tapstart',__onTapStart);
        v._$addEvent(_element,'tapcancel',__onTapCancel);
    };
})();
};
NEJ.define('{lib}native/ios/util.js',
      ['{lib}native/ios/phonegap.js'],f);
