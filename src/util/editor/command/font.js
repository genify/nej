/*
 * ------------------------------------------
 * 字体/字号执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _e = _('nej.e'),
        _p = _('nej.ut.cmd'),
        _proFont;
    if (!!_p._$$Font) return;
    /**
     * 字体/字号执行命令封装
     * @class   {nej.ut.cmd._$$Font} 字体/字号执行命令封装
     * @extends {nej.ui.cmd._$$CardCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$Font = NEJ.C();
      _proFont = _p._$$Font._$extend(_p._$$CardCommand);
    /**
     * 取提示信息
     * @protected
     * @method {__getFontText}
     * @param  {String} 实际值
     * @return {String} 提示信息
     */
    _proFont.__getFontText = _f;
    /**
     * 字体字号选择回调
     * @protected
     * @method {__onChange}
     * @param  {Object} 大小信息
     * @return {Void}
     */
    _proFont.__onChange = function(_data){
        this.__editor._$execCommand(
            this.__name,_data.value||_data.name);
    };
    /**
     * 查询命令值
     * @method {_$queryValue}
     * @param  {Node} 命令按钮节点
     * @return {nej.ut.cmd._$$Font}
     */
    _proFont._$queryValue = function(_node){
        var _element = _e._$getByClassName(_node,
                       'js-t-'+_e._$getHtmlTemplateSeed())[0],
            _value = this.__getFontText(this
                         .__editor._$queryCommand(this.__name,'Value'));
        if (!_element||!_value) return this;
        _element.innerText = _value;
        return this;
    };
};
define('{lib}util/editor/command/font.js',
      ['{lib}util/editor/command/card.js'],f);