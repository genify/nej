/*
 * ------------------------------------------
 * JSON-RPC协议实现文件
 * http://www.jsonrpc.org/specification
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _j = _('nej.j');
    /**
     * 开始批处理请求
     * @return {Void}
     */
    _j._$beginJSRPC = function(){
        
    };
    /**
     * 结束请求批处理，正式发送请求
     * @return {Void}
     */
    _j._$endJSRPC = function(){
        
    };
    /**
     * 使用JSON-RPC协议载入数据<br/>
     * 
     * 脚本举例
     * [code]
     *   var j = nej.j;
     *   j._$requestByDWR('LogBean.log',
     *      {path:'http://123.163.com/webmail/dwr/call/plaincall/',
     *       script:true,param:{},onload:function(data){
     *           // 正常回调方法
     *       },onerror:function(error){
     *           // 异常回调
     *       },onbeforerequest:function(data){
     *          // 请求发送前对请求数据进行处理
     *       }
     *       });
     * [/code]
     * @api    {nej.j._$requestByJSRPC}
     * @param  {String}  请求地址,格式为class.method
     * @param  {Object}  可选配置参数,已处理参数列表如下：
     * @config {String}  path    请求路径,默认为/JSON-RPC/
     * @config {Array}   param   参数列表,不传或空数组均作为无参数处理
     * @config {Boolean} script  使用脚本方式载入
     * @config {Boolean} sync    是否同步请求,使用脚本载入方式忽略此属性
     * @config {String}  method  请求方式,GET/POST,使用脚本载入方式忽略此属性
     * @config {Number}  timeout 请求超时时间
     * @config {Object}  headers 头信息,批处理请求合并所有头信息,同名的头信息后面请求覆盖前面请求
     * @return {nej.j}
     * 
     * [hr]
     * 载入完成回调函数
     * @event  {onload} 
     * @param  {Object} 返回的数据
     * 
     * [hr]
     * 载入出错回调函数
     * @event  {onerror} 
     * @param  {Object}  错误信息
     * 
     * [hr]
     * 请求之前对数据处理回调
     * @event  {onbeforerequest} 
     */
    _j._$requestByJSRPC = function(_options){
        
    };
};
NEJ.define(
    '{lib}util/ajax/json.rpc.js',[
    '{lib}util/encode/json.js',
    '{lib}util/ajax/xdr.js'
],f);
