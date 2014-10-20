/*
 * ------------------------------------------
 * 动画基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/animation/animation */
NEJ.define([
    'base/global',
    'base/klass',
    'util/event',
    'util/timer/animation'
],function(NEJ,_k,_t,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 动画基类
     * 
     * @class   module:util/animation/animation._$$Animation
     * @extends module:util/event._$$EventTarget
     *
     * @param    {Object} config - 可选配置参数
     * @property {Object} to     - 动画结束信息
     * @property {Object} from   - 动画初始信息
     * @property {Number} delay  - 延时时间，单位毫秒，默认0
     */
    /**
     * 动画结束回调事件
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
     *         onstop: function(){
     *             // 动画停止后回收控件
     *             _bounce = nej.ut._$$AnimBounce._$recycle(_bounce);
     *         }
     *     });
     * });
     * ```
     * 
     * @event module:util/animation/animation._$$Animation#onstop
     */
    /**
     * 动画过程回调事件
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
     * });
     * ```
     * 
     * @event    module:util/animation/animation._$$Animation#onupdate
     * @param    {Object} event    - 可选配置参数
     * @property {Number} offset   - 偏移量
     * @property {Number} velocity - 初速度(px/s)
     */
    _p._$$Animation = _k._$klass();
    _pro = _p._$$Animation._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method   module:util/animation/animation._$$Animation#__reset
     * @param    {Object} arg0 - 可选配置参数
     * @property {Number} to   - 结束坐标
     * @property {Number} from - 起始坐标
     * @return   {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__end = _options.to||_o;
        this.__begin = _options.from||{};
        this.__delay = Math.max(
            0,parseInt(_options.delay)||0
        );
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/animation/animation._$$Animation#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
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
     * 
     * @protected
     * @method module:util/animation/animation._$$Animation#__onAnimationFrame
     * @param  {Number} arg0 - 时间值
     * @return {Void}
     */
    _pro.__onAnimationFrame = function(_time){
        if (!this.__begin) return;
        if ((''+_time).indexOf('.')>=0){
            _time = +new Date;
        }
        if (this.__doAnimationFrame(_time)){
            this._$stop();
            return;
        }
        this.__timer = _t0.requestAnimationFrame(
            this.__onAnimationFrame._$bind(this)
        );
    };
    /**
     * 动画帧回调，子类实现具体算法
     * 
     * @abstract
     * @method module:util/animation/animation._$$Animation#__doAnimationFrame
     * @param  {Number}  arg0 - 时间值
     * @return {Boolean}        是否停止动画
     */
    _pro.__doAnimationFrame = _f;
    /**
     * 注册动画监听事件
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
     * @method module:util/animation/animation._$$Animation#_$play
     * @return {Void}
     */
    _pro._$play = (function(){
        var _doPlayAnim = function(){
            this.__dtime = window.clearTimeout(this.__dtime);
            this.__begin.time = +new Date;
            this.__timer = _t0.requestAnimationFrame(
                this.__onAnimationFrame._$bind(this)
            );
        };
        return function(){
            this.__dtime = window.setTimeout(
                _doPlayAnim._$bind(this),
                this.__delay
            );
        };
    })();
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
     *     // 进行动画
     *     _bounce._$play();
     *     // 停止动画,触发onstop
     *     _bounce._$stop();
     * });
     * ```
     *
     * @method module:util/animation/animation._$$Animation#_$stop
     * @return {Void}
     */
    _pro._$stop = function(){
        this.__timer = _t0.cancelAnimationFrame(this.__timer);
        this._$dispatchEvent('onstop');
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});