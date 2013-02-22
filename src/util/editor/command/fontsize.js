/*
 * ------------------------------------------
 * 字号大小执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _i = _('nej.ui.cmd'),
        _p = _('nej.ut.cmd'),
        _proFontSize;
    if (!!_p._$$FontSize) return;
    /**
     * 字号大小执行命令封装
     * @class   {nej.ut.cmd._$$FontSize} 字号大小执行命令封装
     * @extends {nej.ut.cmd._$$Font}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$FontSize = NEJ.C();
      _proFontSize = _p._$$FontSize._$extend(_p._$$Font);
    /**
     * 命令名称
     * @type String
     */
    _p._$$FontSize.command = 'fontSize';
    /**
     * 显示卡片
     * @protected
     * @method {__doShowCard}
     * @return {Void}
     */
    _proFontSize.__doShowCard = function(){
        _i._$$FontSizeCard._$allocate(this.__fopt)._$show();
    };
    /**
     * 取提示信息
     * @protected
     * @method {__getFontText}
     * @param  {String} 实际值
     * @return {String} 提示信息
     */
    _proFontSize.__getFontText = function(_value){
        return _i._$$FontSizeCard._$getText(_value)||'标准';
    };
    // regist command implemention
    _p._$$FontSize._$regist();
};
NEJ.define('{lib}util/editor/command/fontsize.js',
      ['{lib}util/editor/command/font.js'
      ,'{lib}ui/editor/command/fontsize.js'],f);