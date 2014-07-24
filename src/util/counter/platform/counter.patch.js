NEJ.define([
    './counter.js'
],function(){
    // for ie
    NEJ.patch('TR',function(){
        // variable declaration
        var _  = NEJ.P,
            _h = _('nej.h');
        /**
         * 取字符串长度
         * @param  {String} 字符串
         * @return {Number} 字符串长度
         */
        _h.__length = 
        _h.__length._$aop(function(_event){
            _event.stopped = !0;
            _event.value = (_event.args[0]||'').length;
        });
    });
});