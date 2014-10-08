/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    './counter.js'
],function(_h){
    // for ie
    NEJ.patch('TR',function(){
        /**
         * 取字符串长度
         * @param  {String} 字符串
         * @return {Number} 字符串长度
         */
        _h.__length = function(){
            return (_event.args[0]||'').length;
        };
    });
    
    return _h;
});