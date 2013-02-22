/*
 * ------------------------------------------
 * 动画时钟实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _b = NEJ.P('nej.p'),
        _p = window;
    // implement animation frame interface
    if (!!_p.requestAnimationFrame&&
        !!_p.cancelRequestAnimationFrame)
        return;
    // use browser implementation
    var _prefix = _b._$KERNEL.prefix.pro;
    if (!!_p[_prefix+'RequestAnimationFrame']&&
        !!_p[_prefix+'CancelRequestAnimationFrame']){
        _p.requestAnimationFrame = _p[_prefix+'RequestAnimationFrame'];
        _p.cancelRequestAnimationFrame = _p[_prefix+'CancelRequestAnimationFrame'];
        return;
    }
    // requestAnimationFrame/cancelRequestAnimationFrame implementation
    var _is = _b._$IS,
        _fps = _is.desktop?80:(_is.ios?50:30);
    /**
     * 请求动画<br />
     * 脚本举例
     * [code]
     *   // 桌面端一秒钟调用12.5次，ios端没秒调用20次，否则调用33次
     *   var _id  = requestAnimationFrame(function(_date){console.log(_date);})
     * [/code]
     * @api    {window.requestAnimationFrame}
     * @param  {Function} 动画回调
     * @return {String}   动画标识
     */
    _p.requestAnimationFrame = function(_callback){
        return window.setTimeout(
               function(){
                   try{_callback(+new Date);}catch(ex){}
               },1000/_fps);
    };
    /**
     * 取消动画<br />
     * 脚本举例
     * [code]
     *   var _id  = requestAnimationFrame(function(_date){console.log(_date);})
     *   // 停止掉时钟
     *   cancelRequestAnimationFrame(_id);
     * [/code]
     * @api    {window.cancelRequestAnimationFrame}
     * @param  {String} 动画标识
     * @return {window}
     */
    _p.cancelRequestAnimationFrame = function(_id){
        window.clearTimeout(_id);
        return this;
    };
};
NEJ.define('{lib}util/timer/animation.js',
      ['{lib}base/platform.js'],f);