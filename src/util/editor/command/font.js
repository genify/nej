/*
 * ------------------------------------------
 * 字体/字号执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}util/editor/command/card.js',
    '{lib}util/template/jst.js',
],function(NEJ,_k,_e,_t0,_t1,_p,_o,_f,_r){
    var _pro;
    /**
     * 字体/字号执行命令封装
     * @class   {nej.ut.cmd._$$Font} 字体/字号执行命令封装
     * @extends {nej.ui.cmd._$$CardCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$Font = _k._$klass();
    _pro = _p._$$Font._$extend(_t0._$$CardCommand);
    /**
     * 取提示信息
     * @protected
     * @method {__getFontText}
     * @param  {String} 实际值
     * @return {String} 提示信息
     */
    _pro.__getFontText = _f;
    /**
     * 字体字号选择回调
     * @protected
     * @method {__onChange}
     * @param  {Object} 大小信息
     * @return {Void}
     */
    _pro.__onChange = function(_data){
        this.__editor._$execCommand(
            this.__name,_data.value||_data.name);
    };
    /**
     * 查询命令值
     * @method {_$queryValue}
     * @param  {Node} 命令按钮节点
     * @return {Void}
     */
    _pro._$queryValue = function(_node){
        var _element = _e._$getByClassName(_node,
                       'js-t-'+_t1._$getHtmlTemplateSeed())[0],
            _value = this.__getFontText(this
                         .__editor._$queryCommand(this.__name,'Value'));
        if (!_element||!_value) return;
        _element.innerText = _value;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});