/*
 * ------------------------------------------
 * 事件接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(NEJ,_h,_eh,_e,_u,_v){
    if (CMPT){
        // variable declaration
        var _  = NEJ.P,
            _r = NEJ.R,
            _h = _('nej.h'),
            _e = _('nej.e'),
            _u = _('nej.u'),
            _v = _('nej.v'),
            _x = _('nej.x'),
            _reg = /\s+/,
            // {id:{type:[{type:'click',func:function,sfun:function,capt:true},...]}}
            // id   - element id
            // type - event name, no on prefix
            // func - event after wrapper
            // capt - capture flag
            // sfun - event before wrapper
            _cache = {};
    }
    var _r     = NEJ.R,
        _x     = _v,
        _reg = /\s+/,
        _cache = {};
    /*
     * 检查事件批量添加或删除
     * @return {Void}
     */
    var _doCheckBatchEvent = function(_added){
        var _arr = (arguments[2]||'').split(_reg);
        if (_arr.length>1){
            var _args = _r.slice.call(arguments,1);
            _u._$forEach(
                _arr,function(_value){
                    _args[1] = _value;
                    !_added ? _v._$delEvent.apply(_v,_args)
                            : _v._$addEvent.apply(_v,_args);
                }
            );
            return !0;
        }
    };
    /*
     * 清理节点事件缓存
     * @param  {String|Node} 节点
     * @return {Void}
     */
    var _doClearElement = function(_element){
        _element = _e._$get(_element);
        if (!_element||!_cache[_element.id]) return;
        var _empty = !0,
            _id = _element.id;
        _u._$forIn(
            _cache[_id],
            function(){
                _empty = !1;
                return !0;
            }
        );
        if (_empty) delete _cache[_id];
    };
    /**
     * 节点添加事件，
     * 支持添加自定义事件，
     * 对于自定义事件的实现逻辑由其他模块负责实现
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     *   // 添加系统预定义事件
     *   _v._$addEvent(
     *       'abc','mouseover',function(_event){
     *           // TODO something
     *       },false
     *   );
     *   // 添加自定义事件
     *   _v._$addEvent(
     *       'abc','custom',function(_event){
     *           // TODO something
     *       },false
     *   );
     *   // 添加多个事件
     *   _v._$addEvent(
     *       'abc','mouseover click mousedown',
     *       function(_event){
     *           // TODO something
     *       },false
     *   );
     * [/code]
     * 
     * @see    {#_$delEvent}
     * @api    {nej.v._$addEvent}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @param  {Function}    事件处理函数
     * @param  {Boolean}     是否捕获阶段事件，IE低版本浏览器忽略此参数
     * @return {nej.v}
     */
    _v._$addEvent = 
    _x._$addEvent = (function(){
        // add event to cache
        var _doAddEventInCache = function(){
            var _args = _h.__checkEvent
                          .apply(_h,arguments);
            // check element and hanlder
            if (!_args||!_args[2]) return;
            var _tmp0 = _e._$id(_args[0]),
                _tmp1 = _cache[_tmp0]||{};
            // cache.id
            _cache[_tmp0] = _tmp1;
            // cache.id.type
            _tmp0 = _args[4]||_args[1];
            var _tmp2 = _tmp1[_tmp0]||[];
            _tmp1[_tmp0] = _tmp2;
            // push event cache
            _tmp2.push({
                type:_args[1],
                func:_args[2],
                capt:!!_args[3],
                sfun:_args[5]||_args[2]
            });
            return _args.slice(0,4);
        };
        return function(){
            // check batch event add
            var _args = _r.slice.call(arguments,0);
            _args.unshift(!0);
            if (_doCheckBatchEvent.apply(null,_args)){
                return;
            }
            // add one event
            var _args = _doAddEventInCache
                        .apply(null,arguments);
            if (!!_args) 
                _h.__addEvent.apply(_h,_args);
            return this;
        };
    })();
    /**
     * 节点删除事件，输入参数必须保证与添加接口{#_$addEvent}输入参数完全一致
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     * 
     *   // 事件回调业务逻辑
     *   var _doCallback = function(_event){
     *       // TODO something
     *       alert('0');
     *   };
     * 
     *   // 添加事件
     *   _v._$addEvent('abc','mouseover',_doCallback,false);
     *   // 删除事件，这里参数必须保持完全一致
     *   _v._$delEvent('abc','mouseover',_doCallback,false);
     *
     *   // 比如以下方式虽然回调的业务逻辑一致，但是无法删除之前添加的事件
     *   _v._$delEvent(
     *       'abc',"mouseover",function(_event){
     *           // TODO something
     *           alert('0');
     *       },false
     *   );
     * 
     *   // 删除多个事件
     *   _v._$delEvent('abc','mouseover click mouseup',_doCallback,false);
     * [/code]
     * 
     * @see    {#_$addEvent}
     * @api    {nej.v._$delEvent}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      事件类型，不带on前缀，不区分大小写，多个事件用空格分隔
     * @param  {Function}    事件处理函数
     * @param  {Boolean}     是否捕获阶段事件
     * @return {nej.v}
     */
    _v._$delEvent = 
    _x._$delEvent = (function(){
        // delete event in cache
        var _doDelEventInCache = function(){
            var _argc = arguments,
                _tmp0 = _e._$id(_argc[0]),
                _tmp1 = _cache[_tmp0],
                _type = (_argc[1]||'').toLowerCase(),
                _event = _argc[2];
            // check arguments
            if (!_tmp1||!_type||!_event) return;
            // cache.id.type
            _tmp1 = _tmp1[_type];
            if (!_tmp1) return;
            // find event match handler/capture
            var _cflag = !!_argc[3],
                _index = _u._$indexOf(_tmp1,
                         function(_emap){
                             return _event==_emap.sfun&&
                                    _cflag==_emap.capt;
                         });
            // check result
            if (_index<0) return;
            var _emap = _tmp1.splice(_index,1)[0];
            if (!_tmp1.length){
                delete _cache[_tmp0][_type];
            }
            return !_emap?null:[
                       _e._$get(_tmp0),
                       _emap.type,
                       _emap.func,
                       _emap.capt
                   ];
        };
        return function(){
            // check batch event delete
            var _args = _r.slice.call(arguments,0);
            _args.unshift(!1);
            if (_doCheckBatchEvent.apply(null,_args)){
                return;
            }
            // delete one event
            var _args = _doDelEventInCache
                        .apply(null,arguments);
            if (!!_args){
                _h.__delEvent.apply(_h,_args);
                _doClearElement(_args[0]);
            }
            return this;
        };
    })();
    /**
     * 清除节点事件
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     * 
     *   // 添加事件
     *   _v._$addEvent(
     *     'abc','mouseover',
     *     function(_event){
     *         // TODO something
     *     },false);
     * 
     *   _v._$addEvent(
     *     'abc','mouseover',
     *     function(_event){
     *         // TODO something
     *     },true);
     * 
     *   _v._$addEvent(
     *     'abc','custom',
     *     function(_event){
     *         // TODO something
     *     },false);
     * 
     *   // 清除节点所有事件，包括两个mouseover事件和一个custom事件
     *   _v._$clearEvent('abc');
     *   
     *   // 清除节点指定类型事件，只清除两个mouseover事件
     *   _v._$clearEvent('abc','mouseover');
     * [/code]
     * 
     * @api    {nej.v._$clearEvent}
     * @param  {String|Node} 节点ID或者对象
     * @param  {String}      事件类型，不带on前缀，不区分大小写
     * @return {nej.v}
     */
    _v._$clearEvent = 
    _x._$clearEvent = (function(){
        // clear by type
        var _doClearByType = function(){
            var _argc = arguments,
                _tmp0 = _e._$id(_argc[0]),
                _tmp1 = _cache[_tmp0],
                _tmp2 = (_argc[1]||'').toLowerCase();
            if (!_tmp1||!_tmp2) return;
            // celar event list
            var _element = _e._$get(_tmp0);
            _u._$reverseEach(
                _tmp1[_tmp2],
                function(_emap,_index,_list){
                    _h.__delEvent(
                        _element,
                        _emap.type,
                        _emap.func,
                        _emap.capt
                    );
                    _list.splice(_index,1);
                }
            );
            delete _tmp1[_tmp2];
        };
        // clear all type
        var _doClearAll = function(_element){
            _element = _e._$get(_element);
            if (!_element) return;
            var _id = _element.id;
            _u._$forIn(
                _cache[_id],
                function(_list,_type){
                    _doClearByType(_id,_type);
                });
            delete _cache[_id];
        };
        return function(_element,_type){
            !_type ? _doClearAll(_element)
                   : _doClearByType(_element,_type);
            _doClearElement(_element);
            return this;
        };
    })();
    /**
     * 获取触发事件的节点，可以传入过滤接口来遍历父节点找到符合条件的节点
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="a">
     *     <p>
     *       <span id="b">123</span>
     *       <span link="a">123</span>
     *       <span class="a link">123</span>
     *       <span data-link="a">123</span>
     *     </p>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     *   
     *   // 取事件触发节点
     *   _v._$addEvent(
     *       'b','click',
     *       fucntion(_event){
     *           // id为b的节点
     *           var _node = _v._$getElement(_event);
     *           // TODO something
     *       },false);
     * 
     *   // 事件触发，取id是a的节点
     *   _v._$addEvent(
     *       'b','click',
     *       fucntion(_event){
     *           // id为a的节点
     *           var _node = _v._$getElement(_event,
     *                       function(_element){
     *                           return _element.id=='a';
     *                       });
     *           // TODO something
     *           // class含link或者属性含link或者data-link的节点
     *           var _node = _v._$getElement(_event,'link');
     *           // 仅匹配class即 class="link xx xxx"
     *           var _node = _v._$getElement(_event,'c:link');
     *           // 仅匹配dataset即 data-link="aaaa"
     *           var _node = _v._$getElement(_event,'d:link');
     *           // 仅匹配attributer即 link="aaa"
     *           var _node = _v._$getElement(_event,'a:link');
     *       },false);
     * [/code]
     * 
     * @api    {nej.v._$getElement}
     * @param  {Event}    事件对象
     * @param  {Function} 过滤接口
     * @return {Node}     符合条件的节点
     */
    _v._$getElement = (function(){
        // element filter
        var _exmap;
        var _doFilter = function(_name,_element){
            var _arr = _name.split(':');
            if (_arr.length>1){
                if (!_exmap)
                    _exmap = {
                        'c':_e._$hasClassName,
                        'd':_e._$dataset,
                        'a':_e._$attr
                    };
                var _check = _exmap[_arr[0]];
                if (!!_check) 
                    return !!_check(_element,_arr[1]);
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
            if (!_filter) return _element;
            if (_u._$isString(_filter))
                _filter = _doFilter._$bind(null,_filter);
            if (_u._$isFunction(_filter)){
                while(_element){
                    if (!!_filter(_element))
                        return _element;
                    _element = _element.parentNode;
                }
                return null;
            }
            return _element;
        };
    })();
    /**
     * 阻止事件，包括默认事件和传递事件
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     * 
     *   // 事件回调中阻止事件冒泡
     *   _v._$addEvent(
     *       'b','click',
     *       function(_event){
     *           // 阻止事件继续传播
     *           // 阻止链接打开的默认事件
     *           _v._$stop(_event);
     *       },false);
     * 
     *   // a节点上的点击事件不会触发
     *   _v._$addEvent(
     *       'a','click',
     *       function(_event){
     *           alert(0);
     *           // TODO something
     *       },false);
     * [/code]
     * 
     * @see    {#_$stopBubble}
     * @see    {#_$stopDefault}
     * @api    {nej.v._$stop}
     * @param  {Event} 要阻止的事件对象
     * @return {nej.v}
     */
    _v._$stop = function(_event){
        _v._$stopBubble(_event);
        _v._$stopDefault(_event);
        return this;
    };
    /**
     * 阻止事件的冒泡传递
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     * 
     *   // 事件回调中阻止事件冒泡
     *   _v._$addEvent(
     *       'b','click',
     *       function(_event){
     *           // 阻止事件继续传播
     *           // 链接仍然会被打开
     *           _v._$stopBubble(_event);
     *       },false);
     * 
     *   // a节点上的点击事件不会触发
     *   _v._$addEvent(
     *       'a','click',
     *       function(_event){
     *           alert(0);
     *           // TODO something
     *       },false);
     * [/code] 
     * 
     * @see    {#_$stop}
     * @api    {nej.v._$stopBubble}
     * @param  {Event} 要阻止的事件对象
     * @return {nej.v}
     */
    _v._$stopBubble = function(_event){
        if (!!_event){
            !!_event.stopPropagation
            ? _event.stopPropagation()
            : _event.cancelBubble = !0;
        } 
        return this;
    };
    /**
     * 阻止标签的默认事件
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="a">
     *     <a href="xxx.html" id="b">123</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     * 
     *   // 事件回调中阻止链接默认事件
     *   _v._$addEvent(
     *       'b','click',
     *       function(_event){
     *           // 阻止链接打开页面的默认行为
     *           _v._$stopDefault(_event);
     *       },false);
     * 
     *   // a节点上的点击事件仍然会触发
     *   _v._$addEvent(
     *       'a','click',
     *       function(_event){
     *           alert(0);
     *           // TODO something
     *       },false);
     * [/code]
     * 
     * @see    {#_$stop}
     * @api    {nej.v._$stopDefault}
     * @param  {Event} 要阻止的事件对象
     * @return {nej.v}
     */
    _v._$stopDefault = function(_event) {
        if (!!_event){
            !!_event.preventDefault
            ? _event.preventDefault()
            : _event.returnValue = !1;
        }
        return this;
    };
    /**
     * 阻止点击默认事件，
     * 支持在非click事件时阻止，
     * click事件回调中调用此接口等价于调用_$stopDefault接口
     * 
     * 结构举例
     * [code type="html"]
     *   <div class="test">
     *     <a href="http://blog.163.com/" id="link-node-id">网易博客</a>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     * 
     *   // 添加非点击事件
     *   _v._$addEvent(
     *     'link-node-id','mousedown',
     *     function(_event){
     *         // 阻止打开链接
     *         _v._$stopClick(_event);
     *         // TODO something
     *     });
     * 
     *   // 添加点击事件
     *   _v._$addEvent(
     *     'link-node-id','click',
     *     function(_event){
     *         // 此时等价于调用 _v._$stopDefault(_event)
     *         _v._$stopClick(_event);
     *         // TODO something
     *     });
     * [/code]
     * 
     * @api    {nej.v._$stopClick}
     * @see    {#_$stopDefault}
     * @param  {Event} 事件对象
     * @return {nej.v}
     */
    _v._$stopClick = (function(){
        var _inited = !1;
        var _doInitListener = function(){
            if (_inited) 
                return;
            _inited = !0;
            _v._$addEvent(document,'click',
                         _onDocumentClick,!0);
        };
        var _onDocumentClick = function(_event){
            var _element = _v._$getElement(_event),
                _stopped = _e._$dataset(_element,'stopped');
            if (_stopped=='true'){
                _v._$stop(_event);
                _e._$dataset(_element,'stopped','false');
            }
        };
        return function(_event){
            if (!_event) return;
            if (_event.type=='click'){
                _v._$stop(_event);
                return;
            }
            _doInitListener();
            _e._$dataset(
                _v._$getElement(_event),
                'stopped','true'
            );
        };
    })();
    /**
     * 取事件相对于页面的位置
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     *   // 回调中取鼠标位置
     *   _v._$addEvent(
     *       'abc','click',
     *       function(_event){
     *           // 获取鼠标事件触发的水平、垂直位置
     *           var _pos = _v._$page(_event);
     *       },false);
     * [/code]
     * 
     * @see    {#_$pageX}
     * @see    {#_$pageY}
     * @api    {nej.v._$page}
     * @param  {Event}  事件对象
     * @return {Object} 位置信息，{x:10,y:10}
     */
    _v._$page = function(_event){
        return {
            x:_v._$pageX(_event),
            y:_v._$pageY(_event)
        };
    };
    /**
     * 取事件相对于页面左侧的位置
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     *   // 回调中取鼠标位置
     *   _v._$addEvent(
     *       'abc','click',
     *       function(_event){
     *           // 获取鼠标事件触发的水平位置
     *           var _x = _v._$pageX(_event);
     *       },false);
     * [/code]
     * 
     * @see    {#_$pageY}
     * @api    {nej.v._$pageX}
     * @param  {Event}    事件对象
     * @return {Number} 水平位置
     */
    _v._$pageX = function(_event){
        return _event.pageX!=null?_event.pageX:(
               _event.clientX+_e._$getPageBox().scrollLeft);
    };
    /**
     * 取事件相对于页面顶部的位置
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc" style="width:100%;height:100%;">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     *   // 回调中取鼠标位置
     *   _v._$addEvent(
     *       'abc','click',
     *       function(_event){
     *            // 获取鼠标事件触发的垂直位置
     *           var _y = _v._$pageY(_event);
     *       },false);
     * [/code]
     * 
     * @see    {#_$pageX}
     * @api    {nej.v._$pageY}
     * @param  {Event}    事件对象
     * @return {Number} 垂直位置
     */
    _v._$pageY = function(_event){
        return _event.pageY!=null?_event.pageY:(
               _event.clientY+_e._$getPageBox().scrollTop);
    };
    /**
     * 触发对象的某个事件，注：对于IE浏览器该接口有以下限制
     * [ul]
     *   捕获阶段支持需要浏览器IE9+
     *   自定义事件支持需要浏览器IE9+
     * [/ul]
     * 
     * 页面结构举例
     * [code type="html"]
     *   <div id="abc">123</div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _v = NEJ.P('nej.v');
     * 
     *   // 注册鼠标事件
     *   _v._$addEvent('abc','click',function(_event){
     *       // 获取鼠标事件触发的垂直位置
     *      var _y = _v._$pageY(_event);
     *   },false);
     *   // 触发鼠标事件
     *   _v._$dispatchEvent('abc','click');
     * 
     *   // 注册自定义事件
     *   _v._$addEvent('abc','ok',function(_event){
     *      // TODO something
     *   },false);
     *   // 触发自定义事件
     *   _v._$dispatchEvent('abc','ok');
     * [/code]
     * 
     * @api    {nej.v._$dispatchEvent}
     * @param  {String|Node}    节点ID或者对象
     * @param  {String}          鼠标事件类型，不区分大小写
     * @return {nej.v}
     */
    _v._$dispatchEvent = 
    _x._$dispatchEvent = function(_element,_type,_options){
        var _args = _h.__checkEvent(
                        _element,_type);
        if (!!_args)
            _h.__dispatchEvent(
                _args[0],_args[1],_options);
        return this;
    };

    /**
     * 判断是否需要对Flash事件做代理，
     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
     * @return {Boolean} 是否做代理
     */
    _v._$canFlashEventBubble =
    _x._$canFlashEventBubble = function(_wmode){
        return _h.__canFlashEventBubble(_wmode);
    };
    /**
     * 导出dom事件缓存对象，仅用于调试
     * @return {Void}
     */
    window.dbg.dumpEV = function(){
        return _cache;
    };
    _x.isChange = !0;

    return _v;
};
NEJ.define(
    '{lib}base/event.js',[
    '{lib}base/global.js',
    '{platform}event.js',
    '{lib}base/element.js',
    '{lib}base/util.js'
],f);
