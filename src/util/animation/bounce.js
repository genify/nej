/*
 * ------------------------------------------
 * 弹跳动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/animation/animation.js'
],function(NEJ,_k,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 弹跳动画
     * [ntb]
     * 初始信息包括
     *  offset    [Number] | 偏移量
     *  velocity  [Number] | 初速度，单位 px/s
     * 无结束信息
     * [/ntb]
     * ```javascript
     *   var options = {
     *         from: {
     *             offset: 100,
     *             velocity: 100
     *         },
     *         acceleration:100,
     *         onstop: function(){
     *             // 动画停止后回收控件
     *             _bounce = nej.ut._$$AnimBounce._$recycle(_bounce);
     *         }
     *     }
     *  var _bounce = nej.ut._$$AnimBounce._$allocate(options);
     *  _bounce._$play();
     * ```
     * @class   {nej.ut._$$AnimBounce} 弹跳动画
     * @extends {nej.ut._$$Animation}
     * @param   {Object} 可选配置参数
     * @property  {Number} acceleration  加速度，值越小弹跳越快
     * @property  {Number} springtension 张紧度，0-1之间，值越小弹跳距离越大
     */
    _p._$$AnimBounce = _k._$klass();
    _pro = _p._$$AnimBounce._$extend(_t0._$$Animation);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @property {Number} acceleration  加速度，值越小弹跳越快
     * @property {Number} springtension 张紧度，0-1之间，值越小弹跳距离越大
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__acceleration = _options.acceleration||30;
        this.__springtension = _options.springtension||0.3;
    };
    /**
     * 动画帧回调
     * @protected
     * @method {__doAnimationFrame}
     * @param  {Number} 时间值
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
        this._$dispatchEvent('onupdate',{offset:_offset});
        return _stop;
    };
    /**
     * 取消动画监听事件<br/>
     * 脚本举例
     * ```javascript
     *   var options = {
     *         from: {
     *             offset: 100,
     *             velocity: 100
     *         },
     *         acceleration:100,
     *         onstop: function(){
     *             _bounce = nej.ut._$$AnimBounce._$recycle(_bounce);
     *         }
     *     }
     *   var _bounce = nej.ut._$$AnimBounce._$allocate(options);
     *   // 进行动画
     *   _bounce._$play();
     *   // 停止动画,触发onstop
     *   _bounce._$stop();
     * ```
     * @method {_$stop}
     * @return {Void}
     */
    _pro._$stop = function(){
        this._$dispatchEvent('onupdate',{offset:this.__begin.offset});
        this.__super();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});