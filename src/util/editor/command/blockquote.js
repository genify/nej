/*
 * ------------------------------------------
 * 引用执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _h = _('nej.h'),
        _t = _('nej.ut'),
        _p = _('nej.ut.cmd'),
        _proBlockquote;
    if (!!_p._$$Blockquote) return;
    /**
     * 引用执行命令封装
     * @class   {nej.ut.cmd._$$Blockquote} 引用执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$Blockquote = NEJ.C();
    _proBlockquote = _p._$$Blockquote._$extend(_t._$$EditorCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$Blockquote.command = 'blockquote';
    
    /**
     * 执行命令
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {nej.ut.cmd._$$Blockquote}
     */
    _proBlockquote._$execute = function(_options){
        this.__editor._$execCommand('superscript',false,1);
        return this;
    };
    // regist command implemention
    _p._$$Blockquote._$regist();
};
define('{lib}util/editor/command/blockquote.js',
      ['{lib}util/editor/command.js'],f);