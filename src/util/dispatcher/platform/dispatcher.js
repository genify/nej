/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    'base/platform'
],function(_m,_p,_o,_f,_r){
    /**
     * 修正标题
     * @param  {String} 上次标题
     * @return {String} 修正后的标题
     */
    _p.__doFixTitle = (function(){
        var _reg = /#.*?$/i;
        return function(_title){
            var _odttl = document.title,
                _nwttl = _odttl.replace(_reg,'');
            if (_odttl!=_nwttl){
                _title = _nwttl||_title;
                document.title = _title;
            }
            return document.title;
        };
    })();
    /**
     * 修正标题被Hash污染问题
     * @param  {String} 原始标题
     * @return {Void}
     */
    _p.__doFixHashTitle = function(_title){
        // TODO
    };
    
    return _p;
});
