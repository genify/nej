/*
 * ------------------------------------------
 * 简易命令封装实现文件
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
     * 简易命令封装
     * @class   {nej.ut.cmd._$$SimpleCommand} 简易命令封装
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    _p._$$SimpleCommand = _k._$klass();
      _pro = _p._$$SimpleCommand._$extend(_t0._$$EditorCommand);
    /**
     * 执行命令
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {Void}
     */
    _pro._$execute = function(){
        this.__editor._$execCommand(this.__name);
    };
    /**
     * 查询命令是否已经执行
     * @method {_$queryState}
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