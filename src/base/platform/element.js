/**
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _r = NEJ.R,
        _p = _('nej.p'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _h = _('nej.h');
    var _prefix = _p._$KERNEL.prefix,
        _suport = _p._$SUPPORT,
        _2dmap  = {scale:'scale({x|1},{y|1})'
                  ,rotate:'rotate({a})'
//                ,matrix:'matrix({m11},{m12},{m21},{m22},{m41},{m42})'
                  ,translate:'translate({x},{y})'},
        _3dmap  = {scale:'scale3d({x|1},{y|1},{z|1})'
                  ,rotate:'rotate3d({x},{y},{z},{a})'
//                ,matrix:'matrix3d({m11},{m12},{m13},{m14},{m21},{m22},{m23},{m24},{m31},{m32},{m33|1},{m34},{m41},{m42},{m43},{m44|1})'
                  ,translate:'translate3d({x},{y},{z})'},
        _cssmap = {'transition':!0,'transform':!0,'animation':!0,'keyframes':!0
                  ,'box':!0,'box-pack':!0,'box-flex':!0,'marquee':!0,'border-radius':!0,'user-select':!0};
    /*
     * 初始化文件
     * @return {Void}
     */
    var _doInit = function(){
        var _matrix = _h.__getCSSMatrix();
        _suport.css3d = !!_matrix&&_matrix.m41!=null;
        var _reg = /-([a-z])/g;
        for(var x in _cssmap){
            _cssmap[_doFormatStyleName(x)] = _cssmap[x];
        }
    };
    /*
     * 解析样式属性名称
     * border-width -> borderWidth
     * @param  {String} 样式样式名
     * @return {String} 格式化后样式名
     */
    var _doFormatStyleName = (function(){
        var _reg = /-([a-z])/g;
        return function(_name){
            _name = _name||'';
            return _name.replace(_reg,
                   function($1,$2){
                        return $2.toUpperCase();
                   });
        };
    })();
    /*
     * 取变换值模板
     * @param  {String} _name 变换名称
     * @return {String}       变换模板
     */
    var _getTransformTemplate = function(_name){
        return (!_suport.css3d?_2dmap:_3dmap)[_name];
    };
    /*
     * 取待验证的样式列表
     * @param  {String} _class 样式，多个以空格分隔
     * @return {Array}         样式列表
     */
    var _getClassList = (function(){
        var _reg = /\s+/;
        return function(_class){
            _class = (_class||'').trim();
            return !!_class?_class.split(_reg):null;
        };
    })();
    /*
     * 处理样式类
     * @param  {String|Node} _element 要操作的节点ID或者节点对象
     * @param  {String}      _type    处理方式
     * @param  {String}      _class   要处理的样式类名称
     * @return {Void}
     */
    var _doClassName = function(_element,_type,_class){
        _element = _e._$get(_element);
        if (!_element) return;
        _u._$forEach(
           _getClassList(_class),
           function(_clazz){
               _element.classList[_type](_clazz);
           });
    };
    // ---------- begin dom core patch api ---------
    /**
     * 集合转数组
     * @param  {Object} _list 集合
     * @return {Array}        数组
     */
    _h.__col2array = function(_list){
        return _r.slice.call(_list,0);
    };
    /**
     * 取节点的子节点列表
     * @param  {Node} _element 节点ID或者对象
     * @return {Array}         子节点列表
     */
    _h.__getChildren = function(_element){
        return _h.__col2array(_element.children);
    };
    /**
     * 根据类名取节点列表
     * @param  {Node}   _element 节点ID或者对象
     * @param  {String} _class   类名
     * @return {Array}           节点列表
     */
    _h.__getElementsByClassName = function(_element,_class){
        return _h.__col2array(_element.getElementsByClassName(_class));
    };
    /**
     * 取下一个兄弟节点
     * @param  {Node}  节点对象
     * @return {Node}  节点
     */
    _h.__nextSibling = function(_element){
        return _element.nextElementSibling;
    };
    /**
     * 取上一个兄弟节点
     * @param  {Node}  节点对象
     * @return {Node}  节点
     */
    _h.__previousSibling = function(_element){
        return _element.previousElementSibling;
    };
    /*
     * 根据选择器取节点列表
     * @param  {Node}   _element  相对节点，默认为document
     * @param  {String} _selector 选择器
     * @return {Array}            匹配到的节点列表
    _h.__querySelectorAll = function(_element,_selector){
        return _h.__col2array(_element.querySelectorAll(_selector));
    };
     */
    /**
     * 新增样式类，多个样式用空格分开
     * @param  {String|Node} _element 要操作的节点ID或者节点对象
     * @param  {String}      _add     要新增的样式类名称
     * @return {Void}
     */
    _h.__addClassName = function(_element,_add){
        _doClassName(_element,'add',_add);
    };
    /**
     * 删除样式类，多个样式用空格分开
     * @param  {String|Node} _element 要操作的节点ID或者节点对象
     * @param  {String}      _del     要删除的样式类名称
     * @return {Void}
     */
    _h.__delClassName = function(_element,_del){
        _doClassName(_element,'remove',_del);
    };
    /**
     * 替换节点的样式类名称，多个样式用空格分隔
     * @param  {String|Node} _element 要操作的节点ID或者节点对象
     * @param  {String}      _del     要删除的样式类名称
     * @param  {String}      _add     要新增的样式类名称
     * @return {Void}
     */
    _h.__replaceClassName = function(_element,_del,_add){
        _doClassName(_element,'remove',_del);
        _doClassName(_element,'add',_add);
    };
    /**
     * 检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含
     * @param  {String|Node} _element 节点ID或者对象
     * @param  {String}      _class   样式串
     * @return {Boolean}              是否含指定样式
     */
    _h.__hasClassName = function(_element,_class){
        _element = _e._$get(_element);
        if (!_element) return !1;
        var _list = _element.classList;
        if (!_list||!_list.length) return !1;
        return _u._$indexOf(
                  _getClassList(_class),
                  function(_clazz){
                      return _list.contains(_clazz);
                  })>=0;
    };
    /**
     * 节点hover行为，高版本浏览器用样式处理
     * @param  {String|Node} _element 节点
     * @param  {String}      _clazz   样式
     * @return {Void}
     */
    _h.__hoverElement = function(_element,_clazz){
        // do nothing
    };
    /**
     * 节点fixed定位，高版本浏览器用样式处理
     * @param  {Node} 节点
     * @return {Void}
     */
    _h.__fixedElement = function(_element){
        // do nothing
    };
    /**
     * 设置光标位置
     * @return {Void}
     */
    _h.__setCursorPosition = function(_textarea,_position){
        _textarea.selectionEnd = _position.end||0;
        _textarea.selectionStart = _position.start||0;
        _textarea.focus();
    };
    /**
     * 取光标位置
     * @return {Void}
     */
    _h.__getCursorPosition = function(_textarea){
        return {
            end:_textarea.selectionEnd,
            start:_textarea.selectionStart
        };
    };
    /**
     * 节点focus行为
     * @param  {String|Node} 节点
     * @param  {Number}      模式
     * @param  {String}      样式
     * @return {Void}
     */
    _h.__focusElement = (function(){
        // do blur check
        var _onBlur = function(_clazz,_event){
            var _element = _v._$getElement(_event);
            if (!_element.value)
                _e._$delClassName(_element,_clazz);
        };
        // do focus
        var _onFocus = function(_clazz,_event){
            _e._$addClassName(
                _v._$getElement(_event),_clazz);
        };
        return function(_element,_mode,_clazz){
            if (_mode==1){
                _v._$addEvent(_element,'blur',
                   _onBlur._$bind(null,_clazz));
            }
            if (_mode==1||_mode==-1){
                _v._$addEvent(_element,'focus',
                   _onFocus._$bind(null,_clazz));
            }
            // other do nothing, use css :focus
        };
    })();
    /**
     * 将dom节点转为xml串
     * @param  {Node} _dom 节点
     * @return {String}    xml串
     */
    _h.__serializeDOM2XML = function(_dom){
        return new XMLSerializer()
                  .serializeToString(_dom)||'';
    };
    /**
     * 将xml转为dom节点
     * @param  {String} _xml xml文本
     * @return {Node}        节点
     */
    _h.__parseDOMFromXML = function(_xml){
        var _root = new DOMParser()
                       .parseFromString(_xml,'text/xml')
                       .documentElement;
        return _root.nodeName=='parsererror'?null:_root;
    };
    /**
     * 节点占全屏
     * @param  {Node} _element 节点
     * @return {Void}
     */
    _h.__fullScreen = function(_element){
        // use css fixed position
    };
    /**
     * 为节点增加用于盖select/flash等控件的层
     * @param  {Node} _element 节点
     * @return {Void}         
     */
    _h.__mask = function(_element){
        // do nothing
        return null;
    };
    /**
     * 去除用于盖select/flash等控件的层
     * @param  {Object} _element 节点
     * @return {Void}
     */
    _h.__unmask = function(_element){
        // do nothing
        return null;
    };
    // ---------- begin css patch api ---------
    /**
     * 取样式变换矩阵对象
     * @param  {String} _matrix 变化信息
     * @return {CSSMatrix}      变换矩阵对象
     */
    _h.__getCSSMatrix = (function(){
        var _reg0 = /\((.*?)\)/,
            _reg1 = /\s*,\s*/,
            _list = ['m11','m12','m21','m22','m41','m42'];
        var _parse = function(_matrix){
            var _obj = {};
            if (_reg0.test(_matrix||'')){
                _u._$forEach(RegExp.$1.split(_reg1),
                function(_value,_index){
                    _obj[_list[_index]] = _value||'';
                });
            } 
            return _obj;
        };
        return function(_matrix){
            if (!!window.CSSMatrix)
                return new CSSMatrix(_matrix);
            var _name = _prefix.clz+'CSSMatrix';
            if (!!window[_name])
                return new window[_name](_matrix||'');
            return _parse(_matrix);
        };
    })();
    /**
     * 取3D变换值，对于不支持3D的系统自动切换为2D变换
     * @param  {String} _name    变换类型，matrix/translate/scale/rotate
     * @param  {Object} _map     变换值，{x:1,y:2,z:3,a:'30deg'}
     * @return {String}          返回变换值串
     */
    _h.__getTransformValue = (function(){
        var _reg = /\{(.*?)\}/g;
        return function(_name,_map){
            _map = _map||o;
            var _tpl = _getTransformTemplate(_name);
            return !_tpl?'':_tpl.replace(_reg,function($1,$2){
                       var _arr = $2.split('|');
                       return _map[_arr[0]]||_arr[1]||'0';
                   });
        };
    })();
    /**
     * 取样式值
     * @param  {String|Node} 节点
     * @param  {String}      样式名称
     * @return {Variable}    样式值
     */
    _h.__getStyleValue = function(_element,_name){
        var _current = window.getComputedStyle(_element,null);
        return _current[_h.__getStyleName(_name)]||'';
    };
    /**
     * 针对样式名称做前缀增强
     * @param  {String} _name 样式名
     * @return {String}       增强后的样式名
     */
    _h.__getStyleName = (function(){
        var _reg = /^[a-z]/,
            _pfx = _prefix.css;
        var _addPrefix = function(_name){
            return _name.replace(_reg,function($1){
                return _pfx+$1.toUpperCase();
            });
        };
        return function(_name){
            _name = _doFormatStyleName(_name);
            var _pfxed = _h.__checkStyleName(_name,_cssmap);
            return _pfxed?_addPrefix(_name):_name;
        };
    })();
    /**
     * 设置样式
     * @param  {String|Node} _element 节点
     * @param  {String}      _name    样式名称
     * @param  {String}      _value   样式值
     * @return {Void}
     */
    _h.__applyStyle = function(_element,_name,_value){
        _element.style[_h.__getStyleName(_name)] = _value;
    };
    /**
     * 检查样式名称是否需要前缀增强
     * @param  {String} _name 名称
     * @param  {Object} _map  验证信息
     * @return {Boolean}      是否需要前缀增强
     */
    _h.__checkStyleName = (function(){
        var _reg = /^([a-z]+?)[A-Z]/;
        return function(_name,_map){
            if (!_map[_name]){
                if (_reg.test(_name))
                    _name = RegExp.$1;
            }
            return !!_map[_name];
        };
    })();
    /**
     * 对样式进行预处理
     * @param  {String} _css 待处理样式内容
     * @return {String}      处理后样式内容
     */
    _h.__filterCSSText = (function(){
        var _reg = /\$<(.*?)>/gi,
            _pfx = '-'+_prefix.css.toLowerCase()+'-';
        return function(_css){
            return _css.replace(_reg,function($1,$2){
                var _val = $2,
                    _arr = _val.split('|'),
                    _tpl = _getTransformTemplate(_arr[0]);
                if (!!_tpl){
                    return _h.__getTransformValue(
                             _arr[0],_u._$query2object(_arr[1]));
                }
                return !_h.__checkCSSText(_val,_cssmap)?_val:(_pfx+_val);
            });
        };
    })();
    /**
     * 检查样式名称或者属性名是否需要前缀增强
     * @param  {String} _name 样式属性名称
     * @param  {Object} _map  默认匹配表
     * @return {Boolean}      是否需要前缀增强
     */
    _h.__checkCSSText = function(_name,_map){
        return !!_map[_name];
    };
    /**
     * 应用样式
     * @param  {Node}   _style 样式节点
     * @param  {String} _css   样式串
     * @return {Void}
     */
    _h.__applyCSSText = function(_style,_css){
        _style.textContent = _css;
    };
    /**
     * 追加CSS规则
     * @param  {Node}    样式节点
     * @param  {String}  单条样式规则
     * @return {CSSRule} 样式规则对象
     */
    _h.__appendCSSText = function(_style,_css){
        var _sheet = _style.sheet,
            _length = _sheet.cssRules.length;
        _sheet.insertRule(_css,_length);
        return _sheet.cssRules[_length];
    };
    /**
     * 应用CSS特效
     * @param  {Node}   _element 节点
     * @param  {Object} _options 配置参数
     * @return {Void}
     */
    _h.__applyEffect = function(_element,_options){
        
    };
    /**
     * 取节点属性值
     * @param  {Node}   节点
     * @param  {String} 属性名
     * @return {String} 属性值
     */
    _h.__getAttribute = function(_element,_name){
        if (!!_element.getAttribute)
            return _element.getAttribute(_name);
        return '';
    };
    // init
    _doInit();
};
NEJ.define('{lib}base/platform/element.js',
          ['{lib}base/platform.js'],f);