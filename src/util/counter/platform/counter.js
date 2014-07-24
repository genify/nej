NEJ.define([
    '{lib}base/platform.js'
],function(){
    // variable declaration
    var _  = NEJ.P,
        _h = _('nej.h');
    /**
     * 取字符串长度
     * @param  {String} 字符串
     * @return {Number} 字符串长度
     */
    _h.__length = (function(){
        var _reg = /(\r\n|\r|\n)/g;
        return function(_content){
            return (_content||'').replace(_reg,'**').length;
        };
    })();
});