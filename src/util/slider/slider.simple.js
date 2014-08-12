/*
 * --------------------------------------------
 * 简易滑块控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * --------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/event.js'
],function(NEJ,_k,_e,_v,_t,_p,_o,_f,_r){
    // variable
    var _pro;
    /**
     * 简易滑块控件
     * @class   {_$$SimpleSlider}
     * @extends {util/event#$$Event}
     *
     * @param   {Object} 配置参数
     * @config  {String|Node} track    轨道
     * @config  {String|Node} thumb    滑块
     * @config  {String|Node} progress 进度条
     * @config  {Float}       value    初始值
     * @config  {Number}      delta    数据计算偏差
     * @config  {Boolean}     reset    回收时是否重置位置
     *
     * [hr]
     * 滑动过程事件
     * @event   {onslidechange}
     * @param   {Object} 滑动信息
     * @config  {Float} ratio 滑动比例
     *
     * [hr]
     * 滑动停止事件
     * @event   {onslidestop}
     * @param   {Object} 滑动信息
     * @config  {Float} ratio 滑动比例
     *
     */
    _p._$$SimpleSlider = _k._$klass();
    _pro = _p._$$SimpleSlider._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * @param  {Object} 配置参数
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
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__ndrst)
            this.__doUpdatePosition(0);
        this.__super();
    };
    /**
     * 滑动开始
     * @param  {Event} 事件信息
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
     * @param  {Event} 事件信息
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
     * @param  {Event} 事件信息
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
     * @param  {Float} 滑块百分比
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
     * @param  {Float} 滑块百分比
     * @return {Void}
     */
    _pro._$setPosition = function(_ratio){
        if (!!this.__offset) return;
        this.__doUpdatePosition(_ratio);
    };
    /**
     * 取滑块位置
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