/*
 * ------------------------------------------
 * 斜体执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd'),
    	_t = NEJ.P('nej.ut');
    if (!!_p._$$Format) return;
    /**
     * 斜体执行命令封装
     * @class   {nej.ut.cmd._$$Format} 斜体执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$Format = NEJ.C();
    _pro = _p._$$Format._$extend(_t._$$EditorCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$Format.command = 'format';

    _pro._$execute = function(){
    	this.__editor._$setContentNoStyle();
    };
    // regist command implemention
    _p._$$Format._$regist();
};
NEJ.define('{lib}util/editor/command/format.js',
      ['{lib}util/editor/command.js'],f);