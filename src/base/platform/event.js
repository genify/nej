/**
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(NEJ,_e,_v,_u,_p,_h){
    if (CMPT){
        // variable declaration
        var _  = NEJ.P,
            _r = NEJ.R,
            _p = _('nej.p'),
            _e = _('nej.e'),
            _v = _('nej.v'),
            _u = _('nej.u'),
            _h = _('nej.h');
    }
    var _r = NEJ.R,
        _prefix = _p._$KERNEL.prefix;
    // ---------- begin dom event patch api ---------
    /**
     * 集合转数组
     * @param  {Object} _list 集合
     * @return {Array}        数组
     */
    _h.__col2array = function(_list){
        return _r.slice.call(_list,0);
    };
    /**
     * 格式化事件参数
     * @param  {Node}     _element 节点对象
     * @param  {String}   _type    事件类型
     * @param  {Function} _event   事件处理函数
     * @param  {Boolean}  _capture 是否捕获阶段事件
     * @return {Array}             事件列表
     */
    _h.__formatEventArgs = function(){
        var _args = _h.__col2array(arguments);
        _args[0] = _e._$get(_args[0]);
        if (!_args[0]) 
            return null;
        _args[1] = (_args[1]||'').toLowerCase();
        if (!_args[1]) 
            return null;
        return _args;
    };
    /**
     * 检查事件信息<br/>
     * 返回列表内容
     * [ntb]
     *   0 | 节点对象
     *   1 | 实际添加的事件类型
     *   2 | 实际添加的事件回调
     *   3 | 实际添加的是否捕获阶段标识
     *   4 | 原始事件类型，转为小写
     *   5 | 原始事件回调
     * [/ntb]
     * @param  {Node}     _element 节点对象
     * @param  {String}   _type    事件类型
     * @param  {Function} _event   事件处理函数
     * @param  {Boolean}  _capture 是否捕获阶段事件
     * @return {Array}             事件列表
     */
    _h.__checkEvent = (function(){
            // need change event name
        var _tmap = {
                touchstart:'mousedown',
                touchmove:'mousemove',
                touchend:'mouseup'
            },
            // need prefix
            _emap = {
                transitionend:'TransitionEnd',
                animationend:'AnimationEnd',
                animationstart:'AnimationStart',
                animationiteration:'AnimationIteration'
            };
        // complete event name prefix
        var _doCompletePrefix = function(_type){
            return (_prefix.evt||_prefix.pro)+_type;
        };
        return function(){
            var _args = _h.__formatEventArgs
                          .apply(_h,arguments);
            if (!_args) return;
            // check event type
            var _type = _h.__checkEventType(
                _args[0],_args[1]
            );
            // type changed
            if (!!_type){
                // swap event
                _args[4] = _args[1];
                _args[1] = _type;
                // check event handler
                if (!!_args[2]){
                    _args[5] = _args[2];
                    _args[2] = _h.__checkEventHandler(
                        _args[1],_args[2],_args[0]
                    );
                }
                return _args;
            }
            // check type prefix
            var _type1 = _emap[_args[1]],
                _type2 = _tmap[_args[1]];
            if (!!_type1){
                _args[4] = _args[1];
                _args[1] = _doCompletePrefix(_type1);
            }else if(!!_type2){
                var _name = 'on'+_args[1];
                if (!(_name in _args[0])){
                    _args[4] = _args[1];
                    _args[1] = _type2;
                }
            }
            return _args;
        };
    })();
    /**
     * 检查事件类型
     * @param  {Object} 事件匹配表
     * @param  {Object} 参数及结果信息
     * @return {Void}
     */
    _h.__checkEventTypeWithConf = function(_map,_event){
        var _value,
            _args = _event.args,
            _type = _args[1],
            _element = _args[0];
        if (!('on'+_type in _element)){
            _value = _map[_type]||'';
        }
        if (!!_value&&!_map[_value]&&
            !('on'+_value in _element)){
            _value = null;
        }
        if (!!_value){
            _event.stopped = !0;
            _event.value = _value;
        }
    };
    /**
     * 检查事件类型
     * @param  {Node}   节点
     * @param  {String} 事件类型
     * @return {String} 变化后的事件类型
     */
    _h.__checkEventType = (function(){
        var _emap = {
            enter:'keypress'
        };
        return function(_element,_type){
            return _emap[_type]||null;
        };
    })();
    /**
     * 检查事件执行函数
     * @param  {String}   事件类型
     * @param  {Function} 事件执行函数
     * @param  {Node}     事件添加节点
     * @return {Function} 变化后的事件执行函数
     */
    _h.__checkEventHandler = function(_type,_handler,_element){
        var _callback = _handler;
        switch(_type){
            case 'keypress':
                _callback = function(_event){
                    var _this = _v._$getElement(_event)||this;
                    if (_event.keyCode==13){
                        _handler.call(_this,_event);
                    }
                };
            break;
        }
        return _callback;
    };
    /**
     * 添加节点事件
     * @param  {Node}     _element 节点对象
     * @param  {String}   _type    事件类型
     * @param  {Function} _event   事件处理函数
     * @param  {Boolean}  _capture 是否捕获阶段事件
     * @return {Void}
     */
    _h.__addEvent = function(){
        var _args = arguments,
            _isok = ('on'+_args[1]) in _args[0];
        if (!_isok){
            console.log('not support event['+_args[1]+'] for '+_args[0]);
        }
        _args[0].addEventListener(_args[1],_args[2],!!_args[3]);
    };
    /**
     * 删除节点事件
     * @param  {Node}     _element 节点对象
     * @param  {String}   _type    事件类型
     * @param  {Function} _event   事件处理函数
     * @param  {Boolean}  _capture 是否捕获阶段事件
     * @return {Void}
     */
    _h.__delEvent = function(){
        var _args = arguments;
        _args[0].removeEventListener(_args[1],_args[2],!!_args[3]);
    };
    /**
     * 触发对象的某个事件
     * @param  {String|Node} _element 节点ID或者对象
     * @param  {String}      _type    鼠标事件类型
     * @return {Void}
     */
    _h.__dispatchEvent = function(_element,_type,_options){
        var _event = document.createEvent('Event');
        _event.initEvent(_type,!0,!0);
        NEJ.X(_event,_options);
        _element.dispatchEvent(_event);
    };
    /**
     * 判断是否需要对Flash事件做代理，
     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
     * @return {Boolean} 是否做代理
     */
    _h.__canFlashEventBubble = function(_wmode){
        return (_wmode||'').toLowerCase()!='transparent';
    };

    return _h;
};
NEJ.define('{lib}base/platform/event.js',
          ['{lib}base/global.js',
          '{lib}base/element.js',
          '{lib}base/event.js',
          '{lib}base/util.js',
          '{lib}base/platform.js'],f);