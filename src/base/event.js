/*
 * ------------------------------------------
 * 事件接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './global.js',
    './element.js',
    './util.js',
    '{platform}event.js'
],function(NEJ,_e,_u,_h,_p,_o,_f,_r){
    // {id:{type:[{type:'click',func:function,sfun:function,capt:true},...]}}
    // id   - element id
    // type - event name, no on prefix
    // func - event after wrapper
    // capt - capture flag
    // sfun - event before wrapper
    // link - events link to this event [[element,type,handler,capture],...]
    var _xcache = {};
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
     * 对于自定义事件的实现逻辑由其他模块负责实现<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 添加系统预定义事件
     *       _p._$addEvent(
     *           'abc','mouseover',function(_event){
     *               // TODO something
     *           },false
     *       );
     *       // 添加自定义事件，回车事件
     *       _p._$addEvent(
     *           'abc','enter',function(_event){
     *               // TODO something
     *           },false
     *       );
     *       // 添加多个事件，用空格分隔
     *       _p._$addEvent(
     *           'abc','mouseover click mousedown',
     *           function(_event){
     *               // TODO something
     *           },false
     *       );
     *   });
     * [/code]
     * 
     * @see    {#_$delEvent}
     * @api    {_$addEvent}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @param  {Function}    事件处理函数
     * @param  {Boolean}     是否捕获阶段事件，IE低版本浏览器忽略此参数
     * @return {Void}
     */
    _p._$addEvent = (function(){
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
                link:_real.link
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
     * 节点删除事件，输入参数必须保证与添加接口_$addEvent输入参数完全一致<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 事件回调业务逻辑
     *       var _doCallback = function(_event){
     *           // TODO something
     *           alert('0');
     *       };
     * 
     *       // 添加事件
     *       _p._$addEvent('abc','mouseover',_doCallback,false);
     *       // 删除事件，这里参数必须保持完全一致
     *       _p._$delEvent('abc','mouseover',_doCallback,false);
     *
     *       // 比如以下方式虽然回调的业务逻辑一致，但是无法删除之前添加的事件
     *       _p._$delEvent(
     *           'abc',"mouseover",function(_event){
     *               // TODO something
     *               alert('0');
     *           },false
     *       );
     * 
     *       // 删除多个事件
     *       _p._$delEvent(
     *           'abc','mouseover click mouseup',
     *           _doCallback,false
     *       );
     *   });
     * [/code]
     * 
     * @see    {#_$addEvent}
     * @api    {_$delEvent}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @param  {Function}    事件处理函数
     * @param  {Boolean}     是否捕获阶段事件
     * @return {Void}
     */
    _p._$delEvent = (function(){
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
                    _result.push.apply(_result,_item.link);
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
     * 清除节点事件<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 添加事件
     *       _p._$addEvent(
     *           'abc','mouseover',function(_event){
     *               // TODO something
     *           }
     *       );
     *       _p._$addEvent(
     *           'abc','mouseover',function(_event){
     *               // TODO something
     *           },true
     *       );
     *       _p._$addEvent(
     *           'abc','custom',function(_event){
     *               // TODO something
     *           }
     *       );
     * 
     *       // 清除节点所有事件，包括两个mouseover事件和一个custom事件
     *       _p._$clearEvent('abc');
     *   
     *       // 清除节点指定类型事件，只清除两个mouseover事件
     *       _p._$clearEvent('abc','mouseover');
     *      
     *       // 清除多个事件，用空格分隔
     *       _p._$clearEvent('abc','mouseover custom');
     *   });
     * [/code]
     * 
     * @see    {#_$delEvent}
     * @api    {_$clearEvent}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @return {Void}
     */
    _p._$clearEvent = (function(){
        var _doClearEvent = function(_id,_list){
            _u._$reverseEach(
                _list,function(_item){
                    _p._$delEvent(
                        _id,_item.type,
                        _item.func,_item.capt
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
                            _doClearEvent(_id,_cch_id[_name]);
                        }
                    );
                }else{
                    // clear all event
                    _u._$forIn(
                        _cch_id,function(_value,_name){
                            _p._$clearEvent(_element,_name);
                        }
                    );
                }
            }
        };
    })();
    /**
     * 触发对象的某个事件，注：对于IE浏览器该接口节点事件有以下限制<br/>
     * [ul]
     *   捕获阶段支持需要浏览器IE9+
     *   节点上自定义事件支持需要浏览器IE9+
     * [/ul]
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 注册鼠标事件
     *       _p._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的垂直位置
     *               var _y = _p._$pageY(_event);
     *           }
     *       );
     *       // 触发鼠标事件
     *       _p._$dispatchEvent('abc','click');
     * 
     *       // 注册自定义事件
     *       _p._$addEvent(
     *           'abc','ok',function(_event){
     *               // TODO something
     *           }
     *       );
     *       // 触发自定义事件
     *       _p._$dispatchEvent('abc','ok');
     *   });
     * [/code]
     * 
     * @api    {_$dispatchEvent}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      鼠标事件类型，不区分大小写，多个事件用空格分隔
     * @return {Void}
     */
    _p._$dispatchEvent = function(_element,_type,_options){
        var _element = _e._$get(_element);
        if (!!_element){
            _u._$forEach(
                _getTypeList(_type),function(_name){
                    _p.__dispatchEvent(
                        _element,_name,_options
                    );
                }
            );
        }
    };
    /**
     * 获取触发事件的节点，可以传入过滤接口来遍历父节点找到符合条件的节点<br/>
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="a">
     *     <p>
     *       <span id="b">123</span>
     *       <span link="a">123</span>
     *       <span class="a link">123</span>
     *       <span data-link="a">123</span>
     *       <label>aaaaa</label>
     *     </p>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 取事件触发节点
     *       _p._$addEvent(
     *           'b','click',fucntion(_event){
     *               // id为b的节点
     *               var _node = _p._$getElement(_event);
     *               // TODO something
     *           }
     *       );
     * 
     *       // 事件触发，取id是a的节点
     *       _p._$addEvent(
     *           'b','click',fucntion(_event){
     *               // id为a的节点
     *               var _node = _p._$getElement(
     *                   _event,function(_element){
     *                       return _element.id=='a';
     *                   }
     *               );
     *               // TODO something
     * 
     *               // class含link或者属性含link或者data-link的节点
     *               var _node = _p._$getElement(_event,'link');
     * 
     *               // 仅匹配class即 class="link xx xxx"
     *               var _node = _p._$getElement(_event,'c:link');
     * 
     *               // 仅匹配dataset即 data-link="aaaa"
     *               var _node = _p._$getElement(_event,'d:link');
     * 
     *               // 仅匹配attributer即 link="aaa"
     *               var _node = _p._$getElement(_event,'a:link');
     *               
     *               // 仅匹配tag即 <label>
     *               var _node = _p._$getElement(_event,'t:label');
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @api    {_$getElement}
     * @param  {Event}    事件对象
     * @param  {Function} 过滤接口
     * @return {Node}     符合条件的节点
     */
    _p._$getElement = (function(){
        // element filter
        var _exmap;
        var _doFilter = function(_name,_element){
            var _arr = _name.split(':');
            if (_arr.length>1){
                if (!_exmap){
                    _exmap = {
                        a:_e._$attr, 
                        d:_e._$dataset,
                        c:_e._$hasClassName,
                        t:function(n,v){return (n.tagName||'').toLowerCase()===v;}
                    };
                }
                var _check = _exmap[_arr[0]];
                if (!!_check){
                    return !!_check(_element,_arr[1]);
                }
                _name = _arr[1];
            }
            return !!_e._$attr(_element,_name)||
                   !!_e._$dataset(_element,_name)||
                     _e._$hasClassName(_element,_name);
        };
        return function(_event){
            if (!_event) return null;
            var _element = _event.target||
                           _event.srcElement,
                _filter = arguments[1];
            if (!_filter){
                return _element;
            } 
            if (_u._$isString(_filter)){
                _filter = _doFilter._$bind(null,_filter);
            }
            if (_u._$isFunction(_filter)){
                while(_element){
                    if (!!_filter(_element)){
                        return _element;
                    }
                    _element = _element.parentNode;
                }
                return null;
            }
            return _element;
        };
    })();
    /**
     * 阻止事件，包括默认事件和传递事件<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 事件回调中阻止事件冒泡
     *       _p._$addEvent(
     *           'b','click',function(_event){
     *               // 阻止事件继续传播
     *               // 阻止链接打开的默认事件
     *               _p._$stop(_event);
     *           }
     *       );
     * 
     *       // a节点上的点击事件不会触发
     *       _p._$addEvent(
     *           'a','click',function(_event){
     *               alert(0);
     *               // TODO something
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @see    {#_$stopBubble}
     * @see    {#_$stopDefault}
     * @api    {_$stop}
     * @param  {Event} 要阻止的事件对象
     * @return {Void}
     */
    _p._$stop = function(_event){
        _p._$stopBubble(_event);
        _p._$stopDefault(_event);
    };
    /**
     * 阻止事件的冒泡传递<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 事件回调中阻止事件冒泡
     *       _p._$addEvent(
     *           'b','click',function(_event){
     *               // 阻止事件继续传播
     *               // 链接仍然会被打开
     *               _p._$stopBubble(_event);
     *           }
     *       );
     * 
     *       // a节点上的点击事件不会触发
     *       _p._$addEvent(
     *           'a','click',function(_event){
     *               alert(0);
     *               // TODO something
     *           }
     *       );
     *   });
     * [/code] 
     * 
     * @see    {#_$stop}
     * @api    {_$stopBubble}
     * @param  {Event} 要阻止的事件对象
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
     * 阻止标签的默认事件<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 事件回调中阻止链接默认事件
     *       _p._$addEvent(
     *           'b','click',function(_event){
     *               // 阻止链接打开页面的默认行为
     *               _p._$stopDefault(_event);
     *           }
     *       );
     * 
     *       // a节点上的点击事件仍然会触发
     *       _p._$addEvent(
     *           'a','click',function(_event){
     *               alert(0);
     *               // TODO something
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @see    {#_$stop}
     * @api    {_$stopDefault}
     * @param  {Event} 要阻止的事件对象
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
     * 取事件相对于页面的位置<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 回调中取鼠标位置
     *       _p._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的水平、垂直位置
     *               var _pos = _p._$page(_event);
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @see    {#_$pageX}
     * @see    {#_$pageY}
     * @api    {_$page}
     * @param  {Event}  事件对象
     * @return {Object} 位置信息，{x:10,y:10}
     */
    _p._$page = function(_event){
        return {
            x:_p._$pageX(_event),
            y:_p._$pageY(_event)
        };
    };
    /**
     * 取事件相对于页面左侧的位置<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 回调中取鼠标位置
     *       _p._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的水平位置
     *               var _x = _p._$pageX(_event);
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @see    {#_$pageY}
     * @api    {_$pageX}
     * @param  {Event}    事件对象
     * @return {Number} 水平位置
     */
    _p._$pageX = function(_event){
        return _event.pageX!=null?_event.pageX:
               (_event.clientX+_e._$getPageBox().scrollLeft);
    };
    /**
     * 取事件相对于页面顶部的位置<br/>
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/event.js'
     *   ],function(_p){
     *       // 回调中取鼠标位置
     *       _p._$addEvent(
     *           'abc','click',function(_event){
     *               // 获取鼠标事件触发的垂直位置
     *               var _y = _p._$pageY(_event);
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @see    {#_$pageX}
     * @api    {_$pageY}
     * @param  {Event}  事件对象
     * @return {Number} 垂直位置
     */
    _p._$pageY = function(_event){
        return _event.pageY!=null?_event.pageY:
               (_event.clientY+_e._$getPageBox().scrollTop);
    };
    
    if (CMPT){
        var _v = NEJ.P('nej.v'),
            _x = NEJ.P('nej.x');
        NEJ.copy(_v,_p);
        NEJ.copy(_x,_p);
        _x.isChange = !0;
    }
    
    return _p;
});
