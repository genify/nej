/*
 * --------------------------------------------
 * 简易滑块控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
/** @module util/slider/simple */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'util/event'
],function(NEJ,_k,_e,_v,_t,_p,_o,_f,_r){
    // variable
    var _pro;
    /**
     * 简易滑块控件，通过控制进度的长度调整滑块位置
     * 
     * 样式举例
     * ```css
     * .track{width:300px;background:#aaa;}
     * .pogrs{position:relative;height:20px;background:#f00;width:30%;}
     * .thumb{position:absolute;top:-5px;right:-5px;width:10px;height:30px;background:#0b0;}
     * ```
     * 
     * 结构举例
     * ```html
     * <div class="track" id="track">
     *   <div class="pogrs" id="progress">
     *     <span class="thumb" id="thumb">&nbsp;</span>
     *   </div>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/slider/simple'
     * ],function(_t){
     *     _t._$$SimpleSlider._$allocate({
     *         track:'track',
     *         thumb:'thumb',
     *         progress:'progress',
     *         onslidechange:function(_event){
     *             console.log(_event.ratio);
     *         },
     *         onslidestop:function(_event){
     *             console.log(_event.ratio);
     *         }
     *     });
     * });
     * ```
     * 
     * @class   module:util/slider/simple._$$SimpleSlider
     * @extends module:util/event._$$EventTarget
     *
     * @param    {Object}      config   - 配置参数
     * @property {String|Node} track    - 轨道
     * @property {String|Node} thumb    - 滑块
     * @property {String|Node} progress - 进度条
     * @property {Float}       value    - 初始值
     * @property {Number}      delta    - 数据计算偏差
     * @property {Boolean}     reset    - 回收时是否重置位置
     */
    /**
     * 滑动过程事件
     * 
     * @event    module:util/slider/simple._$$SimpleSlider#onslidechange
     * @param    {Object} event - 滑动信息
     * @property {Float}  ratio - 滑动比例
     */
    /**
     * 滑动停止事件
     * 
     * @event    module:util/slider/simple._$$SimpleSlider#onslidestop
     * @param    {Object} event - 滑动信息
     * @property {Float}  ratio - 滑动比例
     *
     */
    _p._$$SimpleSlider = _k._$klass();
    _pro = _p._$$SimpleSlider._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/slider/simple._$$SimpleSlider#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__ndrst = !!_options.reset;
        this.__delta = parseInt(_options.delta)||0;
        this.__track = _e._$get(_options.track);
        this.__prgrs = _e._$get(_options.progress);
        this.__doInitDomEvent([[
            _options.thumb,'mousedown',
            this.__onSlideStart._$bind(this)
        ],[
            document,'mousemove',
            this.__onSliding._$bind(this)
        ],[
            document,'mouseup',
            this.__onSlideStop._$bind(this)
        ],[
            this.__track,'mousedown',
            this.__onSlideTo._$bind(this)
        ]]);
        // init value
        var _ratio = _options.value;
        if (_ratio==null){
            _ratio = this.__prgrs.offsetWidth/
                     this.__track.offsetWidth;
        }
        this._$setPosition(_ratio);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/slider/simple._$$SimpleSlider#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__ndrst){
            this.__doUpdatePosition(0);
        }
        this.__super();
    };
    /**
     * 滑动开始
     *
     * @protected 
     * @method module:util/slider/simple._$$SimpleSlider#__onSlideStart
     * @param  {Event} arg0 - 事件信息
     * @return {Void}
     */
    _pro.__onSlideStart = function(_event){
        if (!!this.__offset) return;
        _v._$stop(_event);
        this.__offset = _v._$pageX(_event);
        this.__owidth = this.__track.offsetWidth;
    };
    /**
     * 滑动过程
     *
     * @protected
     * @method module:util/slider/simple._$$SimpleSlider#__onSliding
     * @param  {Event} arg0 - 事件信息
     * @return {Void}
     */
    _pro.__onSliding = function(_event){
        if (!this.__offset) return;
        var _offset = _v._$pageX(_event),
            _delta = _offset-this.__offset;
        this.__offset = _offset;
        this.__doUpdatePosition(
            this.__ratio+_delta/this.__owidth
        );
        this._$dispatchEvent('onslidechange',{
            ratio:this.__ratio
        });
    };
    /**
     * 滑动结束
     *
     * @protected
     * @method module:util/slider/simple._$$SimpleSlider#__onSlideStop
     * @param  {Event} arg0 - 事件信息
     * @return {Void}
     */
    _pro.__onSlideStop = function(_event){
        if (!this.__offset) return;
        this.__onSliding(_event);
        delete this.__offset;
        delete this.__owidth;
        this._$dispatchEvent('onslidestop',{
            ratio:this.__ratio
        });
    };
    /**
     * 直接点击跳转至指定位置
     *
     * @protected 
     * @method module:util/slider/simple._$$SimpleSlider#__onSlideTo
     * @return {Void}
     */
    _pro.__onSlideTo = function(_event){
        var _ofstx = _e._$offset(this.__track).x,
            _pagex = _v._$pageX(_event);
        this.__doUpdatePosition(
            (_pagex-_ofstx+this.__delta)/this.__track.offsetWidth
        );
        this._$dispatchEvent('onslidestop',{
            ratio:this.__ratio
        });
    };
    /**
     * 设置滑块位置
     *
     * @protected
     * @method module:util/slider/simple._$$SimpleSlider#__doUpdatePosition
     * @param  {Float} arg0 - 滑块百分比
     * @return {Void}
     */
    _pro.__doUpdatePosition = function(_ratio){
        this.__ratio = Math.max(0,
                       Math.min(1,_ratio));
        _e._$setStyle(
            this.__prgrs,'width',
            this.__ratio*100+'%'
        );
    };
    /**
     * 设置滑块位置
     *
     * @method module:util/slider/simple._$$SimpleSlider#_$setPosition
     * @param  {Float} arg0 - 滑块百分比
     * @return {Void}
     */
    _pro._$setPosition = function(_ratio){
        if (!!this.__offset) return;
        this.__doUpdatePosition(_ratio);
    };
    /**
     * 取滑块位置
     *
     * @method module:util/slider/simple._$$SimpleSlider#_$getPosition
     * @return {Float} 滑块百分比
     */
    _pro._$getPosition = function(_ratio){
        return this.__ratio;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});