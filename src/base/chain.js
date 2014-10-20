/*
 * ------------------------------------------
 * 可链式接口实现代理文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @namespace CHAINABLE */
/** @module base/chain */
NEJ.define([
    'base/util'
],function(_u,_p){
    var _cache = {};
    /**
     * 添加可链式调用的接口
     *
     * 添加可链式接口
     * ```javascript
     * NEJ.define([
     *     'base/chain'
     * ],function(_l){
     *     var _map = {};
     *
     *      _map._$api1 = function(){
     *          // TODO
     *      }
     *      
     *      _map._$api2 = function(){
     *          // TODO
     *      }
     * 
     *     _l._$merge(_map);
     * });
     * ```
     *
     * 使用链式调用接口
     * ```javascript
     * NEJ.define([
     *     '/path/to/api.js',
     *     'util/chain/chainable'
     * ],function(_x,$){
     *     // 使用链式调用api
     *     $('body > p')._$api1()._$api2();
     * });
     * ```
     * 
     * @method module:base/chain._$merge
     * @param  {Object} arg0 - 接口集合
     * @return {Void}
     */
    _p._$merge = function(_map){
        _u._$merge(_cache,_map);
    };
    /**
     * 导出链式接口列表
     * 
     * @method module:base/chain._$dump
     * @return {Object} 链式接口列表
     */
    _p._$dump = function(){
        return _cache;
    };
    /**
     * 清除链式列表
     * 
     * @method module:base/chain._$clear
     * @return {Void}
     */
    _p._$clear = function(){
        _cache = {};
    };
    
    return _p;
});
