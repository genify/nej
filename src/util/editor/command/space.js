/*
 * ------------------------------------------
 * 空格执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _t = _('nej.ut'),
        _p = _('nej.ut.cmd'),
        _pro;
    if (!!_p._$$Blank) return;
    /**
     * 空格执行命令封装
     * @class   {nej.ut.cmd._$$Blank} 左对齐执行命令封装
     * @extends {nej.ut.cmd._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$Blank = NEJ.C();
    _pro = _p._$$Blank._$extend(_t._$$EditorCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$Blank.command = 'space';
    /**
     * 执行命令
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {Void}
     */
    _pro._$execute = function(){
        this.__editor._$execCommand('inserthtml','　');
        return this;
    };
    // regist command implemention
    _p._$$Blank._$regist();
};
NEJ.define(
    '{lib}util/editor/command/space.js',[
    '{lib}util/editor/command.js'
],f);