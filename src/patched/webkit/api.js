var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.webkit) return;
    /**
     * 检查事件类型
     * @param  {Node}   节点
     * @param  {String} 事件类型
     * @return {String} 变化后的事件类型
     */
    _h.__checkEventType = (function(){
        var _emap = {
            mouseenter:'mouseover',
            mouseleave:'mouseout'
        };
        return _h.__checkEventType._$aop(
            _h.__checkEventTypeWithConf._$bind(_h,_emap)
        );
    })();
    /**
     * 检查事件执行函数
     * @param  {String}   事件类型
     * @param  {Function} 事件执行函数
     * @param  {Node}     事件添加节点
     * @return {Function} 变化后的事件执行函数
     */
    _h.__checkEventHandler = (function(){
        var _cache = {};
        var _doCheckElement = function(_id,_element){
            return _id==_element.id;
        };
        var _doCheckCache = function(_id,_state,_event){
            // clear out delay
            var _key = _id+'-timer';
            _cache[_key] = window.clearTimeout(
                _cache[_key]
            );
            // check element
            var _element = _v._$getElement(
                _event,_doCheckElement._$bind(null,_id)
            );
            if (!_element) return;
            _v._$stopBubble(_event);
            if (_cache[_id]!=_state){
                _cache[_id] = _state;
                return _element;
            }
        };
        var _doMouseEnter = function(_id,_handler,_event){
            var _element = _doCheckCache(_id,'over',_event);
            if (!!_element){
                _handler.call(_element,_event);
            }
        };
        var _doMouseLeave = function(_id,_handler,_event){
            var _element = _doCheckCache(_id,'out',_event);
            if (!!_element){
                // delay mouseout event
                _cache[_id+'-timer'] = window.setTimeout(
                    _doMouseLeaveCheck._$bind(
                        null,_id,_handler,
                        NEJ.X({},_event)
                    ),50
                );
            }
        };
        var _doMouseLeaveCheck = function(_id,_handler,_event){
            delete _cache[_id+'-timer'];
            if (_cache[_id]=='out'){
                var _element = _e._$get(_id);
                _handler.call(_element,_event);
            }
        };
        return _h.__checkEventHandler._$aop(function(_event){
            var _args = _event.args,
                _type = _args[0],
                _handler = _args[1],
                _id = _e._$id(_args[2]);
            switch(_type){
                case 'mouseover':
                    _event.stopped = !0;
                    _event.value = _doMouseEnter._$bind(
                        null,_id,_handler
                    );
                break;
                case 'mouseout':
                    _event.stopped = !0;
                    _event.value = _doMouseLeave._$bind(
                        null,_id,_handler
                    );
                break;
            }
        });
    })();
    /**
     * 判断是否需要对Flash事件做代理，
     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
     * @return {Boolean} 是否做代理
     */
    _h.__canFlashEventBubble = function(_wmode){
        return !0;
    };
    /**
     * 删除IFrame节点，保留历史
     * @param  {Node} iframe节点
     * @return {Void}
     */
    _h.__removeIFrameKeepHistory = 
    _h.__removeIFrameKeepHistory._$aop(function(_event){
        // bug for chrome 35 when history back for removed iframe
        // do nothing
        _event.stopped = !0;
    });
};
NEJ.define(
    '{lib}patched/webkit/api.js',[
    '{lib}patched/com/api.js'
],f);