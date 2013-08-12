/*
 * ------------------------------------------
 * 颜色选择卡片实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _i = _('nej.ui'),
        _p = _('nej.ui.cmd'),
        _proComplexColorCard,
        _supComplexColorCard;
    // ui css seed
    if (!!_p._$$ComplexColorCard) return;
    var _seed_css = _e._$pushCSSText('.#<uispace>{width:238px;padding:5px 0 8px;border:1px solid #9FAC87;}');
    /**
     * 颜色选择卡片
     * @class   {nej.ui.cmd._$$ComplexColorCard} 颜色选择卡片
     * @extends {nej.ui.cmd._$$ColorCard}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} color 颜色值
     * 
     * [hr]
     * 
     * @event  {onchange} 颜色选中回调函数
     * @param  {String}   颜色值
     * 
     */
    _p._$$ComplexColorCard = NEJ.C();
      _proComplexColorCard = _p._$$ComplexColorCard._$extend(_p._$$ColorCard);
    /**
     * 取取色器实例
     * @return {Void}
     */
    _proComplexColorCard.__getColorPicker = function(){
        this.__copt.clazz = _seed_css;
        return _i._$$ComplexColorPick._$allocate(this.__copt);
    };
};
NEJ.define('{lib}ui/editor/command/color.complex.js',
          ['{lib}ui/editor/command/color.js'
          ,'{lib}ui/colorpick/colorpick.complex.js'],f);