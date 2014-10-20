/*
 * ------------------------------------------
 * 输入框光标相关接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/cursor/cursor */
NEJ.define([
    'base/global',
    'base/element',
    'base/util',
    'base/chain',
    '{platform}cursor.js'
],function(NEJ,_e,_u,_x,_h,_p,_o,_f,_r){
    var _y = {};
    /**
     * 设置/获取光标位置在TEXTAREA中的位置
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'util/cursor/cursor'
     *   ],function(_e){
     *       // 设置光标选中内容
     *       _e._$cursor('xxx',{start:5,end:10});
     *       // 设置光标位置
     *       _e._$cursor('xxx',8);
     *
     *       // 获取光标位置
     *       // _position.start 光标起始位置
     *       // _position.end   光标结束位置
     *       var _position = _e._$cursor('xxx');
     *   });
     * ```
     *
     * @method   module:util/cursor/cursor._$cursor
     * @param    {String|Node}   arg0  - TEXTAREA或者INPUT节点
     * @param    {Number|Object} arg1  - 待设置光标的位置，如果起始位置和结束位置一致则输入数值即可
     * @property {Number}        start - 起始位置
     * @property {Number}        end   - 结束位置，没有end则表示与start相同
     * @return   {Object}                光标位置，{start:0,end:10}
     */
    /**
     * @method CHAINABLE._$cursor
     * @see module:util/cursor/cursor._$cursor
     */
    _p._$cursor =
    _y._$cursor = function(_textarea,_options){
        _textarea = _e._$get(_textarea);
        if (!_textarea){
            return {start:0,end:0};
        }
        // position
        if (_u._$isNumber(_options)){
            _options = {
                start:_options,
                end:_options
            };
        }
        if (_options!=null){
            if (_options.end==null){
                _options.end = _options.start||0;
            }
            _h.__setCursorPosition(_textarea,_options);
        }else{
            _options = _h.__getCursorPosition(_textarea);
        }
        return _options;
    };
    /**
     * 取输入框光标相对于输入框左上角像素位置
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cursor/cursor'
     * ],function(_e){
     *     // 返回 {top:10,left:20,width:30,height:20}
     *     var _cord = _e._$coordinate('input-id');
     * 
     *     // 返回 {top:10,left:20,width:30,height:20}
     *     var _cord = _e._$coordinate('textarea-id');
     * });
     * ``
     * 
     * @method module:util/cursor/cursor._$coordinate
     * @param  {Node|String} arg0 - 输入节点
     * @return {Object}             光标像素坐标，如 {top:10,left:20,width:30,height:20}
     */
    /**
     * @method CHAINABLE._$coordinate
     * @see module:util/cursor/cursor._$coordinate
     */
    _p._$coordinate = 
    _y._$coordinate = function(_input){
        _input = _e._$get(_input);
        if (!_input){
            return {
                top:0,
                left:0,
                width:0,
                height:0
            };
        }
        return _h.__getCursorPXPosition(_input);
    };
    // for chainable
    _x._$merge(_y);
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }
    
    return _p;
});
