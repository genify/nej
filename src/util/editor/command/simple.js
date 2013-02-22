/*
 * ------------------------------------------
 * 简易命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _t = _('nej.ut'),
        _p = _('nej.ut.cmd'),
        _proSimpleCommand;
    if (!!_p._$$SimpleCommand) return;
    /**
     * 简易命令封装
     * @class   {nej.ut.cmd._$$SimpleCommand} 简易命令封装
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$SimpleCommand = NEJ.C();
      _proSimpleCommand = _p._$$SimpleCommand._$extend(_t._$$EditorCommand);
    /**
     * 执行命令
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {nej.ut.cmd._$$SimpleCommand}
     */
    _proSimpleCommand._$execute = function(){
        this.__editor._$execCommand(this.__name);
        return this;
    };
    /**
     * 查询命令是否已经执行
     * @method {_$queryState}
     * @return {Boolean} 是否已经被执行，返回null表示不做处理
     */
    _proSimpleCommand._$queryState = function(){
        return this.__editor._$queryCommand(this.__name,'State');
    };
};
NEJ.define('{lib}util/editor/command/simple.js',
      ['{lib}util/editor/command.js'],f);