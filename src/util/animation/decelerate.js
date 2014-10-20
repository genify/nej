/*
 * ------------------------------------------
 * 减速动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/animation/decelerate */
NEJ.define([
    'base/global',
    'base/klass',
    './animation.js'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 减速动画
     * 
     * 初始信息包括
     * 
     * * offset    [Number]   偏移量
     * * velocity  [Number]   初速度，单位 px/s
     *  
     * 无结束信息
     * 
     * 结构举例
     * ```html
     * <div id='id-bounce1'></div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/animation/decelerate'
     * ],function(_t){
     *     // 创建减速动画实例
     *     var _decelerate  = _t._$$AnimDecelerate._$allocate({
     *         from:{
     *            offset: 100,
     *             velocity: 10
     *         },
     *         onupdate: function(_event){
     *             // 更新盒子的位置
     *             _box.style.left = _event.offset + 'px';
     *         },
     *         onstop: function(){
     *             this._$recycle();
     *         }
     *     });
     *     // 开始动画
     *     _decelerate._$play();
     * });
     * ```
     * 
     * @class    module:util/animation/decelerate._$$AnimDecelerate
     * @extends  module:util/animation/animation._$$Animation
     * 
     * @param    {Object} config       - 可选配置参数
     * @property {Number} friction     - 阻力系数，0-1之间，阻力越大减速距离越短
     * @property {Number} acceleration - 加速度，值越小减速越快
     */
    _p._$$AnimDecelerate = _k._$klass();
    _pro = _p._$$AnimDecelerate._$extend(_t0._$$Animation);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/animation/decelerate._$$AnimDecelerate#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__friction = _options.friction||0.5;
        this.__theta = Math.log(1-(this.__friction/10));
        this.__acceleration = _options.acceleration||30;
    };
    /**
     * 动画帧回调
     * 
     * @protected
     * @method module:util/animation/decelerate._$$AnimDecelerate#__doAnimationFrame
     * @param  {Number}  arg0 - 时间值
     * @return {Boolean}        是否停止
     */
    _pro.__doAnimationFrame = function(_time){
        var _factor = Math.exp((_time-this.__begin.time)/this.__acceleration*this.__theta),
            _offset = this.__begin.offset-this.__begin.velocity*(1-_factor)/this.__theta,
            _velocity = this.__begin.velocity*_factor,
            _stop = !1;
        if (Math.abs(_velocity)<=1){
            _stop = !0;
        }
        this._$dispatchEvent('onupdate',{
            offset:_offset,
            velocity:_velocity
        });
        return _stop;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});