/**
 * ------------------------------------------
 * 平台配置信息
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
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _c = NEJ.P('nej.c');
    /**
     * 取Frame跨域Ajax代理文件
     * @param  {String} 请求地址或者域名
     * @return {String} 代理文件地址
     */
    _c._$getFrameProxy = function(_url){
        return _c.__getFrameProxy(_url);
    };
    /**
     * 取Flash跨域Ajax配置文件
     * @param  {String} 请求地址或者域名
     * @return {String} 代理文件地址
     */
    _c._$getFlashProxy = function(_url){
        return _c.__getFlashProxy(_url);
    };

    /**
     * ie 7-9获取域名
     * @type {[type]}
     */
    _c._$getProxyURL = function(_url){
        return _c.__getProxyURL ? _c.__getProxyURL(_url) : _url;
    };

    /**
     * 获取NEJ配置信息
     * @param  {String} _key 配置标识
     * @return {Variable}    配置信息
     */
    _c._$get = function(_key){
        return _c.__get(_key);
    };
};
NEJ.define('{lib}base/config.js',['{platform}config.js'],f);