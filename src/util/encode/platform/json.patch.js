var f = function(){
	// ie6-9
	NEJ.patch('2.0<=TR<=5.0',['./3rd.json.js']);

	// ie6 json patch
    NEJ.patch('TR==2.0',['./3rd.json.js'],function(){
	    // variable declaration
	    var _  = NEJ.P,
	        _p = _('nej.p');
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
};
define(['./json.js'],f);