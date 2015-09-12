/*
 * ------------------------------------------
 * 事件接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module base/event */
NEJ.define([
    './global.js',
    './element.js',
    './util.js',
    './chain.js',
    '{platform}event.js'
],function(NEJ,_e,_u,_x,_h,_p,_o,_f,_r){
    // {id:{type:[{type:'click',func:function,sfun:function,capt:true},...]}}
    // id   - element id
    // type - event name, no on prefix
    // func - event after wrapper
    // capt - capture flag
    // sfun - event before wrapper
    // link - events link to this event [[element,type,handler,capture],...]
    var _xcache = {},
        _y = {}; // chainable methods
    /*
     * 取事件类型列表
     * @param  {String} 事件类型
     * @return {Array}  事件列表
     */
    var _getTypeList = (function(){
        var _reg = /[\s,;]+/;
        return function(_type){
            var _type = (_type||'').trim().toLowerCase();
            return !_type?null:_type.split(_reg);
        };
    })();
    /*
     * 取鼠标相对于BODY的偏移
     * @param  {Event}  事件对象
     * @param  {String} 类型，X/Y
     * @param  {String} 滚动偏移名称，Left/Top
     * @return {Void}
     */
    var _getClientOffset = function(_event,_type,_name){
        var _key1 = 'page'+_type;
        return _event[_key1]!=null?_event[_key1]:(
            _event['client'+_type]+
            _e._$getPageBox()['scroll'+_name]
        );
    };
    /*
     * 取鼠标相对于页面的偏移
     * @param  {Event}  事件对象
     * @param  {String} 类型，X/Y
     * @param  {String} 滚动偏移名称，Left/Top
     * @return {Void}
     */
    var _getPageOffset = function(_event,_type,_name){
        var _key3 = 'scroll'+_name;
            _node = _p._$getElement(_event),
            _xret = _getClientOffset(_event,_type,_name);
        while(!!_node&&
                _node!=document.body&&
                _node!=document.documentElement){
            _xret += _node[_key3]||0;
            _node = _node.parentNode;
        }
        return _xret;
    };
    /*
     * 格式化添加删除事件接口参数
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @param  {Function}    事件处理函数
     * @param  {Boolean}     是否捕获阶段事件，IE低版本浏览器忽略此参数
     * return  {Object}      格式化后参数
     */
    var _doFormatArgs = function(_element,_type,_handler,_capture){
        var _result = {};
        // check element
        _element = _e._$get(_element);
        if (!_element){
            return null;
        }
        _e._$id(_element);
        _result.element = _element;
        // check event handler
        if (!_u._$isFunction(_handler)){
            return null;
        }
        _result.handler = _handler;
        // check type
        var _type = _getTypeList(_type);
        if (!_type){
            return null;
        }
        // save info
        _result.type = _type;
        _result.capture = !!_capture;
        return _result;
    };
    /**
     * 节点添加事件，
     * 支持添加自定义事件，
     * 对于自定义事件的实现逻辑由其他模块负责实现
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 添加系统预定义事件
     *       _v._$addEvent(
     *           'abc','mouseover',function(_event){
     *               // TODO something
     *           },false
     *       );
     *
     *       // 添加自定义事件，回车事件
     *       _v._$addEvent(
     *           'abc','enter',function(_event){
     *               // TODO something
     *           },false
     *       );
     *
     *       // 添加多个事件，用空格分隔
     *       _v._$addEvent(
     *           'abc','mouseover click mousedown',
     *           function(_event){
     *               // TODO something
     *           },false
     *       );
     *   });
     * ```
     *
     * 带自定义事件的类构造或者对象
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     'base/event',
     *     'util/event',
     *     'util/event/event'
     * ],function(_k,_v,_t0,_t1,_p){
     *     // 定义类
     *     _p._$$Klass = _k._$klass();
     *     var _pro = _p._$$Klass._$extend(_t0._$$EventTarget);
     *     
     *     // TODO
     *     
     *     // 添加自定义事件支持
     *     // 对节点的事件同样支持此自定义事件
     *     _t1._$$CustomEvent._$allocate({
     *         element:_p._$$Klass,
     *         event:['ok','fail']
     *     });
     * 
     *     // 使用事件接口添加/删除/调度事件
     *     var _handler = function(_event){
     *         // TODO
     *     };
     *     _v._$addEvent(_p._$$Klass,'ok',_handler);
     *     _v._$delEvent(_p._$$Klass,'ok',_handler);
     * });
     * ```
     * 
     * @method module:base/event._$addEvent
     * @see    module:base/event._$delEvent
     * @param  {String|Node|Object} arg0 - 节点或者类构造或者对象
     * @param  {String}      arg1 - 事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @param  {Function}    arg2 - 事件处理函数
     * @param  {Boolean}     arg3 - 是否捕获阶段事件，IE低版本浏览器忽略此参数
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$addEvent
     * @see module:base/event._$addEvent
     */
    _p._$addEvent = 
    _y._$addEvent = (function(){
        // cache event
        // type/handler/link
        var _doCacheEvent = function(_type,_source,_real){
            var _id = _e._$id(_source.element),
                _cch_id = _xcache[_id]||{},
                _cch_tp = _cch_id[_type]||[];
            _cch_tp.push({
                type:_real.type||_type,
                func:_real.handler||_source.handler,
                sfun:_source.handler,
                capt:_source.capture,
                link:_real.link,
                destroy:_real.destroy
            });
            _cch_id[_type] = _cch_tp;
            _xcache[_id] = _cch_id;
        };
        return function(){
            var _args = _doFormatArgs.apply(null,arguments);
            if (!_args) return;
            _u._$forEach(
                _args.type,function(_name){
                    var _argc = _h.__checkEvent(
                        _args.element,
                        _name,_args.handler
                    );
                    // add event
                    _h.__addEvent(
                        _args.element,_argc.type,
                        _argc.handler,_args.capture
                    );
                    // add event link
                    _u._$forIn(
                        _argc.link,function(_item){
                            _item[3] = !!_item[3];
                            _h.__addEvent.apply(_h,_item);
                            _item[0] = _e._$id(_item[0]);
                        }
                    );
                    // cache event
                    _doCacheEvent(_name,_args,_argc);
                }
            );
        };
    })();
    /**
     * 节点删除事件，输入参数必须保证与添加接口_$addEvent输入参数完全一致
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 事件回调业务逻辑
     *       var _doCallback = function(_event){
     *           // TODO something
     *           alert('0');
     *       };
     *
     *       // 添加事件
     *       _v._$addEvent('abc','mouseover',_doCallback,false);
     *       // 删除事件，这里参数必须保持完全一致
     *       _v._$delEvent('abc','mouseover',_doCallback,false);
     *
     *       // 比如以下方式虽然回调的业务逻辑一致，但是无法删除之前添加的事件
     *       _v._$delEvent(
     *           'abc',"mouseover",function(_event){
     *               // TODO something
     *               alert('0');
     *           },false
     *       );
     *
     *       // 删除多个事件
     *       _v._$delEvent(
     *           'abc','mouseover click mouseup',
     *           _doCallback,false
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$delEvent
     * @see    module:base/event._$addEvent
     * @param  {String|Node} arg0 - 节点ID或者对象
     * @param  {String}      arg1 - 事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @param  {Function}    arg2 - 事件处理函数
     * @param  {Boolean}     arg3 - 是否捕获阶段事件
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$delEvent
     * @see module:base/event._$delEvent
     */
    _p._$delEvent = 
    _y._$delEvent = (function(){
        var _unCacheEvent = function(_type,_conf){
            var _id = _e._$id(_conf.element),
                _cch_id = _xcache[_id]||_o,
                _cch_tp = _cch_id[_type],
                _index = _u._$indexOf(
                    _cch_tp,function(_item){
                        // check handler and capture
                        return _item.sfun===_conf.handler&&
                               _item.capt===_conf.capture;
                    }
                );
            // check result
            var _result = null;
            if (_index>=0){
                var _item = _cch_tp.splice(_index,1)[0];
                _result = [[
                    _conf.element,_item.type,
                    _item.func,_conf.capture
                ]];
                if (!!_item.link){
                    // complete element by id
                    _u._$forEach(_item.link,function(v){
                        v[0] = _e._$get(v[0]);
                    });
                    _result.push.apply(_result,_item.link);
                }
                if (!!_item.destroy){
                    _item.destroy();
                }
                // clear cache
                if (!_cch_tp.length){
                    delete _cch_id[_type];
                }
                if (!_u._$hasProperty(_cch_id)){
                    delete _xcache[_id];
                }
            }
            return _result;
        };
        return function(){
            var _args = _doFormatArgs.apply(null,arguments);
            if (!_args) return;
            _u._$forEach(
                _args.type,function(_name){
                    _u._$forEach(
                        _unCacheEvent(_name,_args),
                        function(_item){
                            _h.__delEvent.apply(_h,_item);
                        }
                    );
                }
            );
        };
    })();
    /**
     * 清除节点事件
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 添加事件
     *       _v._$addEvent(
     *           'abc','mouseover',function(_event){
     *               // TODO something
     *           }
     *       );
     *       _v._$addEvent(
     *           'abc','mouseover',function(_event){
     *               // TODO something
     *           },true
     *       );
     *       _v._$addEvent(
     *           'abc','custom',function(_event){
     *               // TODO something
     *           }
     *       );
     *
     *       // 清除节点所有事件，包括两个mouseover事件和一个custom事件
     *       _v._$clearEvent('abc');
     *
     *       // 清除节点指定类型事件，只清除两个mouseover事件
     *       _v._$clearEvent('abc','mouseover');
     *
     *       // 清除多个事件，用空格分隔
     *       _v._$clearEvent('abc','mouseover custom');
     *   });
     * ```
     *
     * @method module:base/event._$clearEvent
     * @see    module:base/event._$delEvent
     * @param  {String|Node} arg0 - 节点ID或者对象
     * @param  {String}      arg1 - 事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$clearEvent
     * @see module:base/event._$clearEvent
     */
    _p._$clearEvent = 
    _y._$clearEvent = (function(){
        var _doClearEvent = function(_id,_name,_list){
            _u._$reverseEach(
                _list,function(_item){
                    _p._$delEvent(
                        _id,_name,_item.sfun,_item.capt
                    );
                }
            );
        };
        return function(_element,_type){
            var _id = _e._$id(_element);
            if (!_id) return;
            var _cch_id = _xcache[_id];
            if (!!_cch_id){
                _type = _getTypeList(_type);
                if (!!_type){
                    // clear event by type
                    _u._$forEach(
                        _type,function(_name){
                            _doClearEvent(_id,_name,_cch_id[_name]);
                        }
                    );
                }else{
                    // clear all event
                    _u._$loop(
                        _cch_id,function(_value,_name){
                            _p._$clearEvent(_element,_name);
                        }
                    );
                }
            }
        };
    })();
    /**
     * 触发对象的某个事件，注：对于IE浏览器该接口节点事件有以下限制
     *
     * * 捕获阶段支持需要浏览器IE9+
     * * 节点上自定义事件支持需要浏览器IE9+
     *
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 注册鼠标事件
     *       _v._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的垂直位置
     *               var _y = _v._$pageY(_event);
     *           }
     *       );
     *       // 触发鼠标事件
     *       _v._$dispatchEvent('abc','click');
     *
     *       // 注册自定义事件
     *       _v._$addEvent(
     *           'abc','ok',function(_event){
     *               // TODO something
     *           }
     *       );
     *       // 触发自定义事件
     *       _v._$dispatchEvent('abc','ok');
     *   });
     * ```
     *
     * @method module:base/event._$dispatchEvent
     * @param  {String|Node} arg0 - 节点ID或者对象
     * @param  {String}      arg1 - 鼠标事件类型，不区分大小写，多个事件用空格分隔
     * @param  {Object}      arg2 - 传递的参数信息
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$dispatchEvent
     * @see module:base/event._$dispatchEvent
     */
    _p._$dispatchEvent = 
    _y._$dispatchEvent = function(_element,_type,_options){
        var _element = _e._$get(_element);
        if (!!_element){
            _u._$forEach(
                _getTypeList(_type),function(_name){
                    var _result = _h.__checkEvent(
                        _element,_name
                    );
                    _h.__dispatchEvent(
                        _element,_result.type,_options
                    );
                }
            );
        }
    };
    /**
     * 获取触发事件的节点，可以传入过滤接口来遍历父节点找到符合条件的节点
     *
     * 结构举例
     * ```html
     *   <div id="a">
     *     <p>
     *       <span id="b">123</span>
     *       <span link="a">123</span>
     *       <span class="a link">123</span>
     *       <span data-link="a">123</span>
     *       <label>aaaaa</label>
     *     </p>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 取事件触发节点
     *       _v._$addEvent(
     *           'b','click',function(_event){
     *               // id为b的节点
     *               var _node = _v._$getElement(_event);
     *               // TODO something
     *           }
     *       );
     *
     *       // 事件触发，取id是a的节点
     *       _v._$addEvent(
     *           'b','click',function(_event){
     *               // id为a的节点
     *               var _node = _v._$getElement(
     *                   _event,function(_element){
     *                       return _element.id=='a';
     *                   }
     *               );
     *               // TODO something
     *
     *               // class含link或者属性含link或者data-link的节点
     *               var _node = _v._$getElement(_event,'link');
     *
     *               // 仅匹配class即 class="link xx xxx"
     *               var _node = _v._$getElement(_event,'c:link');
     *
     *               // 仅匹配dataset即 data-link="aaaa"
     *               var _node = _v._$getElement(_event,'d:link');
     *
     *               // 仅匹配attributer即 link="aaa"
     *               var _node = _v._$getElement(_event,'a:link');
     *
     *               // 仅匹配tag即 <label>
     *               var _node = _v._$getElement(_event,'t:label');
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$getElement
     * @param  {Event}    arg0 - 事件对象
     * @param  {Function} arg1 - 过滤接口
     * @return {Node}            符合条件的节点
     */
    _p._$getElement = function(_event){
        if (!_event) return null;
        var _element = _event.target||
                _event.srcElement,
            _filter = arguments[1];
        return _e._$getParent(_element,_filter);
    };
    /**
     * 阻止事件，包括默认事件和传递事件
     *
     * 结构举例
     * ```html
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 事件回调中阻止事件冒泡
     *       _v._$addEvent(
     *           'b','click',function(_event){
     *               // 阻止事件继续传播
     *               // 阻止链接打开的默认事件
     *               _v._$stop(_event);
     *           }
     *       );
     *
     *       // a节点上的点击事件不会触发
     *       _v._$addEvent(
     *           'a','click',function(_event){
     *               alert(0);
     *               // TODO something
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$stop
     * @see    module:base/event._$stopBubble
     * @see    module:base/event._$stopDefault
     * @param  {Event} arg0 - 要阻止的事件对象
     * @return {Void}
     */
    _p._$stop = function(_event){
        _p._$stopBubble(_event);
        _p._$stopDefault(_event);
    };
    /**
     * 阻止事件的冒泡传递
     *
     * 结构举例
     * ```html
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 事件回调中阻止事件冒泡
     *       _v._$addEvent(
     *           'b','click',function(_event){
     *               // 阻止事件继续传播
     *               // 链接仍然会被打开
     *               _v._$stopBubble(_event);
     *           }
     *       );
     *
     *       // a节点上的点击事件不会触发
     *       _v._$addEvent(
     *           'a','click',function(_event){
     *               alert(0);
     *               // TODO something
     *           }
     *       );
     *   });
     * ```
     *
     * @see    module:base/event._$stop}
     * @method module:base/event._$stopBubble
     * @param  {Event} arg0 - 要阻止的事件对象
     * @return {Void}
     */
    _p._$stopBubble = function(_event){
        if (!!_event){
            !!_event.stopPropagation
            ? _event.stopPropagation()
            : _event.cancelBubble = !0;
        }
    };
    /**
     * 阻止标签的默认事件
     *
     * 结构举例
     * ```html
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 事件回调中阻止链接默认事件
     *       _v._$addEvent(
     *           'b','click',function(_event){
     *               // 阻止链接打开页面的默认行为
     *               _v._$stopDefault(_event);
     *           }
     *       );
     *
     *       // a节点上的点击事件仍然会触发
     *       _v._$addEvent(
     *           'a','click',function(_event){
     *               alert(0);
     *               // TODO something
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$stopDefault
     * @see    module:base/event._$stop
     * @param  {Event} arg0 - 要阻止的事件对象
     * @return {Void}
     */
    _p._$stopDefault = function(_event) {
        if (!!_event){
            !!_event.preventDefault
            ? _event.preventDefault()
            : _event.returnValue = !1;
        }
    };
    /**
     * 取事件相对于页面的位置
     *
     * 结构举例
     * ```html
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 回调中取鼠标位置
     *       _v._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的水平、垂直位置
     *               var _pos = _v._$page(_event);
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$page
     * @see    module:base/event._$pageX
     * @see    module:base/event._$pageY
     * @param  {Event}  arg0 - 事件对象
     * @return {Object}        位置信息，{x:10,y:10}
     */
    _p._$page = function(_event){
        return {
            x:_p._$pageX(_event),
            y:_p._$pageY(_event)
        };
    };
    /**
     * 取事件相对于页面左侧的位置，累加所有内部滚动高度
     *
     * 结构举例
     * ```html
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 回调中取鼠标位置
     *       _p._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的水平位置
     *               var _x = _v._$pageX(_event);
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$pageX
     * @see    module:base/event._$clientX
     * @param  {Event}  arg0 - 事件对象
     * @return {Number}        水平位置
     */
    _p._$pageX = function(_event){
        return _getPageOffset(_event,'X','Left');
    };
    /**
     * 取事件相对于页面顶部的位置，累加所有内部滚动高度
     *
     * 结构举例
     * ```html
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 回调中取鼠标位置
     *       _v._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的垂直位置
     *               var _y = _v._$pageY(_event);
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$pageY
     * @see    module:base/event._$clientY
     * @param  {Event}  arg0 - 事件对象
     * @return {Number}        垂直位置
     */
    _p._$pageY = function(_event){
        return _getPageOffset(_event,'Y','Top');
    };
    /**
     * 取事件相对于页面左侧的位置，仅累加页面滚动高度
     *
     * 结构举例
     * ```html
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 回调中取鼠标位置
     *       _p._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的水平位置
     *               var _x = _v._$clientX(_event);
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$clientX
     * @see    module:base/event._$pageX
     * @param  {Event}  arg0 - 事件对象
     * @return {Number}        水平位置
     */
    _p._$clientX = function(_event){
        return _getClientOffset(_event,'X','Left');
    };
    /**
     * 取事件相对于页面顶部的位置，仅累加页面滚动高度
     *
     * 结构举例
     * ```html
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/event'
     *   ],function(_v){
     *       // 回调中取鼠标位置
     *       _v._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的垂直位置
     *               var _y = _v._$pageY(_event);
     *           }
     *       );
     *   });
     * ```
     *
     * @method module:base/event._$clientY
     * @see    module:base/event._$pageY
     * @param  {Event}  arg0 - 事件对象
     * @return {Number}        垂直位置
     */
    _p._$clientY = function(_event){
        return _getClientOffset(_event,'Y','Top');
    };
    
    // for chainable method
    _x._$merge(_y);
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.v'),_p);
    }

    return _p;
});