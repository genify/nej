/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/global',
    'base/util'
],function(NEJ,_u,_p,_o,_f,_r){
    var _cache = {};
    /*
     * URL地址转源信息
     * http://a.b.com:8080/a/bc/ -> http://a.b.com:8080
     * @param  {String} URL地址
     * @return {String} 源信息
     */
    _p.__url2host = (function(){
        var _reg = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(_url){
            _url = _url||'';
            if (_reg.test(_url))
                return RegExp.$1;
            return location.protocol+'//'+location.host;
        };
    })();
    /**
     * 设置NEJ配置信息
     * @param  {String}   配置标识
     * @param  {Variable} 配置信息
     * @return {Void}
     */
    _p.__set = function(_key,_value){
        _cache[_key] = _value;
    };
    /**
     * 获取NEJ配置信息
     * @param  {String}   配置标识
     * @return {Variable} 配置信息
     */
    _p.__get = function(_key){
        return _cache[_key];
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
                    _map[_p.__url2host(_path)] = _path;
            }
            return _map;
        };
        return function(_config){
            // check path config
            _p.__set('root',_config.root||'/res/');
            var _root = _p.__get('root');
            _u._$forIn(_conf,function(v,k,m){
                _p.__set(k,_config[v.name]||(_root+v.dft));
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
            _p.__set('csrf',{
                param:_csrf.param||'',
                cookie:_csrf.cookie||''
            });
            // ajax by frame proxy
            _p.__set('frames',_doInitProxy(_config.p_frame));
            // ajax by flash proxy
            _p.__set('flashs',_doInitProxy(_config.p_flash));
        };
    })();
    _doInit(this.NEJ_CONF||_o);

    return _p;
});
