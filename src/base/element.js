/*
 * ------------------------------------------
 * 节点接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module base/element */
NEJ.define([
    './global.js',
    './constant.js',
    './util.js',
    './event.js',
    './chain.js',
    '{platform}element.js'
],function(NEJ,_g,_u,_v,_x,_h,_p,_o,_f,_r){
    // variables
    var _y = {},     // chainable methods
        _cspol,      // css text pool
        _empol = {}, // elements without id property, eg. document,window
        _fragment = document.createDocumentFragment(); // node in memory
    // init
    if (!document.head){
         document.head = document.getElementsByTagName('head')[0]||document.body;
    }
    /**
     * 为节点设置一个唯一的标识
     *
     * 结构举例
     * ```html
     *    <div id="abc">aaaaa</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 如果有id，返回原来的id,否则返回auto-id-12345678(8位随机字符串)
     *       var _id = _e._$id(_node||"abc");
     *   });
     * ```
     *
     * @method module:base/element._$id
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @return {String}             节点标识
     */
    /**
     * @method CHAINABLE._$id
     * @see module:base/element._$id
     */
    _p._$id =
    _y._$id = function(_element){
        _element = _p._$get(_element);
        if (!_element) return;
        var _id = !!_element.id ? _element.id
                : 'auto-id-'+_u._$uniqueID();
        if (!('id' in _element)){
            _empol[_id] = _element;
        }
        _element.id = _id;
        return _id;
    };
    /**
     * 根据标识取节点对象，包括在内存中的节点
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 先根据id从内存中取，再从页面取
     *       var _node = _e._$get("abc");
     *   });
     * ```
     *
     * @method module:base/element._$get
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @return {Node}               节点对象
     */
    _p._$get = function(_element){
        // for document/window
        var _node = _empol[''+_element];
        if (!!_node){
            return _node;
        }
        // element is node
        if (!_u._$isString(_element)&&
            !_u._$isNumber(_element)){
            return _element;
        }
        // node in memory
        var _node = _h.__getElementById(_fragment,_element);
        if (!!_node){
            return _node;
        }
        // element is id
        return document.getElementById(_element);
    };
    /**
     * 取节点的子节点列表
     *
     * 结构举例
     * ```html
     *   <div id="abc">
     *       <p>1</p>
     *       <p><span>2</span></p>
     *       <p>3</p>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 取直接的3个子节点(p标签)
     *       var _childs = _e._$getChildren('abc');
     *
     *       // 使用类名过滤，去带a或者b样式类的子节点
     *       var _childs = _e._$getChildren('abc','a b');
     *   });
     * ```
     *
     * @method module:base/element._$getChildren
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @param  {String}      arg1 - 样式标识
     * @return {Array}              子节点列表
     */
    /**
     * @method CHAINABLE._$getChildren
     * @see module:base/element._$getChildren
     */
    _p._$getChildren =
    _y._$getChildren = function(_element,_clazz){
        _element = _p._$get(_element);
        if (!_element) return null;
        var _list = _h.__getChildren(_element);
        if (!!_clazz){
            _u._$reverseEach(
                _list,function(_node,_index,_list){
                    if (!_p._$hasClassName(_node,_clazz)){
                        _list.splice(_index,1);
                    }
                }
            );
        }
        return _list;
    };
    /**
     * 根据类名取节点列表
     *
     * 结构举例
     * ```html
     *   <div id="abc">
     *     <p class="item">1</p>
     *     <div><p class="item">2</p></div>
     *     <p class="item">3</p>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 获取abc节点下样式带有"item"的节点列表,如果没有父节点，返回null
     *       var _list = _e._$getByClassName('abc','item');
     *   });
     * ```
     *
     * @method module:base/element._$getByClassName
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @param  {String}      arg1 - 类名
     * @return {Array}              节点列表
     */
    /**
     * @method CHAINABLE._$getByClassName
     * @see module:base/element._$getByClassName
     */
    _p._$getByClassName =
    _y._$getByClassName = function(_element,_class){
        _element = _p._$get(_element);
        return !_element ? null :
                _h.__getElementsByClassName(
                    _element,_class.trim()
                );
    };
    /**
     * 根据从兄弟节点中搜索符合条件的节点
     *
     * 结构举例
     * ```html
     *   <div>
     *     <p class="item" id="a1">1</p>
     *     <p class="item" id="a2">2</p>
     *     <p class="item" id="a3">3</p>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 取a2的后一个兄弟节点a3
     *       var _node = _e._$getSibling('a2');
     *
     *       // 取a2的前一个兄弟节点a1
     *       var _node = _e._$getSibling('a2',{backward:true});
     *
     *       // 过滤搜索，从a2向后搜索找id为a4的节点
     *       var _node = _e._$getSibling('a2',function(_element){
     *           return _element.id=='a4'
     *       });
     *
     *       // 过滤搜索，从a2向前搜索找id为a0的节点
     *       var _node = _e._$getSibling('a2',{
     *           backward:true,
     *           filter:function(_element){
     *               return _element.id=='a0'
     *           }
     *       });
     *   });
     * ```
     *
     * @method   module:base/element._$getSibling
     * @param    {String|Node}     arg0     - 节点标识或者对象
     * @param    {Function|Object} arg1     - 如果是函数则表示过滤器，否则为配置信息
     * @property {Boolean}         backward - 是否后向搜索，默认前向搜索
     * @property {Function}        filter   - 节点过滤器，返回true表示需要返回的节点，找到第一个即返回
     * @return   {Node}                       符合条件的节点
     */
    /**
     * @method CHAINABLE._$getSibling
     * @see module:base/element._$getSibling
     */
    _p._$getSibling =
    _y._$getSibling = (function(){
        var _doFilter = function(){
            return !0;
        };
        return function(_element,_filter){
            _element = _p._$get(_element);
            if (!_element){
                return null;
            }
            var _conf = {
                backward:!1,
                filter:_doFilter
            };
            if (_u._$isFunction(_filter)){
                _conf.filter = _filter;
            }else{
                _conf = _u._$fetch(_conf,_filter);
            }
            var _next = _conf.backward
                      ? _h.__previousSibling
                      : _h.__nextSibling;
            while(_element=_next(_element)){
                if (_conf.filter(_element)){
                    break;
                }
            }
            return _element;
        };
    })();
    /**
     * 取节点所在的滚动容器，
     * 从当前节点开始往上遍历，直到出现滚动条的节点
     *
     * 结构举例
     * ```html
     *   <div id="efg">
     *     <div id="abc">123</div>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 加入efg节点出现滚动条，则这里找到的是efg节点
     *       var _sbody = _e._$getScrollViewPort('abc');
     *
     *       // 不带任何参数取页面滚动条所在节点
     *       var _sbody = _e._$getScrollViewPort();
     *   });
     * ```
     *
     * @method module:base/element._$getScrollViewPort
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @return {Node}               视窗节点
     */
    _p._$getScrollViewPort = function(_element){
        _element = _p._$get(_element);
        if (!!_element){
            _element = _element.parentNode;
            while(!!_element){
                if (_element.scrollHeight>
                    _element.clientHeight){
                    break;
                }
                _element = _element.parentNode;
            }
            if (!!_element){
                return _element;
            }
        }
        var _tmp1 = document.body.scrollHeight,
            _tmp2 = document.documentElement.scrollHeight;
        return _tmp2>=_tmp1?document.documentElement:document.body;
    };
    /**
     * 盒模型结构
     *
     * @typedef  {Object} module:base/element~BoxModel
     * @property {Number} scrollTop    - 滚动垂直偏移
     * @property {Number} scrollLeft   - 滚动水平偏移
     * @property {Number} clientWidth  - 页面可视宽度
     * @property {Number} clientHeight - 页面可视高度
     * @property {Number} scrollWidth  - 页面滚动宽度
     * @property {Number} scrollHeight - 页面滚动高度
     */
    /**
     * 取页面盒信息，返回盒信息内容：
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 返回信息见说明
     *       var _box = _e._$getPageBox();
     *   });
     * ```
     *
     * @method module:base/element._$getPageBox
     * @param  {Document} arg0 - 文档对象
     * @return {module:base/element~BoxModel} 盒信息
     */
    _p._$getPageBox = (function(){
        // get min value but not zero
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
        var _farr = [
            {
                main:'scroll',
                sub:['Top','Left'],
                func:function(_key,_body0,_body1){
                    return Math.max(
                        _body0['scroll'+_key],
                        _body1['scroll'+_key]
                    );
                }
            },
            {
                main:'client',
                sub:['Width','Height'],
                func:function(_key,_body0,_body1){
                    return _getClientBox([
                        _body0['client'+_key],
                        _body0['offset'+_key],
                        _body1['client'+_key],
                        _body1['offset'+_key]
                    ]);
                }
            },
            {
                main:'scroll',
                sub:['Width','Height'],
                func:function(_key,_body0,_body1,_result){
                    return Math.max(
                        _result['client'+_key],
                        _body0['scroll'+_key],
                        _body1['scroll'+_key]
                    );
                }
            }
        ];
        return function(_document){
            var _result = {},
                _doc   = _document||document,
                _body0 = _doc.body,
                _body1 = _doc.documentElement;
            _u._$forEach(
                _farr,function(_item){
                    var _main = _item.main;
                    _u._$forEach(
                        _item.sub,function(_key){
                            _result[_main+_key] = _item.func(
                                _key,_body0,_body1,_result
                            );
                        }
                    );
                }
            );
            return _result;
        };
    })();
    /**
     * 按比例将给定大小缩放至限制区域内
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 限制区域大小 100*10
     *       var _limit = {width:100,height:10};
     *
     *       // 给定200*10的大小，由于宽度超出，缩放后为{width:100,height:5}
     *       var _box = _e._$getMaxBox({width:200,height:10},_limit);
     *
     *       // 给定100*20的大小，由于高度超出，缩放后为{width:50,height:10}
     *       var _box = _e._$getMaxBox({width:100,height:20},_limit);
     *
     *       // 给定 50*5，没有超出限制，返回{width:50,height:5}
     *       var _box = _e._$getMaxBox({width:50,height:5},_limit);
     *   });
     * ```
     *
     * @method   module:base/element._$getMaxBox
     * @param    {module:base/element~SizeModel} arg0 - 原始大小
     * @param    {module:base/element~SizeModel} arg1 - 最大限制大小
     * @return   {module:base/element~SizeModel}        按比例计算出的最大值信息
     */
    _p._$getMaxBox = function(_org,_max){
        var _result = _u._$merge({},_org),
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
     * 滚动到指定节点
     *
     * 结构举例
     * ```html
     *   <div id="a" style="padding:5px 0 0 10px;"></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 滚动到页面上a这节点的位置
     *       _e._$scrollTo('a');
     *   });
     * ```
     *
     * @method module:base/element._$scrollTo
     * @param  {Node|String} arg0 - 节点
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$scrollTo
     * @see module:base/element._$scrollTo
     */
    _p._$scrollTo =
    _y._$scrollTo = function(_element){
        var _offset = _p._$offset(_element);
        window.scrollTo(_offset.x,_offset.y);
    };
    /**
     * 大小信息对象
     * @typedef  {Object} module:base/element~SizeModel
     * @property {Number} width  - 宽度
     * @property {Number} height - 高度
     */
    /**
     * 位置信息对象
     * @typedef  {Object} module:base/element~PositionModel
     * @property {Number} top  - 垂直位置
     * @property {Number} left - 水平位置
     */
    /**
     * 计算在容器中对齐时的位置信息
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 容器大小
     *       var _box = {width:100,height:40};
     *
     *       // 默认居中对齐返回 {top:15,left:40}
     *       var _pos = _e._$align(_box,{width:20,height:10});
     *
     *       // 左下对齐返回 {top:30,left:0}
     *       var _pos = _e._$align(_box,{width:20,height:10},'left bottom');
     *   });
     * ```
     *
     * @method module:base/element._$align
     * @param  {module:base/element~SizeModel} arg0 - 容器大小
     * @param  {module:base/element~SizeModel} arg1 - 原始大小
     * @param  {String} arg2 - 对齐方式，水平+空格+垂直，如left top，默认为 center middle，
     *                         水平：left/center/right，
     *                         垂直：top/middle/bottom
     * @return {module:base/element~PositionModel} 位置信息
     */
    _p._$align = (function(){
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
                _arr  = (_align||'').split(_reg),
                _top  = _fmap[_arr[1]]||_fmap.middle,
                _left = _fmap[_arr[0]]||_fmap.center;
            _result.top = _top(_box,_org);
            _result.left = _left(_box,_org);
            return _result;
        };
    })();
    /**
     * 计算两个节点之间的偏移量
     *
     * 结构举例
     * ```html
     *   <div id="a" style="position:relative;padding:5px 0 0 10px;">
     *     <span id="b">123</span>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 计算节点b到节点a(外层需要定位属性)的距离，如果没有指定节点，默认计算的根节点
     *       // _result : {x:10,y:5}
     *       var _result = _e._$offset('b','a');
     *   });
     * ```
     *
     * @method module:base/element._$offset
     * @param  {String|Node} arg0 - 起始节点
     * @param  {String|Node} arg1 - 结束节点，没有该参数则计算到根节点
     * @return {Object}             偏移量，如{x:234,y:987}
     */
    /**
     * @method CHAINABLE._$offset
     * @see module:base/element._$offset
     */
    _p._$offset =
    _y._$offset = (function(){
        var _isRoot = function(_element){
            return _element==document.body||
                   _element==document.documentElement;
        };
        return function(_from,_to){
            _from = _p._$get(_from);
            if (!_from){
                return null;
            }
            _to = _p._$get(_to)||null;
            var _result = {x:0,y:0},
                _isroot,_delta,_border;
            while(!!_from&&_from!=_to){
                _isroot = _isRoot(_from);
                _delta = _isroot?0:_from.scrollLeft;
                _border = parseInt(_p._$getStyle(_from,'borderLeftWidth'))||0;
                _result.x += _from.offsetLeft+_border-_delta;
                _delta = _isroot?0:_from.scrollTop;
                _border = parseInt(_p._$getStyle(_from,'borderTopWidth'))||0;
                _result.y += _from.offsetTop+_border-_delta;
                _from = _from.offsetParent;
            }
            return _result;
        };
    })();
    /**
     * 设置/获取光标位置在TEXTAREA中的位置
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 设置光标选中内容
     *       _e._$cursor('xxx',{start:5,end:10});
     *       // 设置光标位置
     *       _e._$cursor('xxx',8);
     *
     *       // 获取光标位置
     *       // _position.start 光标起始位置
     *       // _position.end   光标结束位置
     *       var _position = _e._$cursor('xxx');
     *   });
     * ```
     *
     * @method   module:base/element._$cursor
     * @param    {String|Node}   arg0  - TEXTAREA或者INPUT节点
     * @param    {Number|Object} arg1  - 待设置光标的位置，如果起始位置和结束位置一致则输入数值即可
     * @property {Number}        start - 起始位置
     * @property {Number}        end   - 结束位置，没有end则表示与start相同
     * @return   {Object}                光标位置，{start:0,end:10}
     */
    /**
     * @method CHAINABLE._$cursor
     * @see module:base/element._$cursor
     */
    _p._$cursor =
    _y._$cursor = function(_textarea,_options){
        _textarea = _p._$get(_textarea);
        if (!_textarea){
            return {start:0,end:0};
        }
        // position
        if (_u._$isNumber(_options)){
            _options = {
                start:_options,
                end:_options
            };
        }
        if (_options!=null){
            if (_options.end==null){
                _options.end = _options.start||0;
            }
            _h.__setCursorPosition(_textarea,_options);
        }else{
            _options = _h.__getCursorPosition(_textarea);
        }
        return _options;
    };
    /**
     * 节点占全屏
     *
     * @method module:base/element._$fullScreen
     * @param  {Node} arg0 - 节点
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$fullScreen
     * @see module:base/element._$fullScreen
     */
    _p._$fullScreen =
    _y._$fullScreen = function(_element){
        _element = _p._$get(_element);
        if (!!_element){
            _h.__fullScreen(
                _element,
                _p._$getPageBox()
            );
        }
    };
    /**
     * 为节点增加用于盖select/flash等控件的层
     *
     * @method module:base/element._$mask
     * @see    module:base/element._$unmask
     * @param  {Node} arg0 - 节点
     * @return {Node}        盖层节点
     */
    /**
     * @method CHAINABLE._$mask
     * @see module:base/element._$mask
     */
    _p._$mask =
    _y._$mask = function(_element){
        _element = _p._$get(_element);
        if (!!_element){
            _p._$id(_element);
            return _h.__mask(_element);
        }
        return null;
    };
    /**
     * 为节点移除用于盖select/flash等控件的层
     *
     * @method module:base/element._$unmask
     * @see    module:base/element._$mask
     * @param  {Node} arg0 - 节点
     * @return {Node}        盖层节点
     */
    /**
     * @method CHAINABLE._$unmask
     * @see module:base/element._$unmask
     */
    _p._$unmask =
    _y._$unmask = function(_element){
        _element = _p._$get(_element);
        if (!!_element){
            _p._$id(_element);
            return _h.__unmask(_element);
        }
        return null;
    };
    /**
     * 创建节点，使用该接口创建的结构后续可通过_$get接口根据ID取到节点
     *
     * 结构举例
     * ```javascript
     *   <div id="abc">1</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 创建一个节点，挂到body上
     *       _e._$create("div","m-body",document.body);
     *
     *       // 创建一个节点挂到id是abc的节点上
     *       // 结果：<div id="abc">1<p class="m-list"></p></div>
     *       _e._$create("p","m-list","abc");
     * 
     *       // 创建一个节点放在内存中
     *       var _node = _e._$create('div');
     *       _node.innerHTML = '<p id="a">aaaaaa</p><p id="b">bbbbbb</p>';
     *       // 后续可以通过id取id为a的节点
     *       var _pa = _e._$get('a');
     *   });
     * ```
     *
     * @method module:base/element._$create
     * @param  {String}      arg0 - 标签
     * @param  {String}      arg1 - 样式
     * @param  {String|Node} arg2 - 父节点标识或者对象
     * @return {Node}               节点
     */
    _p._$create = (function(){
        var _map = {
            a:{href:'#',hideFocus:!0},
            style:{type:'text/css'},
            link:{type:'text/css',rel:'stylesheet'},
            iframe:{frameBorder:0},
            script:{defer:!0,type:'text/javascript'}
        };
        return function(_tag,_class,_parent){
            var _element = document.createElement(_tag);
            _u._$merge(_element,_map[_tag.toLowerCase()]);
            if (!!_class) _element.className = _class;
            _parent = _p._$get(_parent);
            if (!!_parent){
                _parent.appendChild(_element);
            }else{
                // append to documentfragment for get by id
                _fragment.appendChild(_element);
            }
            return _element;
        };
    })();
    /**
     * 创建可交互框架
     *
     * 结构举例
     * ```html
     *   <div id="frameCnt"></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *      var _xFrame = _e._$createXFrame({
     *          src:'http://www.baidu.com',
     *          name:'百度',
     *          parent:'frameCnt',
     *          visible:false,
     *          onload:function(){
     *              // 加载frame成功后，name设置成功，为百度
     *              // 加载frame成功后，显示效果正确，display:none
     *          }
     *      });
     *   });
     * ```
     *
     * @method   module:base/element._$createXFrame
     * @param    {Object}               arg0    - 可选配置参数
     * @property {String}               src     - 框架地址
     * @property {String}               name    - 框架名称
     * @property {String|Node|Function} parent  - 父节点或者框架加入父容器的执行函数
     * @property {Boolean}              visible - 是否可见
     * @property {Function}             onload  - 框架载入回调
     * @return {Node}                             框架节点
     */
    _p._$createXFrame = (function(){
        var _getFrameSrc = function(){
            if (location.hostname==document.domain){
                return 'about:blank';
            }
            return 'javascript:(function(){document.open();document.domain="'+document.domain+'";document.close();})();';
        };
        var _getFrameWithName = function(_name){
            _name = _name.trim();
            if (!_name){
                return _p._$create('iframe');
            }
            // pass name to frame
            var _iframe;
            try{
                _iframe = document.createElement(
                          '<iframe name="'+_name+'"></iframe>');
                _iframe.frameBorder = 0;
            }catch(e){
                _iframe = _p._$create('iframe');
                _iframe.name = _name;
            }
            return _iframe;
        };
        return function(_options){
            _options = _options||_o;
            var _iframe = _getFrameWithName(_options.name||'');
            if (!_options.visible){
                _iframe.style.display = 'none';
            }
            if (_u._$isFunction(_options.onload)){
                _v._$addEvent(_iframe,'load',function(_event){
                    if (!_iframe.src) return;
                    _v._$clearEvent(_iframe,'load');
                    _options.onload(_event);
                });
            }
            // will trigger onload
            var _parent = _options.parent;
            if (_u._$isFunction(_parent)){
                try{_parent(_iframe);}catch(e){}
            }else{
                (_p._$get(_parent)||document.body).appendChild(_iframe);
            }
            // ensure trigger onload async
            var _src = _options.src||_getFrameSrc();
            window.setTimeout(function(){
                _iframe.src = _src;
            },0);
            return _iframe;
        };
    })();
    /**
     * 删除节点
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 移除节点前先清理节点上的事件
     *       _e._$remove('abc',false);
     *       // 移除节点前不清理节点上的事件
     *       _e._$remove('abc',true);
     *   });
     * ```
     *
     * @method module:base/element._$remove
     * @see    module:base/element._$removeByEC
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @param  {Boolean}     arg1 - 是否禁止事件清理
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$remove
     * @see module:base/element._$remove
     */
    _p._$remove =
    _y._$remove = (function(){
        var _fmap = {
            img:function(_node){
                _node.src = _g._$BLANK_IMAGE;
            },
            iframe:function(_node){
                _node.src = 'about:blank';
            }
        };
        var _doClear = function(_node,_tag){
            if (!_tag){
                var _xtag = (_node.tagName||'').toLowerCase(),
                    _func = _fmap[_xtag];
                if (!!_func){
                    _func(_node);
                }
                return;
            }
            if (!!_node.getElementsByTagName){
                _u._$forEach(
                    _node.getElementsByTagName(_tag),
                    _doClear
                );
            }
        };
        return function(_element){
            _element = _p._$get(_element);
            if (!!_element){
                // clear events
                if (!arguments[1]){
                    _v._$clearEvent(_element);
                }
                // clear elements
                _doClear(_element);
                _doClear(_element,'img');
                _doClear(_element,'iframe');
                // remove node
                if (!!_element.parentNode){
                    _element.parentNode.removeChild(_element);
                }
            }
        };
    })();
    /**
     * 节点移至内存
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 先生成一个节点加到body下
     *       var _node = _e._$create('div','js-div',document.body);
     *       // 把节点移动到内存中
     *       _e._$removeByEC(_node);
     *       // 从body上没有取到节点,结果为[]
     *       _e._$getByClassName(document.body,'js-div');
     *   });
     * ```
     *
     * @method module:base/element._$removeByEC
     * @see    module:base/element._$remove
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$removeByEC
     * @see module:base/element._$removeByEC
     */
    _p._$removeByEC =
    _y._$removeByEC = function(_element){
        _element = _p._$get(_element);
        if (!!_element){
            _fragment.appendChild(_element);
        }
    };
    /**
     * 清除所有子节点
     *
     * 结构举例
     * ```html
     *   <ul id="abc">
     *     <li>aaaaaaaaaaaaa</li>
     *     <li>bbbbbbbbbbbbb</li>
     *     <li>ccccccccccccc</li>
     *   </ul>
     *
     *   <table id="efg">
     *     <tr><td>1111</td><td>1111</td></tr>
     *     <tr><td>2222</td><td>2222</td></tr>
     *     <tr><td>3333</td><td>3333</td></tr>
     *   </table>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 清除ul下的子节点
     *       _e._$clearChildren('abc');
     *
     *       // 清除table下的子节点
     *       _e._$clearChildren('efg');
     *   });
     * ```
     *
     * @method module:base/element._$clearChildren
     * @see    module:base/element._$remove
     * @param  {String|Node} arg0 - 容器节点
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$clearChildren
     * @see module:base/element._$clearChildren
     */
    _p._$clearChildren =
    _y._$clearChildren = function(_element){
        _element = _p._$get(_element);
        if (!!_element){
            _u._$reverseEach(
                _element.childNodes,
                function(_node){
                    _p._$remove(_node);
                }
            );
        }
    };
    /**
     * 内联元素增加定位封装
     *
     * 结构举例
     * ```html
     *   <input type="text" id="abc"/>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 包装定位的span
     *       _e._$wrapInline('abc');
     *   });
     * ```
     *
     * 生成结构如下
     * ```html
     *   <span style="position:relative;zoom:1">
     *     <input type="text" id="abc"/>
     *     <!-- 此api返回以下这个节点 -->
     *     <span style="position:absolute;top:0;left:0;"></span>
     *   </span>
     * ```
     *
     * 应用举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 返回容器的样式名称
     *       // 通过这个样式名称可以取到一个绝对定位的样式名 class+'-show'
     *       var _node = _e._$wrapInline('abc',{
     *           tag:'label',
     *           clazz:'js-xxx'
     *       });
     *       // 可以在返回的节点里添加想要显示的结构
     *       _node.innerHTML = '<span>aaa</span><span>aaa</span>';
     *   });
     * ```
     *
     * @method   module:base/element._$wrapInline
     * @param    {String|Node}  arg0  - 内联节点
     * @param    {Object}       arg1  - 绝对定位节点配置信息
     * @property {String}       tag   - 标记名称，默认span
     * @property {String}       nid   - 节点识别样式名，这个会被添加到样式中作为标识
     * @property {String}       clazz - 样式名称
     * @return   {Node}                 绝对定位的节点
     */
    /**
     * @method CHAINABLE._$wrapInline
     * @see module:base/element._$wrapInline
     */
    _p._$wrapInline =
    _y._$wrapInline = (function(){
        var _clazz,
            _reg0 = /\s+/;
        var _doInitStyle = function(){
            if (!!_clazz) return;
            _clazz = _p._$pushCSSText('.#<uispace>{position:relative;zoom:1;}.#<uispace>-show{position:absolute;top:0;left:100%;cursor:text;white-space:nowrap;overflow:hidden;}');
            _p._$dumpCSSText();
        };
        return function(_element,_options){
            _element = _p._$get(_element);
            if (!_element){
                return null;
            }
            // init style
            _doInitStyle();
            _options = _options||_o;
            // check relative parent
            var _parent = _element.parentNode;
            if (!_p._$hasClassName(_parent,_clazz)){
                // build wrapper box
                _parent = _p._$create('span',_clazz);
                _element.insertAdjacentElement('beforeBegin',_parent);
                _parent.appendChild(_element);
            }
            // check absolute node
            var _nid = _options.nid||'',
                _node = _p._$getByClassName(
                    _parent,_nid||
                   (_clazz+'-show')
                )[0];
            if (!_node){
                var _klass = ((_options.clazz||'')+' '+_nid).trim();
                _klass = _clazz+'-show'+(!_klass?'':' ')+_klass;
                _node = _p._$create(_options.tag||'span',_klass);
                _parent.appendChild(_node);
            }
            // append class to parent node
            var _klass = _options.clazz;
            if (!!_klass){
                _klass = (_klass||'').trim().split(_reg0)[0]+'-parent';
                _p._$addClassName(_parent,_klass);
            }
            return _node;
        };
    })();
    /**
     * 设置或者获取指定标识的数据
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 设置值操作
     *       // <div id="abc" data-img="http://a.b.com/a.png">123</div>
     *       // 返回value值: http://a.b.com/a.png
     *       var _src = _e._$dataset('abc','img','http://a.b.com/a.png');
     *
     *       // 取值操作
     *       var _src = _e._$dataset('abc','img');
     *   });
     * ```
     *
     * @method module:base/element._$dataset
     * @see    module:base/element._$attr
     * @param  {String} arg0 - 数据标识
     * @param  {String} arg1 - 数据值
     * @return {String}        数据值
     */
    /**
     * @method CHAINABLE._$dataset
     * @see module:base/element._$dataset
     */
    _p._$dataset =
    _y._$dataset = function(_element,_key,_value){
        var _id = _p._$id(_element);
        return !_id ? null :
                _h.__dataset(
                    _p._$get(_element),
                    _key,_value
                );
    };
    /**
     * 取某个节点的属性值
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 设置成 <div id="abc" data-img="http://a.b.com/a.png">123</div>
     *       // 返回value值: http://a.b.com/a.png
     *       var _src = _e._$attr('abc','data-img','http://a.b.com/a.png');
     *
     *       // 如果设置了img的值返回data-img，否则放回空字符串
     *       var _src = _e._$attr('abc','data-img');
     *   });
     * ```
     *
     * @method module:base/element._$attr
     * @see    module:base/element._$dataset
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @param  {String}      arg1 - 属性名称
     * @param  {String}      arg2 - 属性值，如果没有设置此参数则表示取值
     * @return {String}             属性值
     */
    /**
     * @method CHAINABLE._$attr
     * @see module:base/element._$attr
     */
    _p._$attr =
    _y._$attr = function(_element,_name,_value){
        _element = _p._$get(_element);
        if (!_element){
            return '';
        }
        if (_value!==undefined&&!!_element.setAttribute){
            _element.setAttribute(_name,_value);
        }
        return _h.__getAttribute(_element,_name);
    };
    /**
     * html代码转节点对象，
     * 如果转换出来的节点数量超过[包含]2个，
     * 则最外面增加一个容器节点，即返回的始终是一个节点
     *
     * 结构举例
     * ```html
     *   <div id="abc">
     *     <span>123</span>
     *   </div>
     * ```
     *
     * 代码举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       var _node = _e._$html2node('<div>1</div><div><span>2</span></div>');
     *   });
     * ```
     *
     * 返回结果
     * ```html
     *   <div> <!-- 返回此节点 -->
     *     <div>1</div>
     *     <div><span>2</span></div>
     *   </div>
     * ```
     *
     * @method module:base/element._$html2node
     * @param  {String} arg0 - 代码
     * @return {Node}          节点
     */
    _p._$html2node = (function(){
        var _reg = /<(.*?)(?=\s|>)/i, // first tag name
            _tmap = {li:'ul',tr:'table',td:'tr',th:'tr',option:'select'};
        return function(_html){
            var _tag;
            if (_reg.test(_html)){
                _tag = _tmap[RegExp.$1]||'';
            }
            var _div = _p._$create(_tag||'div');
            _div.innerHTML = _html;
            var _list = _p._$getChildren(_div);
            return _list.length>1?_div:_list[0];
        };
    })();
    /**
     * 将dom节点转为xml串
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_p){
     *       // 生成<div id="abc">123</div>字符串
     *       var _xml = _p._$dom2xml('abc'));
     *   });
     * ```
     *
     * @see    module:base/element._$xml2dom
     * @method module:base/element._$dom2xml
     * @param  {String|Node} arg0 - 节点
     * @return {String}             XML代码
     */
    /**
     * @method CHAINABLE._$dom2xml
     * @see module:base/element._$dom2xml
     */
    _p._$dom2xml =
    _y._$dom2xml = function(_element){
        _element = _p._$get(_element);
        return !_element?'':_h.__serializeDOM2XML(_element);
    };
    /**
     * 将xml转为dom节点
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 生成<div id="abc">123</div>节点
     *       var _node = _e._$xml2dom('<div id="abc">123</div>');
     *   });
     * ```
     *
     * @method module:base/element._$xml2dom
     * @see    module:base/element._$dom2xml
     * @param  {String} arg0 - xml文本
     * @return {Node}          DOM节点
     */
    _p._$xml2dom = function(_xml){
        _xml = (_xml||'').trim();
        return !_xml?null:_h.__parseDOMFromXML(_xml);
    };
    /**
     * dom节点转对象，多用于XML DOM转数据对象
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     *
     *   <div id="efg">
     *     <p>aaaa</p>
     *     <span>bbbb</span>
     *   </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_p){
     *       // 返回对象{div:'123'}
     *       var _obj = _p._$dom2object('abc');
     *
     *       // 返回对象{div:{p:'aaaa',span:'bbbb'}}
     *       var _obj = _p._$dom2object('efg');
     *   });
     * ```
     *
     * @method module:base/element._$dom2object
     * @see    module:base/element._$xml2object
     * @param  {String|Node} arg0 - 节点
     * @return {Object}             转换完成的对象
     */
    /**
     * @method CHAINABLE._$dom2object
     * @see module:base/element._$dom2object
     */
    _p._$dom2object =
    _y._$dom2object = function(_dom,_obj){
         _obj = _obj||{};
         _dom = _p._$get(_dom);
         if (!_dom) return _obj;
        var _name = _dom.tagName.toLowerCase(),
            _list = _p._$getChildren(_dom);
        if (!_list||!_list.length){
            _obj[_name] = _dom.textContent||_dom.text||'';
            return _obj;
        }
        var _tmp = {};
        _obj[_name] = _tmp;
        _u._$forEach(
            _list,function(_node){
                _p._$dom2object(_node,_tmp);
            }
        );
        return _obj;
    };
    /**
     * XML转对象
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 返回 {user:{id:'1',username:'aaa',password:'123456'}}
     *       var _obj = _e._$xml2object('\
     *           <?xml version="1.0" encoding="utf-8" ?>\
     *           <user>\
     *             <id>1</id>\
     *             <username>aaa</username>\
     *             <password>123456</password>\
     *           </user>\
     *       ');
     *   });
     * ```
     *
     * @method module:base/element._$xml2object
     * @see    module:base/element._$dom2object
     * @param  {String} arg0 - xml代码
     * @return {Object}        对象
     */
    _p._$xml2object = function(_xml){
        try{
            return _p._$dom2object(_p._$xml2dom(_xml));
        }catch(ex){
            return null;
        }
    };
    /**
     * 文本转指定类型的数据
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 转成dom节点
     *       var _dom = _e._$text2type('<div id="abc">123</div>',"xml");
     *       // 转成json字符串
     *       var _json = _e._$text2type('{"a":"aaaaaaaaaaaaa"}',"json");
     *       // 原样返回
     *       var _text = _e._$text2type('<div id="abc">123</div>');
     *   });
     * ```
     *
     * @method module:base/element._$text2type
     * @param  {String} arg0 - 文本内容
     * @param  {String} arg1 - 类型，如xml/json/text
     * @return {Variable}      指定类型的数据
     */
    _p._$text2type = (function(){
        var _fmap = {
            xml:function(_text){
                return _p._$xml2dom(_text);
            },
            json:function(_text){
                try{
                    return JSON.parse(_text);
                }catch(ex){
                    return null;
                }
            },
            dft:function(_text){
                return _text;
            }
        };
        return function(_text,_type){
            _type = (_type||'').toLowerCase();
            return (_fmap[_type]||_fmap.dft)(_text||'');
        };
    })();
    /**
     * 批量设置节点样式
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       _e._$style('abc',{color:'red',width:'100px'});
     *   });
     * ```
     *
     * 输出结果
     * ```html
     *   <div id="abc" style="color:red;width:100px;">123</div>
     * ```
     *
     * @method module:base/element._$style
     * @see    module:base/element._$setStyle
     * @param  {String|Node} arg0 - 节点
     * @param  {Object}      arg1 - 样式信息{color:'red',width:'100px'}
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$style
     * @see module:base/element._$style
     */
    _p._$style =
    _y._$style = function(_element,_map){
        _element = _p._$get(_element);
        if (!!_element){
            _u._$forIn(_map,function(_value,_name){
                _p._$setStyle(_element,_name,_value);
            });
        }
    };
    /**
     * 设置单个样式
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       _e._$setStyle('abc','color','red');
     *   });
     * ```
     *
     * 输出结果
     * ```html
     *   <div id="abc" style="color:red;">123</div>
     * ```
     *
     * @method module:base/element._$setStyle
     * @see    module:base/element._$getStyle
     * @param  {String|Node} arg0 - 节点
     * @param  {String}      arg1 - 样式名称
     * @param  {String}      arg2 - 样式值
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$setStyle
     * @see module:base/element._$setStyle
     */
    _p._$setStyle =
    _y._$setStyle = function(_element,_name,_value){
        _element = _p._$get(_element);
        if (!!_element){
            _h.__setStyleValue(
                _element,_name,
                _h.__processCSSText(_value)
            );
        }
    };
    /**
     * 取样式值
     *
     * 结构举例
     * ```html
     *   <div id="abc" style="color:red;">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 返回节点的颜色值red（高版本浏览器返回rgb值），如果没有返回空字符串
     *       var _value = _e._$getStyle('abc','color');
     *   });
     * ```
     *
     * @method module:base/element._$getStyle
     * @see    module:base/element._$setStyle
     * @param  {String|Node} arg0 - 节点
     * @param  {String}      arg1 - 样式名称
     * @return {String}             样式值
     */
    /**
     * @method CHAINABLE._$getStyle
     * @see module:base/element._$getStyle
     */
    _p._$getStyle =
    _y._$getStyle = function(_element,_name){
        _element = _p._$get(_element);
        return !_element ? '' :
                _h.__getStyleValue(
                    _element,_name
                );
    };
    /**
     * 页面注入脚本
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 注入脚本，全局执行环境
     *       _e._$addScript('\
     *           document.getElementById("abc").style.color = "green"\
     *       ');
     *   });
     * ```
     *
     * 输出结果
     * ```html
     *   <div id="abc" style="color:green;">123</div>
     * ```
     *
     * @method module:base/element._$addScript
     * @param  {String} arg0 - 脚本内容
     * @return {Void}
     */
    _p._$addScript = function(_script){
        try{
            _script = _script.trim();
            if (!!_script){
                return (new Function(_script))();
            }
        }catch(ex){
            // ignore
            console.error(ex.message);
            console.error(ex.stack);
        }
    };
    /**
     * 注入页面内联样式，
     * 样式支持前缀标记$&lt;vendor&gt; ，
     * 如下样式值支持3D/2D切换，优先选用3D，格式：$&lt;NAME|VALUE&gt;
     *
     * * NAME支持：scale/rotate/translate/matrix
     * * VALUE格式：x=1&y=2&z=3&a=30
     *
     *
     * 范例如$&lt;scale|a=30&gt;，各名称支持的参数列表
     *
     * | 名称              | 参数 |
     * | :--        | :-- |
     * | scale      | x,y,z |
     * | rotate     | x,y,z,a |
     * | translate  | x,y,z |
     * | matrix     | m11,m12,m13,m14,m21,m22,m23,m24,m31,m32,m33,m34,m41,m42,m43,m44 |
     *
     *
     * 结构举例
     * ```html
     *   <html>
     *    <head>
     *        <title>test</title>
     *    </head>
     *   </html>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 注入样式
     *       _e._$addStyle('body{font-size:20px}');
     *
     *       // 注入样式支持变量
     *       _e._$addStyle('\
     *           .a{$<vendor>transform-origin:0 0;}\
     *           .b{$<vendor>transform:$<translate|x=0&y=1&z=1>}\
     *       ');
     *   });
     * ```
     *
     * 输出结果
     * ```html
     *   <html>
     *    <head>
     *        <title>test</title>
     *        <style>body{font-size:20px;}</style>
     *        <style>
     *           .a{-webkit-transform-origin:0 0;}\
     *           .b{-webkit-transform:translate3d(0,1,1);}\
     *        </style>
     *    </head>
     *   </html>
     * ```
     *
     * @method module:base/element._$addStyle
     * @param  {String} arg0 - 样式内容
     * @return {Node}          样式节点
     */
    _p._$addStyle = (function(){
        var _reg = /[\s\r\n]+/gi;
        return function(_css){
            _css = (_css||'').replace(_reg,' ').trim();
            var _node = null;
            if (!!_css){
                _node = _p._$create('style');
                document.head.appendChild(_node);
                _h.__injectCSSText(
                    _node,_h.__processCSSText(_css)
                );
            }
            return _node;
        };
    })();
    /**
     * 缓存待激活样式
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 设置样式到缓存中，自动生成样式名，返回自动生成的类名#<class>
     *       var _class = _e._$pushCSSText('.#<uispace>{width:300px;}');
     *
     *       // 把缓存中的样式内联到页面
     *       _e._$dumpCSSText();
     *   });
     * ```
     *
     * @method module:base/element._$pushCSSText
     * @see    module:base/element._$dumpCSSText
     * @param  {String} arg0 - 样式
     * @return {String}        样式标识
     */
    _p._$pushCSSText = (function(){
        var _reg = /#<(.*?)>/g,
            _seed = +new Date;
        return function(_css,_data){
            if (!_cspol){
                _cspol = [];
            }
            var _class = 'auto-'+_u._$uniqueID(),
                _dmap = _u._$merge({uispace:_class},_data);
            _cspol.push(
                _css.replace(_reg,function($1,$2){
                    return _dmap[$2]||$1;
                })
            );
            return _class;
        };
    })();
    /**
     * 激活缓存中的样式
     *
     * 结构举例
     * ```html
     *   <div id="abc" class="item">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 设置样式.item{width:300px;}到缓存中
     *       _e._$pushCSSText('.item{width:300px;}');
     *
     *       // 把缓存中的样式内联到页面
     *       _e._$dumpCSSText();
     *   });
     * ```
     *
     * @method module:base/element._$dumpCSSText
     * @see    module:base/element._$pushCSSText
     * @return {Void}
     */
    _p._$dumpCSSText = function(){
        if (!!_cspol){
            _p._$addStyle(_cspol.join(' '));
            _cspol = null;
        }
    };
    /**
     * 追加CSS规则
     *
     * 结构举例
     * ```html
     *   <style id="abc"></style>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 设置样式.item{width:300px;}到缓存中
     *       _e._$appendCSSText('node-id','.item{width:300px;}');
     *   });
     * ```
     *
     * @method module:base/element._$appendCSSText
     * @see    module:base/element._$addStyle
     * @param  {Node}   arg0 - 样式节点
     * @param  {String} arg1 - 单条样式规则
     * @return {CSSRule}       样式规则对象
     */
    /**
     * @method CHAINABLE._$appendCSSText
     * @see module:base/element._$appendCSSText
     */
    _p._$appendCSSText =
    _y._$appendCSSText = function(_element,_css){
        _element = _p._$get(_element);
        return !_element ? null :
                _h.__appendCSSText(
                    _element,
                    _h.__processCSSText(_css)
                );
    };
    /**
     * 新增样式类，多个样式用空格分开
     *
     * 结构举例
     * ```html
     *   <div id="abc">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 添加样式 fc01 fc03
     *       _e._$addClassName('abc','fc01 fc03');
     *   });
     * ```
     *
     * 输出结果
     * ```html
     *   <div id="abc" class="fc01 fc03">123</div>
     * ```
     *
     * @method module:base/element._$addClassName
     * @see    module:base/element._$delClassName
     * @see    module:base/element._$replaceClassName
     * @param  {String|Node} arg0 - 要操作的节点标识或者节点对象
     * @param  {String}      arg1 - 要新增的样式类名称
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$addClassName
     * @see module:base/element._$addClassName
     */
    _p._$addClassName =
    _y._$addClassName = function(_element,_class){
        _element = _p._$get(_element);
        if (!!_element){
            _h.__processClassName(
                _element,'add',_class
            );
        }
    };
    /**
     * 删除样式类，多个样式用空格分开
     *
     * 结构举例
     * ```html
     *   <div id="abc" class="fc01 fc03">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 删除fc02 fc03样式名
     *       _e._$delClassName('abc','fc02 fc03');
     *   });
     * ```
     *
     * 输出结果
     * ```html
     *   <div id="abc" class="fc01">123</div>
     * ```
     *
     * @method module:base/element._$delClassName
     * @see    module:base/element._$addClassName
     * @see    module:base/element._$replaceClassName
     * @param  {String|Node} arg0 - 要操作的节点标识或者节点对象
     * @param  {String}      arg1 - 要删除的样式类名称
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$delClassName
     * @see module:base/element._$delClassName
     */
    _p._$delClassName =
    _y._$delClassName = function(_element,_class){
        _element = _p._$get(_element);
        if (!!_element){
            _h.__processClassName(
                _element,'remove',_class
            );
        }
    };
    /**
     * 替换节点的样式类名称，多个样式用空格分隔，
     * 操作过程为先删除待删样式，再添加待添样式，因此不需要删除样式存在才添加样式
     *
     * 结构举例
     * ```html
     *   <div id="abc" class="fc01 fc03">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 替换fc02为fc05
     *       // 这里不需要fc02存在
     *       _e._$replaceClassName('abc','fc02','fc05');
     *   });
     * ```
     *
     * 输出结果
     * ```html
     *   <div id="abc" class="fc01 fc03 fc05">123</div>
     * ```
     *
     * @method module:base/element._$replaceClassName
     * @see    module:base/element._$addClassName
     * @see    module:base/element._$delClassName
     * @param  {String|Node} arg0 - 要操作的节点标识或者节点对象
     * @param  {String}      arg1 - 要删除的样式类名称
     * @param  {String}      arg2 - 要新增的样式类名称
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$replaceClassName
     * @see module:base/element._$replaceClassName
     */
    _p._$replaceClassName =
    _y._$replaceClassName = function(_element,_del,_add){
        _element = _p._$get(_element);
        if (!!_element){
            _h.__processClassName(
                _element,'replace',
                _del,_add
            );
        }
    };
    /**
     * 检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含
     *
     * 结构举例
     * ```html
     *   <div id="abc" class="fc01 fc03">123</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 如果有fc01样式返回true，否则返回false
     *       _e._$hasClassName('abc',"fc01");
     *   });
     * ```
     *
     * @method module:base/element._$hasClassName
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @param  {String}      arg1 - 样式串
     * @return {Boolean}            是否含指定样式
     */
    /**
     * @method CHAINABLE._$hasClassName
     * @see module:base/element._$hasClassName
     */
    _p._$hasClassName =
    _y._$hasClassName = function(_element,_class){
        _element = _p._$get(_element);
        if (!!_element){
            return _h.__hasClassName(_element,_class);
        }
        return !1;
    };
    /**
     * 取样式变换矩阵对象
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 生成下面矩阵的对象
     *       // |a:1,b:0,c:0,d:1,e:0:f:0|
     *       // |m11:1,m12:0,m13:0,m14:0|
     *       // |m21:0,m22:1,m23:0,m24:0|
     *       // |m31:0,m32:0,m33:1,m34:0|
     *       // |m41:0,m42:0,m43:0,m44:1|
     *       var _matrix = _e._$matrix("matrix(1,0,0,1,0,0)");
     *   });
     * ```
     *
     * @method module:base/element._$matrix
     * @param  {String} arg0 - 变化信息
     * @return {CSSMatrix}     变换矩阵对象
     */
    _p._$matrix = function(_matrix){
        _matrix = (_matrix||'').trim();
        return _h.__getCSSMatrix(_matrix);
    };
    /**
     * 设置3D变换，对于不支持3D的系统自动切换为2D变换
     *
     * 结构举例
     * ```html
     *   <div id="abc"></div>
     * ```
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 进行css3d变换，对应css样式为-webkit-transform:rotate3d( 2, 1, 1, -75deg);
     *       _e._$css3d('abc','rotate',{x:2,y:1,z:1,a:'-75deg'});
     *   });
     * ```
     *
     * @method module:base/element._$css3d
     * @see    module:base/element._$addStyle
     * @param  {String|Node} arg0 - 节点标识或者对象
     * @param  {String}      arg1 - 变换类型，matrix/translate/scale/rotate
     * @param  {Object}      arg2 - 变换值，{x:1,y:2,z:3,a:'30deg'}
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$css3d
     * @see module:base/element._$css3d
     */
    _p._$css3d =
    _y._$css3d = function(_element,_name,_map){
        _element = _p._$get(_element);
        if (!!_element){
            var _value = _h.__processTransformValue(_name,_map);
            if (!!_value){
                _p._$setStyle(_element,'transform',_value);
            }
        }
    };
    // for chainable
    _x._$merge(_y);

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});
