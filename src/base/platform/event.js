/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/util',
    'base/platform'
],function(_u,_m,_p,_o,_f,_r){
    /**
     * 验证事件信息
     * @param  {Node}     节点
     * @param  {String}   事件类型
     * @param  {Function} 处理函数
     * @return {Object}   验证后事件信息 type/handler
     */
    _p.__checkEvent = (function(){
            // need change event name
        var _tmap = {
                touchstart:'mousedown',
                touchmove:'mousemove',
                touchend:'mouseup'
            },
            // need prefix
            _pfix = _m._$KERNEL.prefix,
            _emap = {
                transitionend:'TransitionEnd',
                animationend:'AnimationEnd',
                animationstart:'AnimationStart',
                animationiteration:'AnimationIteration'
            };
        var _fmap = {
            enter:function(_element,_type,_handler){
                return {
                    type:'keypress',
                    handler:function(_event){
                        if (_event.keyCode===13){
                            _handler.call(_element,_event);
                        }
                    }
                };
            }
        };
        var _doPrefix = function(_name){
            return (_pfix.evt||_pfix.pro)+_name;
        };
        return function(_element,_type,_handler){
            var _result = {
                type:_type,
                handler:_handler
            };
            if (!(('on'+_type) in _element)){
                // check name convert
                var _name = _tmap[_type];
                if (!!_name){
                    _result.type = _name;
                    return _result;
                }
                // check prefix complete
                var _name = _emap[_type];
                if (!!_name){
                    _result.type = _doPrefix(_name);
                    return _result;
                }
                // check event update
                var _func = _fmap[_type];
                if (!!_func){
                    return _func.apply(null,arguments);
                }
            }
            return _result;
        };
    })();
    /**
     * 添加事件
     * @param  {Node}     节点
     * @param  {String}   事件
     * @param  {Function} 处理函数
     * @param  {Boolean}  是否捕捉阶段
     * @return {Void}
     */
    _p.__addEvent = function(){
        var _args = arguments;
        if (DEBUG){
            if (!(('on'+_args[1]) in _args[0])){
                console.log('not support event['+_args[1]+'] for '+_args[0]);
            }
        }
        _args[0].addEventListener(
            _args[1],_args[2],_args[3]
        );
    };
    /**
     * 删除事件
     * @param  {Node}     节点
     * @param  {String}   事件
     * @param  {Function} 处理函数
     * @param  {Boolean}  是否捕捉阶段
     * @return {Void}
     */
    _p.__delEvent = function(){
        var _args = arguments;
        _args[0].removeEventListener(
            _args[1],_args[2],_args[3]
        );
    };
    /**
     * 触发对象的某个事件
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      鼠标事件类型
     * @return {Void}
     */
    _p.__dispatchEvent = function(_element,_type,_options){
        var _event = document.createEvent('Event');
        _event.initEvent(_type,!0,!0);
        _u._$merge(_event,_options);
        _element.dispatchEvent(_event);
    };
    
    return _p;
});
