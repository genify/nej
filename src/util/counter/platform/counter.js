/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    'base/platform'
],function(_p){
    /**
     * 取字符串长度
     * @param  {String} 字符串
     * @return {Number} 字符串长度
     */
    _p.__length = (function(){
        var _reg = /(\r\n|\r|\n)/g;
        return function(_content){
            return (_content||'').replace(_reg,'**').length;
        };
    })();
    
    return _p;
});