/*
 * ------------------------------------------
 * 减速动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  =NEJ.P,
        _o = NEJ.O,
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$AnimDecelerate) return;
    /**
     * 减速动画
     * [ntb]
     * 初始信息包括
     *  offset    [Number] | 偏移量
     *  velocity  [Number] | 初速度，单位 px/s
     * 无结束信息
     * [/ntb]
     * 页面结构举例
     * [code type="html"]
     *   <div id='id-bounce1'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _box = document.getElementById('id-bounce1'),_decelerate;
     *   var options = {
     *       from:{
     *          offset: 100,
     *           velocity: 10
     *       },
     *       onupdate: function(offset){
     *           // 更新盒子的位置
     *           _box.style.left = offset.offset + 'px';
     *       },
     *       onstop: function(){
     *           _decelerate = nej.ut._$$AnimDecelerate._$recycle(_decelerate);
     *       }
     *   }
     *   // 创建减速动画实例
     *   _decelerate  = nej.ut._$$AnimDecelerate._$allocate(options);
     *   // 开始动画
     *   _decelerate._$play();
     * [/code]
     * @class   {nej.ut._$$AnimDecelerate} 减速动画
     * @extends {nej.ut._$$Animation}
     * @param   {Object}  可选配置参数，已处理参数列表如下
     * @config  {Number}  friction     阻力系数，0-1之间，阻力越大减速距离越短
     * @config  {Number}  acceleration 加速度，值越小减速越快
     */
    _p._$$AnimDecelerate = NEJ.C();
    _pro = _p._$$AnimDecelerate._$extend(_p._$$Animation);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__friction = _options.friction||0.5;
        this.__theta = Math.log(1-(this.__friction/10));
        this.__acceleration = _options.acceleration||30;
    };
    /**
     * 动画帧回调
     * @protected
     * @method {__doAnimationFrame}
     * @param  {Number}  时间值
     * @return {Boolean} 是否停止
     */
    _pro.__doAnimationFrame = function(_time){
        var _factor = Math.exp((_time-this.__begin.time)/this.__acceleration*this.__theta),
            _offset = this.__begin.offset-this.__begin.velocity*(1-_factor)/this.__theta,
            _velocity = this.__begin.velocity*_factor,
            _stop = !1;
        if (Math.abs(_velocity)<=1){
            _stop = !0;
        }
        this._$dispatchEvent('onupdate',{offset:_offset,velocity:_velocity});
        return _stop;
    };
};
NEJ.define(
    '{lib}util/animation/decelerate.js',[
    '{lib}util/animation/animation.js'
],f);