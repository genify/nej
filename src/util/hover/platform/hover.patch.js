/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author
 * ------------------------------------------
 */
NEJ.define([
    './hover.js',
    'base/event'
],function(_h,_v,_p,_o,_f,_r){
    // TR 2.0 - IE 6
    // TR 3.0 - IE 7
    // TR 4.0 - IE 8
    // TR 5.0 - IE 9
    // TR 6.0 - IE 10
    // TR 7.0 - IE 11

    // for ie6-
    NEJ.patch('TR<=2.0',function(){
        var _cache = {};
        // enter element
        var _doEnter = function(_event){
            var _element = _event.srcElement,
                _class = _cache[_element.id],
                _name = _element.className;
            if (_name.indexOf(_class)<0){
                _element.className += ' '+_class;
            }
        };
        // leave element
        var _doLeave = function(_event){
            var _element = _event.srcElement,
                _class = _cache[_element.id],
                _name = _element.className||'';
            if (_name.indexOf(_class)>=0){
                _element.className = _name.replace(_class,'').trim();
            }
        };
        /**
         * 节点hover行为
         * @param  {Node}   节点
         * @param  {String} 样式，默认为js-hover
         * @return {Void}
         */
        _h.__hoverElement = function(_element,_class){
            var _id = _element.id;
            if (!!_cache[_id]) return;
            // hover element
            _cache[_id] = _class;
            _v._$addEvent(
                _id,'mouseenter',_doEnter
            );
            _v._$addEvent(
                _id,'mouseleave',_doLeave
            );
        };
        /**
         * 移除节点hover行为
         * @param  {String} 节点ID
         * @return {Void}
         */
        _h.__unhoverElement = function(_id){
            if (!_cache[_id]) return;
            delete _cache[_id];
            _v._$delEvent(
                _id,'mouseenter',_doEnter
            );
            _v._$delEvent(
                _id,'mouseleave',_doLeave
            );
        };
    });

    return _h;
});
