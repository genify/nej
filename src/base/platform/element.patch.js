var f = function(NEJ,_m,_e,_v,_h,_p) {
	// ie api patch
	window.NEJ.patch('TV',function(){
		if (CMPT){
			var _  = NEJ.P,
			    _e = _('nej.e'),
			    _h = _('nej.h');
		}
		
	    /*
	     * 判断是否有内置的样式操作接口
	     * @return {Boolean} 是否有内置的样式操作接口
	     */
	    var __hasClassMethod = (function(){
	        var _test = !!document.body.classList;
	        return function(){
	            return _test;
	        };
	    })();
	    /*
	     * 取匹配类名的正则表达式
	     * @param  {String} _class 样式列表
	     * @return {RegExp}        正则表达式
	     */
	    var __getClassRegExp = (function(){
	        var _reg = /\s+/g;
	        return function(_class){
	            _class = (_class||'').trim();
	            return !_class ? null
	                           : new RegExp('(\\s|^)(?:'+_class.
	                             replace(_reg,'|')+')(?=\\s|$)','g');
	        };
	    })();
	    /**
	     * 替换节点的样式类名称，多个样式用空格分隔
	     * @param  {String|Node} _element 要操作的节点ID或者节点对象
	     * @param  {String}      _del     要删除的样式类名称
	     * @param  {String}      _add     要新增的样式类名称
	     * @return {Void}
	     */
	    _h.__replaceClassName =  
	    _h.__replaceClassName._$aop(function(_event){
	        if (__hasClassMethod()) return;
	        _event.stopped = !0;
	        var _args = _event.args,
	            _element = _e._$get(_args[0]);
	        if (!_element||
	           (!_args[1]&&!_args[2])) return;
	        var _class = _element.className||'';
	        // replace class
	        var _add = ' '+(_args[2]||''),
	            _del = __getClassRegExp((_args[1]||'')+_add);
	        !!_del&&(_class=_class.replace(_del,'$1'));
	        _element.className = (_class+_add).replace(/\s+/g,' ').trim();
	    });
	    /**
	     * 新增样式类，多个样式用空格分开
	     * @param  {String|Node} _element 要操作的节点ID或者节点对象
	     * @param  {String}      _add     要新增的样式类名称
	     * @return {Void}
	     */
	    _h.__addClassName = 
	    _h.__addClassName._$aop(function(_event){
	        if (__hasClassMethod()) return;
	        _event.stopped = !0;
	        var _args = _event.args;
	        _h.__replaceClassName(_args[0],'',_args[1]);
	    });
	    /**
	     * 删除样式类，多个样式用空格分开
	     * @param  {String|Node} _element 要操作的节点ID或者节点对象
	     * @param  {String}      _del     要删除的样式类名称
	     * @return {Void}
	     */
	    _h.__delClassName = 
	    _h.__delClassName._$aop(function(_event){
	        if (__hasClassMethod()) return;
	        _event.stopped = !0;
	        var _args = _event.args;
	        _h.__replaceClassName(_args[0],_args[1],'');
	    });
	    /**
	     * 检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含
	     * @param  {String|Node} _element 节点ID或者对象
	     * @param  {String}      _class   样式串
	     * @return {Boolean}              是否含指定样式
	     */
	    _h.__hasClassName = 
	    _h.__hasClassName._$aop(function(_event){
	        if (__hasClassMethod()) return;
	        _event.stopped = !0;
	        var _args = _event.args,
	            _element = _e._$get(_args[0]);
	        if (!_element){
	            _event.value = !1;
	            return;
	        }
	        var _reg = __getClassRegExp(_args[1]);
	        _event.value = !_reg?!1:_reg.test(
	                        _element.className||'');
	    });
	});

	// gecko api patch
	window.NEJ.patch('GV',function(){
		if (CMPT){
			// variable declaration
		    var _  = NEJ.P,
		        _v = _('nej.v'),
		        _e = _('nej.e'),
		        _h = _('nej.h'),
		        _p = _('nej.p'),
		        _support = _p._$SUPPORT;
		}
	    var _support = _m._$SUPPORT;
	    /*
	     * 初始化补丁
	     * @return {Void}
	     */
	    var _doInit = function(){
	        _support.css3d = _support.css3d||
	           ('MozPerspective' in document.body.style);
	        if (!document.body.insertAdjacentElement)
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
	        if (!('innerText' in document.body)){
	            HTMLElement.prototype['__defineGetter__']("innerText",function(){return this.textContent;});
	            HTMLElement.prototype['__defineSetter__']("innerText",function(_content){this.textContent = _content;});
	        }
	    };
	    // init patch
	    _doInit();
	});

	// ie6-9 api patch
	window.NEJ.patch('2.0<=TR<=5.0',function(){
		if (CMPT){
			 // variable declaration
		    var _  = NEJ.P,
		        _o = NEJ.O,
		        _e = _('nej.e'),
		        _v = _('nej.v'),
		        _u = _('nej.u'),
		        _h = _('nej.h'),
		        _omap = {}; // event must use attach/detach method
		}
	    var _omap = {};
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
	     * 取节点的子节点列表
	     * @param  {Node} _element 节点ID或者对象
	     * @return {Array}         子节点列表
	     */
	    _h.__getChildren = 
	    _h.__getChildren._$aop(function(_event){
	        _event.stopped = !0;
	        var _arr = [];
	        _u._$forEach(
	           _event.args[0].childNodes,
	           function(_node){
	               if (_node.nodeType==1)
	                   _arr.push(_node);
	           });
	        _event.value = _arr;
	    });
	    /**
	     * 取下一个兄弟节点
	     * @param  {Node}  节点对象
	     * @return {Node}  节点
	     */
	    _h.__nextSibling = 
	    _h.__nextSibling._$aop(function(_event){
	        var _element = _event.args[0];
	        if (!('nextElementSibling' in _element)){
	            _event.stopped = !0;
	            while(_element=_element.nextSibling){
	                if (_element.nodeType==1){
	                    _event.value = _element;
	                    break;
	                }
	            }
	        }
	    });
	    /**
	     * 取上一个兄弟节点
	     * @param  {Node}  节点对象
	     * @return {Node}  节点
	     */
	    _h.__previousSibling = 
	    _h.__previousSibling._$aop(function(_event){
	        var _element = _event.args[0];
	        if (!('previousElementSibling' in _element)){
	            _event.stopped = !0;
	            while(_element=_element.previousSibling){
	                if (_element.nodeType==1){
	                    _event.value = _element;
	                    break;
	                }
	            }
	        }
	    });
	    /**
	     * 根据类名取节点列表
	     * @param  {Node}   _element 节点ID或者对象
	     * @param  {String} _class   类名
	     * @return {Array}           节点列表
	     */
	    _h.__getElementsByClassName = 
	    _h.__getElementsByClassName._$aop(function(_event){
	        var _element = _event.args[0];
	        if (!!_element.getElementsByClassName) return;
	        _event.stopped = !0;
	        var _result = [],
	            _regexp = new RegExp('(\\s|^)(?:'+_event.args[1]
	                         .replace(/\s+/g,'|')+')(?=\\s|$)');
	        _u._$forEach(_element.getElementsByTagName('*'),
	        function(_node){
	            if (_regexp.test(_node.className))
	                _result.push(_node);
	        });
	        _event.value = _result;
	    });
	    /**
	     * 设置光标位置
	     * @return {Void}
	     */
	    _h.__setCursorPosition = 
	    _h.__setCursorPosition._$aop(function(_event){
	        var _textarea = _event.args[0],
	            _position = _event.args[1];
	        if (_textarea.selectionStart==null){
	            _event.stopped = !0;
	            var _range = _textarea.createTextRange();
	            _range.collapse(!0);
	            _range.moveStart('character',_position.start);
	            _range.moveEnd('character',_position.end-_position.start);
	            _range.select();
	            _textarea.focus();
	        }
	    });
	    /**
	     * 取光标位置
	     * @return {Void}
	     */
	    _h.__getCursorPosition = 
	    _h.__getCursorPosition._$aop(function(_event){
	        var _textarea = _event.args[0];
	        // fix bug for ie9 selectionStart/seletionEnd
	        _textarea.focus();
	        if (_textarea.selectionStart==null){
	            _event.stopped = !0;
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
	            _event.value = {
	                start:_start,
	                end:_start+_range0.text.length
	            };
	        }
	    });
	    /**
	     * 将dom节点转为xml串
	     * @param  {Node} _dom 节点
	     * @return {String}    xml串
	     */
	    _h.__serializeDOM2XML = 
	    _h.__serializeDOM2XML._$aop(function(_event){
	        if (!!window.XMLSerializer) return;
	        _event.stopped = !0;
	        var _element = _event.args[0];
	        _event.value = _element.xml!=null
	                     ? _element.xml 
	                     : _element.outHTML;
	    });
	    /**
	     * 将xml转为dom节点
	     * @param  {String} _xml xml文本
	     * @return {Node}        节点
	     */
	    _h.__parseDOMFromXML = (function(){
	        // http://blogs.msdn.com/b/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
	        var _msxml = ['Msxml2.DOMDocument.6.0'
	                     ,'Msxml2.DOMDocument.3.0'];
	        var _getParser = function(){
	            try{
	                for(var i=0,l=_msxml.length;i<l;i++)
	                    return new ActiveXObject(_msxml[i]);
	            }catch(ex){
	                return null;
	            }
	        };
	        return _h.__parseDOMFromXML._$aop(
	               function(_event){
	                    if (!!window.DOMParser) return;
	                    _event.stopped = !0;
	                    var _parser = _getParser();
	                    if (!!_parser&&
	                          _parser.loadXML(_event.args[0])&&
	                         !_parser.parseError.errorCode)
	                        _event.value = _parser.documentElement;
	               });
	    })();
	    /**
	     * 取样式值
	     * @param  {String|Node} 节点
	     * @param  {String}      样式名称
	     * @return {Variable}    样式值
	     */
	    _h.__getStyleValue = (function(){
	        var _reg0 = /opacity\s*=\s*([\d]+)/i;
	        return _h.__getStyleValue._$aop(function(_event){
	            if (!!window.getComputedStyle) return;
	            _event.stopped = !0;
	            var _result = '',
	                _args = _event.args,
	                _name = _args[1],
	                _current = _args[0].currentStyle||_o;
	            // opacity for ie8-
	            if (_name=='opacity'&&!(_name in _current)){
	                _result = 0;
	                var _value = _current.filter||'';
	                if (_reg0.test(_value)){
	                    _result = parseFloat(RegExp.$1)/100;
	                }
	            }else{
	                _result = _current[_h.__getStyleName(_name)]||'';
	            }
	            _event.value = _result;
	        });
	    })();
	    /**
	     * 设置样式
	     * @param  {String|Node} _element 节点
	     * @param  {String}      _name    样式名称
	     * @param  {String}      _value   样式值
	     * @return {Void}
	     */
	    _h.__applyStyle = 
	    _h.__applyStyle._$aop(function(_event){
	        var _args = _event.args,
	            _name = _args[1].toLowerCase();
	        if (_name=='opacity'&&
	          !(_name in document.body.style)){
	            _args[1] = 'filter';
	            _args[2] = 'alpha(opacity='+_args[2]*100+')';
	        }
	    });
	    /**
	     * 应用样式
	     * @param  {Node}   _style 样式节点
	     * @param  {String} _css   样式串
	     * @return {Void}
	     */
	    _h.__applyCSSText = (function(){
	        var _max = 30;
	        return _h.__applyCSSText._$aop(
	               function(_event){
	                    var _element = _event.args[0];
	                    if (!_element.styleSheet) return;
	                    _event.stopped = !0;
	                    var _css = _event.args[1];
	                    // ie has 31 style/link limitation
	                    var _list = document.styleSheets;
	                    if (_list.length>_max){
	                        // bad performance
	                        _element = _list[_max];
	                        _css = _element.cssText + _css;
	                    }else{
	                        _element = _element.styleSheet;
	                    }
	                    _element.cssText = _css;
	               });
	    })();
	    /**
	     * 追加CSS规则
	     * @param  {Node}    样式节点
	     * @param  {String}  单条样式规则
	     * @return {CSSRule} 样式规则对象
	     */
	    _h.__appendCSSText = 
	    _h.__appendCSSText._$aop(function(_event){
	        var _args = _event.args,
	            _sheet = _args[0].sheet;
	        if (!!_sheet) return;
	        _event.stopped = !0;
	        var _sheet = _args[0].styleSheet,
	            _length = _sheet.rules.length,
	            _arr = _args[1].split(/[\{\}]/);
	        _sheet.addRule(_arr[0],_arr[1],_length);
	        _event.value = _sheet.rules[_length];
	    });
	    /**
	     * 取节点属性值
	     * @param  {Node}   节点
	     * @param  {String} 属性名
	     * @return {String} 属性值
	     */
	    _h.__getAttribute = 
	    _h.__getAttribute._$aop(function(_event){
	        var _args = _event.args,
	            _node = (_args[0].attributes||_o)[_args[1]];
	        if (!!_node){
	            _event.stopped = !0;
	            _event.value = _node.value;
	        }
	    },function(_event){
	        // fix ie7 maxlength default value 2147483647
	        var _args = _event.args;
	        if (_args[1]=='maxlength'&&
	            _event.value==2147483647)
	            _event.value = '';
	    });
	    // cache background image
	    try{document.execCommand('BackgroundImageCache',!1,!0);}catch(e){}
	});

	window.NEJ.patch('2.0<=TR<=3.0',function(){
		if (CMPT){
			// variable declaration
		    var _  = NEJ.P,
		        _e = _('nej.e'),
		        _v = _('nej.v'),
		        _h = _('nej.h');
		}
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
	                _v._$getElement(_event),_clazz);
	        };
	        return _h.__focusElement._$aop(
	               function(_event){
	                    // patch ie6-7 :focus
	                    var _args = _event.args;
	                    if (_args[1]!=1){
	                        _v._$addEvent(_args[0],'blur',
	                            _onBlur._$bind(null,_args[2]));
	                        _args[1] = -1;
	                    }
	               });
	    })();
	});

	// ie6 api patch
	window.NEJ.patch('TR==2.0',function(){
		if (CMPT){
			// variable declaration
		    var _  = NEJ.P,
		        _e = _('nej.e'),
		        _v = _('nej.v'),
		        _p = _('nej.p'),
		        _h = _('nej.h');
		}
	    var _seed  = +new Date;
	        _cache = {};
	    /**
	     * 节点hover行为，高版本浏览器用样式处理
	     * @param  {String|Node} _element 节点
	     * @param  {String}      _clazz   样式
	     * @return {Void}
	     */
	    _h.__hoverElement = 
	    _h.__hoverElement._$aop(function(_event){
	        _event.stopped = !0;
	        var _args = _event.args,
	            _id   = _e._$id(_args[0]),
	            _key  = 'hover-'+_id;
	        // cache hovered element
	        if (!_id||!!_cache[_key]) 
	            return;
	        _cache[_key] = !0;
	        // hover element
	        _v._$addEvent(_id,'mouseenter',
	           _e._$addClassName._$bind(_e,_id,_args[1]));
	        _v._$addEvent(_id,'mouseleave',
	           _e._$delClassName._$bind(_e,_id,_args[1]));
	    });
	    /**
	     * 节点fixed定位，高版本浏览器用样式处理
	     * @param  {Node} 节点
	     * @return {Void}
	     */
	    _h.__fixedElement = (function(){
	        // 
	        var _doScrollCheck = function(){
	            
	        };
	        return _h.__fixedElement._$aop(
	               function(_event){
	                   _event.stopped = !0;
	                   var _element = _event.args[0],
	                       _id = 'fixed-'+_e._$id(_element);
	                   // check cache
	                   if (!!_cache[_id])
	                       return;
	                   var _conf = {};
	                   _cache[_id] = _conf;
	                   // init position
	                   
	                   
	               });
	    })();
	    
	    /**
	     * 节点占全屏
	     * @param  {Node} _element 节点
	     * @return {Void}
	     */
	    _h.__fullScreen =
	    _h.__fullScreen._$aop(function(_event){
	        _event.stopped = !0;
	        var _element  = _event.args[0],
	            _style    = _element.style,
	            _viewport = _e._$getPageBox();
	        _style.width  = _viewport.scrollWidth+'px';
	        _style.height = _viewport.scrollHeight+'px';
	    });
	    /**
	     * 为节点增加用于盖select/flash等控件的层
	     * @param  {Node} _element 节点
	     * @return {Node}          盖层节点
	     */
	    _h.__mask = 
	    _h.__mask._$aop(function(_event){
	        _event.stopped = !0;
	        var _element = _event.args[0],
	            _mask = _cache[_element.msk];
	        if (!_mask){
	            _element.msk = _seed++;
	            _mask = _e._$create('iframe');
	            _mask.style.position = 'absolute';
	            _cache[_element.msk] = _mask;
	        }
	        _event.value = _mask;
	        var _style = _mask.style;
	        _style.top = (parseInt(_e._$getStyle
	                     (_element,'top'))||0)+'px';
	        _style.left = (parseInt(_e._$getStyle
	                      (_element,'left'))||0)+'px';
	        _style.width = _element.offsetWidth+'px';
	        _style.height = _element.offsetHeight+'px';
	        _element.insertAdjacentElement('beforeBegin',_mask);
	    });
	    /**
	     * 去除用于盖select/flash等控件的层
	     * @param  {Object} _element 节点
	     * @return {Void}
	     */
	    _h.__unmask = 
	    _h.__unmask._$aop(function(_event){
	        _event.stopped = !0;
	        var _mask = _cache[_event.args[0].msk];
	        if (!!_mask) _e._$removeByEC(_mask);
	    });
	});
	
	return _p;
};
define(['{lib}base/global.js',
	    '{lib}base/platform.js',
		'{lib}base/element.js',
		'{lib}base/event.js',
		'./element.js'],f);