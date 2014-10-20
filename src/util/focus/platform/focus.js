/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    'base/event',
    'base/element'
],function(_v,_e,_p,_o,_f,_r){
    /**
     * 节点focus行为
     * @param  {String|Node} 节点
     * @param  {Number}      模式
     * @param  {String}      样式
     * @return {Void}
     */
    _p.__focusElement = (function(){
        // do blur check
        var _onBlur = function(_clazz,_event){
            var _element = _v._$getElement(_event);
            if (!_element.value)
                _e._$delClassName(_element,_clazz);
        };
        // do focus
        var _onFocus = function(_clazz,_event){
            _e._$addClassName(
                _v._$getElement(_event),_clazz);
        };
        return function(_element,_mode,_clazz){
            if (_mode==1){
                _v._$addEvent(
                    _element,'blur',
                    _onBlur._$bind(null,_clazz)
                );
            }
            if (_mode==1||_mode==-1){
                _v._$addEvent(
                    _element,'focus',
                    _onFocus._$bind(null,_clazz)
                );
            }
            // other do nothing, use css :focus
        };
    })();
    
    return _p;
});
