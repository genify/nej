/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    './cursor.js',
    'base/platform',
    'base/element'
],function(_h,_m,_e,_p,_o,_f,_r){
    // TR 2.0 - IE 6
    // TR 3.0 - IE 7
    // TR 4.0 - IE 8
    // TR 5.0 - IE 9
    // TR 6.0 - IE 10
    // TR 7.0 - IE 11
    
    // for ie
    NEJ.patch('TR',function(){
        /**
         * 取光标像素位置
         * @param  {Node}   输入节点
         * @return {Object} 光标像素位置
         */
        _h.__getCursorPXPosition = function(_input){
            _input.focus();
            var _range = document.selection.createRange(),
                _bpage = _e._$getPageBox(),
                _offset = _e._$offset(_input);
            return {
                top:_range.boundingTop-_offset.y+_bpage.scrollTop,
                left:_range.boundingLeft-_offset.x+_bpage.scrollLeft,
                width:_range.boundingWidth,
                height:_range.boundingHeight
            };
        };
    });
    // for ie8-
    NEJ.patch('TR<=4.0',function(){
        /**
         * 设置光标位置
         * @param  {String|Node} TEXTAREA节点
         * @param  {Object}      光标的位置信息
         * @return {Void}
         */
        _h.__setCursorPosition = function(_textarea,_position){
            var _range = _textarea.createTextRange();
            _range.collapse(!0);
            _range.moveStart('character',_position.start);
            _range.moveEnd('character',_position.end-_position.start);
            _range.select();
            _textarea.focus();
        };
        /**
         * 取光标位置
         * @param  {String|Node} TEXTAREA节点
         * @return {Void}
         */
        _h.__getCursorPosition = function(_textarea){
            var _range0 = document.selection.createRange();
            // create in textarea object and match to document.selection
            var _range1 = _textarea.createTextRange();
            _range1.moveToBookmark(_range0.getBookmark());
            // create textrange object for left amount of textarea & align them
            var _range2 = _textarea.createTextRange();
            _range2.collapse(!0);
            _range2.setEndPoint("EndToStart",_range1);
            // dump start and end
            var _start = _range2.text.length;
            return {
                start:_start,
                end:_start+_range0.text.length
            };
        };
    });
    
    return _h;
});
