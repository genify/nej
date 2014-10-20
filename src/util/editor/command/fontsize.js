/*
 * ------------------------------------------
 * 字号大小执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/fontsize */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/font',
    'ui/editor/command/fontsize'
],function(NEJ,_k,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 字号大小执行命令封装
     *
     * @class   module:util/editor/command/fontsize._$$FontSize
     * @extends module:util/editor/command/font._$$Font
     * @param   {Object} options - 可选配置参数
     */
    _p._$$FontSize = _k._$klass();
    _pro = _p._$$FontSize._$extend(_t0._$$Font);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/backcolor._$$FontSize.command
     */
    _p._$$FontSize.command = 'fontSize';
    /**
     * 显示卡片
     *
     * @protected
     * @method module:util/editor/command/fontsize._$$FontSize#__doShowCard
     * @return {Void}
     */
    _pro.__doShowCard = function(){
        _i0._$$FontSizeCard._$allocate(this.__fopt)._$show();
    };
    /**
     * 取提示信息
     *
     * @protected
     * @method module:util/editor/command/fontsize._$$FontSize#__getFontText
     * @param  {String} arg0 - 实际值
     * @return {String} 提示信息
     */
    _pro.__getFontText = function(_value){
        return _i0._$$FontSizeCard._$getText(_value)||'标准';
    };
    // regist command implemention
    _p._$$FontSize._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});