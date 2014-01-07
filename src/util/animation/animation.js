/*
 * ------------------------------------------
 * 动画基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$Animation) return;
    /**
     * 动画基类
     * @class   {nej.ut._$$Animation} 动画基类
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Object} to    动画结束信息
     * @config  {Object} from  动画初始信息
     * @config  {Number} delay 延时时间，单位毫秒，默认0
     * 
     * [hr]
     * 动画结束回调事件
     * [code]
     *   // 监测onstop事件
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
     * [/code]
     * @event  {onstop} 动画停止的回调
     * 
     * [hr]
     * 动画过程回调事件
     * [code]
     *   // 监测onupdate事件
     *   var options = {
     *         from: {
     *             offset: 100,
     *             velocity: 100
     *         },
     *         acceleration:100,
     *         onupdate: function(offset){
     *             // 坐标
     *             console.log(offset.offset + 'px');
     *             // 初速度
     *             console.log(offset.velocity);
     *         }
     *     }
     *  var _bounce = nej.ut._$$AnimBounce._$allocate(options);
     * [/code]
     * @event  {onupdate}        一帧动画结束的回调
     * @param  {Object}          可选配置参数
     * @config {Number} offset   偏移量
     * @config {Number} velocity 初速度(px/s)
     * 
     */
    _p._$$Animation = NEJ.C();
    _pro = _p._$$Animation._$extend(_p._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {Number} to       结束坐标
     * @config {Number} from      起始坐标
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__end = _options.to||_o;
        this.__begin = _options.from||{};
        this.__delay = Math.max(
            0,parseInt(_options.delay)||0
        );
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        this._$stop();
        if (!!this.__dtime){
            window.clearTimeout(this.__dtime);
            delete this.__dtime;
        }
        delete this.__end;
        delete this.__begin;
    };
    /**
     * 动画帧逻辑
     * @protected
     * @method {__onAnimationFrame}
     * @param  {Number} 时间值
     * @return {Void}
     */
    _pro.__onAnimationFrame = function(_time){
        if (!this.__begin) return;
        if ((''+_time).indexOf('.')>=0)
            _time = +new Date;
        if (this.__doAnimationFrame(_time)){
            this._$stop();
            return;
        }
        this.__timer = requestAnimationFrame(
                       this.__onAnimationFrame._$bind(this));
    };
    /**
     * 动画帧回调，子类实现具体算法
     * @protected
     * @method {__doAnimationFrame}
     * @param  {Number} _time 时间值
     * @return {Boolean}      是否停止动画
     */
    _pro.__doAnimationFrame = _f;
    /**
     * 注册动画监听事件<br/>
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
     *  var _bounce = nej.ut._$$AnimBounce._$allocate(options);
     *  // 进行弹性动画
     *  _bounce._$play();
     * [/code]
     * @method {_$play}
     * @return {nej.ut._$$Animation}
     */
    _pro._$play = (function(){
        var _doPlayAnim = function(){
            this.__dtime = window.clearTimeout(this.__dtime);
            this.__begin.time = +new Date;
            this.__timer = requestAnimationFrame(
                this.__onAnimationFrame._$bind(this)
            );
        };
        return function(){
            this.__dtime = window.setTimeout(
                _doPlayAnim._$bind(this),
                this.__delay
            );
            return this;
        };
    })();
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
     *  var _bounce = nej.ut._$$AnimBounce._$allocate(options);
     *  // 进行动画
     *  _bounce._$play();
     *  // 停止动画,触发onstop
     *  _bounce._$stop();
     * [/code]
     * 
     * @method {_$stop}
     * @return {nej.ut._$$Animation}
     */
    _pro._$stop = function(){
        this.__timer = cancelRequestAnimationFrame(this.__timer);
        this._$dispatchEvent('onstop');
        return this;
    };
};
NEJ.define(
    '{lib}util/animation/animation.js',[
    '{lib}util/event.js',
    '{lib}util/timer/animation.js'
],f);