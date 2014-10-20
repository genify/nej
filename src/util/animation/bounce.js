/*
 * ------------------------------------------
 * 弹跳动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/animation/bounce */
NEJ.define([
    'base/global',
    'base/klass',
    './animation.js'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 弹跳动画
     * 
     * 初始信息包括
     * 
     * * offset    [Number] | 偏移量
     * * velocity  [Number] | 初速度，单位 px/s
     *  
     * 无结束信息
     * 
     * 脚本举例
     * ```javascript
      * NEJ.define([
     *     'util/animation/bounce'
     * ],function(_t){
     *     var _bounce = _t._$$AnimBounce._$allocate({
     *         from: {
     *             offset: 100,
     *             velocity: 100
     *         },
     *         acceleration:100,
     *         onupdate: function(_event){
     *             // 坐标
     *             console.log(_event.offset + 'px');
     *             // 初速度
     *             console.log(_event.velocity);
     *         }
     *     });
     *     // 进行弹性动画
     *     _bounce._$play();
     * });
     * ```
     * 
     * @class    module:util/animation/bounce._$$AnimBounce
     * @extends  module:util/animation/animation._$$Animation
     * 
     * @param    {Object} config        - 可选配置参数
     * @property {Number} acceleration  - 加速度，值越小弹跳越快
     * @property {Number} springtension - 张紧度，0-1之间，值越小弹跳距离越大
     */
    _p._$$AnimBounce = _k._$klass();
    _pro = _p._$$AnimBounce._$extend(_t0._$$Animation);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/animation/bounce._$$AnimBounce#__reset
     * @param    {Object} arg0 - 可选配置参数
     * @return   {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__acceleration = _options.acceleration||30;
        this.__springtension = _options.springtension||0.3;
    };
    /**
     * 动画帧回调
     * 
     * @protected
     * @method module:util/animation/bounce._$$AnimBounce#__doAnimationFrame
     * @param  {Number} arg0 - 时间值
     * @return {Void}
     */
    _pro.__doAnimationFrame = function(_time){
        var _elapse = _time-this.__begin.time,
            _factor = _elapse/this.__acceleration,
            _pwtime = _factor*Math.pow(Math.E,-this.__springtension*_factor),
            _delta  = this.__begin.velocity*_pwtime,
            _offset = this.__begin.offset+_delta,
            _stop = !1;
        if (_elapse>1&&Math.abs(_delta)<1){
            _stop = !0;
            _offset = this.__begin.offset;
        }
        this._$dispatchEvent('onupdate',{
            offset:_offset
        });
        return _stop;
    };
    /**
     * 取消动画监听事件
     * 
     * 脚本举例
     * ```javascript
      * NEJ.define([
     *     'util/animation/bounce'
     * ],function(_t){
     *     var _bounce = _t._$$AnimBounce._$allocate({
     *         from: {
     *             offset: 100,
     *             velocity: 100
     *         },
     *         acceleration:100,
     *         onupdate: function(_event){
     *             // 坐标
     *             console.log(_event.offset + 'px');
     *             // 初速度
     *             console.log(_event.velocity);
     *         }
     *     });
     *     // 进行弹性动画
     *     _bounce._$play();
     *     // 停止动画,触发onstop
     *     _bounce._$stop();
     * });
     * ```
     * 
     * @method module:util/animation/bounce._$$AnimBounce#_$stop
     * @return {Void}
     */
    _pro._$stop = function(){
        this._$dispatchEvent('onupdate',{
            offset:this.__begin.offset
        });
        this.__super();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});