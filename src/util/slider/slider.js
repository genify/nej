/*
 * ------------------------------------------
 * 滑动器算法实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _r = NEJ.R,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _proSlider;
    if (!!_p._$$Slider) return;
    /**
     * 滑动器算法<br />
     * 页面结构举例
     * [code type="html"]
     *   <style type="text/css">
     *       #slide{position:absolute;top:0;height:20px;line-height:20px;width:20px;background:green;}
     *       #track{position:relative;height:20px;line-height:20px;width:100%;background:pink;}
     *   </style>
     *   <div id="track"><div id="slide"></div></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _sd = _p._$$Slider._$allocate({
     *       range:{x:[0,100]},
     *       slide:'slide',
     *       track:'track',
     *       onchange:function(_obj){
     *           _e._$style(_e._$get('slide'),{left:_obj.x.value});
     *       }
     *   });
     * [/code]
     * @class   {nej.ut._$$Slider} 滑动器算法
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Object}      range 滑动范围，默认为滑块可运动范围，如{x:[0,100],y:[0,1000]}
     * @config  {String|Node} slide 滑动节点
     * @config  {String|Node} track 滑动轨道节点
     * 
     * [hr]
     * 
     * @event  {onchange} 滑动触发事件，输入格式如{x:{rate:0.4,value:40},y:{rate:0.5,value:50}}
     * @config {Boolean} stopped 是否停止
     * @config {Object}  x          {rate:0.4,value:40}
     * @config {Object}  y          {rate:0.5,value:50}
     * 
     */
    _p._$$Slider = NEJ.C();
      _proSlider = _p._$$Slider._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proSlider.__init = function(){
        this.__dopt = {
            onchange:this.__onChange._$bind(this),
            ondragend:this.__onChange._$bind2(this,!0)
        };
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proSlider.__reset = function(_options){
        this.__supReset(_options);
        this.__dopt.view = _e._$get(_options.track);
        this.__dopt.body = _e._$get(_options.slide);
        this.__dopt.mbar = this.__dopt.view;
        this._$setRange(_options.range);
        this.__doInitDomEvent([
            [this.__dopt.view,'mousedown',
             this.__onSlideToPosition._$bind(this)]
        ]);
        this.__dragger = _p._$$Dragger._$allocate(this.__dopt);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proSlider.__destroy = function(){
        this.__supDestroy();
        this.__dragger._$recycle();
        delete this.__dragger;
        delete this.__range;
        delete this.__dopt.view;
        delete this.__dopt.body;
        delete this.__dopt.mbar
    };
    /**
     * 活动过程触发事件
     * @protected
     * @method {__onChange}
     * @param  {Object} 位置信息
     * @return {Void}
     */
    _proSlider.__onChange = function(_event,_end){
        var _ratex = _event.left/this.__range.x[1],
            _ratey = _event.top/this.__range.y[1],
            _rngx = this.__range.x,
            _rngy = this.__range.y;
        this._$dispatchEvent('onchange',{
            stopped:!!_end
           ,x:{rate:_ratex,value:_ratex*(_rngx[1]-_rngx[0])}
           ,y:{rate:_ratey,value:_ratey*(_rngy[1]-_rngy[0])}
        });
    };
    /**
     * 滑动到指定位置
     * @protected
     * @method {__onSlideToPosition}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proSlider.__onSlideToPosition = function(_event){
        var _offset = _e._$offset(this.__dopt.view),
            _pointer = {x:_v._$pageX(_event),
                        y:_v._$pageY(_event)},
            _delta = {x:Math.floor(this.__dopt.body.offsetWidth/2),
                      y:Math.floor(this.__dopt.body.offsetHeight/2)};
        this.__dragger._$setPosition({
            top:_pointer.y-_offset.y-_delta.y,
            left:_pointer.x-_offset.x-_delta.x
        });
    };
    /**
     * 设置滑块可移动范围<br />
     * 脚本举例
     * [code]
     *   // 设置可移动范围，单位px
     *   _sd._$setRange({x:[0,99],y:[0,10]});
     * [/code]
     * @method {_$setRange}
     * @param  {Object} 可移动范围，不传则根据轨道自动计算
     * @return {nej.ut._$$Slider}
     */
    _proSlider._$setRange = function(_range){
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
            x:_range.x||[0,_mx]
           ,y:_range.y||[0,_my]
        };
        // adjust position
        if (!!_rate) this._$setPosition(_rate);
        return this;
    };
    /**
     * 设置滑动比例<br />
     * 脚本举例
     * [code]
     *   // 设置滑动到此位置，按比例算
     *   _sd._$setPosition({x:0.4,y:0.5});
     * [/code]
     * @method {_$setPosition}
     * @param  {Object} 滑动比例，范围[0,1]，格式如{x:0.4,y:0.5}
     * @return {nej.ut._$$Slider}
     */
    _proSlider._$setPosition = function(_rate){
        _rate = _rate||_o;
        this.__dragger._$setPosition({
            top:this.__range.y[1]*(_rate.y||0)
           ,left:this.__range.x[1]*(_rate.x||0)
        });
    };
};
define('{lib}util/slider/slider.js',
      ['{lib}util/dragger/dragger.js'],f);
