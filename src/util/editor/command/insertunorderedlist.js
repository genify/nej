/*
 * ------------------------------------------
 * 无序列表执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd');
    if (!!_p._$$InsertUnorderedList) return;
    /**
     * 无序列表执行命令封装
     * @class   {nej.ut.cmd._$$InsertUnorderedList} 无序列表执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$InsertUnorderedList = NEJ.C();
    _p._$$InsertUnorderedList._$extend(_p._$$SimpleCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$InsertUnorderedList.command = 'insertunorderedlist';
    // regist command implemention
    _p._$$InsertUnorderedList._$regist();
};
NEJ.define('{lib}util/editor/command/insertunorderedlist.js',
      ['{lib}util/editor/command/simple.js'],f);