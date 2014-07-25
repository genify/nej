NEJ.define(['{lib}base/global.js'
],function(NEJ,_c){
    var _cache = {};
    if (CMPT){
        var _c = NEJ.P('nej.c');
    }
   
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
        var _conf = {
            'portrait':{name:'portrait',dft:'portrait/'},
            'ajax.swf':{name:'ajax',dft:'nej_proxy_flash.swf'},
            'chart.swf':{name:'chart',dft:'nej_flex_chart.swf'},
            'audio.swf':{name:'audio',dft:'nej_player_audio.swf'},
            'video.swf':{name:'video',dft:'nej_player_video.swf'},
            'clipboard.swf':{name:'clipboard',dft:'nej_clipboard.swf'},
            'upload.image.swf':{name:'uploadimage',dft:'nej_upload_image.swf'}
        };
        return function(_config){
            // check path config
            _c.__set('root',_config.root||'/res/');
            var _cnf,_root = _c.__get('root');
            for(var x in _conf){
                _cnf = _conf[x];
                _c.__set(
                    x,_config[_cnf.name]||(_root+_cnf.dft)
                );
            }
            // csrf config
            var _csrf = _config.p_csrf;
            if (_csrf==!0){
                _csrf = {
                    cookie:'AntiCSRF',
                    param:'AntiCSRF'
                };
            }
            _c.__set('csrf',NEJ.EX({cookie:'',param:''},_csrf));
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
    _c.__get = function(_key){
        return _cache[_key];
    };

    /**
     * 取Frame跨域Ajax代理文件
     * @param  {String} 请求地址或者域名
     * @return {String} 代理文件地址
     */
    _c.__getFrameProxy = function(_url){
        var _host = _url2host(_url);
        return _cache.frames[_host]||
              (_host+'/res/nej_proxy_frame.html');
    };

    /**
     * 取Flash跨域Ajax配置文件
     * @param  {String} 请求地址或者域名
     * @return {String} 代理文件地址
     */
    _c.__getFlashProxy = function(_url){
        return _cache.flashs[_url2host(_url)];
    };

    // init
    _doInit(window.NEJ_CONF||NEJ.O);
    return  _c;
});