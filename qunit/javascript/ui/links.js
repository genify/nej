/*
 * ------------------------------------------
 * 超链接执行命令封装实现文件
 * @version  1.0
 * @author   luzhongfang(luzhongfang@corp.netease.com)
 * ------------------------------------------
 */

define(['{lib}util/editor/command/card.js'
		,'{lib}util/editor/command/link.js'],
function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _p = _('nej.ut2.cmd'),
        _i = _('nej.ui.cmd');
    if (!!_p._$$Link ) return;
    /**
     * 超链接执行命令封装
     * @class   {nej.ut.cmd._$$Link } 超链接执行命令封装
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$MyLink  = NEJ.C();
    var proto = _p._$$MyLink._$extend(nej.ut.cmd._$$Link);

    /*
     * 命令名称
     * @type {String}
     */
    _p._$$MyLink.command = 'link';
    
    // regist command implemention
    _p._$$MyLink._$regist();
});