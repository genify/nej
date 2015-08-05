/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './event.js',
    'base/util'
],function(_h,_u,_p,_o,_f,_r){
    // for ie10+
    NEJ.patch('TR>=6.0',function(){
        /**
         * 验证事件信息
         * @param  {Node}     节点
         * @param  {String}   事件类型
         * @param  {Function} 处理函数
         * @return {Object}   验证后事件信息 type/handler
         */
        _h.__checkEvent = (function(){
            var _emap = {
                touchcancel:'MSPointerCancel',
                touchstart:'MSPointerDown',
                touchmove:'MSPointerMove',
                touchend:'MSPointerUp'
            };
            return _h.__checkEvent._$aop(function(_event){
                var _args = _event.args;
                // check event convert
                var _name = _emap[_args[1]];
                if (!!_name){
                    _event.stopped = !0;
                    _event.value = {
                        type:_name,
                        handler:_args[2]
                    };
                }
            });
        })();
    });
    // for ie9
    NEJ.patch('TR==5.0',function(){
        /**
         * 验证事件信息
         * @param  {Node}     节点
         * @param  {String}   事件类型
         * @param  {Function} 处理函数
         * @return {Object}   验证后事件信息 type/handler
         */
        _h.__checkEvent = (function(){
            var _vmap = {};
            var _fmap = {
                input:function(_element,_type,_handler){
                    // for check type only
                    if (!_handler){
                        return {type:_type};
                    }
                    // fix input backspace/delete/ctrl+x bug
                    return {
                        type:_type,
                        handler:function(_event){
                            var _id = _element.id;
                            _vmap[_id] = _element.value;
                            _handler.call(_element,_event);
                        },
                        link:[[
                            document,'selectionchange',
                            function(_event){
                                var _id = _element.id;
                                if (_element!=document.activeElement){
                                    delete _vmap[_id];
                                    return;
                                }
                                if (_vmap[_id]!==_element.value){
                                    _vmap[_id] = _element.value;
                                    _handler.call(_element,_event);
                                }
                            }
                        ]]
                    };
                }
            };
            return _h.__checkEvent._$aop(function(_event){
                var _args = _event.args;
                // check event update
                var _func = _fmap[_args[1]];
                if (!!_func){
                    _event.stopped = !0;
                    _event.value = _func.apply(null,_args);
                }
            });
        })();
    });
    // for ie9+
    NEJ.patch('TR>=5.0',function(){
        // must use attach/detach for event
        var _attached = {
            'propertychange':1
        };
        /**
         * 添加事件
         * @param  {Node}     节点
         * @param  {String}   事件
         * @param  {Function} 处理函数
         * @param  {Boolean}  是否捕捉阶段
         * @return {Void}
         */
        _h.__addEvent = 
        _h.__addEvent._$aop(function(_event){
            var _args = _event.args;
            if (_attached[_args[1]]!=null&&!!_args[0].attachEvent){
                _event.stopped = !0;
                _args[0].attachEvent('on'+_args[1],_args[2]);
            }
        });
        /**
         * 删除事件
         * @param  {Node}     节点
         * @param  {String}   事件
         * @param  {Function} 处理函数
         * @param  {Boolean}  是否捕捉阶段
         * @return {Void}
         */
        _h.__delEvent = 
        _h.__delEvent._$aop(function(_event){
            var _args = _event.args,
                _alias = _attached[_args[1]];
            if (_attached[_args[1]]!=null&&!!_args[0].detachEvent){
                _event.stopped = !0;
                _args[0].detachEvent('on'+_args[1],_args[2]);
            }
        });
    });
    // for ie8-
    NEJ.patch('TR<=4.0',function(){
        /**
         * 验证事件信息
         * @param  {Node}     节点
         * @param  {String}   事件类型
         * @param  {Function} 处理函数
         * @return {Object}   验证后事件信息 type/handler
         */
        _h.__checkEvent = (function(){
            var _lmap = {};
            var _fmap = {
                input:function(_element,_type,_handler){
                    var _result = {
                        type:'propertychange'
                    };
                    if (!!_handler){
                        var _id = _element.id;
                        var _hack = function(_event){
                            if (!!_element.value&&!_lmap['x-'+_id]){
                                _lmap['x-'+_id] = !0;
                                _handler.call(_element,_event);
                            }
                        };
                        _result.handler = function(_event){
                            // for input.value or textarea.value
                            if (('value' in _element)&&
                                _event.propertyName=='value'){
                                // lock cycle trigger
                                if (!!_lmap[_id]){
                                    return;
                                }
                                _lmap[_id] = !0;
                                _handler.call(_element,_event);
                                delete _lmap[_id];
                            }
                        };
                        _result.link = [
                            [_element,'keyup',_hack],
                            [_element,'mouseup',_hack],
                            [_element,'mousemove',_hack]
                        ];
                        _result.destroy = function(){
                            delete _lmap[_id];
                            delete _lmap['x-'+_id];
                        };
                    }
                    return _result;
                },
                load:function(_element,_type,_handler){
                    var _result = {
                        type:'readystatechange'
                    };
                    if (!!_handler){
                        _result.handler = function(_event){
                            if (_element.readyState=='loaded'||
                                _element.readyState=='complete'){
                                _handler.call(_element,_event);
                            }
                        };
                    }
                    return _result;
                }
            };
            return _h.__checkEvent._$aop(function(_event){
                var _args = _event.args;
                // check event update
                var _func = _fmap[_args[1]];
                if (!!_func){
                    _event.stopped = !0;
                    _event.value = _func.apply(null,_args);
                }
                // use element for this in handler
                if (!!_args[2]){
                    _args[2] = _args[2]._$bind(_args[0]);
                }
            });
        })();
        /**
         * 添加事件
         * @param  {Node}     节点
         * @param  {String}   事件
         * @param  {Function} 处理函数
         * @param  {Boolean}  是否捕捉阶段
         * @return {Void}
         */
        _h.__addEvent = function(){
            var _args = arguments;
            if (DEBUG){
                if (!(('on'+_args[1]) in _args[0])){
                    console.log('not support event['+_args[1]+'] for '+_args[0]);
                }
            }
            _args[0].attachEvent('on'+_args[1],_args[2]);
        };
        /**
         * 删除事件
         * @param  {Node}     节点
         * @param  {String}   事件
         * @param  {Function} 处理函数
         * @param  {Boolean}  是否捕捉阶段
         * @return {Void}
         */
        _h.__delEvent = function(){
            var _args = arguments;
            _args[0].detachEvent('on'+_args[1],_args[2]);
        };
        /**
         * 触发对象的某个事件
         * @param  {String|Node} 节点ID或者对象
         * @param  {String}      鼠标事件类型
         * @return {Void}
         */
        _h.__dispatchEvent = (function(){
            var _omap = {
                propertychange:{propertyName:'value'}
            };
            return function(_element,_type,_options){
                var _event = document.createEventObject();
                try{
                    _u._$merge(_event,_omap[_type],_options);
                    _element.fireEvent('on'+_type,_event);
                }catch(ex){
                    // ignore unrecognized event name
                    console.error(ex.message);
                    console.error(ex.stack);
                }
            };
        })();
    });
    // for firefox
    NEJ.patch('GR',function(){
        /**
         * 验证事件信息
         * @param  {Node}     节点
         * @param  {String}   事件类型
         * @param  {Function} 处理函数
         * @return {Object}   验证后事件信息 type/handler
         */
        _h.__checkEvent = (function(){
            var _nreg = /^(?:transitionend|animationend|animationstart|animationiteration)$/i;
            var _fmap = {
                mousewheel:function(_element,_type,_handler){
                    var _result = {
                        type:'MozMousePixelScroll'
                    };
                    if (!!_handler){
                        _result.handler = function(_event){
                            var _delta = _event.detail;
                            _event.wheelDelta = -_delta;
                            _event.wheelDeltaY = -_delta;
                            _event.wheelDeltaX = 0;
                            _handler.call(_element,_event);
                        };
                    }
                    return _result;
                }
            };
            return _h.__checkEvent._$aop(function(_event){
                var _args = _event.args;
                // check animation event
                if (_nreg.test(_args[1])){
                    _event.stopped = !0;
                    _event.value = {
                        type:_args[1],
                        handler:_args[2]
                    };
                }
                // check event update
                var _func = _fmap[_args[1]];
                if (!!_func){
                    _event.stopped = !0;
                    _event.value = _func.apply(null,_args);
                }
            });
        })();
    });

    return _h;
});
