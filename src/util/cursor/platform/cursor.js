/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    'base/element',
    'base/platform'
],function(_e,_m,_p,_o,_f,_r){
    /**
     * 设置光标位置
     * @param  {String|Node} TEXTAREA节点
     * @param  {Object}      光标的位置信息
     * @return {Void}
     */
    _p.__setCursorPosition = function(_textarea,_position){
        _textarea.selectionEnd = _position.end||0;
        _textarea.selectionStart = _position.start||0;
        _textarea.focus();
    };
    /**
     * 取光标位置
     * @param  {String|Node} TEXTAREA节点
     * @return {Void}
     */
    _p.__getCursorPosition = function(_textarea){
        _textarea.focus();
        return {
            end:_textarea.selectionEnd,
            start:_textarea.selectionStart
        };
    };
    /**
     * 取光标像素位置
     * @param  {Node}   输入节点
     * @return {Object} 光标像素位置
     */
    _p.__getCursorPXPosition = function(_input){
        var _div = document.createElement('div');
        _e._$style(_div,{
            position:'absolute',
            visibility:'hidden',
            whiteSpace:'pre-wrap',
            appearance:'textarea',
            font:_e._$getStyle(_input,'font'),
            display:_e._$getStyle(_input,'display'),
            padding:_e._$getStyle(_input,'padding'),
            wordWrap:_e._$getStyle(_input,'wordWrap'),
            textAlign:_e._$getStyle(_input,'textAlign'),
            letterSpacing:_e._$getStyle(_input,'letterSpacing'),
            top:0,
            left:0,
            width:_input.clientWidth+'px',
            height:_input.clientHeight+'px'
        });
        _div.innerText = _input.value;
        var _span = document.createElement('span');
        _div.appendChild(_span);
        document.body.appendChild(_div);
        var _ret = {
            width:0,
            top:_span.offsetTop,
            left:_span.offsetLeft,
            height:_span.offsetHeight
        };
        _e._$remove(_div);
        return _ret;
    };
    
    return _p;
});
