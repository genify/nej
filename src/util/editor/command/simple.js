/*
 * ------------------------------------------
 * 简易命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/simple */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 简易命令封装
     *
     * @class   module:util/editor/command/simple._$$SimpleCommand
     * @extends module:util/editor/command._$$EditorCommand
     * @param   {Object} options - 可选配置参数
     *
     */
    _p._$$SimpleCommand = _k._$klass();
      _pro = _p._$$SimpleCommand._$extend(_t0._$$EditorCommand);
    /**
     * 执行命令
     *
     * @method module:util/editor/command/simple._$$SimpleCommand#_$execute
     * @return {Void}
     */
    _pro._$execute = function(){
        this.__editor._$execCommand(this.__name);
    };
    /**
     * 查询命令是否已经执行
     *
     * @method module:util/editor/command/simple._$$SimpleCommand#_$queryState
     * @return {Boolean} 是否已经被执行，返回null表示不做处理
     */
    _pro._$queryState = function(){
        return this.__editor._$queryCommand(this.__name,'State');
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});