/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './animation.js',
    'base/platform'
],function(_h,_m){
    // for ie9-
    NEJ.patch('TR<=5.0',function(){
        var _fps = _m._$is('desktop')?80:(_m._$is('ios')?50:30);
        /**
         * 请求动画
         * @param  {Function} 动画回调
         * @return {String}   动画标识
         */
        _h.__requestAnimationFrame = function(_callback){
            return window.setTimeout(
                function(){
                    try{_callback(+new Date);}catch(ex){}
                },1000/_fps
            );
        };
        /**
         * 取消动画
         * @param  {String} 动画标识
         * @return {Void}
         */
        _h.__cancelRequestAnimationFrame = function(_id){
            window.clearTimeout(_id);
        };
    });
    
    return _h;
});
