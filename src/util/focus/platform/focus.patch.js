/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    './focus.js',
    'base/event',
    'base/element'
],function(_h,_v,_e,_p,_o,_f,_r){
    // TR 2.0 - IE 6
    // TR 3.0 - IE 7
    // TR 4.0 - IE 8
    // TR 5.0 - IE 9
    // TR 6.0 - IE 10
    // TR 7.0 - IE 11
    
    // for ie7-
    NEJ.patch('TR<=3.0',function(){
        /**
         * 节点focus行为
         * @param  {String|Node} 节点
         * @param  {Number}      模式
         * @param  {String}      样式
         * @return {Void}
         */
        _h.__focusElement = (function(){
            // remove classname onblur
            var _onBlur = function(_clazz,_event){
                _e._$delClassName(
                    _v._$getElement(_event),_clazz
                );
            };
            return _h.__focusElement._$aop(
                function(_event){
                    // patch ie6-7 :focus
                    var _args = _event.args;
                    if (_args[1]!=1){
                        _v._$addEvent(
                            _args[0],'blur',
                            _onBlur._$bind(null,_args[2])
                        );
                        _args[1] = -1;
                    }
                }
            );
        })();
    });
    
    return _h;
});
