/*
 * ------------------------------------------
 * 有序列表执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/insertorderedlist */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/simple'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    /**
     * 有序列表执行命令封装
     *
     * @class   module:util/editor/command/insertorderedlist._$$InsertOrderedList
     * @extends module:util/editor/command/simple._$$SimpleCommand
     * @param   {Object} options - 可选配置参数
     */
    _p._$$InsertOrderedList = _k._$klass();
    _p._$$InsertOrderedList._$extend(_t0._$$SimpleCommand);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/insertorderedlist._$$InsertOrderedList.command
     */
    _p._$$InsertOrderedList.command = 'insertorderedlist';
    // regist command implemention
    _p._$$InsertOrderedList._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});