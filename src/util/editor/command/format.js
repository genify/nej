/*
 * ------------------------------------------
 * 斜体执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/editor/command.js'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    /**
     * 斜体执行命令封装
     * @class   {nej.ut.cmd._$$Format} 斜体执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$Format = _k._$klass();
    _pro = _p._$$Format._$extend(_t0._$$EditorCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$Format.command = 'format';

    _pro._$execute = function(){
        this.__editor._$setContentNoStyle();
    };
    // regist command implemention
    _p._$$Format._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});