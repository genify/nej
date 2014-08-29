/*
 * ------------------------------------------
 * 引用执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/editor/command/blockquote */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 引用执行命令封装
     *
     * @class   module:util/editor/command/blockquote._$$Blockquote
     * @extends module:util/editor/command._$$SimpleCommand
     * @param   {Object} options - 可选配置参数
     */
    _p._$$Blockquote = _k._$klass();
    _pro = _p._$$Blockquote._$extend(_t0._$$EditorCommand);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/blockquote._$$Blockquote.command
     */
    _p._$$Blockquote.command = 'blockquote';

    /**
     * 执行命令
     *
     * @method module:util/editor/command/blockquote._$$Blockquote#_$execute
     * @param  {Object} options - 执行参数
     * @return {Void}
     */
    _pro._$execute = function(_options){
        this.__editor._$execCommand('superscript',false,1);
    };
    // regist command implemention
    _p._$$Blockquote._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});