/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/platform.js'
],function(_m,_p,_o,_f,_r){
    var _this = this,
        _prefix = _m._$KERNEL.prefix.pro;
    /**
     * 请求动画
     * @param  {Function} 动画回调
     * @return {String}   动画标识
     */
    _p.__requestAnimationFrame = function(){
        var _handler = _this.requestAnimationFrame||
                       _this[_prefix+'RequestAnimationFrame'];
        if (!!_handler){
            return _handler.apply(this,arguments);
        }
    };
    /**
     * 取消动画
     * @param  {String} 动画标识
     * @return {Void}
     */
    _p.__cancelRequestAnimationFrame = function(){
        var _handler = _this.cancelRequestAnimationFrame||
                       _this[_prefix+'CancelRequestAnimationFrame'];
        if (!!_handler){
            return _handler.apply(this,arguments);
        }
    };
    
    return _p;
});
