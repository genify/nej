/*
 * ------------------------------------------
 * 字体执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/fontname */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/font',
    'ui/editor/command/fontname'
],function(NEJ,_k,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 字体执行命令封装
     * @class   module:util/editor/command/fontname._$$FontName
     * @extends module:util/editor/command/font._$$Font
     * @param   {Object} 可选配置参数
     *
     */
    _p._$$FontName = _k._$klass();
      _pro = _p._$$FontName._$extend(_t0._$$Font);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/fontname._$$FontName.command
     */
    _p._$$FontName.command = 'fontName';
    /**
     * 显示卡片
     *
     * @protected
     * @method module:util/editor/command/fontname._$$FontName#__doShowCard
     * @return {Void}
     */
    _pro.__doShowCard = function(){
        _i0._$$FontNameCard._$allocate(this.__fopt)._$show();
    };
    /**
     * 取提示信息
     *
     * @protected
     * @method module:util/editor/command/fontname._$$FontName#__getFontText
     * @param  {String} arg0 - 实际值
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