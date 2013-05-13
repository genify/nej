/**
 * ------------------------------------------
 * Trident引擎(ie6-ie9)对API增强实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _p = _('nej.p'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _h = _('nej.h'),
        _omap = {}; // event must use attach/detach method
    if (_p._$NOT_PATCH.trident) return;
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
     * 取节点属性值
     * @param  {Node}   节点
     * @param  {String} 属性名
     * @return {String} 属性值
    _h.__getAttribute = 
    _h.__getAttribute._$aop(null,function(_event){
        // fix ie7 maxlength default value 2147483647
        var _args = _event.args;
        if (_args[1]=='maxlength'&&
            _event.value==2147483647)
            _event.value = '';
    });
     */
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
    /*
     * 根据选择器取节点列表
     * @param  {Node}   _element  相对节点，默认为document
     * @param  {String} _selector 选择器
     * @return {Array}            匹配到的节点列表
    _h.__querySelectorAll = 
    _h.__querySelectorAll._$aop(function(_event){
        var _element = _event.args[0];
        if (!!_element.querySelectorAll) return;
        _event.stopped = !0;
        // TODO
        
    });
     */
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
     * 检查事件信息
     * @param  {Node}     _element 节点对象
     * @param  {String}   _type    事件类型
     * @param  {Function} _event   事件处理函数
     * @param  {Boolean}  _capture 是否捕获阶段事件
     * @return {Array}             事件列表
     */
    _h.__checkEvent = (function(){
        var _emap = {'input':'propertychange'
                    ,'load':'readystatechange'};
        for(var x in _emap) _omap[_emap[x]] = !0;
        // check type used in ie
        var _doCheckType = function(_element,_type){
            if ('on'+_type in _element) 
                return null;
            return _emap[_type]||'';
        };
        // check event handler used by element with type
        var _doCheckEvent = function(_type,_handler){
            var _callback = _handler;
            switch(_type){
                case 'readystatechange':
                    _callback = function(_event){
                        var _element = _v._$getElement(_event)||this;
                        if (_element.readyState=='loaded'||
                            _element.readyState=='complete'){
                            _event.target = _element;
                            _handler.call(_element,_event);
                        }
                    };
                break;
            }
            return _callback;
        };
        return _h.__checkEvent._$aop(function(_event){
            var _args = _h.__formatEventArgs
                          .apply(_h,_event.args);
            // illegal arguments
            if (!_args){
                _event.stopped = !0;
                return;
            }
            // check type
            var _type = _doCheckType(_args[0],_args[1]);
            // other event used in ie
            if (!!_type){
                _event.stopped = !0;
                _args[4] = _args[1];
                _args[1] = _type;
                // check event handler
                if (!!_args[2]){
                    _args[5] = _args[2];
                    _args[2] = _doCheckEvent(
                               _args[1],_args[2]);
                }
                _event.value = _args;
            }
        },function(_event){
            var _args = _event.value;
            if (!_args[0]||
                !_u._$isFunction(_args[2]))
                return;
            if (!_u._$isFunction(_args[5]))
                _args[5] = _args[2];
            _args[2] = _args[2]._$bind(_args[0]);
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
                    // ie8+ support css :focus
                    if (_p._$KERNEL.release>='4.0')
                        return;
                    // patch ie6-7 :focus
                    var _args = _event.args;
                    if (_args[1]!=1){
                        _v._$addEvent(_args[0],'blur',
                            _onBlur._$bind(null,_args[2]));
                        _args[1] = -1;
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
};
NEJ.define('{lib}patched/trident/api.js',
      ['{lib}patched/api.js'],f);