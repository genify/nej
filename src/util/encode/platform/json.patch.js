var f = function(_m,_j,_3rd,_p){
	// ie8-
	NEJ.patch(_m,'TR<=5.0',['./3rd.json.js']);

	// ie6 json patch
    NEJ.patch(_m,'TR==2.0',['./3rd.json.js'],function(JSON){
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
	return _p;
};
define(['{lib}base/platform.js','./json.js'],f);