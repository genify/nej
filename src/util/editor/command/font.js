/*
 * ------------------------------------------
 * 字体/字号执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/font */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'util/editor/command/card',
    'util/template/jst'
],function(NEJ,_k,_e,_t0,_t1,_p,_o,_f,_r){
    var _pro;
    /**
     * 字体/字号执行命令封装
     *
     * @class   module:util/editor/command/font._$$Font
     * @extends module:util/editor/command/card._$$CardCommand
     * @param   {Object} arg0 - 可选配置参数
     */
    _p._$$Font = _k._$klass();
    _pro = _p._$$Font._$extend(_t0._$$CardCommand);
    /**
     * 取提示信息
     *
     * @abstract
     * @method module:util/editor/command/font._$$Font#__getFontText
     * @param  {String} 实际值
     * @return {String} 提示信息
     */
    _pro.__getFontText = _f;
    /**
     * 字体字号选择回调
     *
     * @protected
     * @method module:util/editor/command/font._$$Font#__onChange
     * @param  {Object} data - 大小信息
     * @return {Void}
     */
    _pro.__onChange = function(_data){
        this.__editor._$execCommand(
            this.__name,_data.value||_data.name);
    };
    /**
     * 查询命令值
     *
     * @method module:util/editor/command/font._$$Font#_$queryValue
     * @param  {Node} node - 命令按钮节点
     * @return {Void}
     */
    _pro._$queryValue = function(_node){
        var _element = _e._$getByClassName(_node,
                       'js-t-'+_t1._$seed())[0],
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