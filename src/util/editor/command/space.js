/*
 * ------------------------------------------
 * 空格执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/space */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 空格执行命令封装
     * @class   module:util/editor/command/space._$$Blank
     * @extends module:util/editor/command._$$EditorCommand
     * @param   {Object} options - 可选配置参数
     */
    _p._$$Blank = _k._$klass();
    _pro = _p._$$Blank._$extend(_t0._$$EditorCommand);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/space._$$Blank.command
     */
    _p._$$Blank.command = 'space';
    /**
     * 执行命令
     *
     * @method module:util/editor/command/space._$$Blank#_$execute
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