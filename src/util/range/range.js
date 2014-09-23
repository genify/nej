/*
 * ------------------------------------------
 * 区域大小选择功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/range/range */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/event'
],function(NEJ,_k,_e,_v,_u,_t,_p,_o,_f,_r,_pro){
    /**
     * 区域大小选择功能封装
     * 
     * 结构举例
     * ```html
     * <div id="box2"></div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/range/range'
     * ],function(_t){
     *     var _range = _t._$$Range._$allocate({
     *         sbody:'box2',
     *         parent:document.body,
     *         onchange:function(_event){
     *             // 鼠标移动过程，区域选择过程
     *         },
     *         onbeforechange:function(_event){
     *             // 鼠标按下，区域选择开始
     *         },
     *         onafterchange:function(_event){
     *             // 鼠标放开，区域选择结束
     *         }
     *     });
     * });
     * ```
     * 
     * @class    module:util/range/range._$$Range
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object}      config   - 可选配置参数
     * @property {Node|String} sbody    - 用于改变大小的节点
     * @property {Node|String} pbody    - 用于改变位置的节点，不传使用sbody
     * @property {Node|String} parent   - 可选择区域节点
     * @property {Boolean}     overflow - 是否允许超出parent范围
     */
    /**
     * 区域选择变化触发事件
     * @event    module:util/range/range._$$Range#onchange 
     * @param    {Object} event  - 范围信息
     * @property {Number} top    - 上距离
     * @property {Number} left   - 左距离
     * @property {Number} width  - 宽
     * @property {Number} height - 高
     * @property {Event}  event  - 事件
     */
    /**
     * 区域变化之前触发事件
     * 
     * @event    module:util/range/range._$$Range#onbeforechange
     * @param    {Object} event    - 事件
     * @property {Boolean} stopped - 是否阻止后续逻辑
     */
    /**
     * 区域变化之后触发事件
     * 
     * @event  module:util/range/range._$$Range#onafterchange
     */
    _p._$$Range = _k._$klass();
    _pro = _p._$$Range._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/range/range._$$Range#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        // init node
        this.__overflow = !!_options.overflow;
        this.__sbody = _e._$get(_options.sbody);
        this.__pbody = _e._$get(_options.pbody)||this.__sbody;
        this.__parent = _e._$get(_options.parent)||document.body;
        // init event
        this.__doInitDomEvent([[
            document,'mouseup',
            this.__onRangEnd._$bind(this),
        ],[
            document,'mousemove',
            this.__onRanging._$bind(this)
        ],[
            this.__parent,'mousedown',
            this.__onRangeStart._$bind(this)
        ]]);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/range/range._$$Range#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__sbody;
        delete this.__pbody;
        delete this.__parent;
        delete this.__offset;
        delete this.__delta;
        delete this.__maxbx;
    };
    /**
     * 刷新参考信息
     * @return {Void}
     */
    _pro.__doRefreshBox = function(){
        this.__delta = _e._$offset(this.__parent);
        this.__delta.w = this.__pbody.offsetWidth-
                         this.__sbody.clientWidth;
        this.__delta.h = this.__pbody.offsetHeight-
                         this.__sbody.clientHeight;
        this.__maxbx = {
            w:this.__parent.clientWidth,
            h:this.__parent.clientHeight
        };
    };
    /**
     * 改变范围
     * 
     * @protected
     * @method module:util/range/range._$$Range#__doChangeRange
     * @param  {Object} arg0 - 范围信息
     * @return {Void}
     */
    _pro.__doChangeRange = (function(){
        var _isEqual = function(_node,_obj){
            return !_u._$forIn(
                _obj,function(_value,_name){
                    return _value!==parseInt(
                        _e._$getStyle(_node,_name)
                    );
                }
            );
        };
        var _doUnit = function(_obj){
            _u._$forIn(
                _obj,function(_value,_key,_map){
                    _map[_key] = _value+'px';
                }
            );
            return _obj;
        };
        return function(_event){
            // adjust box
            _event.top -= this.__delta.y;
            _event.left -= this.__delta.x;
            _event.width = Math.max(0,_event.width-this.__delta.w);
            _event.height = Math.max(0,_event.height-this.__delta.h);
            // check limit
            var _xpos = {top:_event.top,left:_event.left},
                _size = {width:_event.width,height:_event.height};
            if (!this.__overflow){
                // for performance
                if (_event.top<0&&_event.left<0){
                    return;
                }
                _xpos.top = Math.max(0,_event.top);
                _xpos.left = Math.max(0,_event.left);
                if (_event.top>=0){
                    _size.height = Math.min(
                        _event.height,
                        this.__maxbx.h-_xpos.top-this.__delta.h
                    );
                }else{
                    delete _size.height;
                }
                if (_event.left>=0){
                    _size.width = Math.min(
                        _event.width,
                        this.__maxbx.w-_xpos.left-this.__delta.w
                    );
                }else{
                    delete _size.width;
                }
            }
            // check changed
            if (_isEqual(this.__pbody,_xpos)&&
                _isEqual(this.__sbody,_size)){
                return;
            }
            // update position and size
            _e._$style(this.__pbody,_doUnit(_xpos));
            _e._$style(this.__sbody,_doUnit(_size));
            this._$dispatchEvent(
                'onchange',this._$getRangeBox()
            );
        };
    })();
    /**
     * 开始范围选择
     * 
     * @protected
     * @method module:util/range/range._$$Range#__onRangeStart
     * @param  {Event} arg0 - 事件
     * @return {Void}
     */
    _pro.__onRangeStart = function(_event){
        if (!!this.__offset) return;
        try{
            _event.stopped = !1;
            this._$dispatchEvent('onbeforechange',_event);
            if (!!_event.stopped) return;
        }catch(ex){
            // ignore
        }
        // record position
        this.__offset = {
            x:_v._$pageX(_event),
            y:_v._$pageY(_event)
        };
        // update position
        this.__doRefreshBox();
        this.__doChangeRange({
            width:0,
            height:0,
            event:_event,
            top:this.__offset.y,
            left:this.__offset.x
        });
    };
    /**
     * 范围选择过程
     * 
     * @protected
     * @method module:util/range/range._$$Range#__onRanging
     * @param  {Event} arg0 - 事件
     * @return {Void}
     */
    _pro.__onRanging = function(_event){
        if (!this.__offset) return;
        // calculate position
        var _offset = {
                x:_v._$pageX(_event),
                y:_v._$pageY(_event)
            },
            _delta = {
                x:_offset.x-this.__offset.x,
                y:_offset.y-this.__offset.y
            };
        // update position
        this.__doChangeRange({
            event:_event,
            width:Math.abs(_delta.x),
            height:Math.abs(_delta.y),
            top:_delta.y<0?_offset.y:this.__offset.y,
            left:_delta.x<0?_offset.x:this.__offset.x
        });
    };
    /**
     * 结束范围选择
     * 
     * @protected
     * @method module:util/range/range._$$Range#__onRangEnd
     * @param  {Event} arg0 - 事件
     * @return {Void}
     */
    _pro.__onRangEnd = function(_event){
        if (!!this.__offset){
            delete this.__offset;
            this._$dispatchEvent('onafterchange');
        }
    };
    /**
     * 取选择范围信息
     * 
     * @method module:util/range/range._$$Range#_$getRangeBox
     * @return {Object} 选择范围信息
     */
    _pro._$getRangeBox = function(){
        return {
            width:this.__pbody.offsetWidth,
            height:this.__pbody.offsetHeight,
            top:parseInt(_e._$getStyle(this.__pbody,'top')),
            left:parseInt(_e._$getStyle(this.__pbody,'left'))
        };
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});