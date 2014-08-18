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
    'util/event'
],function(NEJ,_k,_e,_v,_t,_p,_o,_f,_r){
    var _pro;
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
     *         body:'box2',
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
     * @param    {Object}      config - 可选配置参数
     * @property {Node|String} body   - 用于改变范围的节点或者ID
     * @property {Node|String} parent - 可选择区域节点或者ID
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
     * @event  module:util/range/range._$$Range#onbeforechange
     * @param  {Event} event - 事件
     */
    /**
     * 区域变化之后触发事件
     * @event  module:util/range/range._$$Range#onafterchange
     */
    _p._$$Range = _k._$klass();
    _pro = _p._$$Range._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/range/range._$$Range#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__eopt = {
            end:this.__onRangEnd._$bind(this),
            range:this.__onRanging._$bind(this),
            start:this.__onRangeStart._$bind(this)
        };
    };
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
        this.__body = _e._$get(_options.body);
        this.__parent = _e._$get(_options.parent)
                                ||document.body;
        this.__doInitDomEvent([
            [document,'mouseup',this.__eopt.end],
            [document,'mousemove',this.__eopt.range],
            [this.__parent,'mousedown',this.__eopt.start]
        ]);
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
        delete this.__body;
        delete this.__parent;
        delete this.__offset;
    };
    /**
     * 改变范围
     * 
     * @protected
     * @method module:util/range/range._$$Range#__doChangeRange
     * @param  {Object} arg0 - 范围信息
     * @return {Void}
     */
    _pro.__doChangeRange = function(_event){
        var _style = this.__body.style;
        for(var x in _event)
            _style[x] = _event[x]+'px';
        this._$dispatchEvent('onchange',_event);
    };
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
            if (_event.stopped) return;
        }catch(e){}
        this.__offset = {
            x:_v._$pageX(_event)
           ,y:_v._$pageY(_event)
        };
        this.__parent.appendChild(this.__body);
        this.__doChangeRange({
            top:this.__offset.y
           ,left:this.__offset.x
           ,width:0,height:0
           ,event:_event
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
        var _offset = {
                x:_v._$pageX(_event)
               ,y:_v._$pageY(_event)
            },
            _delta = {
                x:_offset.x-this.__offset.x
               ,y:_offset.y-this.__offset.y
            };
        this.__doChangeRange({
            top:_delta.y<0?_offset.y:this.__offset.y
           ,left:_delta.x<0?_offset.x:this.__offset.x
           ,width:Math.abs(_delta.x)
           ,height:Math.abs(_delta.y)
           ,event:_event
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
        if (!this.__offset) return;
        _e._$removeByEC(this.__body);
        delete this.__offset;
        this._$dispatchEvent('onafterchange');
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});