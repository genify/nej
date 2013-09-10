/**
 * ------------------------------------------
 * 平台配置信息接口实现文件
 *  window.NEJ_CONF = {
 *      // resource root
 *      // defalut value -> '/res/'
 *      root : '/nej/'
 *      // blank image for ie6-ie7
 *      // default value -> $root+'nej_blank.gif'
 *      blank : '/res/nej_blank.gif'
 *      // localstorage flash
 *      // default value -> $root+'nej_storage.swf'
 *      storage : '/res/nej_storage.swf'
 *      // clipboard flash
 *      // default value -> $root+'nej_clipboard.swf'
 *      clipboard : '/res/nej_clipboard.swf'
 *      // https request proxy
 *      // default value -> $root+'nej_proxy_flash.swf'
 *      ajax : '/res/nej_proxy_flash.swf'
 *      // portrait root
 *      // default value -> $root+'portrait/'
 *      portrait : '/res/portrait/'
 *      // cross domain xhr request for ie6-ie9
 *      // if path not start with http[s]://
 *      // will use /res/nej_proxy_frame.html as default
 *      p_frame:['http://c.d.com/html/nej_proxy_frame.html']
 *      // flash crossdomain.xml file path
 *      // default value -> http://a.b.com/crossdomain.xml
 *      p_flash:['http://a.b.com/proxy/crossdomain.xml']
 *      // CSRF cookie name and parameter name
 *      // default value -> {cookie:'',param:''}
 *      p_csrf:{cookie:'',param:''}
 *  };
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _c = NEJ.P('nej.c'),
        _cache = {};
    /*
     * URL地址转源信息
     * http://a.b.com:8080/a/bc/ -> http://a.b.com:8080
     * @param  {String} URL地址
     * @return {String} 源信息
     */
    var _url2host = (function(){
        var _reg = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(_url){
            _url = _url||'';
            if (_reg.test(_url))
                return RegExp.$1;
            return location.protocol+'//'+location.host;
        };
    })();
    /*
     * 初始化配置信息
     * @param  {Object} 配置信息
     * @return {Void}
     */
    var _doInit = (function(){
        var _doInitProxy = function(_list,_map){
            if (!_list||!_list.length) return;
            for(var i=0,l=_list.length,_path;i<l;i++){
                _path = _list[i];
                if (_path.indexOf('://')>0)
                    _map[_url2host(_path)] = _path;
            }
        };
        return function(_config){
            // root
            _c.__set('root',_config.root||'/res/');
            // portrait root
            _c.__set('portrait',_config.portrait||
                    (_c._$get('root')+'portrait/'));
            // ajax by flash proxy
            _c.__set('ajax.swf',_config.ajax||
                    (_c._$get('root')+'nej_proxy_flash.swf'));
            // clipboard flash
            _c.__set('clipboard.swf',_config.clipboard||
                    (_c._$get('root')+'nej_clipboard.swf'));
            // chart flash
            _c.__set('chart.swf',_config.chart||
                    (_c._$get('root')+'nej_flex_chart.swf'));
            // csrf config
            _c.__set('csrf',NEJ.EX({
                cookie:'AntiCSRF',
                param:'AntiCSRF'
            },_config.p_csrf));
            // ajax by frame proxy
            _cache.frames = {};
            _doInitProxy(_config.p_frame,_cache.frames);
            // ajax by flash proxy
            _cache.flashs = {};
            _doInitProxy(_config.p_flash,_cache.flashs);
        };
    })();
    /*
     * 设置NEJ配置信息
     * @param  {String}   _key   配置标识
     * @param  {Variable} _value 配置信息
     * @return {Void}
     */
    _c.__set = function(_key,_value){
        _cache[_key] = _value;
    };
    /**
     * 获取NEJ配置信息
     * @param  {String} _key 配置标识
     * @return {Variable}    配置信息
     */
    _c._$get = function(_key){
        return _cache[_key];
    };
    /**
     * 取Frame跨域Ajax代理文件
     * @param  {String} 请求地址或者域名
     * @return {String} 代理文件地址
     */
    _c._$getFrameProxy = function(_url){
        var _host = _url2host(_url);
        return _cache.frames[_host]||
              (_host+'/res/nej_proxy_frame.html');
    };
    /**
     * 取Flash跨域Ajax配置文件
     * @param  {String} 请求地址或者域名
     * @return {String} 代理文件地址
     */
    _c._$getFlashProxy = function(_url){
        return _cache.flashs[_url2host(_url)];
    };
    // init
    _doInit(window.NEJ_CONF||NEJ.O);
};
NEJ.define('{lib}patched/config.js',
          ['{lib}base/platform.js'],f);