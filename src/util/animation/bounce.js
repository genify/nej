/*
 * ------------------------------------------
 * 弹跳动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _o = NEJ.O,
        _p = NEJ.P('nej.ut'),
        _proAnimBounce,
        _supAnimBounce;
    if (!!_p._$$AnimBounce) return;
    /**
     * 弹跳动画
     * [ntb]
     * 初始信息包括
     *  offset    [Number] | 偏移量
     *  velocity  [Number] | 初速度，单位 px/s
     * 无结束信息
     * [/ntb]
     * [code]
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
     * [/code]
     * @class   {nej.ut._$$AnimBounce} 弹跳动画
     * @extends {nej.ut._$$Animation}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Number} acceleration  加速度，值越小弹跳越快
     * @config  {Number} springtension 张紧度，0-1之间，值越小弹跳距离越大
     */
    _p._$$AnimBounce = NEJ.C();
      _proAnimBounce = _p._$$AnimBounce._$extend(_p._$$Animation);
      _supAnimBounce = _p._$$AnimBounce._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {Number} acceleration  加速度，值越小弹跳越快
     * @config {Number} springtension 张紧度，0-1之间，值越小弹跳距离越大
     * @return {Void}
     */
    _proAnimBounce.__reset = function(_options){
        this.__supReset(_options);
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
    _proAnimBounce.__doAnimationFrame = function(_time){
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
     * [code]
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
     * [/code]
     * @method {_$stop}
     * @return {nej.ut._$$AnimBounce}
     */
    _proAnimBounce._$stop = function(){
        this._$dispatchEvent('onupdate',{offset:this.__begin.offset});
        _supAnimBounce._$stop.apply(this,arguments);
        return this;
    };
};
NEJ.define('{lib}util/animation/bounce.js',
      ['{lib}util/animation/animation.js'],f);