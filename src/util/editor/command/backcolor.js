/*
 * ------------------------------------------
 * 背景色执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut.cmd'),
        _proBackColor;
    if (!!_p._$$BackColor) return;
    /**
     * 背景色执行命令封装
     * @class   {nej.ut.cmd._$$BackColor} 背景色执行命令封装
     * @extends {nej.ui.cmd._$$Color}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$BackColor = NEJ.C();
      _proBackColor = _p._$$BackColor._$extend(_p._$$Color);
    /**
     * 命令名称
     * @type String
     */
    _p._$$BackColor.command = 'hiliteColor';
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proBackColor.__init = function(){
        this.__supInit();
        this.__fopt['default'] = '#fff'; 
    };
    // regist command implemention
    _p._$$BackColor._$regist();
};
define('{lib}util/editor/command/backcolor.js',
      ['{lib}util/editor/command/color.js'],f);