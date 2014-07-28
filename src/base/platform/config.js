/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js'
],function(NEJ,_p,_o,_f,_r){
    var _cache = {};
    /*
     * 设置NEJ配置信息
     * @param  {String}   配置标识
     * @param  {Variable} 配置信息
     * @return {Void}
     */
    _p.__set = function(_key,_value){
        _cache[_key] = _value;
    };
    /**
     * 获取NEJ配置信息
     * @api    {_$get}
     * @param  {String}   配置标识
     * @return {Variable} 配置信息
     */
    _p._$get = function(_key){
        return _cache[_key];
    };
    
    if (CMPT){
        return this.copy(NEJ.P('nej.c'),_p);
    }
    
    return _p;
});
