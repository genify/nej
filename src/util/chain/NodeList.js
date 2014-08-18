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
        _x = _("nej.x"),
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
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
            return this;
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
            if(!_node) return false;
            var _type = _node.nodeType;
            return _type === 1 || _type === 9 || //  element document
                _type === 11|| _node.window === _node; // framement window
        },
        // 安全的添加原型, 本作用域内
        _safeProtoExtend = function(Type){
            var _proto = Type.prototype,
                _list = {};
            return {
                extend:function(_name, _fn){
                    _list[_name] = _proto[_name];//先保存之前的
                    _proto[_name] = _fn;
                    return this;
                },
                reset: function(){
                    for(var _i in _list) if(_list.hasOwnProperty(_i)){
                        if(_list[_i] === undefined){
                            delete _proto[_i];
                        }else{
                            _proto[_i] = _list[_i];
                        }
                    }
                }
            };
        },
        _fn = _safeProtoExtend(Function);

    // 安全扩展函数原型
    // 1. autoSet, 自动转换set({name:value})为多重set(name, value)
    _fn.extend("autoSet", function(){
        var _fn = this;
        return function(_key, _value) {
            if (_u._$isObject(_key)){
                var _args = _slice.call(arguments, 1);
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
                    _ret;
                if(_isGetter) _ret = {}; //当时getter函数需要返回值
                for(var _i = 0 ; _i < _len ;_i++){
                    var _param = _params[_i],
                        _tmpRet = _fn.apply(this, [_param].concat(_args));
                    if(_isGetter && typeof _param === "string") _ret[_param] = _tmpRet;
                }
                return _isGetter? _ret : this;
            }else{
                return _fn.apply(this, arguments);
            }
        };
    });

    _extend = _extend.autoSet();

    
  /**    
    *    将输入的选择器指定节点或节点和节点数组包装成_$$NodeList对象，NodeList是一个类似jQuery的对象
    *    可以进行链式操作，拥有大部分nej.e下的接口，并扩展了一部分jQuery的常用方法。
    *
    *    一个脑残的例子告诉你链式调用可以做什么
    *    ```javascript
    *    // 获得某个节点集, 设置样式
    *    $("#chainable li:nth-child(odd)")._$style({
    *        "background": "#cca",
    *        "cursor": "pointer"
    *    })
    *    // 然后抛弃他们 找他们的下一个位置条件满足是4倍数的兄弟节点并设置样式
    *    ._$next(":nth-child(2n)")._$style({
    *        "background": "#a19",
    *        "cursor": "help"
    *    })
    *    // 过滤出其中是4倍数的行,并绑定事件
    *    ._$filter(":nth-child(4n)")._$click(function(_e) {
    *        $(this)._$style("background", "#111");
    *    // 并给他们中的第一行设置边框
    *    })._$get(1, true)._$style("border", "3px solid #222")
    *    // 找到父节点div并且有chainable的id并且设置样式
    *    ._$parent("div#chainable")._$style({
    *        width: "800px",
    *        left: "300px",
    *        position:"absolute"
    *    // 绑定事件以及代理事件
    *    })._$on({
    *        "click" :function(){
    *            var div = document.createElement("div")
    *            div.innerHTML = "haha插入一行"
    *            //每次点击插入一行
    *            $(this)._$insert(div, "bottom");
    *        },
    *        "mouseover li:nth-child(odd)":function(_e){
    *            this._isLight = !this._isLight;
    *            // 每次点击改变背景色
    *            $(this)._$style("background-color", this._isLight? "#cca":"#331")
    *        }
    *    // 获得样式值
    *    })._$style(["width", "left"])
    *    // 到这里链式结束返回{"width":"80px", "left":"30px"}
    *    ```
    *    
    *    复制的NEJ中的接口如下：
    *    [ul]
    *    nej.e._$addClassNam: chainable
    *    nej.e._$delClassNam: chainable
    *    nej.e._$hasClassName
    *    nej.e._$replaceClassName: chainable
    *    nej.e._$toggle: chainable
    *    nej.e._$setStyle: chainable
    *    nej.e._$getStyle
    *    nej.e._$css3d: chainable
    *    nej.e._$offset
    *    nej.e._$getScrollViewPort
    *    nej.e._$fixed: chainable
    *    nej.e._$effect: chainable
    *    nej.e._$fade: chainable
    *    nej.e._$focus: chainable
    *    nej.e._$highlight: chainable
    *    nej.e._$hover: chainable
    *    nej.e._$page
    *    nej.e._$placeholder: chainable
    *    nej.e._$tab
    *    nej.e._$wrapInline
    *    nej.e._$attr: chainable
    *    nej.e._$dataset
    *    nej.e._$remove: chainable
    *    nej.e._$removeByEC: chainable
    *    nej.e._$dom2xml
    *    nej.e._$bindClearAction: chainable
    *    nej.e._$bindCopyAction: chainable
    *    nej.e._$counter
    *    nej.v._$addEvent: chainable
    *    nej.v._$clearEvent: chainable
    *    nej.v._$delEven: chainablet
    *    nej.v._$dispatchEvent: chainable
    *    [/ul]   
    *    nej.$ 支持的选择器与nes选择器一致，具体请参考 https://github.com/leeluolee/nes
    *    页面结构举例
    *    ```html
    *      <ul>
    *          <li><a href=""></a></li>
    *          <li><a href=""></a></li>
    *          <li><a href=""></a></li>
    *          <li><a href=""></a></li>
    *      </ul>
    *    ```
    *    ```javascript
    *      var $ = NEJ.P('nej.$');
    *      $('ul > li:nth-child(2n+1) >a')
    *       .addClassName('odd')
    *       ._$on('click', _callback) //将所有的奇数li节点下的a标签加上className，并进行事件绑定
    *    ```
    *
    *    $接受的参数与jQuery的一致 ，非常灵活
    *    ```javascript
    *    获得"body"节点， 很明显此时节点集只有一个元素
    *    $("body")
    *
    *    // 找到有class1并且有rel属性的节点集，这时可能会有很多个节点
    *    $("body li.class1[rel]")
    *    // 会过滤出childNodes的节点，其他Array Like也是类似
    *    $(document.body.childNodes) 
    *
    *    // 有时候你不确定输入的是什么参数， 安全的再包一次吧，无副作用
    *    $body = $("body")
    *    $body2 = $($body2) 
    *    ```
    *    @chainable
    *    @api    {nej.$}
    *    @param  {String|Array|_$$NodeList|Node} _selector 可以是选择器、节点、节点数组或另一个_$$NodeList实例
    *    @param  {String|Node|_$$NodeList} _context  代表从这个根节点下查找节点，特别是页面上节点还不存在时，需要传入这个参数
    *    @return {_$$NodeList}           返回_$$NodeList实例
    */     
    var $ = nej.$ = function(_selector, _context){
        if(_x.isChange){
            $._$implement(nej.x, {"statics": true});
            _x.isChange = false;
        }
        if (typeof _selector === 'string' && _selector.trim().indexOf("<") == 0) {
        var container = document.createElement('div');
            container.innerHTML = _selector;
            var res = $(container.childNodes);
            return res;
        }
        return new _$$NodeList(_selector, _context);
    };

    function _$$NodeList(_selector, _context){
        this.length = 0;
        this._signs = {};//标示是否有了当前节点
        this._context = _context || _doc;
        if(!_selector) return ;
        if(typeof _selector === "string"){
            // if(/\^<[-\w]+/.test(_selector)) return $.fragment(_selector);
            if(_context && _context instanceof _$$NodeList) _context = _context[0];
            if(typeof _context == 'string') _context = $(_context)[0];
            this._$add(_e._$all(_selector, _context));
        }else if(_selector instanceof _$$NodeList || _isAcceptedNode(_selector) ||
            _selector.length){ // _$$NodeList 或者 是单节点、或者是类数组(如childNodes)
            this._$add(_selector);
        }
    }

    // 扩展接口
    $._$extend = _extend._$bind($);


    $._$extend({
        _$signal: "_uid",//会绑定在节点上的唯一标示
        _$instances:{},// 缓存对象
        _$handlers:[], // 保存原始handler方法
        _$fragment: function(){
        },
        /**
         * 扩展链式化接口，你可以通过两种方式，一是迁移已有的静态接口(比如NEJ的大部分接口都是这样迁移过来的)，而是直接进行_$$NodeList的原型扩展
         *
         * Example:
         * ```javascript
         * // 1. 直接扩展
         * $._$implement("_$hello", function(){
         *     // 遍历容器内的所有节点
         *     this._$forEach(function(_node, _index){
         *         _node.hello = "Hello World"
         *     })
         * })
         * $("li:nth-child(2n)")._$hello() // 所有偶数行都被加上了 hello属性
         * // 2. 直接利用静态方法进行扩展(常用语迁移), 上面扩展等价于
         * $._$implement("_$hello", function(_node){
         *    _node.hello = "Hello World" 
         * }, {static: true})
         * // 3. 创建jQuey的wrap 方法
         * // 创建wrap方法
         * $._$implement("_$wrap", function(_selector){
         *     var $content = $(_selector)
         *     $content._$after2(this)._$insert(this);
         * })
         * $("#list")._$wrap(document.createElement("div"))
         * ```
         *
         * 需要注意的是，当静态接口的迁移时，有如下约定(同时也是NEJ原接口在链式调用的表现约定)
         * [ul]
         * 当返回值为: this 、 传入节点 、 nej.v 、 nej.e 、 undefined (即不返回)时, 视为setter操作,可以进行链式调用, 如上例:
         * 当返回值为其他类型时: 视为getter操作, 返回节点列表中 第一个元素 的返回值，这个也是jQuery的链式接口的表现
         * [/ul]
         * 
         * @api    {nej.$._$implement}
         * @param  {Object} _definition 要扩展的接口集合 (注意不要使用字符串作为键值)
         * @param  {Object} _options 参数  目前只有两个选项{statics: 代表是否是静态接口迁移, override: 是否覆盖原同名方法}
         * @return {this}    
         */
        _$implement: function(_name, _fn, _options){
            _options = _options || {};
            _extend.call(_$$NodeList.prototype, _name, _options.statics? this._transport(_fn): _fn);
        }.autoSet(),
        _transport: function(_fn){
            return function(){
                // if(!this.length) throw Error("内部节点集为空")
                var _args = _slice.call(arguments);
                _args.unshift(this[0]);

                var _ret = _fn.apply(this,_args);
                // 当返回_e、_v、this、_node、undefined(无返回值)都视为链式
                if(!_ischainableRet.call(this, _ret)) return _ret;

                this._$forEach(function(_node, _index){
                    if(_index === 0) return;
                    _args[0] = _node;
                    _fn.apply(this ,_args);
                });
                return this;
            };
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
            return _a === _b || (_a.nodeType == 9? _a[_de]: _a).contains(_b);
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
                _ce = nes.all("*", _clone);
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
    });

    // proto function 扩展
    // ================================
    var _rclickEvents = /^(?:click|dblclick|contextmenu|DOMMouseScroll|mouse(?:\w+))$/,
        _rkeyEvents = /^key(?:)/,
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
                    _dest[_prop] = _src[_prop];
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
                        var related = _e.relatedTarget || _e[(_type == 'mouseover' ? 'from' : 'to') + 'Element'];
                        while (related && related.nodeType == 3) related = related.parentNode;
                        _e.relatedTarget = related;
                    }
                }
                _e.which = _e.charCode != null ? _e.charCode : _e.keyCode;
                if( !_e.which && _button !== undefined){
                    // http://api.jquery.com/event.which/ use which
                    _e.which = ( _button & 1 ? 1 : ( _button & 2 ? 3 : ( _button & 4 ? 2 : 0 ) ) );
                }
                if(!_e.preventDefault) _e.preventDefault = function(){
                    this.returnValue = false;
                    return this;
                };

                if(!_e.stopPropagation) _e.stopPropagation = function(){
                   this.cancelBubble = true; 
                   return this;
                };
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
            });
            return _ret;
        };
    };


    $._$implement({
     /**    
      * 获取节点样式或者设置节点样式, 这个接口的表现与jQuery的css方法一致, 根据参数不同有不同的表现
      * 比如:
      * ```javascript
      * $('li')._$style(name) //相当于_$getStyle 返回样式值
      * $('li')._$style([name1,name2...]) //相当于多重_$getStyle 返回一个Object(如{"height:20px, width:30px..."})
      * $('li')._$style(name, value) // 相当于setStyle 返回this
      * $('li')._$style(obj) //相当于多重版setStyle(即原_$style) 返回this        
      * ```
      * @chainable
      * @api    {nej.$()._$style}
      * @param  {String|Object|Array} _key  可以是String(单取值或设置)，一个对象(多重赋值)，一个数组(多重取值)
      * @param  {String} _value 样式值
      * @return {_$$Nodelist|String|Object} setter操作返回_$$NodeList，单重取值返回String，多重取值返回样式属性为键的Object，表现与jQuery的css接口一致        
      */
        _$style: function(_key, _value){
            if(!_key) throw Error("缺少css样式名");
            if(_value === undefined){
                return _e._$getStyle(this[0], _key);
            }
            return this._$forEach(function(_node){
                _e._$setStyle(_node, _key, _value);
            });
        }.splitProcess(true).autoSet(),
       /**
        * 获取节点属性或者设置节点属性, 这个接口的表现与jQuery的attr一致, 同_$style接口，根据参数不同有不同的表现
        * 比如:
        * ```javascript
        * $('li')._$attr(name): 相当于_$attr 返回属性值
        * $('li')._$attr([name1, name2]) 同style描述 返回{titile:"xxx",rel:"xxx", href:"xxx"}
        * $('li')._$attr(name, value): 相当于_$attr 返回this
        * $('li')._$attr(obj): 相当于多重版的_$attr 返回this
        * ```
        * @chainable
        * @api    {nej.$()._$attr}
        * @param  {String|Object|Array} _key  可以是String(单取值或设置)，一个对象(多重赋值)，一个数组(多重取值)
        * @param  {String} _value 属性值
        * @return {_$$Nodelist|String|Object} setter操作返回_$$NodeList，单重取值返回String，多重取值返回样式属性为键的Object，表现与jQuery的css接口一致        
        */
        _$attr: function(_key, _value){
            if(!_key) throw Error("缺少属性名");
            if(_value === undefined){
                return _e._$attr(this[0], _key);
            }
            return this._$forEach(function(_node){
                _e._$attr(_node, _key, _value);
            });
        }.splitProcess(true).autoSet(),

        /**
         * 类似于ES5的Array#forEach, 一个遍历函数, 即遍历_$$NodeList的所有节点集
         * 比如:
         * ```javascript
         * // 将1,4,7...class含有strong的li元素分别加上阶梯型的高度
         * $("li.strong:nth-child(3n+1)")._$forEach(function(_node, _index){
         *     _node.style.height = "" + (_index+1)*10 + "px"; 
         *     // 这里的this指向实例
         * })   
         * ```
         * 注意callback中传入的节点是裸节点，而不是包装后的_$$NodeList
         * @chainable
         * @api    {nej.$()._$forEach}
         * @param  {Function} _fn 遍历回掉，接受两个参数，当前遍历到的节点和节点下标
         * @return {_$$NodeList}  
         */
        _$forEach: function(_fn){
            _u._$forEach(this, _fn);
            return this;
        },

      /**     
       * 类似于ES5的Array#filter, 一个过滤, 即过滤_$$NodeList的所有节点集并筛选符合的节点
       * 比如:
       * ```javascript
       * // 返回节点集中的匹配选择器.strong:nth-child(3n)的节点
       * $("li")._$filter(".strong:nth-child(3n)") 

       * // 相当于  ===>
       * $("li")._$filter(function(_node){
       *     return $(_node)._$matches(".strong:nth-child(3n)");
       * });        
       * ```
       * 注意callback中传入的节点是裸节点，而不是包装后的_$$NodeList
       * @chainable
       * @api    {nej.$()._$filter}
       * @param  {Function|String} _fn 遍历函数，接受两个参数，当前遍历到的节点和节点下标。同时也接受一个Selector，筛选出节点集中满足选择器的节点
       * @return {_$$NodeList} 
      */        
        _$filter: function(_fn){
            var _ret = [],
                _isSelctor = typeof _fn === "string";
            this._$forEach(function(_node, _index){
                var _test = _isSelctor ? $._$matches(_node, _fn):_fn.call(this, _node, _index);
                if(_test) _ret.push(_node);
            });
            return $(_ret);
        },
        /**
         * 相当于ES5的Array#map, 当返回值全部是节点类型时，返回$NodeListchainable, 否则返回标准结果数组(此时chainable不能)
         *
         * example:
         * ```javascript
         * // 此时返回Array : ["li", "li", "li".........]
         * $("li")._$map(function(_node){
         *     return _node.tagName.toLowerCase()
         * });
         * // 此时返回 $NodeList: 即所有节点的下一个兄弟节点
         * $("li")._$map(function(_node){
         *     return _node.nextSibling
         * });
         * ```
         * 注意callback中传入的节点是裸节点，而不是包装后的_$$NodeList
         * @chainable
         * @api    {nej.$()._$map}
         * @param  {Function} _fn 遍历callback，接受两个参数，当前遍历到的节点和节点下标
         * @return {_$$NodeList}  
         */
        _$map:function(_fn){
            var _ret = [],
                _isNotAllNode = false;
            this._$forEach(function(_node, _index){
                var _res = _fn.call(this, _node, _index);
                if(!_isAcceptedNode(_res)) _isNotAllNode = true;
                _ret.push(_res);
            });
            return _isNotAllNode ? _ret : $([])._$add(_ret);
        },
        /**
         * NodeList中的节点是不保证按文档顺序的(如果是用选择器，则保证是有序的), 你可以手动排序
         * @api    {nej.$()._$sort}
         * @return {_$$NodeList}
         */
        _$sort:function(){
            var _array = this._$get();
            $._$uniqueSort(_array);
            return $(_array);
        },
        /**
         * 向内部节点集填入元素, 会处理好重复以及过滤的逻辑。这个也是$接口依赖的方法。
         * ```javascript
         * var $body = $("body")
         * $body._$add($("tbody")) //==> 添加tbody
         * $body._$add($("tbody")) //==> 什么都不会发生 因为重复了
         * $body._$add(document.body.childNodes) //==> 添加所有的body下的子节点,过滤掉不符合的
         * ```
         * @chainable
         * @api    {nej.$()._$add}
         * @param  {Node|Array|_$$NodeList} _node 要添加的节点或节点集
         * @return {_$$NodeList}      返回this
         */
        _$add:function(_node){
            if(!_node) return;
            // TODO: 把window 排除在外
            if(_node.tagName || typeof _node.length !== "number" || _node === window ) _node = [_node];
            $._merge(this, _node, function(_nodum){
                if(!_isAcceptedNode(_nodum)) return false;
                var _uid = $._$uid(_nodum); 
                if(this._signs[_uid]){
                    return false; 
                }else{
                    this._signs[_uid] = 1;
                    return true;
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
        /**
         * 判断包装节点是否满足某个选择器，即Selector API的matches方法。如果节点集内不止一个节点，则只判断第一个节点
         * Exmaple:
         * ```javascript
         *  $("body tbody td:nth-child(4n)")._$matches("body tbody td:nth-child(2n)")
         *  //返回 true... 这个是当然的, 4倍数的节点当然满足偶数条件
         * ```
         *
         * @chainable
         * @api    {nej.$()._$matches}
         * @param  {String} _selector 供测试的选择器
         * @return {Boolean}          是否通过测试
         */
        _$matches: function(_selector){
            return $._$matches(this[0],_selector);
        },
        /**
         * 查找 所有节点 的第一个(或所有)满足关系的 父节点 集, 并返回$NodeList
         *
         * Example:
         * ```javascript
         * $("tr")._$parent() 
         * //=> ['tbody', 'thead'],两个是因为节点集中的tr元素可能在tbody或thead中
         * $("tr")._$parent("tbody") 
         * //=> ['tbody'] 必须满足tbody
         * $("tr")._$parent(true) 
         * // =>['tbody', 'thead', 'div', 'body' ....] //会向上查找所有父节点
         * $("tr")._$parent("tbody, body",true) 
         * // =>['body', 'tbody'] //会向上查找所有父节点,但是必须满足选择器
         * ```
         * @api    {nej.$()._$parent}
         * @param  {String} _selector 选择器
         * @param  {Boolean} _all     是否获取所有层级的父节点
         * @return {[type]}           
         * @type {[type]}
         */
        _$parent: _traverse("parentNode"),
        /**
         * 与_$parent类似,查找 所有节点 的第一个(或所有根据_all参数)满足关系的 前序兄弟节点 (previousSibling)集, 并返回$NodeList
         * ```javascript 
         * $("td")._$prev("th[scope=row]", true) 
         * // 返回所有在td之前的th元素, 它们的scope属性为 row         
         * $("td")._$prev("th[scope=row]") 
         * // 只返回直接相邻的前节点，如果不满足选择器则返回空节点集
         * ```
         * @api    {nej.$()._$prev} 
         * @param  {String} _selector 选择器
         * @param  {Boolean} _all     是否获取所有前序节点
         * @return {[type]}           
         */
        _$prev: _traverse("previousSibling"),
        /**
         * 与_$prev类似,查找 所有节点 的第一个(或所有根据_all参数)满足关系的 向后兄弟节点 (nextSibling)集, 并返回$NodeList
         * @api    {nej.$()._$next} 
         * @param  {String} _selector 选择器
         * @param  {Boolean} _all     是否获取所有后序节点
         * @return {[type]}           
         */
        _$next: _traverse("nextSibling"),
        /**
         * 查找到 本节点集中 所有节点 的满足选择器关系的 直接子节点 (或 任意层级子节点 )集, 并返回$NodeList
         * ```javascript 
         * $("body, table")._$children();
         * // => 相当于 合并body与table的直接子节点
         * $("body, table")._$children("div, thead");
         * // => 只要他们子节点中的div 与 thead元素
         * $("body, table")._$children(true);
         * // => 这里会获取所有body下的所有层级的子节点(table也在body中) 
         * $("body, table")._$children("td:not(:last-child, :nth-child(2n))",true);
         * // => 返回所有层级的td元素并且满足选择器 td:not(:last-child, :nth-child(2n))
         * ```
         * 
         * @api    {nej.$()._$children} 
         * @param  {String} _selector 选择器
         * @param  {Boolean} _all     是否获取所有层级的节点
         * @return {[type]}           
         */
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
            return _ret;
        },
        /**
         * 满足选择器条件的同级节点，但不包含本身
         * Example
         * ```javascript
         * $("script")._$siblings("title,h2"); // => 返回script的同级节点中的
         * ```
         *
         * @chainable
         * @api    {nej.$()._$siblings} 
         * @param  {String} _selector 
         * @return {_$$NodeList}    这些同级节点会被包装为一个_$$NodeList
         */
        _$siblings: function(_selector){ // sibling 默认就是取所有
            return this._$prev(_selector, true)._$add(this._$next(_selector, true));
        },
        /**
         * 这个insert 拥有jQuery的四个接口的功能(before, after, prepend , append) ，分别用_direct参数控制
         *
         * Example: 
         * ```javascript
         * //将`a.next`插到`#home`的内部的最上方
         * $('#home')._$insert('a.next', 'up');
         * //将a.next插入到`#home`节点后面
         * $('#home')._$insert('a.next', 'after');
         * ```
         * 
         * @api    {nej.$()._$insert} 
         * @param  {String|Node|_$$NodeList} _selector 代表被插入的节点，可以是选择器、节点或是另外一个_$$NodeList对象
         * @param  {String} _direct   插入位置，可以是节点内的底部、顶部(bottom, top)，或节点同层的前后位置(before, after)，默认为bottom
         * @return {_$$NodeList}    返回this
         */
        _$insert: function(_selector, _direct){
            _direct = (_direct && _direct.toLowerCase()) || "bottom";
            if(!_definitions.insertor[_direct]) _direct = "bottom";
            var _content = $(_selector)[0], //将被插入的节点
                _insertor = _definitions.insertor[_direct];
            if(!_content) throw Error("The Element to be inserted is not exist");

            return this._$forEach(function(_node, _index){
                _insertor(_node, _index === 0? _content
                    : $._$cloneNode(_content, true));//如果是多个节点则cloneNode
            });
        },
        /**
         * 这个_$insert2 拥有jQuery的四个接口的功能(insertBefore, insertAfter, prependTo , appendTo) ，分别用_direct参数控制。其实就是_$insert接口的相反版，
         * 你做的是将被插入节点插入到某个节点的指定位置。
         *
         * Example: 
         * ```javascript
         * //将`#home`插到`a.next`的内部的最上方
         * $('#home')._$insert2('a.next', 'up');
         * //将`#home`插入到`a.next`节点后面
         * $('#home')._$insert2('a.next', 'after');
         * ```
         * 
         * @api    {nej.$()._$insert2} 
         * @param  {String|Node|_$$NodeList} _selector 代表参考节点，可以是选择器、节点或是另外一个_$$NodeList对象
         * @param  {String} _direct   插入位置，可以是节点内的底部、顶部(bottom, top)，或节点同层的前后位置(before, after)，默认为bottom
         * @return {_$$NodeList}    返回this
         */
        _$insert2: function(_selector, _direct){
            $(_selector)._$insert(this, _direct);
            return this;
        },
        /**
         * 克隆节点集内部的 所有节点, 并返回clone的目标节点集 $NodeList 实例
         *
         * Example:
         * ```javascript
         * $('.m-template')._$clone(true)._$insert2('body');//将`.m-template`节点clone一份插入到`body`的内部下方
         * ```
         * 
         * @api    {nej.$()._$clone} 
         * @param  {Boolean} _withContent 是否要克隆子节点
         * @return {_$$NodeList}   
         */
        _$clone: function(_withContent){
            return this._$map(function(_node){
                return $._$cloneNode(_node, _withContent);
            });
        },
        /**
         * 获得节点集中的 第一个元素的innerText 或者 设置所有元素的innerText
         *
         * Example:
         * ```javascript
         * $("title,h2")._$text("haha")
         * // 同时设置title与h2的text内容为haha
         * $("title,h2")._$text()
         * // 获得title(第一个元素)的innerText
         * ```
         *
         * @chainable
         * @api    {nej.$()._$text} 
         * @param  {content} _content 要插入的内容 , 不传入则认为是getter操作
         * @return {_$$NodeList|String} setter操作返回_$$NodeList getter操作返回String   
         */
        _$text: function(_content){
            if(_content === undefined){
                if(!this[0]) throw Error("内部节点为空，无法完成get操作");
                return this[0][_textHandle];
            }
            return this._$forEach(function(_node){
                _node[_textHandle] = _content;
            });
        },
        /**
         * 获得节点集中的 第一个元素的innerHTML 或者设置所有元素的innerHTML(与_$text接口类似)
         *
         * Example:
         * ```javascript
         * $("title,h2")._$html("haha")
         * // 同时设置title与h2的innerHTML为haha
         * $("title,h2")._$html()
         * // 获得title(第一个元素)的innerHTML
         * ```
         *
         * @chainable
         * @api    {nej.$()._$html} 
         * @param  {content} _content 要插入的内容 不传入则认为是getter操作
         * @return {_$$NodeList|String} setter操作返回_$$NodeList getter操作返回String   
         */
        _$html: function(_content){
            if(_content === undefined){
                if(!this[0]) throw Error("内部节点为空，无法完成get操作");
                return this[0].innerHTML;
            }
            return this._$forEach(function(_node){
                _node.innerHTML = _content;
            });
            return this;
        },
        /**
         * 获得节点集中的 第一个元素的value 或者设置所有元素的value(与_$text接口类似)
         *
         * Example:
         * ```javascript
         * $("input,textarea")._$val()
         * // 获取第一个满足'input,textarea'选择器元素的value值
         * $("title,h2")._$html("haha")
         * // 获得title(第一个元素)的innerHTML
         * ```
         *
         * @chainable
         * @api    {nej.$()._$html} 
         * @param  {content} _content 要插入的内容
         * @return {_$$NodeList|String} setter操作返回_$$NodeList getter操作返回String   
         */
        _$val:function(_content){
            if(_content === undefined){
                if(!this[0]) throw Error("内部节点为空，无法完成get操作");
                return this[0].value;
            }
            return this._$forEach(function(_node){
                _node.value = _content;
            });
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
            });
        },
        // 私有方法 解绑事件代理
        _undelegate:function(_event, _selector, _handler){
            _selector = $._cleanSelector(_selector);
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node);
                var _handlers, _events, _selectors;
                if (!(_handlers = $._delegateHandlers[_uid]) || 
                    !(_events = _handlers[_event]) || !(_selectors = _events[_selector])){
                    return; 
                }
                for(var _len = _selectors.length;_len--;){
                    var _fn = _selectors[_len];
                    //如果没有传入_handler或者 函数匹配了
                    if(!_handler || _fn._raw === _handler){
                        _v._$delEvent(_node, _event, _fn);
                        _selectors.splice(_len,1);
                    }
                }
                // 如果被删光了
                if(!_selectors.length) delete _events[_selector];
            });
            return this;
        },
        /**
         * 绑定事件，可以使用事件代理, 与jQuery的on类似
         * 
         * __Example:__
         * ```javascript
         * // 1. 普通事件绑定
         * $("body")._$on("click", function(_e){
         *     alert("单个事件绑定"+_e.type)
         * })
         * // 2. 多个普通类型绑定到同一个handler
         * $("body")._$on(["click", "mouseover"], function(_e){
         *     alert("多个type绑定"+_e.type)
         * })
         * // 3. 单个代理事件绑定 这里等同于_$on("click", "tr:nth-child(2n)", handler)
         * $("body")._$on("click tr:nth-child(2n)", function(_e){
         *     // this 对象指向当前`触发`事件的tr:nth-child(2n)
         *     _e.preventDefault()
         *     alert("单个代理事件绑定"+_e.type)
         * })
         * // 4. 多个事件绑定(同回调), 这里分别是普通事件dblclick与代理事件click tr:nth-child(2n)
         * $("body")._$on(["dblclick", "click tr:nth-child(2n)"], function(_e){
         *     _e.preventDefault()
         *     alert("多个事件类型绑定"+_e.type)
         * })
         * // 5. 多重事件绑定, 
         * $("body")._$on({
         *     "dblclick":function(_e){
         *         alert("多重事件绑定之普通版"+_e.type)
         *     },
         *     "click tr:nth-child(2n)":function(_e){
         *         alert("多重事件绑定之代理版"+_e.type)
         *     }
         * })
         * ```
         * @chainable
         * @api    {nej.$()._$on} 
         * @param  {String|Array|Object} _event     事件名，_event支持多种参数类型会有不同的结果
         *                             如果_event参数中不包含空格, 则视为简单事件绑定如，click, 
         *                             如果_event参数中包含空格,则会被split, 左边视为event参数，右边视为_selector参数如'click .next',
         *                             如果_event是个Ojbect,则会视为多重绑定,如{'click .next': callback1, 'mouseover': callback2}
         *                             如果_event是个Array, 则会对多个_event进行同一个函数的绑定, 如['click','mouseover']
         * @param  {String} _selector  如果传入则代表是一个事件代理,可忽略
         * @param  {Function} _handler 回掉函数
         * @return {_$$NodeList}       
         */
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
                return this._delegate(_event,_selector, _handler);
            }
            // on("click", handler)
            return this._$forEach(function(_node){
                _v._$addEvent(_node, _event, _handler);
            });
        }.splitProcess().autoSet(),

        /**
         * 为 节点集内的每一个节点 解除事件回调, 类似jQuery的off方法 
         * __Example__
         * ```javascript
         * // 1. 普通事件解绑
         * $("body")._$off("click", handler)
         * // 2. 多个普通类型事件解绑(同一个handler)
         * $("body")._$off(["click", "mouseover"], handler)
         * // 3. 普通事件清除(即不传入handler) __同时会把节点上click类型的代理事件清除!__
         * $("body")._$off("click")
         * // 4. 多个普通事件清除 同时会把节点上相应类型的代理事件清除!
         * $("body")._$off(["click","mouseover"])
         * // 5. 单个代理事件的解绑
         * $("body")._$off("click","tr:nth-child(2n)", handler)
         * // 或
         * $("body")._$off("click tr:nth-child(2n)", handler)
         * // 6. 多个代理事件的解绑(同一个handler)
         * $("body")._$off(["dblclick td[title]", "click tr:nth-child(2n)"], handler)
         * // 7. 代理事件的清除
         * $("body")._$off("dblclick","td[title]");
         * $("body")._$off("dblclick td[title]");
         * $("body")._$off(["dblclick td[title]", "click tr:nth-child(2n)"])
         * // 8. 多重事件解绑
         * $("body")._$off({
         *     "dblclick td":handler1,
         *     "click tr":handler2
         * });
         * // 9. 所有事件清除 
         * $("body")._$off() //慎重
         * ```
         * 
         * @chainable
         * @api    {nej.$()._$off} 
         * @param  {String|Array|Object} _event 与_$on方法一样，解绑也会根据参数不同可以有很大的灵活度
         *                                      如果_event参数中不包含空格, 则视为简单事件解绑如，click, 
         *                                      如果_event参数中包含空格,则会被split, 左边视为event参数，右边视为_selector参数如'click .next',
         *                                      如果_event是个Ojbect,则会视为多重解绑, 如{'click .next': callback1, 'mouseover': callback2}
         *                                      如果_event是个Array, 则会对多个_event进行同一个函数的解绑, 如['click','mouseover']
         *                                      需要注意_$off与_$on不同的是_event也可以是个空值，代表会解决节点下的所有事件
         * @param  {[type]} _selector [description] 如果传入_selector参数，则会进行事件代理的事件解绑, 可忽略
         * @param  {[type]} _handler  [description] 要解绑对应回调，可忽略
         * @return {_$$NodeList}      
         */
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
                return this._undelegate(_event, _selector, _handler);
            }
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node),
                    _handlers = $._delegateHandlers[_uid],
                    _events;
                if(!_event){ // off()
                    if(_handlers){
                        delete $._delegateHandlers[_uid]; // 删除所有
                    }
                    _v._$clearEvent(_node, _event);
                }else{ 
                    if(_handlers) _events = _handlers[_event];
                    if(!_handler){ // off("click")
                        if(_events){
                            delete _handlers[_event];
                        }
                        _v._$clearEvent(_node, _event);
                    }else{ // off("click", handler)
                        // 这里不对delegate做清理是因为 这样不会对delegate发生影响
                        _v._$delEvent(_node, _event, _handler);
                    }
                }
            });
        }.splitProcess().autoSet(),
        /**
         * 触发每个节点的对应事件, 同nej.v._$dispatchEvent，区别是参数类型自由度高一点
         *                                      如果_event参数为String, 则视为简单事件触发如，click, 
         *                                      如果_event是个Ojbect,则会视为多重触发, 如{'click': param1, 'mouseover': param2}
         *                                      如果_event是个Array, 则会对多个_event进行触发(公用一个options), 如['click','mouseover']
         * Example:
         * ```javascript
         * //触发一个事件
         * _$trigger("click", params) 
         * //一次触发多个事件(如果有参数，他们共用这个参数)
         * _$trigger(["click", "mouseover"], params) 
         * // 触发多个事件有不同参数
         * _$trigger({
         *     "click": params1,
         *     "dblclick": params2
         * })
         * ```
         * 
         * @api    {nej.$()._$trigger} 
         * @param  {String|Array|Object} _event   可以传入多种参数类型
         * @param  {Whatever} _options 同_$dispatchEvent的_options
         * @return {_$$NodeList}          
         */
        _$trigger:function(_event, _options){
            if(typeof _event !== 'string') throw Error("事件类型参数错误");
            this._$forEach(function(_node){
                _v._$dispatchEvent(_node, _event, _options);
            });
            return this;
        }.splitProcess().autoSet(),

        // http://stackoverflow.com/questions/6599071/array-like-objects-in-javascript
        // 让这个对象看起来像数组
        splice: function(){ throw Error("don't use the NodeList#splice");}
    });
    // @ remove 无法被混淆的方法
    // // 无奈 添加 _$before // _$before2   _$bottom _$bottom2等方法    
    // _u._$forIn(_definitions.insertor, function(_value, _key){
    //     $._$implement("_$" + _key, function(){
    //        var _args = _slice.call(arguments);
    //        _args.push(_key)
    //        return this._$insert.apply(this, _args)
    //     })
    //     $._$implement("_$" + _key+"2", function(){
    //        var _args = _slice.call(arguments);
    //        _args.push(_key)
    //        return this._$insert2.apply(this, _args)
    //     })
    // })

    // // 添加类似 _$click的事件
    // // ================================
    // // TODO: 检查是否有遗漏的方法
    //    @
    // var _beAttached = "click dbclick blur change focus focusin focusout keydown keypress keyup mousedown mouseover mouseup mousemove mouseout scroll select submit".split(" ");

    // @ remove 无法被混淆 移除
    // _u._$forEach(_beAttached, function(_eventName){
    //     $._$implement("_$"+_eventName, function(){
    //         var _type = typeof arguments[0];
    //         var _args = _slice.call(arguments);
    //         _args.unshift(_eventName);
    //         // click("li", handler)   或者  click(handler)
    //         if((_type == "function") || (_type === "string" && typeof arguments[1] === "function")){
    //             this._$on.apply(this, _args);
    //         }else{
    //         // click(options) 或者 click()
    //             this._$trigger.apply(this, _args);
    //         }
    //         return this;
    //     }.autoSet())
    // });
    // 把原型还回去, WARN:千万注意
    _fn.reset();
};
NEJ.define('{lib}util/chain/NodeList.js', [
    '{lib}util/query/query.js',
    '{lib}base/element.js',
    '{lib}base/util.js'
    ], f);

