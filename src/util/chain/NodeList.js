/*
 * ------------------------------------------
 * _$$NodeList， * @version  0.1
 * @author hzzhenghaibo
 * ------------------------------------------
 */
var f = function() {
    // import
    var _  = NEJ.P,
        _e = _("nej.e"),
        _v = _("nej.v"),
        _u = _("nej.u"),
        _proEvent,
        // local vals
        _slice = [].slice,
        _doc = document,
        _de = "documentElement",
        _docElem = _doc[_de],
        _testNode = _doc.createElement('div'),

        // assert 
        _textHandle = _testNode.textContent == null? 'innerText' : 'textContent' ,
        _extend = function(_name, _value, _options) {
            _options = _options || {};
            if (this[_name] == null || _options.override) this[_name] = _value;
            return this
        },
        _bubbleUp = function(_sl, _node, _container) {
            while (_node && _node !== _container) {
                if (nes.matches(_node, _sl)){
                    return _node;
                }
                _node = _node.parentNode;
            }
        },
        /**
         * 根据返回类型决定返回this，还是别的什么
         * @param  {Mix} _result     
         * @param  {String} _methodName 当前方法名
         * @return {Mix}
         */
        _ischainableRet = function(_result, _methodName, _node){
            return (_result === _node || _result === "undefined" || _result === this ||
                    _result === _e || _result === _v);// 这两个是为了兼容nej
        },
        _isAcceptedNode = function(_node){
            if(!_node) return false
            var _type = _node.nodeType;
            return _type === 1 || _type === 9 || //  element document
                _type === 11|| _node.window === _node; // framement window
        },
        // 安全的添加原型, 本作用域内
        _safeProtoExtend = function(Type){
            var _proto = Type.prototype,
                _list = {}
            return {
                extend:function(_name, _fn){
                    _list[_name] = _proto._name;//先保存之前的
                    _proto[_name] = _fn;
                    return this;
                },
                reset: function(){
                    for(var _i in _list) if(_list.hasOwnProperty(_i)){
                        _proto[_i] = _list[_i];
                    }
                }
            }
        },
        _fn = _safeProtoExtend(Function);

    // 安全扩展函数原型
    // 1. autoSet, 自动转换set({name:value})为多重set(name, value)
    _fn.extend("autoSet", function(){
        var _fn = this;
        return function(_key, _value) {
            if (_u._$isObject(_key)){
                var _args = _slice.call(arguments, 1)
                for(var _i in _key){
                    _fn.apply(this, [_i, _key[_i]].concat(_args));
                }
                return this;
            }else{
                return _fn.apply(this, arguments);
            }
        };
    // 2. splitProcess, 自动在首参数为数组时，拆分为多步，
    }).extend("splitProcess", function(_isGetter){
        var _fn = this;
        return function(_params){
            if(_u._$isArray(_params)){
                var _args = _slice.call(arguments, 1),
                    _len = _params.length,
                    _ret
                if(_isGetter) _ret = {}; //当时getter函数需要返回值
                for(var _i = 0 ; _i < _len ;_i++){
                    var _param = _params[_i],
                        _tmpRet = _fn.apply(this, [_param].concat(_args));
                    if(_isGetter && typeof _param === "string") _ret[_param] = _tmpRet;
                }
                return _isGetter? _ret : this
            }else{
                return _fn.apply(this, arguments);
            }
        }
    });

    _extend = _extend.autoSet()

    // name space  _("nej.$")    
    var $ = nej.$ = function(_selector, _context){
        return new _$$NodeList(_selector, _context);
    };
    /**
     * _nodelist的包装类
     * @param {String|Node} _node
     */
    function _$$NodeList(_selector, _context){
        this.length = 0;
        this._signs = {};//标示是否有了当前节点
        this._context = _context || _doc;
        if(!_selector) return 
        if(typeof _selector === "string"){
            this._$add(_e._$all(_selector, _context));
        }else if(_selector instanceof _$$NodeList || _isAcceptedNode(_selector) ||
            _selector.length){ // _$$NodeList 或者 是单节点、或者是类数组(如childNodes)
            this._$add(_selector);
        }
    }

    // 扩展接口
    $._$extend = _extend._$bind($)


    $._$extend({
        _$signal: "_uid",//会绑定在节点上的唯一标示
        _$instances:{},// 缓存对象
        _$handlers:[], // 保存原始handler方法
        _$implement: function(_name, _fn, _options){
            _options = _options || {};
            _extend.call(_$$NodeList.prototype, _name, _options.static? this._transport(_fn): _fn);
        }.autoSet(),
        _transport: function(_fn){
            return function(){
                // if(!this.length) throw Error("内部节点集为空")
                var _args = _slice.call(arguments)
                _args.unshift(this[0]);

                var _ret = _fn.apply(this,_args);
                // 当返回_e、_v、this、_node、undefined(无返回值)都视为链式
                if(!_ischainableRet.call(this, _ret)) return _ret;

                this._$forEach(function(_node, _index){
                    if(_index === 0) return;
                    _args[0] = _node;
                    _fn.apply(this ,_args);
                });
                return this
            }
        },
        _merge: function(_list1, _list2 , _filter){
            var _i = _list1.length || 0,
                _j = 0;
            for( ;_list2[_j] !== undefined;){
                var _tmp = _list2[_j++];
                if(!_filter || _filter.call(_list1, _tmp)){
                    _list1[_i++] = _tmp;
                }
            }
            _list1.length = _i;
            return _list1;
        },
        _toArray: function(_list){
            return $._merge([], _list);
        },
        // ** fork form jQuery **
        _contains: _docElem.contains ? function( _a, _b ) {
            return _a === _b || (_a.nodeType == 9? _a[_de]: _a).contains(_b)
        }: _docElem.compareDocumentPosition ?
        function( _a, _b ) {
            // more info : https://gist.github.com/4601579
            return _b && !!( _a.compareDocumentPosition( _b ) & 16 );
        }: function( _a, _b ) {
            // fallback
            while ( (_b = _b.parentNode) ) {
                if ( _b === _a ) return true;
            }
            return false;
        },
        _$cloneNode:function(_node, _withContent){
            _withContent = !!_withContent;
            var _clone = _node.cloneNode(_withContent),
                _ce, _be;

            if(_withContent){
                _be = nes.all("*", _node);
                _be.push(_node);
                _ce = nes.all("*", _clone)
                _ce.push(_clone);
            }else{
                _be = [_node];
                _ce = [_clone];
            }

            for (_i = _ce.length; _i--;){
                _definitions.fixture.clone(_ce[_i], _be[_i]);
            }
            return _clone;
        },
        _delegateHandlers : {},// for delegate
        _cleanSelector : nes._cleanSelector,
        _$uniqueSort : nes._uniqueSort,
        _$matches : nes.matches,
        _$fn: _$$NodeList.prototype,
        _$uid : nes._getUid
    })

    // proto function 扩展
    // ================================
    var _rclickEvents = /^(?:click|dblclick|contextmenu|DOMMouseScroll|mouse(?:\w+))$/,
        _rkeyEvents = /^key(?:)/
        _definitions ={
        // for insert 
        // 这里统一视为_node2为插入点
        "insertor":{
            "top":function(_node, _node2){
                _node.insertBefore(_node2, _node.firstChild);
            },
            "bottom": function(_node, _node2){
                _node.appendChild(_node2);
            },
            "before":function(_node, _node2){
                var _parent = _node.parentNode;
                if(_parent) _parent.insertBefore(_node2, _node);
            },
            "after":function(_node, _node2){
                var _parent = _node.parentNode;
                if(_parent) _parent.insertBefore(_node2, _node.nextSibling);
            }
        },
        "eventFn":{
             preventDefault: function(){
                 if (this.preventDefault) this.preventDefault();
                 else this.returnValue = false;
                 return this;
             },
             stopPropagation: function(){
                 if (this.stopPropagation) this.__event.stopPropagation();
                 else this.cancelBubble = true;
                 return this;
             },
             stop: function(){
                 this.preventDefault().stopPropagation();
             }           
        },
        fixProps :{
            // 确保表单元素属性被正确设置 IE lt9
            input: 'checked', 
            option: 'selected', 
            textarea: 'value',
            // clone时 , IE某些版本不会正确设置text
            script:"text"
        },
        fixture:{
            // dest src attribute fixed
            "clone": function(_dest, _src){
                var _nodeName, _attr;

                if (_dest.nodeType !== 1) {
                    return;
                }
                // lt ie9 才有
                if (_dest.clearAttributes) {
                    _dest.clearAttributes();
                    _dest.mergeAttributes(_src);
                }
                // 判断是否有需要处理属性的节点
                _nodeName = _dest.nodeName.toLowerCase();
                if(_prop = _definitions.fixProps[_nodeName]){
                    _dest[_prop] = _src[_prop]
                }
                //移除节点标示
                _dest.removeAttribute($._$signal);
                // 移除ID:  TODO? 是否允许有重复ID?
                _dest.removeAttribute("id");
            },
            //patch event
            "event":function(_e){
                var _type = _e.type;
                var _button = _e.button;
                _e.__fixed = true; //标示被fix过
                _e.target = _e.target || _e.srcElement || document; //for ie
                _e.metaKey = !!_e.metaKey; //低版本ie会返回undefined 应该返回


                if(_e.target.nodeType === 3) _e.target = _e.target.parentNode;
                if(_rclickEvents.test(_type)){ //如果是鼠标事件 则初始化page相关
                    _e.pageX = _v._$pageX(_e);
                    _e.pageY = _v._$pageY(_e);
                    if (_type === 'mouseover' || _type === 'mouseout'){//如果是鼠标事件中的mouseover与mouseout
                        var related = event.relatedTarget || event[(_type == 'mouseover' ? 'from' : 'to') + 'Element'];
                        while (related && related.nodeType == 3) related = related.parentNode;
                        this.relatedTarget = related;
                    }
                }
                if( !_e.which && _button !== undefined){
                    // http://api.jquery.com/event.which/ use which
                    _e.which = ( _button & 1 ? 1 : ( _button & 2 ? 3 : ( _button & 4 ? 2 : 0 ) ) );
                }
                _extend(_e, _definitions.eventFn);
            }
        }
    },
    // for traverse
    _traverse = function(_direct){
        var _$matches = $._$matches;

        return function(_selector, _all){
            var _ret = $([]);
            if(typeof _selector === "boolean"){
                _all = _selector;
                _selector = null;
            }
            this._$forEach(function(_node){
                var _tmp = _node[_direct];
                while (_tmp) {
                  if(_tmp.nodeType ===1 && (!_selector || _$matches(_tmp, _selector))){
                    _ret._$add(_tmp);
                    if(!_all) break;
                  }
                  _tmp = _tmp[_direct];
                }
            })
            return _ret;
        }
    };


    $._$implement({

        // NEJ-enhance API :style attr
        _$style: function(_key, _value){
            if(!_key) throw Error("缺少css样式名")
            if(_value === undefined){
                return _e._$getStyle(this[0], _key)
            }
            return this._$forEach(function(_node){
                _e._$setStyle(_node, _key, _value)
            });
        }.splitProcess(true).autoSet(),
        _$attr: function(_key, _value){
            if(!_key) throw Error("缺少属性名")
            if(_value === undefined){
                return _e._$attr(this[0], _key)
            }
            return this._$forEach(function(_node){
                _e._$attr(_node, _key, _value)
            })
        }.splitProcess(true).autoSet(),

        // 1. 工具类
        // ===========
        _$forEach: function(_fn){
            _u._$forEach(this, _fn)
            return this
        },
        _$filter: function(_fn){
            var _ret = [],
                _isSelctor = typeof _fn === "string";
            this._$forEach(function(_node, _index){
                var _test = _isSelctor ? $._$matches(_node, _fn):_fn.call(this, _node, _index);
                if(_test) _ret.push(_node)
            });
            return $(_ret);
        },
        // 当全部返回节点时 包装成对象
        _$map:function(_fn){
            var _ret = [],
                _isNotAllNode = false;
            this._$forEach(function(_node, _index){
                var _res = _fn.call(this, _node, _index);
                if(!_isAcceptedNode(_res)) _isNotAllNode = true
                _ret.push(_res)
            });
            return _isNotAllNode ? _ret : $([])._$add(_ret)
        },
        _$sort:function(){
            var _array = this._$get();
            $._$uniqueSort(_array)
            return $(_array);
        },
        _$add:function(_node){
            if(!_node) return;
            // TODO: 把window 排除在外
            if(typeof _node.length !== "number" || _node === window) _node = [_node];
            $._merge(this, _node, function(_nodum){
                if(!_isAcceptedNode(_nodum)) return false;
                var _uid = $._$uid(_nodum) 
                if(this._signs[_uid]){
                    return false 
                }else{
                    this._signs[_uid] = 1
                    return true
                }
            });
            return this;
        },
        _$get:function(_index, wrap){
            if(typeof _index !== "number") return $._toArray(this);
            return wrap ? $(this[_index]) : this[_index];
        },
        _$last: function(wrap){
            return wrap? $(this[this.length-1]) : this[this.length-1];
        },
        _$first: function(wrap){
            return wrap? $(this[0]) : this[0];
        },
        _$matches: function(_selector){
            return $._$matches(this[0],_selector)
        },
        /**
         * 2. 遍历、获取
         * ======================
         */
        _$parent: _traverse("parentNode"),
        _$prev: _traverse("previousSibling"),
        _$next: _traverse("nextSibling"),
        _$children: function(_selector, _all){
            var _ret = $([]);
            if(typeof _selector === "boolean"){
                _all = _selector;
                _selector = null;
            }
            this._$forEach(function(_node){
                var _backed = _all? _e._$all(_selector || "*", _node)
                    : _selector? $(_node.childNodes)._$filter(_selector)
                    : $(_node.childNodes);
                _ret._$add(_backed);
            });
            return _ret
        },
        _$siblings: function(_selector){ // sibling 默认就是取所有
            return this._$prev(_selector, true)._$add(this._$next(_selector, true))
        },
        // 3. 操作
        // =========================

        // 把jQuery的8个API整成了2个

        // insert是把目标节点内容插到 内部所有节点中
        _$insert: function(_selector, _direct){
            _direct = (_direct && _direct.toLowerCase()) || "bottom";
            if(!_definitions.insertor[_direct]) _direct = "bottom";
            var _content = $(_selector)[0], //将被插入的节点
                _insertor = _definitions.insertor[_direct];
            if(!_content) throw Error("The Element to be inserted is not exist")

            return this._$forEach(function(_node, _index){
                _insertor(_node, _index === 0? _content
                    : $._$cloneNode(_content, true))//如果是多个节点则cloneNode
            });

        },
        // e....  means insert To
        _$insert2: function(_selector, _direct){
            $(_selector)._$insert(this, _direct)
            return this
        },
        _$clone: function(_withContent){
            return this._$map(function(_node){
                return $._$cloneNode(_node, _withContent)
            })
        },
        // 4. 属性
        // ===============================
        _$text: function(_content){
            if(_content === undefined){
                if(!this[0]) throw Error("内部节点为空，无法完成get操作")
                return this[0][_textHandle];
            }
            return this._$forEach(function(_node){
                _node[_textHandle] = _content
            })
        },
        _$html: function(_content){
            if(_content === undefined){
                if(!this[0]) throw Error("内部节点为空，无法完成get操作")
                return this[0].innerHTML;
            }
            return this._$forEach(function(_node){
                _node.innerHTML = _content;
            })
            return this;
        },
        _$val:function(_content){
            if(_content === undefined){
                if(!this[0]) throw Error("内部节点为空，无法完成get操作")
                return this[0].value;
            }
            return this._$forEach(function(_node){
                _node.value = _content;
            })
            return this;
        },

        // 事件相关
        // ==============
        // 私有方法  注册事件代理
        _delegate:function(_event, _selector, _handler){
            _selector = $._cleanSelector(_selector);
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node),
                    _handlers = $._delegateHandlers[_uid] || ($._delegateHandlers[_uid] = {}),
                    _events = _handlers[_event] || (_handlers[_event] = {}),
                    _selectors = _events[_selector] || (_events[_selector] = []);

                var _realCb = function(_e) {//正式回调
                    var _trigger;
                    if (_trigger = _bubbleUp(_selector, _e.target || _e.srcElement , _node)) {
                        _handler.apply(_trigger, arguments);
                    }
                };
                // 保存引用 以可以正确off
                _realCb._raw = _handler;
                _selectors.push(_realCb);
                // 假如不存在对应的容器，则先创建
                _v._$addEvent(_node, _event, _realCb);
                // Fix: 我们保存原始_handler为了 nej的 delEvent可以正确解绑
                // 省去再存储一份handler列表的开销
            })
        },
        // 私有方法 解绑事件代理
        _undelegate:function(_event, _selector, _handler){
            _selector = $._cleanSelector(_selector);
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node);
                var _handlers, _events, _selectors;
                if (!(_handlers = $._delegateHandlers[_uid]) || 
                    !(_events = _handlers[_event]) || !(_selectors = _events[_selector])){
                    return 
                }
                for(var _len = _selectors.length;_len--;){
                    var _fn = _selectors[_len];
                    //如果没有传入_handler或者 函数匹配了
                    if(!_handler || _fn._raw === _handler){
                        _v._$delEvent(_node, _event, _fn)
                        _selectors.splice(_len,1)
                    }
                }
                // 如果被删光了
                if(!_selectors.length) delete _events[_selector];
            })
            return this
        },
        _$on:function(_event, _selector, _handler){
            if(_event === undefined) throw Error("缺少事件名参数");
            if(typeof _selector === "function"){
                _handler = _selector;
                _selector = null;
            };
            var _index = _event.indexOf(" ");
            if(~_index){//有空格分隔 如"click div.m-model"
                _selector = _event.slice(_index + 1);
                _event = _event.slice(0, _index);
            }
            if(!_handler) throw Error("缺少回调函数");
            // 创建一个realHandler
            else {
                var _raw = _handler;
                var _handler = function(_e){
                    _definitions.fixture.event(_e);
                    _raw.apply(this, arguments);
                };
                _raw.real = _handler;//
            }    
            if(_selector){ // on ("click", "li.clas1", handler)或 on("click", "li.class1")
                return this._delegate(_event,_selector, _handler)
            }
            // on("click", handler)
            return this._$forEach(function(_node){
                _v._$addEvent(_node, _event, _handler);
            });
        }.splitProcess().autoSet(),

        _$off:function(_event, _selector, _handler){
            if(typeof _selector === "function"){
                _handler = _selector;
                _selector = null;
            }
            var _index;
            if(_event && ~(_index = _event.indexOf(" "))){//有空格分隔 如"click hello"
                _selector = _event.slice(_index + 1);
                _event = _event.slice(0, _index);
            }
            if(_handler) _handler = _handler.real || _handler;
            if(_selector){ // off("click", ".class")   off("click", ".class", handler)
                return this._undelegate(_event, _selector, _handler)
            }
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node),
                    _handlers = $._delegateHandlers[_uid],
                    _events;
                if(!_event){ // off()
                    if(_handlers){
                        delete $._delegateHandlers[_uid] // 删除所有
                    }
                    _v._$clearEvent(_node, _event);
                }else{ 
                    if(_handlers) _events = _handlers[_event];
                    if(!_handler){ // off("click")
                        if(_events){
                            delete _handlers[_event]
                        }
                        _v._$clearEvent(_node, _event)
                    }else{ // off("click", handler)
                        // 这里不对delegate做清理是因为 这样不会对delegate发生影响
                        _v._$delEvent(_node, _event, _handler)
                    }
                }
            });
        }.splitProcess().autoSet(),

        _$trigger:function(_event, _options){
            if(typeof _event !== 'string') throw Error("事件类型参数错误")
            this._$forEach(function(_node){
                _v._$dispatchEvent(_node, _event, _options)
            })
            return this
        }.splitProcess().autoSet(),

        // http://stackoverflow.com/questions/6599071/array-like-objects-in-javascript
        // 让这个对象看起来像数组
        splice: function(){ throw Error("don't use the NodeList#splice")}
    });

    // 无奈 添加 _$before // _$before2   _$bottom _$bottom2等方法    
    _u._$forIn(_definitions.insertor, function(_value, _key){
        $._$implement("_$" + _key, function(){
           var _args = _slice.call(arguments);
           _args.push(_key)
           return this._$insert.apply(this, _args)
        })
        $._$implement("_$" + _key+"2", function(){
           var _args = _slice.call(arguments);
           _args.push(_key)
           return this._$insert2.apply(this, _args)
        })
    })

    // 添加类似 _$click的事件
    // ================================
    // TODO: 检查是否有遗漏的方法
    var _beAttached = "click dbclick blur change focus focusin focusout keydown keypress keyup mousedown mouseover mouseup mousemove mouseout scroll select submit".split(" ");

    _u._$forEach(_beAttached, function(_eventName){
        $._$implement("_$"+_eventName, function(){
            var _type = typeof arguments[0];
            var _args = _slice.call(arguments);
            _args.unshift(_eventName);
            // click("li", handler)   或者  click(handler)
            if((_type == "function") || (_type === "string" && typeof arguments[1] === "function")){
                this._$on.apply(this, _args);
            }else{
            // click(options) 或者 click()
                this._$trigger.apply(this, _args);
            }
            return this;
        }.autoSet())
    });
    // 把原型还回去, WARN:千万注意
    _fn.reset();
}
NEJ.define('{lib}util/chain/NodeList.js', [
    '{lib}util/query/query.js',
    '{lib}base/element.js',
    '{lib}base/util.js'
    ], f);

