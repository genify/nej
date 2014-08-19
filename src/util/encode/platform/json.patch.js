/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
	'base/platform'
],function(_m,_p,_o,_f,_r){
	// ie8-
	NEJ.patch('TR<=5.0',['./3rd.json.js']);

	// ie6 json patch
    NEJ.patch('TR==2.0',['./3rd.json.js'],function(){
	    // eval for big string
	    JSON.parse = (function(){
	        // check save json string
	        // http://www.ietf.org/rfc/rfc4627.txt
	        var _isSafeJSON = function(_content){
	            return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
	                        _content.replace(/"(\\.|[^"\\])*"/g,'')
	                    ));
	        };
	        return JSON.parse._$aop(function(_event){
	            var _str = _event.args[0]||'';
	            if (_str.length>=500000){  // &&_isSafeJSON(_str)
	                _event.stopped = !0;
	                _event.value = eval('('+_str+')');
	            }
	        });
	    })();
	});

	return JSON;
});