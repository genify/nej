/*
 * ------------------------------------------
 * 字号大小执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/editor/command/font.js',
    '{lib}ui/editor/command/fontsize.js'
],function(NEJ,_k,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 字号大小执行命令封装
     * @class   {nej.ut.cmd._$$FontSize} 字号大小执行命令封装
     * @extends {nej.ut.cmd._$$Font}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$FontSize = _k._$klass();
    _pro = _p._$$FontSize._$extend(_t0._$$Font);
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
    _pro.__doShowCard = function(){
        _i0._$$FontSizeCard._$allocate(this.__fopt)._$show();
    };
    /**
     * 取提示信息
     * @protected
     * @method {__getFontText}
     * @param  {String} 实际值
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