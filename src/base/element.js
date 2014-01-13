/*
 * ------------------------------------------
 * 节点接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _g = _('nej.g'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _v = _('nej.v'),
        _h = _('nej.h'),
        _x = _('nej.x'),
        _cspol,       // css text pool
        _empol = {},  // id:instance for elements not append to page
        _cache = document.createDocumentFragment();
    /**
     * 为节点设置一个唯一的ID<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *    <div id="abc">aaaaa</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _node = _e._$get("abc");
     *   // 如果有id，返回原来的id,否则返回auto-id-12345678(8位随机字符串)
     *   var _id = _e._$id(_node||"abc");
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$id}
     * @param  {String|Node}    节点ID或者对象
     * @return {String}         节点ID
     */
    _e._$id = 
    _x._$id = function(_element){
        _element = _e._$get(_element);
        if (!_element) return;
        var _id = !!_element.id ? _element.id
                : 'auto-id-'+_u._$randString(16);
        _element.id = _id;
        if (_e._$get(_id)!=_element)
            _empol[_id] = _element;
        return _id;
    };
    /**
     * 取节点对象<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 先根据id从缓存中取，然后如果不是数字或字符串被当做节点返回，最后用本地方法根据id返回
     *   var _node = _e._$get("abc");
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$get}
     * @param  {String|Node}    节点ID或者对象
     * @return {Node}           节点对象
     */
    _e._$get = 
    _x._$get = function(_element){
        var _node = _empol[''+_element];
        if (!!_node) return _node;
        if (!_u._$isString(_element)&&
            !_u._$isNumber(_element))
            return _element;
        return document.getElementById(_element);
    };
    /**
     * 取节点的子节点列表<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">
     *       <p>1</p>
     *       <p><span>2</span></p>
     *       <p>3</p>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("abc");
     *   // 取直接的3个子节点(p标签)，不取更深层的节点
     *   var _childs = _e._$getChildren(_e._$get("abc"));
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$getChildren}
     * @param  {String|Node}    节点ID或者对象
     * @param  {String}         样式标识
     * @return {Array}          子节点列表
     */
    _e._$getChildren = 
    _x._$getChildren = function(_element,_clazz){
        _element = _e._$get(_element);
        if (!_element) return null;
        var _list = _h.__getChildren(_element);
        if (!!_clazz)
            _u._$reverseEach(_list,
                function(_node,_index){
                    if (!_e._$hasClassName(_node,_clazz))
                        _list.splice(_index,1);
                });
        return _list;
    };
    /**
     * 根据类名取节点列表<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">
     *     <p class="item">1</p>
     *     <div><p class="item">2</p></div>
     *     <p class="item">3</p>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 获取_parent节点下样式带有"item"的节点列表,如果没有父节点，返回null
     *   var _parent = _e._$get("abc");
     *   _e._$getByClassName(_parent,"item");
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$getByClassName}
     * @param  {String|Node}    节点ID或者对象
     * @param  {String}         类名
     * @return {Array}          节点列表
     */
    _e._$getByClassName = 
    _x._$getByClassName = function(_element,_class){
        _element = _e._$get(_element);
        return !_element?null:_h.
               __getElementsByClassName(_element,_class.trim());
    };
    /**
     * 取页面滚动视窗<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 如果传入节点或者节点id，找它的父节点，直到滚动高度大于可视高度，返回此节点
     *   _e._$getScrollViewPort("abc");
     *   // 如果不传入节点ID或对象,返回document.documentElement和document.body中滚动高度更高的一个
     *   _e._$getScrollViewPort();
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$getScrollViewPort}
     * @param  {String|Node}    节点ID或者对象
     * @return {Node}           视窗节点
     */
    _e._$getScrollViewPort = 
    _x._$getScrollViewPort = function(_element){
        _element = _e._$get(_element);
        if (!!_element){
            _element = _element.parentNode;
            while(!!_element){
                if (_element.scrollHeight>
                    _element.clientHeight)
                    break;
                _element = _element.parentNode;
            }
            if (!!_element) return _element;
        }
        var _tmp1 = document.body.scrollHeight,
            _tmp2 = document.documentElement.scrollHeight;
        return _tmp2>=_tmp1?document.documentElement:document.body;
    };
    /**
     * 取页面盒信息<br/>
     * 
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 获取盒信息，document.body和document.documentElement中较大的一个
     *   _e._$getPageBox();
     * [/code]
     * @api    {nej.e._$getPageBox}
     * @return {Object} 盒信息
     * [ntb]
     *  scrollTop    | 滚动垂直偏移
     *  scrollLeft   | 滚动水平偏移
     *  clientWidth  | 页面可视宽度
     *  clientHeight | 页面可视高度
     *  scrollWidth  | 页面滚动宽度
     *  scrollHeight | 页面滚动高度
     * [/ntb]
     *                  
     */
    _e._$getPageBox = (function(){
        var _getClientBox = function(_list){
            var _result = 0;
            _u._$forEach(
                _list,function(_size){
                    if (!_size) return;
                    if (!_result){
                        _result = _size;
                    }else{
                        _result = Math.min(_result,_size);
                    }
                }
            );
            return _result;
        };
        return function(_document){
            var _doc = _document||document,
                _body0 = _doc.body,
                _body1 = _doc.documentElement,
                _result = {
                    scrollTop:Math.max(_body0.scrollTop,_body1.scrollTop),
                    scrollLeft:Math.max(_body0.scrollLeft,_body1.scrollLeft),
                    clientWidth:_getClientBox([
                        _body0.clientWidth,_body0.offsetWidth,
                        _body1.clientWidth,_body1.offsetWidth
                    ]),
                    clientHeight:_getClientBox([
                        _body0.clientHeight,_body0.offsetHeight,
                        _body1.clientHeight,_body1.offsetHeight
                    ])
                };
            _result.scrollWidth  = Math.max(
                _result.clientWidth,
                _body0.scrollWidth,
                _body1.scrollWidth
            );
            _result.scrollHeight = Math.max(
                _result.clientHeight,
                _body0.scrollHeight,
                _body1.scrollHeight
            );
            return _result;
        };
    })();
    /**
     * 按比例计算最大值<br/>
     * 
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 返回 {width:100,height:5}
     *   var _max = _e._$getMaxBox(
     *       {width:100,height:10},
     *       {width:200,height:10}
     *   );
     *   // 返回 {width:50,height:10}
     *   var _max = _e._$getMaxBox(
     *       {width:100,height:10},
     *       {width:100,height:20}
     *   );
     * [/code]
     * 
     * @api    {nej.e._$getMaxBox}
     * @param  {Object} 最大限制
     * @config {Number} width  宽度
     * @config {Number} height 高度
     * @param  {Object} 原始大小
     * @config {Number} width  宽度
     * @config {Number} height 高度
     * @return {Object} 按比例计算出的最大值信息
     * @config {Number} width  宽度
     * @config {Number} height 高度
     */
    _e._$getMaxBox = function(_max,_org){
        var _result = NEJ.X({},_org),
            _mrto = _max.width/_max.height,
            _orto = _org.width/_org.height;
        // height overflow
        if (_mrto>_orto&&
            _org.height>_max.height){
            _result.height = _max.height;
            _result.width = _result.height*_orto;
        }
        // width overflow
        if (_mrto<_orto&&
            _org.width>_max.width){
            _result.width = _max.width;
            _result.height = _result.width/_orto;
        }
        return _result;
    };
    /**
     * 计算在容器中对齐时的位置信息<br/>
     * 
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 返回 {top:15,left:40}
     *   var _pos = _e._$align(
     *       {width:100,height:40},
     *       {width:20,height:10}
     *   );
     *   // 返回 {top:30,left:0}
     *   var _pos = _e._$align(
     *       {width:100,height:40},
     *       {width:20,height:10},
     *       'left bottom'
     *   );
     * [/code]
     * 
     * @api    {nej.e._$align}
     * @param  {Object} 容器信息
     * @config {Number} width  宽度
     * @config {Number} height 高度
     * @param  {Object} 原始大小
     * @config {Number} width  宽度
     * @config {Number} height 高度
     * @param  {String} 对齐方式，水平+空格+垂直，如left top，默认为 center middle
     *                  水平：left/center/right，
     *                  垂直：top/middle/bottom
     * @return {Object} 位置信息
     * @config {Number} top  垂直位置
     * @config {Number} left 水平位置
     */
    _e._$align = (function(){
        var _reg = /\s+/;
        var _fmap = {
            left:function(){
                return 0;
            },
            center:function(_box,_org){
                return (_box.width-_org.width)/2;
            },
            right:function(_box,_org){
                return _box.width-_org.width;
            },
            top:function(){
                return 0;
            },
            middle:function(_box,_org){
                return (_box.height-_org.height)/2;
            },
            bottom:function(_box,_org){
                return _box.height-_org.height;
            }
        };
        return function(_box,_org,_align){
            var _result = {},
                _arr = (_align||'').split(_reg),
                _top = _fmap[_arr[1]]||_fmap.middle,
                _left = _fmap[_arr[0]]||_fmap.center;
            _result.top = _top(_box,_org);
            _result.left = _left(_box,_org);
            return _result;
        };
    })();
    // /**
     // * 根据选择器取节点列表，IE8以下暂时不支持<br/>
     // * 
     // * 页面结构举例
     // * [code type="html"]
     // *   <div class="item">1</div>
     // *   <div class="item">2</div>
     // *   <div id="abc">
     // *     <p class="item2">11</p>
     // *     <p class="item2">22</p>
     // *     <p class="item2">33</p>
     // *   </div>
     // * [/code]
     // * 脚本举例
     // * [code]
     // *   var _e = NEJ.P("nej.e");
     // *   // 不传_element参数默认获取document中样式带有.item的节点列表
     // *   _e._$query(".item");
     // *   // 传_element参数,获取_element中样式带有.item2的p节点列表
     // *   _e._$query("p.item2",_e._$get("abc"));
     // * [/code]
     // * @api    {nej.e._$query}
     // * @param  {String}         选择器
     // * @param  {String|Node}    相对节点，默认为document
     // * @return {Array}          匹配到的节点列表
     // */
    // _e._$query = function(_selector,_element){
        // return _h.__querySelectorAll(
               // _e._$get(_element)||document,_selector);
    // };
    /**
     * 节点hover行为，高版本浏览器用:hover样式处理<br/>
     * 
     * 样式举例
     * [code type="css"]
     *    .page .element:hover,
     *    .page .element.js-hover{background:#f00;}
     * [/code]
     * 页面结构举例
     * [code type="html"]
     *    <!-- 使用data-hover指定hover效果的样式名称 -->
     *    <div id="abc" data-hover="js-hover">aaaaa</div>
     * [/code]
     * 脚本举例
     * [code]
     *    // 如果hover效果的样式名已经通过data-hover指定
     *    nej.e._$hover('abc');
     *    // 如果hover效果的样式名没有通过data-hover指定
     *    nej.e._$hover('abc','js-hover');
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$hover}
     * @param  {String|Node} 节点
     * @param  {String}      样式，默认为js-hover
     * @return {nej.e}
     */
    _e._$hover = 
    _x._$hover = function(_element,_clazz){
        _h.__hoverElement(_element,_clazz||
            _e._$dataset(_element,'hover')||'js-hover');
        return this;
    };
    /**
     * 固定定位节点
     * 
     * @chainable
     * @api    {nej.e._$fixed}
     * @param  {Object} 节点
     * @return {nej.e}  名字空间
     */
    _e._$fixed = 
    _x._$fixed = function(_element){
        _element = _e._$get(_element);
        if (!_element) return;
        _h.__fixedElement(_element);
    };
    /**
     * 节点鼠标或手势按下/抬起行为<br/>
     * 
     * 样式举例
     * [code type="css"]
     *    .page .element.js-highlight{background:#f00;}
     * [/code]
     * 页面结构举例
     * [code type="html"]
     *    <!-- 使用data-highlight指定highlight效果的样式名称 -->
     *    <div id="abc" data-highlight="js-highlight">aaaaa</div>
     * [/code]
     * 脚本举例
     * [code]
     *    // 如果highlight效果的样式名已经通过data-hover指定
     *    nej.e._$highlight('abc');
     *    // 如果highlight效果的样式名没有通过data-hover指定
     *    nej.e._$highlight('abc','js-highlight');
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$highlight}
     * @param  {String|Node} 节点
     * @param  {String}      样式，默认为js-highlight
     * @return {nej.e}
     */
    _e._$highlight = 
    _x._$highlight = (function(){
        var _cache = {},
            _distance = 2;
        // touch start event
        var _doTouchStart = function(_id,_clazz,_event){
            _cache[_id] = [_v._$pageX(_event),
                           _v._$pageY(_event)];
            //_v._$stopDefault(_event);
            _e._$addClassName(_id,_clazz);
        };
        // touchmove event
        var _doTouchMove = function(_id,_clazz,_event){
            var _point = _cache[_id];
            if (!_u._$isArray(_point)) return;
            var _dx = Math.abs(_v._$pageX(_event)-_point[0]),
                _dy = Math.abs(_v._$pageY(_event)-_point[1]);
            if (_dx>_distance||_dy>_distance)
                _doTouchEnd(_id,_clazz);
        };
        // touchend/touchcancel event
        var _doTouchEnd = function(_id,_clazz){
            if (_u._$isArray(_cache[_id])){
                _cache[_id] = -1;
                _e._$delClassName(_id,_clazz);
            }
        };
        return function(_element,_clazz){
            var _id = _e._$id(_element);
            if (!_id||_cache[_id]!=null) 
                return;
            _cache[_id] = -1;
            _clazz = _clazz||_e._$dataset(
                     _id,'highlight')||'js-highlight';
            _v._$addEvent(_id,'touchstart',
                _doTouchStart._$bind(null,_id,_clazz));
            _v._$addEvent(document,'touchmove',
                _doTouchMove._$bind(null,_id,_clazz));
            _v._$addEvent(document,'touchend',
                _doTouchEnd._$bind(null,_id,_clazz));
            _v._$addEvent(document,'touchcancel',
                _doTouchEnd._$bind(null,_id,_clazz));
        };
    })();
    /**
     * 点击切换样式，可以控制两种效果的交替显示<br/>
     * 
     * 样式举例
     * [code type="css"]
     *   .box .shw{display:none;}
     *   .box.js-toggle .shw{display:block;}
     * [/code]
     * 结构举例
     * [code type="html"]
     *   <div class="box">
     *     <div class="bar" id="click-bar">可点击区域</div>
     *     <div class="shw">
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *     </div>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   // 点击click-bar，交替显示shw节点
     *   nej.e._$toggle('click-bar');
     * 
     *   // 自定义切换样式
     *   nej.e._$toggle('click-bar','js-show');
     * [/code]
     * 
     * 样式举例
     * [code type="css"]
     *   .box{display:none;}
     *   .box.js-toggle{display:block;}
     * [/code]
     * 结构举例
     * [code type="html"]
     *   <div class="box">
     *     <div class="bar" id="click-bar">可点击区域</div>
     *     <div class="shw" id="toggle-node">
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *       <p>content content</p>
     *     </div>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   // 自定义切换样式
     *   nej.e._$toggle('click-bar','toggle-node');
     * 
     *   // 同时自定义切换样式和节点
     *   nej.e._$toggle('click-bar',{
     *       clazz:'js-show',
     *       element:'toggle-node'
     *   });
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$toggle}
     * @param  {String|Node}          触发切换节点
     * @param  {String|Object}        切换配置信息，输入字符串表示样式或者节点
     * @config {String}      clazz    样式名称，默认为js-toggle
     * @config {String|Node} element  切换样式的节点，默认为父节点
     * @config {Function}    ontoggle 节点样式切换触发事件
     * @return {nej.e}
     */
    _e._$toggle = 
    _x._$toggle = (function(){
        // click event
        var _doClick = function(_id,_clazz,_ontoggle){
            var _element = _e._$get(_id),
                _event = {
                    clazz:_clazz,
                    target:_element
                };
            if (_e._$hasClassName(_element,_clazz)){
                _event.toggled = !1;
                _e._$delClassName(_element,_clazz);
            }else{
                _event.toggled = !0;
                _e._$addClassName(_element,_clazz);
            }
            _ontoggle.call(null,_event);
        };
        return function(_element,_options){
            _element = _e._$get(_element);
            if (!!_element){
                var _obj = {
                    ontoggle:_f,
                    clazz:'js-toggle',
                    element:_element.parentNode
                };
                if (_u._$isString(_options)){
                    var _node = _e._$get(_options);
                    !!_node ? _obj.element = _node
                            : _obj.clazz = _options;
                }else{
                    NEJ.EX(_obj,_options);
                    _obj.element = _e._$get(_obj.element);
                }
                var _id = _e._$id(_obj.element);
                _v._$addEvent(
                    _element,'click',
                    _doClick._$bind(
                         null,_id,
                        _obj.clazz,
                        _obj.ontoggle||_f
                ));
            }
            return this;
        };
    })();
    /**
     * 节点focus行为，提供两种模式支持
     * [ul]
     *   0 - 聚焦添加效果，失焦去除效果，高版本使用:focus样式处理
     *   1 - 聚焦添加效果，失焦时只有在当前输入框没有内容时去除效果
     * [/ul]
     * 样式举例
     * [code type="css"]
     *   input:focus,input.js-focus{border:1px solid #f00;}
     *   input{color:#aaa;background:#eee;}
     *   .js-focus-0{color:#000;background-color:#fff;}
     * [/code]
     * 结构举例
     * [code type="html"]
     *   <form>
     *     <!-- 可以使用data-focus指定聚焦时样式名称 -->
     *     <!-- 可以使用data-mode指定聚焦模式 -->
     *     <!-- 通过data-focus/data-mode指定的参数优先级高于接口调用时输入参数 -->
     *     <input id="xxx" type="text" data-focus="js-focus-0" data-mode="1"/>
     *     <!-- 节点没有指定参数 -->
     *     <input id="yyy" type="text"/>
     *   </form>
     * [/code]
     * 脚本举例
     * [code]
     *   // 参数已在节点data-属性中指定
     *   nej.e._$focus('xxx');
     *   // 参数没有指定，通过输入传递，仅指定样式名称
     *   nej.e._$focus('yyy','js-focus-1');
     *   // 参数没有指定，通过输入传递，仅指定聚焦模式
     *   nej.e._$focus('yyy',1);
     *   // 参数没有指定，通过输入传递，同时指定样式名称和聚焦模式
     *   nej.e._$focus('yyy',{clazz:'js-focus-2',mode:1});
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$focus}
     * @param  {String|Node}  节点
     * @param  {Object}       配置参数
     * @config {Number} mode  模式选择，默认为0
     * @config {String} clazz 聚焦样式，默认js-focus
     * @return {nej.e}
     */
    _e._$focus = 
    _x._$focus = function(_element,_options){
        _element = _e._$get(_element);
        if (!_element) return;
        var _mode = 0,
            _clazz = 'js-focus';
        // check param
        if (_u._$isNumber(_options)){
            _mode = _options;
        }else if(_u._$isString(_options)){
            _clazz = _options;
        }else if(_u._$isObject(_options)){
            _mode = _options.mode||_mode;
            _clazz = _options.clazz||_clazz;
        }
        // check data- attribute
        var _value = parseInt(
            _e._$dataset(_element,'mode'));
        if (!isNaN(_value)) _mode = _value;
        _value = _e._$dataset(_element,'focus');
        if (!!_value) _clazz = _value;
        // do focus
        _h.__focusElement(_element,_mode,_clazz);
        return this;
    };
    /**
     * 创建节点<br/>
     * 
     * 页面结构举例
     * [code]
     *   <div id="abc">1</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 创建一个节点，挂到body上
     *   _e._$create("div","m-body",document.body);
     *   // 创建一个节点挂到id是abc的节点上
     *   // 结果：<div id="abc">1<p class="m-list"></p></div>
     *    _e._$create("p","m-list","abc");
     * [/code]
     * 
     * @api    {nej.e._$create}
     * @param  {String}      标签
     * @param  {String}      样式
     * @param  {String|Node} 父节点ID或者对象
     * @return {Node}        节点
     */
    _e._$create = (function(){
        var _map = {a:{href:'#',hideFocus:!0}
                   ,style:{type:'text/css'}
                   ,link:{type:'text/css',rel:'stylesheet'}
                   ,iframe:{frameBorder:0}
                   ,script:{defer:!0,type:'text/javascript'}};
        return function(_tag,_class,_parent){
            var _element = document.createElement(_tag);
            NEJ.X(_element,_map[_tag.toLowerCase()]);
            if (!!_class) _element.className = _class;
            _parent = _e._$get(_parent);
            if (!!_parent) _parent.appendChild(_element);
            return _element;
        };
    })();
    /**
     * 创建可交互框架<br/>
     * 
     * 页面结果举例
     * [code type="html"]
     *   <div id="frameCnt"></div>
     * [/code]
     * 脚本举例
     * [code]
     * var _xFrame = e._$createXFrame({
     *     src:'http://www.baidu.com',
     *     name:'百度',
     *     parent:'frameCnt',
     *     visible:false,
     *     onload:function(){
     *         // 加载frame成功后，name设置成功，为百度
     *         // 加载frame成功后，显示效果正确,display:none
     *       }
     *    });
     * [/code]
     * @api    {nej.e._$createXFrame}
     * @param  {Object}                       可选配置参数，已处理参数
     * @config {String}               src     框架地址
     * @config {String}               name    框架名称
     * @config {String|Node|Function} parent  父节点或者框架加入父容器的执行函数
     * @config {Boolean}              visible 是否可见
     * @return {Node}                         框架节点
     * 
     * [hr]
     * 载入回调
     * @event  {onload}   框架载入回调
     * @param  {Variable} load事件对象
     */
    _e._$createXFrame = (function(){
        var _getFrameSrc = function(){
            if (location.hostname==document.domain)
                return 'about:blank';
            return 'javascript:(function(){document.open();document.domain="'+document.domain+'";document.close();})();';
        };
        var _getFrameWithName = function(_name){
            _name = _name.trim();
            if (!_name) 
                return _e._$create('iframe');
            var _iframe;
            try{
                _iframe = document.createElement(
                          '<iframe name="'+_name+'"></iframe>');
                _iframe.frameBorder = 0;
            }catch(e){
                _iframe = _e._$create('iframe');
                _iframe.name = _name;
            }
            return _iframe;
        };
        return function(_options){
            _options = _options||_o;
            var _iframe = _getFrameWithName(_options.name||'');
            if (!_options.visible)
                _iframe.style.display = 'none';
            if (_u._$isFunction(_options.onload))
                _v._$addEvent(_iframe,'load',function(_event){
                    if (!_iframe.src) return;
                    _v._$clearEvent(_iframe,'load');
                    _options.onload(_event);
                });
            // will trigger onload
            var _parent = _options.parent;
            if (_u._$isFunction(_parent)){
                try{_parent(_iframe);}catch(e){}
            }else{
                (_e._$get(_parent)
                ||document.body).appendChild(_iframe);
            }
            // ensure trigger onload async
            var _src = _options.src||_getFrameSrc();
            window.setTimeout(function(){_iframe.src = _src;},0);
            return _iframe;
        };
    })();
    /**
     * 删除节点<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _ele = _e._$get("abc");
     *   // 移除节点前先清理节点上的事件
     *     _e._$remove(_ele,false);
     *   // 移除节点前不清理节点上的事件
     *     _e._$remove(_ele,true);
     * [/code]
     * 
     * @chainable
     * @see    {#_$removeByEC}
     * @api    {nej.e._$remove}
     * @param  {String|Node} 节点ID或者对象
     * @param  {Boolean}     是否不需要事件清理
     * @return {nej.e}
     */
    _e._$remove = 
    _x._$remove = (function(){
        var _clearImage = function(_image){
            _image.src = _g._$BLANK_IMAGE;
        };
        var _clearFrame = function(_frame){
            _frame.src = 'about:blank';
        };
        return function(_element,_nocls){
            _element = _e._$get(_element);
            if (!_element) return this;
            // clear cache and events
            if (!_nocls) 
               _v._$clearEvent(_element);
            delete _empol[_element.id];
            // clear elements
            var _tag = _element.tagName;
            if (_tag=='IFRAME'){
                _clearFrame(_element);
            }else if(_tag=='IMG'){
                _clearImage(_element);
            }else if (!!_element.getElementsByTagName){
                _u._$forEach(_element
                 .getElementsByTagName('img'),_clearImage);
                _u._$forEach(_element
                 .getElementsByTagName('iframe'),_clearFrame);
            }
            // remove node
            if (!!_element.parentNode){
                _element.parentNode.removeChild(_element);
            }
            return this;
        };
    })();
    /**
     * 节点移至内存<br/>
     * 
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 先生成一个节点加到body下
     *   var _ele = _e._$create('div','js-div',document.body);
     *   // 把节点移动到内存中
     *   e._$removeByEC(_ele);
     *   // 从body上没有取到节点,结果为[]
     *   e._$getByClassName(document.body,'js-div');
     * [/code]
     * 
     * @chainable
     * @see    {#_$remove}
     * @api    {nej.e._$removeByEC}
     * @param  {String|Node} 节点ID或者对象
     * @return {nej.e}
     */
    _e._$removeByEC = 
    _x._$removeByEC = function(_element){
        _element = _e._$get(_element);
        if (!!_element) _cache.appendChild(_element);
        return this;
    };
    /**
     * 清除所有子节点
     * @chainable
     * @api    {nej.e._$clearChildren}
     * @param  {String|Node} 容器节点
     * @return {Void}
     */
    _e._$clearChildren =
    _x._$clearChildren = function(_element){
        _element = _e._$get(_element);
        if (!_element) return;
        _u._$reverseEach(
            _element.childNodes,
            function(_node){
                _e._$remove(_node);
            }
        );
    };
    /**
     * 内联元素增加定位封装<br/>
     * 加入以下html代码
     * [code type="html"]
     *   <input type="text" id="abc"/>
     * [/code]
     * 在执行了以下代码后
     * [code]
     *   var node = nej.e._$wrapInline('abc');
     * [/code]
     * 最后生成以下结构
     * [code type="html"]
     *   <span style="position:relative;zoom:1">
     *     <input type="text" id="abc"/>
     *     <!-- 此api返回以下这个节点 -->
     *     <span style="position:absolute;top:0;left:0;"></span>
     *   </span>
     * [/code]
     * 应用举例
     * [code]
     *     var input = nej.e._$get('abc');
     *     // 返回容器的样式名称
     *     // 通过这个样式名称可以取到一个绝对定位的样式名 class+'-show'
     *     var node = nej.e._$wrapInline(input,{
     *         tag:'label',
     *         clazz:'js-xxx'
     *     });
     *     // 可以在返回的节点里添加想要显示的结构
     *     node.innerHTML = '<span>aaa</span><span>aaa</span>';
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$wrapInline}
     * @param  {String|Node}  内联节点
     * @param  {Object}       据对定位节点配置信息
     * @config {String} tag   标记名称，默认span
     * @config {String} clazz 样式名称
     * @config {String} nid   节点识别样式名，这个会被添加到样式中作为标识
     * @return {Node}         绝对定位的节点
     */
    _e._$wrapInline = 
    _x._$wrapInline = (function(){
        var _clazz,
            _reg0 = /\s+/;
        var _doInitStyle = function(){
            if (!!_clazz) return;
            _clazz = _e._$pushCSSText('.#<uispace>{position:relative;zoom:1;}.#<uispace>-show{position:absolute;top:0;left:100%;cursor:text;white-space:nowrap;overflow:hidden;}');
            _e._$dumpCSSText();
        };
        return function(_element,_options){
            _element = _e._$get(_element);
            if (!_element) 
                return;
            _doInitStyle();
            _options = _options||_o;
            // check relative parent
            var _parent = _element.parentNode;
            if (!_e._$hasClassName(_parent,_clazz)){
                // build wrapper box
                _parent = _e._$create('span',_clazz);
                _element.insertAdjacentElement('beforeBegin',_parent);
                _parent.appendChild(_element);
            }
            // check absolute node
            var _nid = _options.nid||'',
                _node = _e._$getByClassName(
                        _parent,_nid||(_clazz+'-show'))[0];
            if (!_node){
                var _klass = ((_options.clazz||'')+' '+_nid).trim();
                _klass = _clazz+'-show'+(!_klass?'':' ')+_klass;
                _node = _e._$create(_options.tag||'span',_klass);
                _parent.appendChild(_node);
            }
            // append class to parent node
            var _klass = _options.clazz;
            if (!!_klass){
                _klass = (_klass||'').trim()
                          .split(_reg0)[0]+'-parent';
                _e._$addClassName(_parent,_klass);
            }
            return _node;
        };
    })();
    /**
     * 设置或者获取指定标识的数据<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   // 设置成<div id="abc" data-img="image-src">123</div>
     *   var _ele = _e._$get("abc");
     *   // 返回value值:image-src
     *   var _a = e._$dataset(_ele,'img','image-src');
     * [/code]
     * 
     * @chainable
     * @see    {#_$attr}
     * @api    {nej.e._$dataset}
     * @param  {String}     数据标识
     * @param  {String}     数据值
     * @return {String}     数据值
     */
    _e._$dataset = 
    _x._$dataset = (function(){
        var _dataset = {},
            _tag = 'data-',
            _reg = /\-(.{1})/gi;
        // init element dataset
        var _init = function(_element){
            var _id = _e._$id(_element);
            if (!!_dataset[_id]) return;
            var _map = {};
            _u._$forEach(_element.attributes,
            function(_node){
                var _key  = _node.nodeName;
                if (_key.indexOf(_tag)!=0) return;
                _key = _key.replace(_tag,'')
                           .replace(_reg,function($1,$2){
                                return $2.toUpperCase();
                           });
                _map[_key] = _node.nodeValue||'';
            });
            _dataset[_id] = _map;
        };
        return function(_element,_key,_value){
            _element = _e._$get(_element);
            if (!_element) return null;
            var _set = _element.dataset;
            if (!_set){
                _init(_element);
                _set = _dataset[_element.id];
            }
            if (_value!==undefined)
                _set[_key] = _value;
            return _set[_key];
        };
    })();
    /**
     * 取某个节点的属性值<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   // 设置成<div id="abc" data-img="image-src">123</div>
     *   var _ele = _e._$get("abc");
     *   // 返回value值:'image-src'
     *   var _a = e._$dataset(_ele,'img','image-src');
     *   // 如果设置了img的值返回image-src，否则放回空字符串
     *   var _attr = _e._$attr(_e._$get("abc"),"img");
     * [/code]
     * 
     * @chainable
     * @see    {#_$dataset}
     * @api    {nej.e._$attr}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      属性名称
     * @param  {String}      属性值，如果没有设置此参数则表示取值
     * @return {String}      属性值
     */
    _e._$attr = 
    _x._$attr = function(_element,_name,_value){
        _element = _e._$get(_element);
        if (!_element) return '';
        if (_value!==undefined&&
          !!_element.setAttribute)
            _element.setAttribute(_name,_value);
        return _h.__getAttribute(_element,_name);
    };
    /**
     * html代码转节点对象，
     * 如果转换出来的节点数量超过[包含]2个，
     * 则最外面增加一个div节点，即返回的始终是一个节点<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">
     *     <span>123</span>
     *   </div>
     * [/code]
     * 执行以下代码
     * [code]
     *   var _e = NEJ.P("nej.e"),
     *       _html = '<div>1</div><div><span>2</span></div>';
     *   var _node = _e._$html2node(_html)
     * [/code]
     * 返回以下结构
     * [code type="html"]
     *   <div>
     *     <div>1</div>
     *     <div><span>2</span></div>
     *   </div>
     * [/code]
     * 
     * @api    {nej.e._$html2node}
     * @param  {String}     代码
     * @return {Node}       节点
     */
    _e._$html2node = function(_html){
        var _div = document.createElement('div');
        _div.innerHTML = _html;
        var _list = _e._$getChildren(_div);
        return _list.length>1?_div:_list[0];
    };
    /**
     * 将dom节点转为xml串<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 执行以下代码
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 生成<div id="abc">123</div>字符串
     *   var _xml = _e._$dom2xml(_e._$get("abc"));
     * [/code]
     * 
     * @chainable
     * @see    {#_$xml2dom}
     * @api    {nej.e._$dom2xml}
     * @param  {String|Node}    节点
     * @return {String}         xml串
     */
    _e._$dom2xml = 
    _x._$dom2xml = function(_element){
        _element = _e._$get(_element);
        return !_element?'':_h.__serializeDOM2XML(_element);
    };
    /**
     * 将xml转为dom节点<br/>
     * 
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // _xml为xml文本,结构为<div id="abc">123</div>
     *   // 生成<div id="abc">123</div>节点
     *   var _node = _e._$xml2dom(_xml);
     * [/code]
     * 
     * @see    {#_$dom2xml}
     * @api    {nej.e._$xml2dom}
     * @param  {String}    xml文本
     * @return {Node}      节点
     */
    _e._$xml2dom = function(_xml){
        _xml = (_xml||'').trim();
        return !_xml?null:_h.__parseDOMFromXML(_xml);
    };
    /**
     * 文本转指定类型的数据<br/>
     * 
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e"),
     *       _text = '<div id="abc">123</div>';
     *   // 转成dom节点
     *   _e._$text2type(_text,"xml");
     *   // 转成json字符串
     *   _e._$text2type(_text,"json");
     *   // 原样返回
     *   _e._$text2type(_text);
     * [/code]
     * 
     * @api    {nej.e._$text2type}
     * @param  {String}     文本内容
     * @param  {String}     类型
     * @return {Variable}   指定类型的数据
     */
    _e._$text2type = function(_text,_type){
        _text = _text||'';
        switch(_type){
            case 'xml' : 
                _text = _e._$xml2dom(_text);
            break;
            case 'json': 
                try{
                    _text = JSON.parse(_text);
                }catch(ex){
                    _text = null;
                }
            break;
        }
        return _text;
    };
    /**
     * 计算两个节点之间的偏移量<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="a" style="position:relative;padding:5px 0 0 10px;">
     *     <span id="b">123</span>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 计算节点b到节点a(外层需要定位属性)的距离，如果没有指定节点，默认计算的根节点
     *   // _result : {x:10,y:5}
     *   var _result = _e._$offset('b','a');
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$offset}
     * @param  {String|Node}    起始节点
     * @param  {String|Node}    结束节点，没有该参数则计算到根节点
     * @return {Object}         偏移量，如{x:234,y:987}
     */
    _e._$offset = 
    _x._$offset = (function(){
        var _isRoot = function(_element){
            return _element==document.body||
                   _element==document.documentElement;
        };
        return function(_from,_to){
            _from = _e._$get(_from);
            if (!_from) return null;
            _to = _e._$get(_to)||null;
            var _result = {x:0,y:0},
                _isroot,_delta,_border;
            while(!!_from&&_from!=_to){
                _isroot = _isRoot(_from);
                _delta = _isroot?0:_from.scrollLeft;
                _border = parseInt(_e._$getStyle(_from,'borderLeftWidth'))||0;
                _result.x += _from.offsetLeft+_border-_delta;
                _delta = _isroot?0:_from.scrollTop;
                _border = parseInt(_e._$getStyle(_from,'borderTopWidth'))||0;
                _result.y += _from.offsetTop+_border-_delta;
                _from = _from.offsetParent;
            }
            return _result;
        };
    })();
    /**
     * 滚动到指定节点<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="a" style="padding:5px 0 0 10px;"></div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *    var _e = NEJ.P("nej.e");
     *    // 滚动到页面上a这节点的位置
     *    _e._$scrollTo(_e_$get("a"));
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$scrollTo}
     * @param  {Node|String} 节点
     * @return {nej.e}
     */
    _e._$scrollTo = 
    _x._$scrollTo = function(_element){
        var _offset = _e._$offset(_element);
        window.scrollTo(_offset.x,_offset.y);
        return this;
    };
    /**
     * 取样式变换矩阵对象<br/>
     * 
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 生成下面矩阵的对象
     *   // |a:1,b:0,c:0,d:1,e:0:f:0|
     *   // |m11:1,m12:0,m13:0,m14:0|
     *   // |m21:0,m22:1,m23:0,m24:0|
     *   // |m31:0,m32:0,m33:1,m34:0|
     *   // |m41:0,m42:0,m43:0,m44:1|
     *   var _matrix = _e._$matrix("matrix(1,0,0,1,0,0)");
     * [/code]
     * 
     * @api    {nej.e._$matrix}
     * @param  {String}    变化信息
     * @return {CSSMatrix} 变换矩阵对象
     */
    _e._$matrix = function(_matrix){
        _matrix = (_matrix||'').trim();
        return _h.__getCSSMatrix(_matrix);
    };
    /**
     * 设置3D变换，对于不支持3D的系统自动切换为2D变换<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="css3d"></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   var _css3d = _e._$get('css3d');
     *   // 进行css3d变换，对应css样式为-webkit-transform:rotate3d( 2, 1, 1, -75deg);
     *   e._$css3d(_css3d,'rotate',{x:2,y:1,z:1,a:'-75deg'});
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$css3d}
     * @param  {String|Node}     节点ID或者对象
     * @param  {String}          变换类型，matrix/translate/scale/rotate
     * @param  {Object}          变换值，{x:1,y:2,z:3,a:'30deg'}
     * @return {nej.e}
     */ 
    _e._$css3d = 
    _x._$css3d = function(_element,_name,_map){
        _element = _e._$get(_element);
        if (!_element) return this;
        var _value = _h.__getTransformValue(_name,_map);
        if (!_value) return this;
        _e._$setStyle(_element,'transform',_value);
        return this;
    };
    /**
     * 设置节点样式<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 运行以下脚本
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   _e._$style(_e._$get("abc"),{color:'red',width:'100px'});
     * [/code]
     * 得到以下结果
     * [code type="html"]
     *   <div id="abc" style="color:red;width:100px;">123</div>
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$style}
     * @param  {String|Node}    节点
     * @param  {Object}         样式信息{color:'red',width:'100px'}
     * @return {nej.e}
     */
    _e._$style = 
    _x._$style = function(_element,_map){
        _element = _e._$get(_element);
        if (!!_element)
            _u._$forIn(_map,function(_value,_name){
                _e._$setStyle(_element,_name,_value);
            });
        return this;
    };
    /**
     * 设置/获取光标位置在TEXTAREA中的位置
     * 脚本举例
     * [code]
     *   // 设置光标选中内容
     *   nej.e._$cursor('xxx',{start:5,end:10});
     *   // 设置光标位置
     *   nej.e._$cursor('xxx',8);
     *   // 获取光标位置
     *   var _position = nej.e._$cursor('xxx');
     *   // _position.start 光标起始位置
     *   // _position.end   光标结束位置
     * [/code]
     * @api    {nej.e._$cursor}
     * @param  {String|Node}   TEXTAREA节点
     * @param  {Number|Object} 待设置光标的位置，如果起始位置和结束位置一致则输入数值即可
     * @config {Number}  start 起始位置
     * @config {Number}  end   结束位置，没有end则表示与start相同
     * @return {Object}        光标位置，{start:0,end:10}
     */
    _e._$cursor = 
    _x._$cursor = function(_textarea,_options){
        _textarea = _e._$get(_textarea);
        if (!_textarea)
            return {
                start:0,end:0
            };
        if (_u._$isNumber(_options))
            _options = {
                start:_options,
                end:_options
            };
        if (_options!=null){
            if (_options.end==null)
                _options.end = _options.start||0;
            _h.__setCursorPosition(_textarea,_options);
        }else{
            _options = _h.__getCursorPosition(_textarea);
        }
        return _options;
    };
    /**
     * 设置样式<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 运行以下代码
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   _e._$setStyle(_e._$get("abc"),"color","red");
     * [/code]
     * 得到以下结果
     * [code type="html"]
     *   <div id="abc" style="color:red;">123</div>
     * [/code]
     * 
     * @chainable
     * @see    {#_$getStyle}
     * @api    {nej.e._$setStyle}
     * @param  {String|Node}    节点
     * @param  {String}         样式名称
     * @param  {String}         样式值
     * @return {nej.e}
     */
    _e._$setStyle = 
    _x._$setStyle = function(_element,_name,_value){
        _element = _e._$get(_element);
        if (!!_element)
            _h.__applyStyle(
                _element,_name,_value);
        return this;
    };
    /**
     * 取样式值<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" style="color:red;">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 返回节点的颜色值red（高版本浏览器返回rgb值），如果没有返回空字符串
     *   var _value = _e._$getStyle(_e._$get("abc"),"color");
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$getStyle}
     * @param  {String|Node}    节点
     * @param  {String}         样式名称
     * @return {String}         样式值
     */
    _e._$getStyle = 
    _x._$getStyle = function(_element,_name){
        _element = _e._$get(_element);
        if (!_element) return '';
        return _h.__getStyleValue(_element,_name);
    };
    /**
     * 添加样式<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <html>
     *    <head>
     *        <title>test</title>
     *    </head>
     *   </html>
     * [/code]
     * 运行以下代码
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   _e._$addStyle('body{font-size:20px}');
     * [/code]
     * 得到以下结果
     * [code type="html"]
     *   <html>
     *    <head>
     *        <title>test</title>
     *        <style>body{font-size:20px;}</style>
     *    </head>
     *   </html>
     * [/code]
     * 
     * @api    {nej.e._$addStyle}
     * @param  {String} 样式内容
     * @return {Node}   样式节点
     */
    _e._$addStyle = (function(){
        var _reg = /[\s\r\n]+/gi;
        return function(_style){
            _style = (_style||'').trim()
                     .replace(_reg,' ');
            if (!_style) return;
            var _node = _e._$create('style');
            document.head.appendChild(_node);
            _h.__applyCSSText(_node,_h.__filterCSSText(_style));
            return _node;
        };
    })();
    /**
     * 添加脚本<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 运行以下代码
     * [code]
     *   e._$addScript('document.getElementById("abc").style.color = "green"');
     * [/code]
     * 得到以下结果
     * [code type="html"]
     *   <div id="abc" style="color:green;">123</div>
     * [/code]
     * 
     * @api    {nej.e._$addScript}
     * @param  {String}        脚本内容
     * @return {nej.e}
     */
    _e._$addScript = function(_script){
        try{
            _script = _script.trim();
            if (!!_script)
                return (new Function(_script))();
        }catch(ex){
            // ignore
            console.error(ex.message);
            console.error(ex.stack);
        }
    };
    /**
     * 缓存待激活样式<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" class="item">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 设置样式.item{width:300px;}到缓存中
     *   _e._$pushCSSText('.item{width:300px;}');
     * [/code]
     * 
     * @see    {#_$dumpCSSText}
     * @api    {nej.e._$pushCSSText}
     * @param  {String}     样式
     * @return {String}     样式标识
     */
    _e._$pushCSSText = (function(){
        var _reg = /#<.*?>/g,
            _seed = +new Date;
        return function(_css){
            if (!_cspol) 
                _cspol = [];
            var _class = 'auto-'+(_seed++);
            _cspol.push(_css.replace(_reg,_class));
            return _class;
        };
    })();
    /**
     * 激活缓存中的样式<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" class="item">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e");
     *   // 设置样式.item{width:300px;}到缓存中
     *   _e._$pushCSSText('.item{width:300px;}');
     *   // 把缓存中的样式内联到页面
     *   _e._$dumpCSSText();
     * [/code]
     * 
     * @see    {#_$pushCSSText}
     * @api    {nej.e._$dumpCSSText}
     * @return {nej.e}
     */
    _e._$dumpCSSText = function(){
        if (!!_cspol){
            _e._$addStyle(_cspol.join(''));
            _cspol = null;
        }
        return this;
    };
    /**
     * 追加CSS规则
     * @param  {Node}    样式节点
     * @param  {String}  单条样式规则
     * @return {CSSRule} 样式规则对象
     */
    _e._$appendCSSText = function(_style,_css){
        _style = _e._$get(_style);
        return !_style?null:_h.__appendCSSText(_style,_css);
    };
    /**
     * 新增样式类，多个样式用空格分开<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 运行以下代码
     * [code]
     *   var _e = NEJ.P("nej.e"),
     *       _node = _e._$get("abc");
     *   _e._$addClassName(_node,'fc01 fc03');
     * [/code]
     * 得到以下结果
     * [code type="html"]
     *   <div id="abc" class="fc01 fc03">123</div>
     * [/code]
     * 
     * @chainable
     * @see    {#_$delClassName}
     * @api    {nej.e._$addClassName}
     * @param  {String|Node}    要操作的节点ID或者节点对象
     * @param  {String}         要新增的样式类名称
     * @return {nej.e}
     */
    _e._$addClassName = 
    _x._$addClassName = function(){
        _h.__addClassName.apply(_h,arguments);
        return this;
    };
    /**
     * 删除样式类，多个样式用空格分开<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" class="fc01 fc03">123</div>
     * [/code]
     * 运行以下代码
     * [code]
     *   var _e = NEJ.P("nej.e"),
     *       _node = _e._$get("abc");
     *   _e._$delClassName(_node,"fc03");
     * [/code]
     * 得到以下结果
     * [code type="html"]
     *   <div id="abc" class="fc01">123</div>
     * [/code]
     * 
     * @chainable
     * @see    {#_$addClassName}
     * @api    {nej.e._$delClassName}
     * @param  {String|Node}    要操作的节点ID或者节点对象
     * @param  {String}         要删除的样式类名称
     * @return {nej.e}
     */
    _e._$delClassName = 
    _x._$delClassName = function(){
        _h.__delClassName.apply(_h,arguments);
        return this;
    };
    /**
     * 替换节点的样式类名称，多个样式用空格分隔<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" class="fc01 fc03">123</div>
     * [/code]
     * 运行以下代码
     * [code]
     *   var _e = NEJ.P("nej.e"),
     *       _node = _e._$get("abc");
     *   _e._$replaceClassName(_node,"fc03","fc05");
     * [/code]
     * 得到以下结果
     * [code type="html"]
     *   <div id="abc" class="fc01 fc05">123</div>
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$replaceClassName}
     * @param  {String|Node}    要操作的节点ID或者节点对象
     * @param  {String}         要删除的样式类名称
     * @param  {String}         要新增的样式类名称
     * @return {nej.e}
     */
    _e._$replaceClassName = 
    _x._$replaceClassName = function(){
        _h.__replaceClassName.apply(_h,arguments);
        return this;
    };
    /**
     * 检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" class="fc01 fc03">123</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P("nej.e"),
     *       _node = _e._$get("abc");
     *   // 如果有fc01样式返回true，否则返回false
     *   _e._$hasClassName(_node,"fc01");
     * [/code]
     * 
     * @chainable
     * @api    {nej.e._$hasClassName}
     * @param  {String|Node}    节点ID或者对象
     * @param  {String}          样式串
     * @return {Boolean}        是否含指定样式
     */
    _e._$hasClassName = 
    _x._$hasClassName = function(){
        return _h.__hasClassName.apply(_h,arguments);
    };
    // init
    if (!document.head)
         document.head = document.getElementsByTagName('head')[0]||document.body;
    _x.isChange = !0;
};
NEJ.define('{lib}base/element.js',
          ['{lib}base/constant.js'
          ,'{lib}base/event.js'
          ,'{lib}base/util.js'
          ,'{patch}api.js'
          ,'{patch}json.js'],f);