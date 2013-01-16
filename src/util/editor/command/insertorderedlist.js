/*
 * ------------------------------------------
 * 有序列表执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd');
    if (!!_p._$$InsertOrderedList) return;
    /**
     * 有序列表执行命令封装
     * @class   {nej.ut.cmd._$$InsertOrderedList} 有序列表执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$InsertOrderedList = NEJ.C();
    _p._$$InsertOrderedList._$extend(_p._$$SimpleCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$InsertOrderedList.command = 'insertorderedlist';
    // regist command implemention
    _p._$$InsertOrderedList._$regist();
};
define('{lib}util/editor/command/insertorderedlist.js',
      ['{lib}util/editor/command/simple.js'],f);