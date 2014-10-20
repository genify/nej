/*
 * ------------------------------------------
 * 自定义事件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/event/event */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/event'
],function(NEJ,_k,_e,_v,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 自定义事件封装对象，封装的事件支持通过事件相关接口进行添加、删除等操作
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/event'
     *     'util/event'
     * ],function(_v,_t){
     *     // 支持自定义事件
     *     _t._$$CustomEvent._$allocate({
     *         element:window,
     *         event:'ok'
     *     });
     * 
     *     // 添加自定义事件 
     *     _v._$addEvent(window,'ok',function(){alert(0);});
     *     _v._$addEvent(window,'ok',function(){alert(1);});
     *     
     *     // 删除自定义事件
     *     _v._$delEvent(window,'ok',function(){alert(0);});
     *     _v._$clearEvent(window,'ok');
     *     
     *     // 触发自定义事件
     *     window.onok({a:'aaaaa'});
     *     _v._$dispatchEvent(window,'ok',{a:'aaaaa'});
     * });
     * ```
     * 
     * @class    module:util/event/event._$$CustomEvent
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object}       config  - 可选配置参数
     * @property {String|Node}  element - 事件关联节点ID或者对象，默认为window对象
     * @property {String|Array} event   - 事件名称或者名称列表
     */
    /** 
     * 初始化时触发事件
     * 
     * @event module:util/event/event._$$CustomEvent#oninit
     * @param {Object} event - 事件信息
     */
    /** 
     * 事件调度前触发事件
     * 
     * @event    module:util/event/event._$$CustomEvent#ondispatch
     * @param    {Object} event - 事件信息
     * @property {String} type  - 事件类型
     */
    /**
     * 添加事件时触发事件
     * 
     * @event    module:util/event/event._$$CustomEvent#oneventadd
     * @param    {Object}   event    - 事件信息
     * @property {String}   type     - 事件类型
     * @property {Function} listener - 事件执行函数
     */
    _p._$$CustomEvent = _k._$klass();
    _pro = _p._$$CustomEvent._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/event/event._$$CustomEvent#__init
     * @return {Void}
     */
    _pro.__init = function(){
        // onxxx - event entry handler
        //   xxx - event callback handler list
        this.__cache = {};
        this.__super();
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/event/event._$$CustomEvent#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__element = _e._$get(_options.element)||window;
        // init event
        this.__doEventInit(_options.event);
        this.__doEventAPIEnhance();
        this._$dispatchEvent('oninit');
    };
    /**
     * 销毁控件
     * 
     * @protected
     * @method module:util/event/event._$$CustomEvent#__destroy
     * @return {Void}
     */
    _pro.__destroy = (function(){
        var _doClear = function(_value,_key,_map){
            if (!_u._$isArray(_value)){
                _u._$safeDelete(this.__element,_key);
            }
            delete _map[_key];
        };
        return function(){
            this.__super();
            // clear cache
            _u._$loop(
                this.__cache,_doClear,this
            );
            delete this.__element;
        };
    })();
    /**
     * 判断是否需要代理事件
     * 
     * @protected
     * @method module:util/event/event._$$CustomEvent#__isDelegate
     * @param  {String|Node} arg0 - 节点
     * @param  {String}      arg1 - 事件
     * @return {Boolean}            是否需要代理事件
     */
    _pro.__isDelegate = function(_element,_type){
        _element = _e._$get(_element);
        return _element===this.__element&&
               (!_type||!!this.__cache['on'+_type]);
    };
    /**
     * 初始化事件
     * 
     * @protected
     * @method module:util/event/event._$$CustomEvent#__doEventInit
     * @param  {String} arg0 - 事件名称
     * @return {Void}
     */
    _pro.__doEventInit = function(_event){
        if (_u._$isString(_event)){
            var _name = 'on'+_event;
            if (!this.__cache[_name]){
                this.__cache[_name] = 
                    this.__doEventDispatch.
                        _$bind(this,_event);
            }
            this.__doEventBind(_event); 
            return;
        }
        if (_u._$isArray(_event)){
            _u._$forEach(
                _event,this.__doEventInit,this
            );
        }
    };
    /**
     * 绑定事件
     * 
     * @protected
     * @method module:util/event/event._$$CustomEvent#__doEventBind
     * @param  {String} arg0 - 事件名称
     * @return {Void}
     */
    _pro.__doEventBind = function(_type){
        var _event = 'on'+_type,
            _handler = this.__element[_event],
            _handler1 = this.__cache[_event];
        if (_handler!=_handler1){
            this.__doEventDelete(_type);
            if (!!_handler&&_handler!=_f){
                this.__doEventAdd(_type,_handler);
            }
            this.__element[_event] = _handler1;
        }
    };
    /**
     * 添加事件
     * 
     * protected
     * @method module:util/event/event._$$CustomEvent#__doEventAdd
     * @param  {String}   arg0 - 事件名称
     * @param  {Function} arg1 - 事件回调
     * @return {Void}
     */
    _pro.__doEventAdd = function(_type,_handler,_front){
        var _list = this.__cache[_type];
        if (!_list){
            _list = [];
            this.__cache[_type] = _list;
        }
        if (_u._$isFunction(_handler)){
            !_front ? _list.push(_handler)
                    : _list.unshift(_handler);
        } 
    };
    /**
     * 删除事件
     * 
     * protected
     * @method module:util/event/event._$$CustomEvent#__doEventDelete
     * @param  {String}   arg0 - 事件名称
     * @param  {Function} arg1 - 事件回调
     * @return {Void}
     */
    _pro.__doEventDelete = function(_type,_handler){
        var _list = this.__cache[_type];
        if (!_list||!_list.length) return;
        // clear all event handler
        if (!_handler){
            delete this.__cache[_type];
            return;
        }
        // delete one event handler
        _u._$reverseEach(
            _list,function(_value,_index,_xlist){
                if (_handler===_value){
                    _xlist.splice(_index,1);
                    return !0;
                }
            }
        );
    };
    /**
     * 事件调度
     * 
     * protected
     * @method module:util/event/event._$$CustomEvent#__doEventDispatch
     * @param  {String} arg0 - 事件名称
     * @param  {Object} arg1 - 事件对象
     * @return {Void}
     */
    _pro.__doEventDispatch = function(_type,_event){
        _event = _event||{noargs:!0};
        if (_event==_o){
            _event = {};
        }
        _event.type = _type;
        this._$dispatchEvent('ondispatch',_event);
        if (!!_event.stopped) return;
        _u._$forEach(
            this.__cache[_type],function(_handler){
                try{
                    _handler(_event);
                }catch(ex){
                    // ignore
                    console.error(ex.message);
                    console.error(ex.stack);
                }
            }
        );
    };
    /**
     * 增强事件操作API
     * 
     * protected
     * @method module:util/event/event._$$CustomEvent#__doEventAPIEnhance
     * @return {Void}
     */
    _pro.__doEventAPIEnhance = (function(){
        var _doAddEvent = function(_event){
            var _args = _event.args,
                _type = _args[1].toLowerCase();
            if (this.__isDelegate(_args[0],_type)){
                _event.stopped = !0;
                this.__doEventBind(_type);
                this.__doEventAdd(_type,_args[2],_args[3]);
                this._$dispatchEvent('oneventadd',{
                    type:_type,
                    listener:_args[2]
                });
            }
        };
        var _doDelEvent = function(_event){
            var _args = _event.args,
                _type = _args[1].toLowerCase();
            if (this.__isDelegate(_args[0],_type)){
                _event.stopped = !0;
                this.__doEventDelete(_type,_args[2]);
            }
        };
        var _doClearEvent = function(_event){
            var _args = _event.args,
                _type = (_args[1]||'').toLowerCase();
            if (this.__isDelegate(_args[0])){
                if (!!_type){
                    this.__doEventDelete(_type);
                    return;
                }
                _u._$loop(
                    this.__cache,function(_value,_key){
                        if (_u._$isArray(_value)){
                            this.__doEventDelete(_key);
                        }
                    },this
                );
            }
        };
        var _doDispatchEvent = function(_event){
            var _args = _event.args,
                _type = _args[1].toLowerCase();
            if (this.__isDelegate(_args[0],_type)){
                _event.stopped = !0;
                _args[0]['on'+_type].apply(_args[0],_args.slice(2));
            }
        };
        return function(){
            // void multi-enhance
            if (!!this.__enhanced){
                return;
            }
            // enhance event api
            this.__enhanced = true;
            _v._$addEvent = _v._$addEvent._$aop(_doAddEvent._$bind(this));
            _v._$delEvent = _v._$delEvent._$aop(_doDelEvent._$bind(this));
            _v._$clearEvent = _v._$clearEvent._$aop(_doClearEvent._$bind(this));
            _v._$dispatchEvent = _v._$dispatchEvent._$aop(_doDispatchEvent._$bind(this));
            
            if (CMPT){
                NEJ.copy(NEJ.P('nej.v'),_v);
            }
        };
    })();
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;
});
