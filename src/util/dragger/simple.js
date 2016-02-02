/*
 * ------------------------------------------
 * 简易区域移动功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/dragger/simple */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'util/dragger/dragger'
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
     *     'util/dragger/simple'
     * ],function(_t){
     *     var _dragger = _t._$$Dragger._$allocate({
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
     * @class    module:util/dragger/simple._$$Dragger
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
     * @event    module:util/dragger/simple._$$Dragger#onbeforechange
     * @param    {Object} event - 位置信息
     * @property {Number} top   - 离父节点顶部距离
     * @property {Number} left  - 离父节点左边距离
     */
    /**
     * 位置变化触发事件
     *
     * @event    module:util/dragger/simple._$$Dragger#onchange
     * @param    {Object} event - 位置信息
     * @property {Number} top   - 离父节点顶部距离
     * @property {Number} left  - 离父节点左边距离
     */
    /**
     * 拖拽结束触发事件
     *
     * @event    module:util/dragger/simple._$$Dragger#ondragend
     * @param    {Object} event - 位置信息
     * @property {Number} top   - 离父节点顶部距离
     * @property {Number} left  - 离父节点左边距离
     */
    _p._$$Dragger = _k._$klass();
    _pro = _p._$$Dragger._$extend(_t._$$Draggable);
    /**
     * 取初始偏移位置
     *
     * @protected
     * @method module:util/dragger/simple._$$Dragger#__getOffset
     * @return {Object} 范围值
     */
    _pro.__getOffset = function(){
        return _e._$offset(this.__view);
    };
    /**
     * 开始移动
     *
     * @protected
     * @method module:util/dragger/simple._$$Dragger#__onDragStart
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDragStart = function(_event){
        _v._$stop(_event);
        if (!!this.__offset) return;
        this.__offset = this.__getOffset();
        this.__maxbox = this.__getMaxRange();
    };
    /**
     * 移动过程
     *
     * @protected
     * @method module:util/dragger/simple._$$Dragger#__onDragging
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDragging = function(_event){
        if (!this.__offset){
            return;
        }
        _v._$stop(_event);
        var _offset = {
            x:_v._$pageX(_event),
            y:_v._$pageY(_event)
        };
        this._$setPosition({
            top:_offset.y-this.__offset.y,
            left:_offset.x-this.__offset.x
        });
    };

    return _p;
});