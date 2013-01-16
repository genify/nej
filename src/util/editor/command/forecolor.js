/*
 * ------------------------------------------
 * 文字颜色执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd'),
        _proForeColor;
    if (!!_p._$$ForeColor) return;
    /**
     * 文字颜色执行命令封装
     * @class   {nej.ut.cmd._$$ForeColor} 文字颜色执行命令封装
     * @extends {nej.ui.cmd._$$Color}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$ForeColor = NEJ.C();
      _proForeColor = _p._$$ForeColor._$extend(_p._$$Color);
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
    _proForeColor.__init = function(){
        this.__supInit();
        this.__fopt['default'] = '#000'; 
    };
    // regist command implemention
    _p._$$ForeColor._$regist();
};
define('{lib}util/editor/command/forecolor.js',
      ['{lib}util/editor/command/color.js'],f);