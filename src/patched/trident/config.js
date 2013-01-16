/**
 * ------------------------------------------
 * Trident引擎(ie6-ie9)配置信息实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _c = _('nej.c'),
        _config = window.NEJ_CONF||NEJ.O;
    if (_p._$NOT_PATCH.trident) return;
    // storage flash url
    _c.__set('storage.swf',_config.storage||
            (_c._$get('root')+'nej_storage.swf'));
    // ie 7- data uri not available
    if (_p._$KERNEL.release<'4.0'){
        _c.__set('blank.png',_config.blank||
                (_c._$get('root')+'nej_blank.gif'));
    }
    // crossdomian.html path config
    var _list = _config.xdr,
        _reg0 = /^(https?:\/\/.*?)(?=\/|$)/i,
        _reg1 = /[\/?=&]/i;
    var _doParseUrl2Key = function(_url){
        return (_reg0.test(_url)?RegExp.$1:'').toLowerCase();
    };
    if (!!_list&&!!_list.length)
        for(var i=_list.length-1,_url,_key;i>=0;i--){
            _url = _list[i];
            _key = _doParseUrl2Key(_url);
            if (!!_key) _c.__set(_key,_url);
        }
    _c._$getProxyURL = function(_url){
        var _key = _doParseUrl2Key(_url);
        if (!_key){
            if (_reg1.test(_url)){
                // url is request path /a/b?a=aaa
                _key = location.protocol+'//'+location.host;
            }else if(_url.indexOf('://')<0){
                // url is domain a.b.com
                _key = location.protocol+'//'+_url;
            }else{
                // url is origin http://a.b.com:900
                _key = _url;
            }
        }
        return _c._$get(_key)||(_key+'/res/nej_xdomain.html');
    };
};
define('{lib}patched/trident/config.js',
      ['{lib}patched/config.js'],f);