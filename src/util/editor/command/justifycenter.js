/*
 * ------------------------------------------
 * 居中对齐执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd');
    if (!!_p._$$JustifyCenter) return;
    /**
     * 居中对齐执行命令封装
     * @class   {nej.ut.cmd._$$JustifyCenter} 居中对齐执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$JustifyCenter = NEJ.C();
    _p._$$JustifyCenter._$extend(_p._$$SimpleCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$JustifyCenter.command = 'justifyCenter';
    // regist command implemention
    _p._$$JustifyCenter._$regist();
};
NEJ.define('{lib}util/editor/command/justifycenter.js',
      ['{lib}util/editor/command/simple.js'],f);