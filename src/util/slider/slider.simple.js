/*
 * --------------------------------------------
 * 简易滑块控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
var f = function(){
    // variable
    var _   = NEJ.P,
        _e  = _('nej.e'),
        _v  = _('nej.v'),
        _p  = _('nej.ut'),
        _proSimpleSlider;
    /**
     * 简易滑块控件
     * 
     * @class   {nej.ut._$$SimpleSlider}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 配置参数
     * @config  {String|Node} track    轨道
     * @config  {String|Node} thumb    滑块
     * @config  {String|Node} progress 进度条
     * @config  {Float}       value    初始值
     * 
     * [hr]
     * 滑动停止事件
     * @event   {onslidestop}
     * @param   {Object} 滑动信息
     * @config  {Float} ratio 滑动比例
     * 
     */
    _p._$$SimpleSlider = NEJ.C();
      _proSimpleSlider = _p._$$SimpleSlider._$extend(_p._$$Event);
    /**
     * 控件重置
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proSimpleSlider.__reset = function(_options){
        this.__supReset(_options);
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
     * 滑动开始
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _proSimpleSlider.__onSlideStart = function(_event){
        if (!!this.__offset) return;
        _v._$stop(_event);
        this.__offset = _v._$pageX(_event);
        this.__owidth = this.__track.offsetWidth;
    };
    /**
     * 滑动过程
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _proSimpleSlider.__onSliding = function(_event){
        if (!this.__offset) return;
        var _offset = _v._$pageX(_event),
            _delta = _offset-this.__offset;
        this.__offset = _offset;
        this.__doUpdatePosition(
            this.__ratio+_delta/this.__owidth
        );
    };
    /**
     * 滑动结束
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _proSimpleSlider.__onSlideStop = function(_event){
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
     * @return {Void}
     */
    _proSimpleSlider.__onSlideTo = function(_event){
        var _ofstx = _e._$offset(this.__track).x,
            _pagex = _v._$pageX(_event);
        this.__doUpdatePosition(
            (_pagex-_ofstx)/this.__track.offsetWidth
        );
        this._$dispatchEvent('onslidestop',{
            ratio:this.__ratio
        });
    };
    /**
     * 设置滑块位置
     * @param  {Float} 滑块百分比
     * @return {Void}
     */
    _proSimpleSlider.__doUpdatePosition = function(_ratio){
        this.__ratio = Math.max(0,
                       Math.min(1,_ratio));
        _e._$setStyle(
            this.__prgrs,'width',
            this.__ratio*100+'%'
        );
    };
    /**
     * 设置滑块位置
     * @param  {Float} 滑块百分比
     * @return {Void}
     */
    _proSimpleSlider._$setPosition = function(_ratio){
        if (!!this.__offset) return;
        this.__doUpdatePosition(_ratio);
    };
};
NEJ.define('{lib}util/slider/slider.simple.js',
          ['{lib}util/event.js'],f);
