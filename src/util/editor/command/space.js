/*
 * ------------------------------------------
 * 空格执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/editor/command.js'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 空格执行命令封装
     * @class   {nej.ut.cmd._$$Blank} 左对齐执行命令封装
     * @extends {nej.ut.cmd._$$EditorCommand}
     * @param   {Object} 可选配置参数
     */
    _p._$$Blank = _k._$klass();
    _pro = _p._$$Blank._$extend(_t0._$$EditorCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$Blank.command = 'space';
    /**
     * 执行命令
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {Void}
     */
    _pro._$execute = function(){
        this.__editor._$execCommand('inserthtml','　');
    };
    // regist command implemention
    _p._$$Blank._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});