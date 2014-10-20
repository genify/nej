/*
 * ------------------------------------------
 * 动画时钟实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/timer/animation */
NEJ.define([
    'base/platform',
    '{platform}animation.js'
],function(_m,_h,_p,_o,_f,_r){
    /**
     * 请求动画
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/timer/animation'
     * ],function(_p){
     *     // 桌面端一秒钟调用12.5次，ios端没秒调用20次，否则调用33次
     *     var _id  = _p.requestAnimationFrame(
     *         function(_time){
     *             console.log(_time);
     *         }
     *     );
     * });
     * ```
     * 
     * @method module:util/timer/animation.requestAnimationFrame
     * @param  {Function} arg0 - 动画回调
     * @return {String}          动画标识
     */
    _p.requestAnimationFrame = function(){
        _h.__requestAnimationFrame.apply(null,arguments);
    };
    /**
     * 取消动画
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/timer/animation'
     * ],function(_p){
     *     var _id  = _p.requestAnimationFrame(
     *         function(_time){
     *             console.log(_time);
     *         }
     *     );
     *     // 停止掉时钟
     *     _p.cancelAnimationFrame(_id);
     * });
     * ```
     * 
     * @method module:util/timer/animation.cancelAnimationFrame
     * @param  {String} arg0 - 动画标识
     * @return {Void}
     */
    _p.cancelAnimationFrame = function(){
        _h.__cancelAnimationFrame.apply(null,arguments);
    };
    
    if (CMPT){
        if (!this.requestAnimationFrame){
            this.requestAnimationFrame = _p.requestAnimationFrame;
        }
        if (!this.cancelAnimationFrame){
            this.cancelAnimationFrame = _p.cancelAnimationFrame;
        }
    }
    
    return _p;
});
