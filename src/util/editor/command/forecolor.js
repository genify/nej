/*
 * ------------------------------------------
 * 文字颜色执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/editor/command/color.js',
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 文字颜色执行命令封装
     * @class   {nej.ut.cmd._$$ForeColor} 文字颜色执行命令封装
     * @extends {nej.ui.cmd._$$Color}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    _p._$$ForeColor = _k._$klass();
    _pro = _p._$$ForeColor._$extend(_t0._$$Color);
    /**
     * 命令名称
     * @type String
     */
    _p._$$ForeColor.command = 'foreColor';
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__fopt.defaultColor = '#000';
    };
    // regist command implemention
    _p._$$ForeColor._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});