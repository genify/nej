/*
 * ------------------------------------------
 * 加粗执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd');
    if (!!_p._$$SuperScript) return;
    /**
     * 加粗执行命令封装
     * @class   {nej.ut.cmd._$$SuperScript} 加粗执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$SuperScript = NEJ.C();
    _p._$$SuperScript._$extend(_p._$$SimpleCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$SuperScript.command = 'superscript';
    // regist command implemention
    _p._$$SuperScript._$regist();
};
define('{lib}util/editor/command/superscript.js',
      ['{lib}util/editor/command/simple.js'],f);