/*
 * ------------------------------------------
 * 滑动器算法实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/slider/slider */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'util/event',
    'util/dragger/simple'
],function(NEJ,_k,_e,_v,_t,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 滑动器算法
     *
     * 样式举例
     * ```css
     * #slide{position:absolute;top:0;height:20px;line-height:20px;width:20px;background:green;}
     * #track{position:relative;height:20px;line-height:20px;width:100%;background:pink;}
     * ```
     * 
     * 结构举例
     * ```html
     * <div id="track">
     *   <div id="slide">&nbsp;</div>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/slider/slider'
     * ],function(_t){
     *     var _slider = _t._$$Slider._$allocate({
     *         range:{x:[0,100]},
     *         slide:'slide',
     *         track:'track',
     *         onchange:function(_obj){
     *             _e._$style('slide',{left:_obj.x.value});
     *         }
     *     });
     * });
     * ```
     * @class    module:util/slider/slider._$$Slider
     * @extends  module:util/event._$$EventTarget
     * @param    {Object}      config    - 可选配置参数
     * @property {Object}      range     - 滑动范围，默认为滑块可运动范围，如{x:[0,100],y:[0,1000]}
     * @property {String|Node} thumb     - 滑块节点
     * @property {String|Node} track     - 滑动轨道节点
     * @property {Number}      direction - 滑动方向控制，0 - 水平垂直[默认]，1 - 水平，2 - 垂直
     */
    /**
     * 滑动触发事件，输入格式如{x:{rate:0.4,value:40},y:{rate:0.5,value:50}}
     * 
     * @event    module:util/slider/slider._$$Slider#onchange
     * @param    {Object}  event   - 滑动信息
     * @property {Boolean} stopped - 是否停止
     * @property {Object}  x       - 水平滑动信息，如{rate:0.4,value:40}
     * @property {Object}  y       - 垂直滑动信息，如{rate:0.5,value:50}
     *
     */
    _p._$$Slider = _k._$klass();
    _pro = _p._$$Slider._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/slider/slider._$$Slider#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__dopt = {
            onchange:this.__onChange._$bind(this),
            ondragend:this.__onChange._$bind2(this,!0)
        };
        this.__super();
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/slider/slider._$$Slider#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__dopt.view = _e._$get(_options.track);
        this.__dopt.body = _e._$get(_options.thumb)||
                           _e._$get(_options.slide);
        this.__dopt.mbar = this.__dopt.view;
        this.__dopt.direction = parseInt(_options.direction)||0;
        this._$setRange(_options.range);
        this.__doInitDomEvent([[
            this.__dopt.view,'mousedown',
            this.__onSlideToPosition._$bind(this)
        ]]);
        this.__dragger = _t0._$$Dragger._$allocate(this.__dopt);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/slider/slider._$$Slider#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__dragger._$recycle();
        delete this.__dragger;
        delete this.__range;
        delete this.__dopt.view;
        delete this.__dopt.body;
        delete this.__dopt.mbar;
    };
    /**
     * 活动过程触发事件
     * 
     * @protected
     * @method module:util/slider/slider._$$Slider#__onChange
     * @param  {Object} arg0 - 位置信息
     * @return {Void}
     */
    _pro.__onChange = function(_event,_end){
        var _ratex = _event.left/this.__range.x[1],
            _ratey = _event.top/this.__range.y[1],
            _rngx = this.__range.x,
            _rngy = this.__range.y;
        this._$dispatchEvent('onchange',{
            stopped:!!_end,
            x:{rate:_ratex,value:_ratex*(_rngx[1]-_rngx[0])},
            y:{rate:_ratey,value:_ratey*(_rngy[1]-_rngy[0])}
        });
    };
    /**
     * 滑动到指定位置
     * 
     * @protected
     * @method module:util/slider/slider._$$Slider#__onSlideToPosition
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onSlideToPosition = function(_event){
        var _offset = _e._$offset(this.__dopt.view),
            _pointer = {
                x:_v._$clientX(_event),
                y:_v._$clientY(_event)
            };
        this.__dragger._$setPosition({
            top:_pointer.y-_offset.y,
            left:_pointer.x-_offset.x
        });
    };
    /**
     * 设置滑块可移动范围
     * 
     * 脚本举例
     * ```javascript
     *   // 设置可移动范围，单位px
     *   _slider._$setRange({x:[0,99],y:[0,10]});
     * ```
     * @method module:util/slider/slider._$$Slider#_$setRange
     * @param  {Object} arg0 - 可移动范围，不传则根据轨道自动计算
     * @return {Void}
     */
    _pro._$setRange = function(_range){
        // save current rate
        var _rate;
        if (!!this.__range){
            var _position = this.__dragger._$getPosition();
            _rate = {
                x:_position.left/this.__range.x[1],
                y:_position.top/this.__range.y[1]
            };
        }
        // reset range
        _range = _range||_o;
        var _mx = (_range.x||_r)[1]||
                  (this.__dopt.view.clientWidth-
                   this.__dopt.body.offsetWidth),
            _my = (_range.y||_r)[1]||
                  (this.__dopt.view.clientHeight-
                   this.__dopt.body.offsetHeight);
        this.__range = {
            x:_range.x||[0,_mx],
            y:_range.y||[0,_my]
        };
        // adjust position
        if (!!_rate) this._$setPosition(_rate);
    };
    /**
     * 设置滑动比例
     * 
     * 脚本举例
     * ```javascript
     *   // 设置滑动到此位置，按比例算
     *   _slider._$setPosition({x:0.4,y:0.5});
     * ```
     * @method module:util/slider/slider._$$Slider#_$setPosition
     * @param  {Object} arg0 - 滑动比例，范围[0,1]，格式如{x:0.4,y:0.5}
     * @return {Void}
     */
    _pro._$setPosition = function(_rate){
        _rate = _rate||_o;
        this.__dragger._$setPosition({
            top:this.__range.y[1]*(_rate.y||0),
            left:this.__range.x[1]*(_rate.x||0)
        });
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
