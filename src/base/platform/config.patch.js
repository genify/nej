/**
 * 配置信息实现文件
 * @return {[type]} [description]
 */
var f = function() {
	// ie6-9
	NEJ.patch('2.0<=TR<=5.0',function(){
	    var _  = NEJ.P,
	        _p = _('nej.p'),
	        _c = _('nej.c'),
	        _config = window.NEJ_CONF||NEJ.O;
	    // storage flash url
	    _c.__set('storage.swf',_config.storage||
	            (_c.__get('root')+'nej_storage.swf'));
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
	    _c.__getProxyURL = function(_url){
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
	        return _c.__get(_key)||(_key+'/res/nej_xdomain.html');
	    };
	});
	
	// ie 7- data uri not available
	NEJ.patch('TR<=3.0',function(){
		var _  = NEJ.P,
	        _c = _('nej.c'),
	        _config = window.NEJ_CONF||NEJ.O;
        _c.__set('blank.png',_config.blank||
                (_c.__get('root')+'nej_blank.gif'));
	});
};
define(['./config.js'],f);