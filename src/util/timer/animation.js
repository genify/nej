/*
 * ------------------------------------------
 * 动画时钟实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/platform.js',
    '{platform}animation.js'
],function(_m,_h,_p,_o,_f,_r){
    /**
     * 请求动画<br />
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/timer/animation.js'
     *   ],function(_p){
     *       // 桌面端一秒钟调用12.5次，ios端没秒调用20次，否则调用33次
     *       var _id  = _p.requestAnimationFrame(
     *           function(_date){
     *               console.log(_date);
     *           }
     *       );
     *   });
     * [/code]
     * 
     * @api    {requestAnimationFrame}
     * @param  {Function} 动画回调
     * @return {String}   动画标识
     */
    _p.requestAnimationFrame = function(){
        _h.__requestAnimationFrame.apply(null,arguments);
    };
    /**
     * 取消动画<br />
     * 
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}util/timer/animation.js'
     *   ],function(_p){
     *       var _id  = _p.requestAnimationFrame(
     *           function(_date){
     *               console.log(_date);
     *           }
     *       );
     *       // 停止掉时钟
     *       _p.cancelAnimationFrame(_id);
     *   });
     * [/code]
     * 
     * @api    {cancelAnimationFrame}
     * @param  {String} 动画标识
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
