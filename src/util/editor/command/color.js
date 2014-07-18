/*
 * ------------------------------------------
 * 颜色执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _i = _('nej.ui.cmd'),
        _p = _('nej.ut.cmd'),
        _proColor;
    if (!!_p._$$Color) return;
    /**
     * 颜色执行命令封装
     * @class   {nej.ut.cmd._$$Color} 颜色执行命令封装
     * @extends {nej.ui.cmd._$$CardCommand}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$Color = NEJ.C();
      _proColor = _p._$$Color._$extend(_p._$$CardCommand);
    /**
     * 卡片内容变化回调
     * @protected
     * @method {__onChange}
     * @param  {String} 颜色值
     * @return {Void}
     */
    _proColor.__onChange = function(_color){
        this.__editor._$execCommand(this.__name,_color);
    };
    /**
     * 显示卡片
     * @protected
     * @method {__doShowCard}
     * @return {nej.ui._$$CardWrapper} 卡片实例
     */
    _proColor.__doShowCard = function(){
        _i._$$SimpleColorCard._$allocate(this.__fopt)._$show();
    };
    // regist command implemention
    _p._$$Color._$regist();
};
NEJ.define('{lib}util/editor/command/color.js',
          ['{lib}util/editor/command/card.js'
          ,'{lib}ui/editor/command/color.simple.js'],f);