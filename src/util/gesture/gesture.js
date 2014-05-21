/**
 * ------------------------------------------
 * 触摸手势基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _v = _('nej.v'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ut.g'),
        _pro;
    if (!!_p._$$Gesture) return;
    /**
     * 触摸手势基类
     * 
     * 
     * @class   {nej.ut.g._$$Gesture}
     * @extends {nej.ut._$$Event}
     * 
     * 
     */
    _p._$$Gesture = NEJ.C();
    _pro = _p._$$Gesture._$extend(_t._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__supInit();
        this.__number = 1;
        _v._$addEvent(
            document,'touchcancel',
            this.__onTouchCancel._$bind(this),!0
        );
        _v._$addEvent(
            document,'touchstart',
            this.__onTouchStart._$bind(this),!0
        );
        _v._$addEvent(
            document,'touchmove',
            this.__onTouchMove._$bind(this),!0
        );
        _v._$addEvent(
            document,'touchend',
            this.__onTouchEnd._$bind(this),!0
        );
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__tlist = [];
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        delete this.__tlist;
    };
    /**
     * 解析触点信息
     * @protected
     * @method {__getTouchPointer}
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__doParseTouch = (function(){
        // get touch id
        var _getId = function(_touch){
            if (!_touch) return;
            var _id1 = _touch.identifier,
                _id2 = _touch.pointerId;
            return _id1!=null?_id1:(_id2!=null?_id2:null);
        };
        // 
        var _doMapList = function(_list){
            var _map = {};
            _u._$forEach(_list,
                function(_touch,_index){
                    _map[_getId(_touch)] = _index;
                });
            return _map;
        };
        // check left list contains right list
        var _isContainForMerge = function(_llist,_rlist){
            var _result = !1,
                _map = _doMapList(_llist);
            _u._$forEach(_rlist,
                function(_touch){
                    var _index = _map[_getId(_touch)];
                    if (_index!=null){
                        _result = !0;
                        _llist[_index] = _touch;
                    }
                });
            return _result;
        };
        // check left list contains right list
        var _isContainForRemove = function(_llist,_rlist){
            var _result = [],
                _map = _doMapList(_rlist);
            _u._$reverseEach(_llist,
                function(_touch,_index1){
                    var _id = _getId(_touch),
                        _index = _map[_id];
                    if (_index!=null){
                        _result.push(_rlist[_index]);
                        _llist.splice(_index1,1);
                    }
                });
            return _result.length>0?_result:null;
        };
        // remove touches in list
        var _doPopTouch = function(_list,_touches){
            return _isContainForRemove(_list,_touches);
        };
        // 
        var _doCheckTouch = function(_list,_touches){
            var _result = !1,
                _map = _doMapList(_touches);
            _u._$forEach(_list,
                function(_touch,_index1){
                    var _index = _map[_getId(_touch)];
                    if (_index!=null){
                        _result = !0;
                        _list[_index1] = _touches[_index];
                        return _result;
                    }
                });
            return _result?_list:null; 
        };
        // save touches to list
        var _doPushTouch = function(_list,_touches,_number){
            if (_isContainForMerge(_list,_touches)){
                return _list;
            }else if (_list.length<_number){
                // push changed touch
                for(var i=_list.length,k=0,_touch;i<_number;k++,i++){
                    _touch = _touches[k];
                    if (!_touch) break;
                    _list.push(_touch);
                }
                return _list;
            }
            return null;
        };
        return function(_event,_flag){
            var _touches = _event.changedTouches;
            if (!_touches){
                if (_getId(_event)==null)
                    _event.identifier = 1;
                _touches = [_event];
            }
            switch(_flag){
                // touch move
                case 1: return _doPopTouch(this.__tlist,_touches);
                // touch end
                case 2: 
                    _touches = _doCheckTouch(this.__tlist,_touches);
                break;
                // touch start
                default:
                    _touches = _doPushTouch(this.
                              __tlist,_touches,this.__number);
                break;
            }
            return !!_touches&&_touches.length>=this.__number?_touches:null;
        };
    })();
    /**
     * 开始触摸事件
     * @protected
     * @method {__onTouchStart}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onTouchStart = function(_event){
        var _touches = this.__doParseTouch(_event);
        if (!!_touches) this.__doTouchStart(_touches,_event);
    };
    /**
     * 执行开始触摸业务逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doTouchStart}
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__doTouchStart = _f;
    /**
     * 移动触点事件
     * @protected
     * @method {__onTouchMove}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onTouchMove = function(_event){
        var _touches = this.__doParseTouch(_event,2);
        if (!!_touches) this.__doTouchMove(_touches,_event);
    };
    /**
     * 执行触摸移动业务逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doTouchMove}
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__doTouchMove = _f;
    /**
     * 结束触摸事件
     * @protected
     * @method {__onTouchEnd}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onTouchEnd = function(_event){
        var _touches = this.__doParseTouch(_event,1);
        if (!!_touches) this.__doTouchEnd(_touches,_event);
    };
    /**
     * 执行触摸结束业务逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doTouchEnd}
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__doTouchEnd = _f;
    /**
     * 触摸取消事件
     * @protected
     * @method {__onTouchCancel}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onTouchCancel = function(_event){
        var _touches = this.__doParseTouch(_event,1);
        if (!!_touches) this.__doTouchCancel(_touches,_event);
    };
    /**
     * 执行开始触摸业务逻辑，子类实现具体业务逻辑
     * @protected
     * @method {__doTouchCancel}
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__doTouchCancel = _f;
    /**
     * 触发事件
     * @protected
     * @method {__doDispatchEvent}
     * @param  {String} 事件类型
     * @param  {Touch}  触点信息
     * @param  {Object} 
     * @return {Void}
     */
    _pro.__doDispatchEvent = function(_type,_touch,_options){
        _v._$dispatchEvent(
            _v._$getElement(
                _touch),_type,_options);
    };
};
NEJ.define(
    '{lib}util/gesture/gesture.js',[
    '{lib}base/event.js',
    '{lib}base/element.js',
    '{lib}util/event.js'
],f);
