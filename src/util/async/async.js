/*
 * ------------------------------------------
 * 异步任务支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _j = _('nej.j');
    /**
     * 执行异步任务，代码示例：
     * [code]
     *   // 执行异步任务
     *   nej.j._$async({
     *       a:function(_event){
     *           
     *       },
     *       b:function(_event){
     * 
     *       },
     *       c...
     *       d...
     *       ...
     *       dep:{
     *           a:'b||c'
     *       }
     *   });
     * [/code]
     * @param  {Object} 任务配置信息
     * @config {Object} dep 依赖关系表
     * @param  {Object} 可选配置
     */
    _j._$async = function(_conf,_options){
        
    };
    /**
     * 
     */
    _j._$when = function(){
    
    };
    /**
     * 
     */
    _j._$then = function(){
    
    };
};
define(
    '{lib}util/async/async.js',[
    '{lib}util/async/node.js'
],f);
