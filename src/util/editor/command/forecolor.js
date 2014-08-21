/*
 * ------------------------------------------
 * 文字颜色执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/forecolor */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/color',
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 文字颜色执行命令封装
     *
     * @class   module:util/editor/command/forecolor._$$ForeColor
     * @extends module:util/editor/command/color._$$Color
     * @param   {Object} options - 可选配置参数
     */
    _p._$$ForeColor = _k._$klass();
    _pro = _p._$$ForeColor._$extend(_t0._$$Color);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/forecolor._$$ForeColor.command
     */
    _p._$$ForeColor.command = 'foreColor';
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/editor/command/forecolor._$$ForeColor#__init
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