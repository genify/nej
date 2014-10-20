/*
 * ------------------------------------------
 * 无序列表执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/insertunorderedlist */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/simple'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    /**
     * 无序列表执行命令封装
     *
     * @class   module:util/editor/command/insertunorderedlist._$$InsertUnorderedList
     * @extends module:util/editor/command/simple._$$SimpleCommand
     * @param   {Object} options - 可选配置参数
     */
    _p._$$InsertUnorderedList = _k._$klass();
    _p._$$InsertUnorderedList._$extend(_t0._$$SimpleCommand);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/insertunorderedlist._$$SimpleCommand.command
     */
    _p._$$InsertUnorderedList.command = 'insertunorderedlist';
    // regist command implemention
    _p._$$InsertUnorderedList._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});