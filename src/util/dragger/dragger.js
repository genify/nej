/*
 * ------------------------------------------
 * 区域移动功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _proDragger;
    if (!!_p._$$Dragger) return;
    /**
     * 区域移动功能封装<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id="box"></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _box = _e._$get('box');
     *   var _dg = _p._$$Dragger._$allocate({body:_box,
     *     overflow:false,
     *     direction:0,
     *     onchange:function(_event){
     *         // 拖动回调获取位置信息
     *     },
     *     ondragend:function(_event){
     *         // 拖动结束，返回当前位置，或者用_$getPosition接口取到当前位置信息
     *         _dg._$getPosition();
     *     }
     *   })
     * [/code]
     * @class   {nej.ut._$$Dragger} 区域移动功能封装
     * @extends {nej.ut._$$Event}
     * @param   {Object}                   可选配置参数，已处理参数列表如下
     * @config  {Node}           view      视窗节点，默认为documentElement或body节点
     * @config  {String|Node}    body      移动控件节点
     * @config  {String|Node}    mbar      触发移动节点ID或者对象，默认为body参数输入节点
     * @config  {Boolean}        overflow  是否允许超出view范围
     * @config  {Number}         direction 移动方向，默认为0，0-水平+垂直、1-水平、2-垂直
     * 
     * [hr]
     * 
     * @event  {onchange}    位置变化触发事件
     * @param  {Object}      位置信息
     * @config {Number} top  离父节点顶部距离
     * @config {Number} left 离父节点左边距离
     * 
     * [hr]
     * 
     * @event  {ondragend}   拖拽结束触发事件
     * @param  {Object}      位置信息
     * @config {Number} top  离父节点顶部距离
     * @config {Number} left 离父节点左边距离
     *                            
     */
    _p._$$Dragger = NEJ.C();
    _proDragger = _p._$$Dragger._$extend(_p._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proDragger.__reset = function(_options){
        this.__supReset(_options);
        this.__overflow = !!_options.overflow;
        this.__body = _e._$get(_options.body);
        this.__view = _e._$get(_options.view)||
                      _e._$getScrollViewPort(this.__body);
        this.__mbar = _e._$get(_options.mbar)||this.__body;
        this.__direction = parseInt(_options.direction)||0;
        this.__doInitDomEvent([
            [document,'mouseup',this.__onDragEnd._$bind(this)]
           ,[document,'mousemove',this.__onDragging._$bind(this)]
           ,[this.__mbar,'mousedown',this.__onDragStart._$bind(this)]
        ]);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proDragger.__destroy = function(){
        this.__supDestroy();
        delete this.__body;
        delete this.__mbar;
        delete this.__view;
    };
    /**
     * 取移动的最大范围
     * @protected
     * @method {__getMaxRange}
     * @return {Object} 范围值
     */
    _proDragger.__getMaxRange = function(){
        return {
            x:Math.max(this.__view.clientWidth,
                       this.__view.scrollWidth)-
                       this.__body.offsetWidth,
            y:Math.max(this.__view.clientHeight,
                       this.__view.scrollHeight)-
                       this.__body.offsetHeight
        };
    };
    /**
     * 开始移动
     * @protected
     * @method {__onDragStart}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proDragger.__onDragStart = function(_event){
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
     * @protected
     * @method {__onDragging}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proDragger.__onDragging = function(_event){
        if (!this.__offset) return;
        var _offset = {
            x:_v._$pageX(_event),
            y:_v._$pageY(_event)
        };
        var _deltax = _offset.x-this.__offset.x,
            _deltay = _offset.y-this.__offset.y,
            _value  = {top:(parseInt(_e._$getStyle
                           (this.__body,'top'))||0)+_deltay
                      ,left:(parseInt(_e._$getStyle
                            (this.__body,'left'))||0)+_deltax};
        this.__offset = _offset;
        this._$setPosition(_value);
    };
    /**
     * 结束移动
     * @protected
     * @method {__onDragEnd}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proDragger.__onDragEnd = function(_event){
        if (!this.__offset) return;
        delete this.__maxbox;
        delete this.__offset;
        this._$dispatchEvent('ondragend',this._$getPosition());
    };
    /**
     * 设置位置<br />
     * 脚本举例
     * [code]
     *   // 在允许范围内设置盒子的位置
     *   _dg._$setPosition({top:100,left:100});
     * [/code]
     * @method {_$setPosition}
     * @param  {Object} 位置信息
     * @return {nej.ut._$$Dragger}
     */
    _proDragger._$setPosition = function(_event){
        if (!this.__overflow){
            var _maxbox = this.__maxbox||
                          this.__getMaxRange();
            _event.top  = Math.min(_maxbox.y,
                          Math.max(0,_event.top));
            _event.left = Math.min(_maxbox.x,
                          Math.max(0,_event.left));
        }
        var _style  = this.__body.style;
        if (this.__direction==0||
            this.__direction==2)
            _style.top  = _event.top+'px';
        if (this.__direction==0||
            this.__direction==1)
            _style.left = _event.left+'px';
        this._$dispatchEvent('onchange',_event);
        return this;
    };
    /**
     * 取当前位置<br />
     * 脚本举例
     * [code]
     *   _dg._$getPosition();
     * [/code]
     * @method {_$getPosition}
     * @return {Object} 当前位置，{x:100,y:100}
     */
    _proDragger._$getPosition = function(){
        return {
            left:parseInt(_e._$getStyle(this.__body,'left'))||0,
            top:parseInt(_e._$getStyle(this.__body,'top'))||0
        };
    };
};
NEJ.define('{lib}util/dragger/dragger.js',
      ['{lib}util/event.js'],f);