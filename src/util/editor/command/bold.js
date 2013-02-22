/*
 * ------------------------------------------
 * 加粗执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd');
    if (!!_p._$$Bold) return;
    /**
     * 加粗执行命令封装
     * @class   {nej.ut.cmd._$$Bold} 加粗执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$Bold = NEJ.C();
    _p._$$Bold._$extend(_p._$$SimpleCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$Bold.command = 'bold';
    // regist command implemention
    _p._$$Bold._$regist();
};
NEJ.define('{lib}util/editor/command/bold.js',
      ['{lib}util/editor/command/simple.js'],f);