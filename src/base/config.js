/*
 * ------------------------------------------
 * 平台配置信息
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module base/config */
NEJ.define([
    './global.js',
    '{platform}util.js',
    '{platform}config.js'
],function(NEJ,_u,_h,_p,_o,_f,_r){
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
    /**
     * 取Frame跨域Ajax代理文件，通过NEJ_CONF的p_frame配置给定域名的代理文件地址
     * 
     * @method module:base/config._$getFrameProxy
     * @see    module:base/config._$get
     * @param  {String} arg0 - 请求地址或者域名
     * @return {String}        代理文件地址
     */
    _p._$getFrameProxy = function(_url){
        var _host = _url2host(_url);
        return _p._$get('frames')[_host]||
              (_host+'/res/nej_proxy_frame.html');
    };
    /**
     * 取Flash跨域Ajax配置文件，通过NEJ_CONF的p_flash配置给定域名的代理文件地址
     * 
     * @method module:base/config._$getFlashProxy
     * @see    module:base/config._$get
     * @param  {String} arg0 - 请求地址或者域名
     * @return {String}        代理文件地址
     */
    _p._$getFlashProxy = function(_url){
        return _p._$get('flashs')[_url2host(_url)];
    };
    /**
     * 获取NEJ配置信息，通过NEJ_CONF配置相关信息
     * 
     * ```javascript
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
     *      // audio player flash
     *      // default value -> $root+'nej_player_audio.swf'
     *      audio : '/res/nej_player_audio.swf'
     *      // video player flash
     *      // default value -> $root+'nej_player_video.swf'
     *      video : '/res/nej_player_video.swf'
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
     *      // set p_csrf:true to use URS config {cookie:'AntiCSRF',param:'AntiCSRF'}
     *      // default value -> {cookie:'',param:''}
     *      p_csrf:{cookie:'AntiCSRF',param:'AntiCSRF'}
     *  };
     * ```
     * 
     * 配置标识支持
     * 
     * | 标识                          | 说明 |
     * | :--              | :-- |
     * | portrait         | 表情根路径 |
     * | blank.png        | 空白图片文件地址 |
     * | ajax.swf         | Ajax代理Flash文件地址 |
     * | chart.swf        | 图标Flash文件地址 |
     * | audio.swf        | 实现Audio功能的Flash文件地址 |
     * | video.swf        | 实现Video功能的Flash文件地址 |
     * | clipboard.swf    | 实现剪切板功能的Flash文件地址 |
     * | upload.image.swf | 实现图片上传功能的Flash文件地址 |
     * | storage.swf      | 实现本地存储功能的Flash文件地址 |
     * 
     * @method module:base/config._$get
     * @param  {String}   arg0 - 配置标识
     * @return {Variable}        配置信息
     */
    _p._$get = function(_key){
        return _h.__get(_key);
    };
    // init
    /*
     * 初始化配置信息
     * @param  {Object} 配置信息
     * @return {Void}
     */
    var _doInit = (function(){
        var _conf = {
            'portrait':{name:'portrait',dft:'portrait/'},
            'ajax.swf':{name:'ajax',dft:'nej_proxy_flash.swf'},
            'chart.swf':{name:'chart',dft:'nej_flex_chart.swf'},
            'audio.swf':{name:'audio',dft:'nej_player_audio.swf'},
            'video.swf':{name:'video',dft:'nej_player_video.swf'},
            'clipboard.swf':{name:'clipboard',dft:'nej_clipboard.swf'},
            'upload.image.swf':{name:'uploadimage',dft:'nej_upload_image.swf'}
        };
        var _doInitProxy = function(_list){
            var _map = {};
            if (!_list||!_list.length){
                return _map;
            }
            for(var i=0,l=_list.length,_path;i<l;i++){
                _path = _list[i];
                if (_path.indexOf('://')>0)
                    _map[_url2host(_path)] = _path;
            }
            return _map;
        };
        return function(_config){
            // check path config
            _h.__set('root',_config.root||'/res/');
            var _root = _p._$get('root');
            _u.__forIn(_conf,function(v,k,m){
                _h.__set(k,_config[v.name]||(_root+v.dft));
            });
            // csrf config
            var _csrf = _config.p_csrf;
            if (_csrf===!0){
                _csrf = {
                    cookie:'AntiCSRF',
                    param:'AntiCSRF'
                };
            }
            _csrf = _csrf || _o;
            _h.__set('csrf',{
                param:_csrf.param||'',
                cookie:_csrf.cookie||''
            });
            // ajax by frame proxy
            _h.__set('frames',_doInitProxy(_config.p_frame));
            // ajax by flash proxy
            _h.__set('flashs',_doInitProxy(_config.p_flash));
        };
    })();
    _doInit(this.NEJ_CONF||_o);

    if (CMPT){
        NEJ.copy(NEJ.P('nej.c'),_p);
    }

    return _p;
});
