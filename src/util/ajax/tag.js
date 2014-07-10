/*
 * ------------------------------------------
 * 脚本载入控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _j = _('nej.j'),
        _p = _('nej.ut.j');
    /**
     * 载入脚本文件<br/>
     * [code]
     *   var _j = nej.j;
     *   _j._$loadScript('../../../javascript/log.js',{
     *       onloaded:function(){
     *           // 载入成功的回调方法
     *       },
     *       onerror:function(_error){
     *           // 抛出异常回调
     *       }
     *   });
     * [/code]
     * @api    {nej.j._$loadScript}
     * @param  {String}  请求地址
     * @param  {Object}  可选配置参数,已处理参数列表如下
     * @config {Boolean} async   异步载入并立刻执行，默认为!0
     * @config {Number}  timeout 超时时间,0表示禁止超时监测
     * @config {String}  version 版本信息
     * @config {String}  charset 脚本编码
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onloaded} 载入完成回调函数
     * 
     * [hr]
     * 
     * @event  {onerror} 载入出错回调函数
     * @param  {Object}  错误信息
     * 
     */
    _j._$loadScript = function(_url,_options){
        _p._$$ScriptLoader._$allocate(_options)._$load(_url);
        return this;
    };
    /**
     * 载入队列脚本并依次执行<br/>
     * [code]
     *   var _j = nej.j;
     *   _j._$queueScript(['../../../javascript/log.js','http://123.163.com/a.js'],{
     *       onloaded:function(){
     *          // 载入成功的回调方法
     *       },
     *       onerror:function(_error){
     *          // 异常回调方法
     *       }
     *   });
     * [/code]
     * @api    {nej.j._$queueScript}
     * @param  {Array}  脚本队列
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {String} version 版本信息
     * @config {String} charset 脚本编码
     * @config {Number} timeout 每个脚本超时时间,0表示禁止超时监测
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onloaded} 载入完成回调函数
     * 
     * [hr]
     * 
     * @event  {onerror} 载入出错回调函数
     * @param  {Object}  错误信息
     * 
     */
    _j._$queueScript = function(_list,_options){
        _p._$$ScriptLoader._$allocate(_options)._$queue(_list);
        return this;
    };
    /**
     * 载入样式文件<br/>
     * [code]
     *   var _j = nej.j;
     *   _j._$loadStyle('http://123.163.com/a.css',{
     *       onloaded:function(){
     *           // 载入成功的回调方法
     *       },
     *       onerror:function(_error){
     *           // 异常回调方法
     *       }
     *   });
     * [/code]
     * @api    {nej.j._$loadStyle}
     * @param  {String} 样式文件地址
     * @param  {Object} 可选配置参数，已处理的参数列表
     * @config {Number} timeout 超时时间,0表示禁止超时监测
     * @config {String} version 版本信息
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onloaded} 载入完成回调函数
     * 
     * [hr]
     * 
     * @event  {onerror} 载入出错回调函数
     * @param  {Object}  错误信息
     * 
     */
    _j._$loadStyle = function(_url,_options){
        _p._$$StyleLoader._$allocate(_options)._$load(_url);
        return this;
    };
    /**
     * 载入样式队列<br/>
     * [code]
     *   var _j = nej.j;
     *   _j._$queueStyle(['http://123.163.com/a.css','http://123.163.com/b.css'],{
     *       onloaded:function(){
     *           // 载入成功的回调方法
     *       },
     *       onerror:function(_error){
     *           // 异常回调方法
     *       }
     *   });
     * [/code]
     * @api    {nej.j._$queueStyle}
     * @param  {Array}  样式队列
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @param  {Object} 可选配置参数，已处理的参数列表
     * @config {Number} timeout 超时时间,0表示禁止超时监测
     * @config {String} version 版本信息
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onloaded} 载入完成回调函数
     * 
     * [hr]
     * 
     * @event  {onerror} 载入出错回调函数
     * @param  {Object}  错误信息
     * 
     */
    _j._$queueStyle = function(_list,_options){
        _p._$$StyleLoader._$allocate(_options)._$queue(_list);
        return this;
    };
    /**
     * 载入HTML文件<br/>
     * [code]
     *   var _j = nej.j;
     *   _j._$loadHtml('http://123.163.com/a.html',{
     *       onloaded:function(){
     *           // 载入成功的回调方法
     *       },
     *       onerror:function(_error){
     *           // 异常回调方法
     *       }
     *   });
     * [/code]
     * @api    {nej.j._$loadHtml}
     * @param  {String} 文件地址
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {String} version 版本信息
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onloaded} 载入完成回调函数
     * 
     * [hr]
     * 
     * @event  {onerror} 载入出错回调函数
     * @param  {Object}  错误信息
     * 
     */
    _j._$loadHtml = function(_url,_options){
        _p._$$HtmlLoader._$allocate(_options)._$load(_url);
        return this;
    };
    /**
     * 载入HTML文件<br/>
     * [code]
     *   var _j = nej.j;
     *   _j._$loadText('http://123.163.com/a.txt',{
     *       onloaded:function(){
     *           // 载入成功的回调方法
     *       },
     *       onerror:function(_error){
     *           // 异常回调方法
     *       }
     *   });
     * [/code]
     * @api    {nej.j._$loadText}
     * @param  {String} 文件地址
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {String} version 版本信息
     * @return {nej.j}
     * 
     * [hr]
     * 载入完成回调函数
     * @event  {onloaded} 
     * 
     * [hr]
     * 载入出错回调函数
     * @event  {onerror} 
     * @param  {Object}  错误信息
     * 
     */
    _j._$loadText = function(_url,_options){
        _p._$$TextLoader._$allocate(_options)._$load(_url);
        return this;
    };
};
NEJ.define(
    '{lib}util/ajax/tag.js',[
    '{lib}util/ajax/loader/text.js',
    '{lib}util/ajax/loader/html.js',
    '{lib}util/ajax/loader/style.js',
    '{lib}util/ajax/loader/script.js'
],f);