/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './xdr.js',
    '{lib}base/util.js'
],function(_h,_u,_p,_o,_f,_r){
    // for ie6-
    NEJ.patch('TR<=2.0',function(){
        /**
         * 取XHR对象
         * @return {XMLHttpRequest} XHR对象
         */
        _h.__getXMLHttpRequest = (function(){
            // http://blogs.msdn.com/b/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
            var _msxml = [
                'Msxml2.XMLHTTP.6.0',
                'Msxml2.XMLHTTP.3.0',
                'Msxml2.XMLHTTP.4.0',
                'Msxml2.XMLHTTP.5.0',
                'MSXML2.XMLHTTP',
                'Microsoft.XMLHTTP'
            ];
            return function(){
                var _xhr = null;
                _u._$forIn(
                    _msxml,function(_name){
                        try{
                            _xhr = new ActiveXObject(_name);
                            return !0;
                        }catch(e){
                            // ignore exception
                        }
                    }
                );
                return _xhr;
            };
        })();
    });
    
    return _h;
});
