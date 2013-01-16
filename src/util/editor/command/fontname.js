/*
 * ------------------------------------------
 * 字体执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _i = _('nej.ui.cmd'),
        _p = _('nej.ut.cmd'),
        _proFontName;
    if (!!_p._$$FontName) return;
    /**
     * 字体执行命令封装
     * @class   {nej.ut.cmd._$$FontName} 字体执行命令封装
     * @extends {nej.ut.cmd._$$Font}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$FontName = NEJ.C();
      _proFontName = _p._$$FontName._$extend(_p._$$Font);
    /**
     * 命令名称
     * @type String
     */
    _p._$$FontName.command = 'fontName';
    /**
     * 显示卡片
     * @protected
     * @method {__doShowCard}
     * @return {Void}
     */
    _proFontName.__doShowCard = function(){
        _i._$$FontNameCard._$allocate(this.__fopt)._$show();
    };
    /**
     * 取提示信息
     * @protected
     * @method {__getFontText}
     * @param  {String} 实际值
     * @return {String} 提示信息
     */
    _proFontName.__getFontText = (function(){
        var _reg = /['"]/g;
        return function(_value){
            return _i._$$FontNameCard._$getText(
                      _value.replace(_reg,''))||_value;
        };
    })();
    // regist command implemention
    _p._$$FontName._$regist();
};
define('{lib}util/editor/command/fontname.js',
      ['{lib}util/editor/command/font.js'
      ,'{lib}ui/editor/command/fontname.js'],f);