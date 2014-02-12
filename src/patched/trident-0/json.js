/**
 * ------------------------------------------
 * JSON接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _p = _('nej.p');
    if (_p._$NOT_PATCH.trident0) return;
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
};
NEJ.define('{lib}patched/trident-0/json.js',
          ['{lib}util/encode/json.js'
          ,'{lib}patched/json.js'],f);