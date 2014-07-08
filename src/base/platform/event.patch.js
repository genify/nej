var f = function() {
	// gecko api patch
	NEJ.patch('GV',function(){
	    // variable declaration
	    var _  = NEJ.P,
	        _v = _('nej.v'),
	        _e = _('nej.e'),
	        _h = _('nej.h'),
	        _p = _('nej.p'),
	        _support = _p._$SUPPORT;
	    /**
	     * 检查事件信息
	     * @param  {Node}     _element 节点对象
	     * @param  {String}   _type    事件类型
	     * @param  {Function} _event   事件处理函数
	     * @param  {Boolean}  _capture 是否捕获阶段事件
	     * @return {Array}             事件列表
	     */
	    _h.__checkEvent = (function(){
	        var _reg0 = /^(?:transitionend|animationend|animationstart|animationiteration)$/i;
	        return _h.__checkEvent._$aop(function(_event){
	            var _args = _event.args;
	            if (_reg0.test(_args[1]||'')){
	                _event.stopped = !0;
	                _event.value = _args;
	            }
	        });
	    })();
	    /**
	     * 检查事件类型
	     * @param  {Node}   节点
	     * @param  {String} 事件类型
	     * @return {String} 变化后的事件类型
	     */
	    _h.__checkEventType = (function(){
	        var _emap = {
	            mousewheel:'MozMousePixelScroll',
	            MozMousePixelScroll:!0
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
	        var _doMouseWheel = function(_id,_handler,_event){
	            var _element = _e._$get(_id);
	            if (!!_element){
	                var _delta = _event.detail;
	                _event.wheelDelta = -_delta;
	                _event.wheelDeltaY = -_delta;
	                _event.wheelDeltaX = 0;
	                _handler.call(_element,_event);
	            }
	        };
	        return _h.__checkEventHandler._$aop(function(_event){
	            var _args = _event.args,
	                _type = _args[0],
	                _handler = _args[1],
	                _id = _e._$id(_args[2]);
	            if (_type=='MozMousePixelScroll'){
	                _event.stopped = !0;
	                _event.value = _doMouseWheel._$bind(
	                    null,_id,_handler
	                );
	            }
	        });
	    })();
	});

	// ie6-9 api patch
	NEJ.patch('2.0<=TR<=5.0',function(){
	    // variable declaration
	    var _  = NEJ.P,
	        _o = NEJ.O,
	        _p = _('nej.p'),
	        _e = _('nej.e'),
	        _v = _('nej.v'),
	        _u = _('nej.u'),
	        _h = _('nej.h'),
	        _omap = {}; // event must use attach/detach method
	    /**
	     * 集合转数组
	     * @param  {Object} _list 集合
	     * @return {Array}        数组
	     */
	    _h.__col2array = 
	    _h.__col2array._$aop(function(_event){
	        _event.stopped = !0;
	        var _list = _event.args[0];
	        if (!_list){
	            _event.value = null;
	            return;
	        }
	        var _index = 0,
	            _result = [];
	        while(!!_list[_index]){
	            _result.push(_list[_index++]);
	        }
	        _event.value = _result;
	    });
	    /**
	     * 检查事件信息
	     * @param  {Node}     _element 节点对象
	     * @param  {String}   _type    事件类型
	     * @param  {Function} _event   事件处理函数
	     * @param  {Boolean}  _capture 是否捕获阶段事件
	     * @return {Array}             事件列表
	     */
	    _h.__checkEvent = 
	    _h.__checkEvent._$aop(null,function(_event){
	        var _args = _event.value;
	        if (!_args||!_args[0]||
	            !_u._$isFunction(_args[2]))
	            return;
	        if (!_u._$isFunction(_args[5]))
	            _args[5] = _args[2];
	        _args[2] = _args[2]._$bind(_args[0]);
	    });
	    /**
	     * 检查事件类型
	     * @param  {Node}   节点
	     * @param  {String} 事件类型
	     * @return {String} 变化后的事件类型
	     */
	    _h.__checkEventType = (function(){
	        var _emap = {
	            'input':'propertychange',
	            'load':'readystatechange'
	        };
	        for(var x in _emap) _omap[_emap[x]] = !0;
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
	        var _lmap = {};
	        return _h.__checkEventHandler._$aop(function(_evt){
	            var _args = _evt.args,
	                _handler = _args[1];
	            switch(_args[0]){
	                case 'readystatechange':
	                    _evt.stopped = !0;
	                    _evt.value = function(_event){
	                        var _element = _v._$getElement(_event)||this;
	                        if (_element.readyState=='loaded'||
	                            _element.readyState=='complete'){
	                            _event.target = _element;
	                            _handler.call(_element,_event);
	                        }
	                    };
	                break;
	                case 'propertychange':
	                    _evt.stopped = !0;
	                    _evt.value = function(_event){
	                        var _element = _v._$getElement(_event)||this;
	                        if (('value' in _element)&&
	                            _event.propertyName=='value'){
	                            var _id = _e._$id(_element);
	                            // lock cycle trigger
	                            if (!!_lmap[_id]){
	                                return;
	                            }
	                            _lmap[_id] = !0;
	                            _event.target = _element;
	                            _handler.call(_element,_event);
	                            delete _lmap[_id];
	                        }
	                    };
	                break;
	            }
	        });
	    })();
	    
	    /**
	     * 添加节点事件
	     * @param  {Node}     _element 节点对象
	     * @param  {String}   _type    事件类型
	     * @param  {Function} _event   事件处理函数
	     * @param  {Boolean}  _capture 是否捕获阶段事件
	     * @return {Void}
	     */
	    _h.__addEvent = 
	    _h.__addEvent._$aop(function(_event){
	        var _args = _event.args;
	        if (!!_omap[_args[1]]||
	            !document.addEventListener){
	            _event.stopped = !0;
	            _args[0].attachEvent('on'+_args[1],_args[2]);
	        }
	    });
	    /**
	     * 删除节点事件
	     * @param  {Node}     _element 节点对象
	     * @param  {String}   _type    事件类型
	     * @param  {Function} _event   事件处理函数
	     * @param  {Boolean}  _capture 是否捕获阶段事件
	     * @return {Void}
	     */
	    _h.__delEvent = 
	    _h.__delEvent._$aop(function(_event){
	        var _args = _event.args;
	        if (!!_omap[_args[1]]||
	            !document.removeEventListener){
	            _event.stopped = !0;
	            _args[0].detachEvent('on'+_args[1],_args[2]);
	        }
	    });
	    /**
	     * 触发对象的某个事件
	     * @param  {String|Node} _element 节点ID或者对象
	     * @param  {String}      _type    鼠标事件类型
	     * @return {Void}
	     */
	    _h.__dispatchEvent = 
	    _h.__dispatchEvent._$aop(function(_event){
	        if (!document.createEvent){
	            _event.stopped = !0;
	            var _args = _event.args,
	                _eobj = document.createEventObject();
	            NEJ.X(_eobj,_args[2]);
	            try{
	                _args[0].fireEvent('on'+_args[1],_eobj);
	            }catch(ex){
	                // ignore unrecognized event name
	                console.error(ex.message);
	                console.error(ex.stack);
	            }
	        }
	    });
	    /**
	     * 判断是否需要对Flash事件做代理，
	     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
	     * @return {Boolean} 是否做代理
	     */
	    _h.__canFlashEventBubble = function(_wmode){
	        return !0;
	    };
	});

	// ie9
	NEJ.patch('TR==5.0',function(){
		// variable declaration
	    var _  = NEJ.P,
	        _o = NEJ.O,
	        _p = _('nej.p'),
	        _e = _('nej.e'),
	        _v = _('nej.v'),
	        _u = _('nej.u'),
	        _h = _('nej.h');

		_h.__addEvent = (function(){
	        var _hmap = {},
	            _kmap = {8:1,46:1},
	            _cmap = {88:'ctrlKey'};
	        var _doEventCheck = function(_event){
	            // for backspace/delete/ctrl+x ...
	            var _code = _event.keyCode,
	                _key = _cmap[_code],
	                _icut = !!_key&&_event[_key];
	            if (!_kmap[_code]&&!_icut) return;
	            // check change
	            var _node = _v._$getElement(_event),
	                _id = _e._$id(_node),
	                _key = _id+'-last',
	                _value = _node.value;
	            if (_hmap[_key]!=_value){
	                _hmap[_key] = _value;
	                _doCallback(_id,_event);
	            }
	        };
	        var _doFocusUpdate = function(_event){
	            var _node = _v._$getElement(_event),
	                _key = _e._$id(_node)+'-focused';
	            _hmap[_key] = _event.type=='focus';
	        };
	        var _doValueChange = function(_event){
	            var _node = _v._$getElement(_event),
	                _id = _e._$id(_node),
	                _key = _id+'-focused';
	            if (!!_hmap[_key]||
	                _event.propertyName!='value'){
	                return;
	            }
	            _doCallback(_id,_event);
	        };
	        var _doCallback = function(_id,_event){
	            _u._$forEach(
	                _hmap[_id],function(_handler){
	                    _handler.call(null,_event);
	                }
	            );
	        };
	        _h.__delEvent = 
	        _h.__delEvent._$aop(null,function(_event){
	            var _args = _event.args;
	            if (_args[1]=='input'){
	                var _id = _e._$id(_args[0]),
	                    _func = _args[2];
	                _u._$reverseEach(
	                    _hmap[_id],function(_handler,_index,_list){
	                        if (_func==_handler){
	                            _list.splice(_index,1);
	                            return !0;
	                        }
	                    }
	                );
	                var _list = _hmap[_id];
	                if (!_list||!_list.length){
	                    delete _hmap[_id];
	                    delete _hmap[_id+'-last'];
	                    _v._$delEvent(_id,'keyup',_doEventCheck);
	                    _v._$delEvent(_id,'keydown',_doEventCheck);
	                    _v._$delEvent(_id,'focus',_doFocusUpdate);
	                    _v._$delEvent(_id,'blur',_doFocusUpdate);
	                    _v._$delEvent(_id,'propertychange',_doValueChange);
	                }
	            }
	        });
	        return _h.__addEvent._$aop(null,function(_event){
	            var _args = _event.args;
	            if (_args[1]=='input'){
	                var _id = _e._$id(_args[0]);
	                if (!_hmap[_id]){
	                    _hmap[_id] = [];
	                }
	                _hmap[_id].push(_args[2]);
	                _v._$addEvent(_id,'keyup',_doEventCheck);
	                _v._$addEvent(_id,'keydown',_doEventCheck);
	                _v._$addEvent(_id,'focus',_doFocusUpdate);
	                _v._$addEvent(_id,'blur',_doFocusUpdate);
	                _v._$addEvent(_id,'propertychange',_doValueChange);
	            }
	        });
	    })();
	});

	// ie10+ api patch
	NEJ.patch('TR>=6.0',function(){
	    var _  = NEJ.P,
	        _p = _('nej.p'),
	        _e = _('nej.e'),
	        _h = _('nej.h');
	    /**
	     * 检查事件类型
	     * @param  {Node}   节点
	     * @param  {String} 事件类型
	     * @return {String} 变化后的事件类型
	     */
	    _h.__checkEventType = (function(){
	        var _emap = {
	            touchcancel:'MSPointerCancel',
	            touchstart:'MSPointerDown',
	            touchmove:'MSPointerMove',
	            touchend:'MSPointerUp'
	        };
	        return _h.__checkEventType._$aop(
	            _h.__checkEventTypeWithConf._$bind(_h,_emap)
	        );
	    })();
	    /**
	     * 判断是否需要对Flash事件做代理，
	     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
	     * @return {Boolean} 是否做代理
	     */
	    _h.__canFlashEventBubble = function(_wmode){
	        return !0;
	    };
	});
	
	// webkit api patch
	NEJ.patch('WV',function(){
	    // variable declaration
	    var _  = NEJ.P,
	        _e = _('nej.e'),
	        _v = _('nej.v'),
	        _p = _('nej.p'),
	        _h = _('nej.h');
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
	});
};
define(['./event.js'],f);