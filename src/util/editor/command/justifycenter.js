/*
 * ------------------------------------------
 * 居中对齐执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/editor/command/justifycenter */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/simple'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    /**
     * 居中对齐执行命令封装
     *
     * @class   module:util/editor/command/justifycenter._$$JustifyCenter
     * @extends module:util/editor/command/simple._$$SimpleCommand
     * @param   {Object} options - 可选配置参数
     */
    _p._$$JustifyCenter = _k._$klass();
    _p._$$JustifyCenter._$extend(_t0._$$SimpleCommand);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/justifycenter._$$JustifyCenter.command
     */
    _p._$$JustifyCenter.command = 'justifyCenter';
    // regist command implemention
    _p._$$JustifyCenter._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});