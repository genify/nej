/*
 * ------------------------------------------
 * 下划线执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/underline */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/simple'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    /**
     * 下划线执行命令封装
     *
     * @class   module:util/editor/command/underline._$$UnderLine
     * @extends module:util/editor/command/simple._$$SimpleCommand
     * @param   {Object} options - 可选配置参数
     */
    _p._$$UnderLine = _k._$klass();
    _p._$$UnderLine._$extend(_t0._$$SimpleCommand);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/underline._$$UnderLine.command
     */
    _p._$$UnderLine.command = 'underline';
    // regist command implemention
    _p._$$UnderLine._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});