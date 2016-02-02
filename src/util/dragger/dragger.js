/*
 * ------------------------------------------
 * 区域移动功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/dragger/dragger */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'util/event'
],function(NEJ,_k,_e,_v,_t,_p,_o,_f,_r,_pro){
    /**
     * 区域移动功能封装
     * 
     * 结构举例
     * ```html
     * <div id="box"></div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/dragger/dragger'
     * ],function(_t){
     *     var _dragger = _t._$$Draggable._$allocate({
     *         body:'box',
     *         overflow:false,
     *         direction:0,
     *         onchange:function(_event){
     *             // 拖动回调获取位置信息
     *             var _postion = this._$getPosition();
     *         },
     *         ondragend:function(_event){
     *             // 拖动结束，返回当前位置，或者用_$getPosition接口取到当前位置信息
     *             var _postion = this._$getPosition();
     *         }
     *     });
     * });
     * ```
     * 
     * @class    module:util/dragger/dragger._$$Draggable
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object}      config    - 可选配置参数
     * @property {Node}        view      - 视窗节点，默认为documentElement或body节点
     * @property {String|Node} body      - 移动控件节点
     * @property {String|Node} mbar      - 触发移动节点ID或者对象，默认为body参数输入节点
     * @property {Boolean}     overflow  - 是否允许超出view范围
     * @property {Number}      direction - 移动方向，默认为0，0-水平+垂直、1-水平、2-垂直
     */
    /**
     * 位置变化之前触发事件
     * 
     * @event    module:util/dragger/dragger._$$Draggable#onbeforechange
     * @param    {Object} event - 位置信息
     * @property {Number} top   - 离父节点顶部距离
     * @property {Number} left  - 离父节点左边距离
     */
    /**
     * 位置变化触发事件
     * 
     * @event    module:util/dragger/dragger._$$Draggable#onchange
     * @param    {Object} event - 位置信息
     * @property {Number} top   - 离父节点顶部距离
     * @property {Number} left  - 离父节点左边距离
     */
    /**
     * 拖拽结束触发事件
     * 
     * @event    module:util/dragger/dragger._$$Draggable#ondragend
     * @param    {Object} event - 位置信息
     * @property {Number} top   - 离父节点顶部距离
     * @property {Number} left  - 离父节点左边距离
     */
    _p._$$Draggable = _k._$klass();
    _pro = _p._$$Draggable._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/dragger/dragger._$$Draggable#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__overflow = !!_options.overflow;
        this.__body = _e._$get(_options.body);
        this.__mbar = _e._$get(_options.mbar)||this.__body;
        this.__view = _e._$get(_options.view)||_e._$getPageBox();
        this.__direction = parseInt(_options.direction)||0;
        this.__doInitDomEvent([[
            document,'mouseup',
            this.__onDragEnd._$bind(this)
        ],[
            document,'mousemove',
            this.__onDragging._$bind(this)
        ],[
            this.__mbar,'mousedown',
            this.__onDragStart._$bind(this)
        ]]);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/dragger/dragger._$$Draggable#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__onDragEnd();
        delete this.__body;
        delete this.__mbar;
        delete this.__view;
    };
    /**
     * 取移动的最大范围
     * 
     * @protected
     * @method module:util/dragger/dragger._$$Draggable#__getMaxRange
     * @return {Object} 范围值
     */
    _pro.__getMaxRange = function(){
        return {
            x:this.__view.clientWidth-this.__body.offsetWidth,
            y:this.__view.clientHeight-this.__body.offsetHeight
        };
    };
    /**
     * 开始移动
     * 
     * @protected
     * @method module:util/dragger/dragger._$$Draggable#__onDragStart
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDragStart = function(_event){
        _v._$stop(_event);
        if (!!this.__offset) return;
        this.__offset = {
            x:_v._$pageX(_event),
            y:_v._$pageY(_event)
        };
        this.__maxbox = this.__getMaxRange();
    };
    /**
     * 移动过程
     * 
     * @protected
     * @method module:util/dragger/dragger._$$Draggable#__onDragging
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDragging = function(_event){
        if (!this.__offset) return;
        _v._$stop(_event);
        var _offset = {
            x:_v._$pageX(_event),
            y:_v._$pageY(_event)
        };
        var _deltax = _offset.x-this.__offset.x,
            _deltay = _offset.y-this.__offset.y,
            _top = parseInt(_e._$getStyle(this.__body,'top'))||0,
            _left = parseInt(_e._$getStyle(this.__body,'left'))||0,
            _value  = {
                top:_top+_deltay,
                left:_left+_deltax
            };
        this.__offset = _offset;
        this._$setPosition(_value);
    };
    /**
     * 结束移动
     * 
     * @protected
     * @method module:util/dragger/dragger._$$Draggable#__onDragEnd
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDragEnd = function(_event){
        if (!this.__offset) return;
        delete this.__maxbox;
        delete this.__offset;
        this._$dispatchEvent(
            'ondragend',
            this._$getPosition()
        );
    };
    /**
     * 修正位置信息
     * @param event
     * @private
     */
    _pro.__doFixPosition = function(event){
        if (!this.__overflow){
            var maxbox = this.__maxbox||
                         this.__getMaxRange();
            event.top  = Math.min(
                maxbox.y,
                Math.max(0,event.top)
            );
            event.left = Math.min(
                maxbox.x,
                Math.max(0,event.left)
            );
        }
    };
    /**
     * 设置位置
     * 
     * 脚本举例
     * ```javascript
     * // 在允许范围内设置盒子的位置
     * _dragger._$setPosition({top:100,left:100});
     * ```
     * 
     * @method   module:util/dragger/dragger._$$Draggable#_$setPosition
     * @param    {Object} arg0 - 位置信息
     * @property {Number} top  - 垂直位置
     * @property {Number} left - 水平位置
     * @return   {Void}
     */
    _pro._$setPosition = function(_event){
        _event.top = Math.round(_event.top);
        _event.left = Math.round(_event.left);
        // fix position
        this.__doFixPosition(_event);
        this._$dispatchEvent(
            'onbeforechange',_event
        );
        this.__doFixPosition(_event);
        // update position
        var _style  = this.__body.style;
        if (this.__direction==0||
            this.__direction==2)
            _style.top  = _event.top+'px';
        if (this.__direction==0||
            this.__direction==1)
            _style.left = _event.left+'px';
        this._$dispatchEvent('onchange',_event);
    };
    /**
     * 取当前位置
     * 
     * 脚本举例
     * ```javascript
     * _dragger._$getPosition();
     * ```
     * 
     * @method module:util/dragger/dragger._$$Draggable#_$getPosition
     * @return {Object} 当前位置，{top:100,left:100}
     */
    _pro._$getPosition = function(){
        return {
            left:parseInt(_e._$getStyle(this.__body,'left'),10)||0,
            top:parseInt(_e._$getStyle(this.__body,'top'),10)||0
        };
    };
    // alias for draggable
    _p._$$Dragger = _p._$$Draggable;

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});