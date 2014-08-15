/*
 * ------------------------------------------
 * 颜色执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/editor/command/card.js',
    '{lib}ui/editor/command/color.simple.js'
],function(NEJ,_k,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 颜色执行命令封装
     * @class   {nej.ut.cmd._$$Color} 颜色执行命令封装
     * @extends {nej.ui.cmd._$$CardCommand}
     * @param   {Object} _options 可选配置参数
     *
     */
    _p._$$Color = _k._$klass();
    _pro = _p._$$Color._$extend(_t0._$$CardCommand);
    /**
     * 卡片内容变化回调
     * @protected
     * @method {__onChange}
     * @param  {String} 颜色值
     * @return {Void}
     */
    _pro.__onChange = function(_color){
        this.__editor._$execCommand(this.__name,_color);
    };
    /**
     * 显示卡片
     * @protected
     * @method {__doShowCard}
     * @return {nej.ui._$$CardWrapper} 卡片实例
     */
    _pro.__doShowCard = function(){
        _i0._$$SimpleColorCard._$allocate(this.__fopt)._$show();
    };
    // regist command implemention
    _p._$$Color._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});