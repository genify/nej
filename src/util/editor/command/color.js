/*
 * ------------------------------------------
 * 颜色执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** ui/editor/command/color */
NEJ.define([
    'base/global',
    'base/klass',
    'util/editor/command/card',
    'ui/editor/command/simple'
],function(NEJ,_k,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 颜色执行命令封装
     *
     * @class   module:util/editor/command/color._$$Color
     * @extends module:util/editor/command/card._$$CardCommand
     * @param   {Object} _options - 可选配置参数
     *
     */
    _p._$$Color = _k._$klass();
    _pro = _p._$$Color._$extend(_t0._$$CardCommand);
    /**
     * 卡片内容变化回调
     *
     * @protected
     * @method module:util/editor/command/color._$$Color#__onChange
     * @param  {String} 颜色值
     * @return {Void}
     */
    _pro.__onChange = function(_color){
        this.__editor._$execCommand(this.__name,_color);
    };
    /**
     * 显示卡片
     *
     * @protected
     * @method module:util/editor/command/color._$$Color#__doShowCard
     * @return {module:ui/editor/command/simple._$$CardWrapper} 卡片实例
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