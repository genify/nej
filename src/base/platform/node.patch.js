/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './element.js',
    '{lib}base/util.js',
    '{lib}base/event.js',
    '{lib}base/platform.js'
],function(_h,_u,_v,_m,_p,_o,_f,_r){
    // for ie10-
    NEJ.patch('TR<=6.0',function(){
        /**
         * 设置、获取数据
         * @param {Node}     节点
         * @param {String}   标识
         * @param {Variable} 值
         */
        _h.__dataset = (function(){
            var _dataset = {},
                _tag = 'data-',
                _reg = /\-(.{1})/gi;
            // init element dataset
            var _init = function(_element){
                var _id = _element.id;
                if (!!_dataset[_id]) return;
                var _map = {};
                _u._$forEach(
                    _element.attributes,
                    function(_node){
                        var _key  = _node.nodeName;
                        if (_key.indexOf(_tag)!=0) return;
                        _key = _key.replace(_tag,'')
                                   .replace(_reg,function($1,$2){
                                        return $2.toUpperCase();
                                   });
                        _map[_key] = _node.nodeValue||'';
                    }
                );
                _dataset[_id] = _map;
            };
            return function(_element,_key,_value){
                _init(_element);
                var _set = _dataset[_element.id];
                if (_value!==undefined){
                    _set[_key] = _value;
                }
                return _set[_key];
            };
        })();
    });
    // for ie8-
    NEJ.patch('TR<=4.0',function(){
        /**
         * 根据类名取节点列表
         * @param  {Node}   节点ID或者对象
         * @param  {String} 类名
         * @return {Array}  节点列表
         */
        _h.__getElementsByClassName = function(_element,_class){
            var _result = [],
                _regexp = new RegExp('(\\s|^)(?:'+_class.replace(/\s+/g,'|')+')(?=\\s|$)');
            _u._$forEach(
                _element.getElementsByTagName('*'),
                function(_node){
                    if (_regexp.test(_node.className)){
                        _result.push(_node);
                    }
                }
            );
            return _result;
        };
        /**
         * 取下一个兄弟节点
         * @param  {Node}  节点对象
         * @return {Node}  节点
         */
        _h.__nextSibling = function(_element){
            while(_element=_element.nextSibling){
                if (_element.nodeType==1){
                    return _element;
                }
            }
        };
        /**
         * 取上一个兄弟节点
         * @param  {Node}  节点对象
         * @return {Node}  节点
         */
        _h.__previousSibling = function(_event){
            while(_element=_element.previousSibling){
                if (_element.nodeType==1){
                    return _element;
                }
            }
        };
        /**
         * 将dom节点转为xml串
         * @param  {Node}   节点
         * @return {String} XML代码
         */
        _h.__serializeDOM2XML = function(_dom){
            return ('xml' in _dom)?_dom.xml:_dom.outerHTML;
        };
        /**
         * 将xml转为dom节点
         * @param  {String} XML代码
         * @return {Node}   节点
         */
        _h.__parseDOMFromXML = (function(){
            // http://blogs.msdn.com/b/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
            var _msxml = [
                'Msxml2.DOMDocument.6.0',
                'Msxml2.DOMDocument.3.0'
            ];
            var _getParser = function(){
                try{
                    for(var i=0,l=_msxml.length;i<l;i++){
                        return new ActiveXObject(_msxml[i]);
                    }
                }catch(ex){
                    return null;
                }
            };
            return function(_xml){
                var _parser = _getParser();
                if (!!_parser&&
                      _parser.loadXML(_xml)&&
                     !_parser.parseError.errorCode){
                    return _parser.documentElement;
                }
                return null;
            };
        })();
        /**
         * 设置光标位置
         * @param  {String|Node} TEXTAREA节点
         * @param  {Object}      光标的位置信息
         * @return {Void}
         */
        _h.__setCursorPosition = function(_textarea,_position){
            var _range = _textarea.createTextRange();
            _range.collapse(!0);
            _range.moveStart('character',_position.start);
            _range.moveEnd('character',_position.end-_position.start);
            _range.select();
            _textarea.focus();
        };
        /**
         * 取光标位置
         * @param  {String|Node} TEXTAREA节点
         * @return {Void}
         */
        _h.__getCursorPosition = function(_textarea){
            var _range0 = document.selection.createRange();
            // create in textarea object and match to document.selection
            var _range1 = _textarea.createTextRange();
            _range1.moveToBookmark(_range0.getBookmark());
            // create textrange object for left amount of textarea & align them
            var _range2 = _textarea.createTextRange();
            _range2.collapse(!0);
            _range2.setEndPoint("EndToStart",_range1);
            // dump start and end
            var _start = _range2.text.length;
            return {
                start:_start,
                end:_start+_range0.text.length
            };
        };
    });
    // for ie7-
    NEJ.patch('TR<=3.0',function(){
        /**
         * 节点focus行为
         * @param  {String|Node} 节点
         * @param  {Number}      模式
         * @param  {String}      样式
         * @return {Void}
         */
        _h.__focusElement = (function(){
            // remove classname onblur
            var _onBlur = function(_clazz,_event){
                _e._$delClassName(
                    _v._$getElement(_event),_clazz
                );
            };
            return _h.__focusElement._$aop(
                   function(_event){
                        // patch ie6-7 :focus
                        var _args = _event.args;
                        if (_args[1]!=1){
                            _v._$addEvent(
                                _args[0],'blur',
                                _onBlur._$bind(null,_args[2])
                            );
                            _args[1] = -1;
                        }
                   });
        })();
        /**
         * 取节点属性值
         * @param  {Node}   节点
         * @param  {String} 属性名
         * @return {String} 属性值
         */
        _h.__getAttribute = 
        _h.__getAttribute._$aop(null,function(_event){
            // fix ie7 maxlength default value 2147483647
            var _args = _event.args;
            if (_args[1]=='maxlength'&&
                _event.value==2147483647){
                _event.value = null;
            }
        });
    });
    // for ie6-
    NEJ.patch('TR<=2.0',function(){
        /**
         * 取节点的子节点列表
         * @param  {Node} _element 节点ID或者对象
         * @return {Array}         子节点列表
         */
        _h.__getChildren = function(_element){
            var _result = [];
            _u._$forEach(
                _element.childNodes,
                function(_node){
                    if (_node.nodeType==1){
                        _result.push(_node);
                    }
                }
            );
            return _result;
        };
        /**
         * 节点hover行为
         * @param  {Node}   节点
         * @param  {String} 样式，默认为js-hover
         * @return {Void}
         */
        _h.__hoverElement = (function(){
            var _cache = {};
            // enter element
            var _doEnter = function(_class,_event){
                var _element = _event.srcElement,
                    _name = _element.className;
                if (_name.indexOf(_class)<0){
                    _element.className += ' '+_class;
                }
            };
            // leave element
            var _doLeave = function(_class,_event){
                var _element = _event.srcElement,
                    _name = _element.className||'';
                if (_name.indexOf(_class)>=0){
                    _element.className = _name.replace(_class,'').trim();
                }
            };
            return function(_element,_class){
                var _id = _element.id;
                if (!!_cache[_id]) return;
                // hover element
                _cache[_id] = !0;
                _v._$addEvent(
                    _id,'mouseenter',
                    _doEnter._$bind(null,_class)
                );
                _v._$addEvent(
                    _id,'mouseleave',
                    _doLeave._$bind(null,_class)
                );
            };
        })();
        /**
         * 节点占全屏
         * @param  {Node}   节点
         * @param  {Object} 视窗模型
         * @return {Void}
         */
        _h.__fullScreen = function(_element,_viewport){
            var _style = _element.style;
            _style.width = _viewport.scrollWidth+'px';
            _style.height = _viewport.scrollHeight+'px';
        };
        /**
         * 为节点增加用于盖select/flash等控件的层
         * @param  {Node} 节点
         * @return {Void}         
         */
        _h.__mask = (function(){
            var _cache = {};
            // remove mask
            _h.__unmask = function(_element){
                var _id = _element.id,
                    _mask = _cache[_id];
                if (!!_mask){
                    delete _cache[_id];
                    _mask.parentNode.remove(_mask);
                }
            };
            // append mask
            return function(_element){
                var _id = _element.id,
                    _mask = _cache[_id];
                // create mask
                if (!_mask){
                    _mask = document.createElement('iframe');
                    _mask.style.position = 'absolute';
                    _cache[_id] = _mask;
                }
                // sync mask size
                var _style1 = _mask.style,
                    _style0 = _element.style;
                _style1.top = (parseInt(_style0.top)||0)+'px';
                _style1.left = (parseInt(_style0.left)||0)+'px';
                _style1.width = _element.offsetWidth+'px';
                _style1.height = _element.offsetHeight+'px';
                _element.insertAdjacentElement('beforeBegin',_mask);
            };
        })();
    });
    // for firefox
    NEJ.patch('GR',function(){
        if (!_m._$SUPPORT.css3d){
            _m._$SUPPORT.css3d = 'MozPerspective' in document.body.style;
        }
        if (!('insertAdjacentElement' in document.body)){
            HTMLElement.prototype.insertAdjacentElement = function(_where,_element){
                if (!_where||!_element) return;
                switch(_where){
                    case 'beforeEnd'  : 
                        this.appendChild(_element); 
                    return;
                    case 'beforeBegin': 
                        this.parentNode.insertBefore(_element,this); 
                    return;
                    case 'afterBegin' :
                        !this.firstChild
                        ?this.appendChild(_element)
                        :this.insertBefore(_element,this.firstChild); 
                    return;
                    case 'afterEnd'   :
                        !this.nextSibling 
                        ?this.parentNode.appendChild(_element)
                        :this.parentNode.insertBefore(_element,this.nextSibling); 
                    return;
                }
            };
        }
        if (!('innerText' in document.body)){
            HTMLElement.prototype['__defineGetter__']("innerText",function(){return this.textContent;});
            HTMLElement.prototype['__defineSetter__']("innerText",function(_content){this.textContent = _content;});
        }
    });
    
    return _h;
});
