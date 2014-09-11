/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    './at.js',
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
    
    return _h;
});
