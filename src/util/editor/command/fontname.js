/*
 * ------------------------------------------
 * 字体执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/editor/command/font.js',
    '{lib}ui/editor/command/fontname.js'
],function(NEJ,_k,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 字体执行命令封装
     * @class   {nej.ut.cmd._$$FontName} 字体执行命令封装
     * @extends {nej.ut.cmd._$$Font}
     * @param   {Object} 可选配置参数
     *
     */
    _p._$$FontName = _k._$klass();
      _pro = _p._$$FontName._$extend(_t0._$$Font);
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
    _pro.__doShowCard = function(){
        _i0._$$FontNameCard._$allocate(this.__fopt)._$show();
    };
    /**
     * 取提示信息
     * @protected
     * @method {__getFontText}
     * @param  {String} 实际值
     * @return {String} 提示信息
     */
    _pro.__getFontText = (function(){
        var _reg = /['"]/g;
        return function(_value){
            if(!_value)
                return;
            return _i0._$$FontNameCard._$getText(
                      _value.replace(_reg,''))||_value;
        };
    })();
    // regist command implemention
    _p._$$FontName._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});