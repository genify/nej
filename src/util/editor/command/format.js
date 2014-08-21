/*
 * ------------------------------------------
 * 清除样式命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/format */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    /**
     * 清除样式命令封装
     *
     * @class   module:util/editor/command/format._$$Format
     * @extends module:util/editor/command._$$EditorCommand
     * @param   {Object} 可选配置参数
     */
    _p._$$Format = _k._$klass();
    _pro = _p._$$Format._$extend(_t0._$$EditorCommand);
    /**
     * 命令名称
     * @const {String} module:util/editor/command/format._$$Format.command
     */
    _p._$$Format.command = 'format';

    /**
     * 执行命令
     *
     * @method  module:util/editor/command/format._$$Format#_$execute
     * @return {Void}
     */
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