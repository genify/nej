/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/platform'
],function(_m,_p,_o,_f,_r){
    var _this = this,
        _prefix = _m._$KERNEL.prefix.pro,
        _fps = _m._$is('desktop')?80:(_m._$is('ios')?50:30);
    /**
     * 请求动画
     * @param  {Function} 动画回调
     * @return {String}   动画标识
     */
    _p.__requestAnimationFrame = (function(){
        var _handler = _m._$is('android')?null:(
            _this.requestAnimationFrame||
            _this[_prefix+'RequestAnimationFrame']
        );
        return function(){
            if (!_handler){
                _handler = function(_callback){
                    return window.setTimeout(
                        function(){
                            try{_callback(+new Date);}catch(ex){}
                        },1000/_fps
                    );
                };
            }
            return _handler.apply(this,arguments);
        };
    })();
    /**
     * 取消动画
     * @param  {String} 动画标识
     * @return {Void}
     */
    _p.__cancelAnimationFrame = (function(){
        var _handler = _m._$is('android')?null:(
            _this.cancelAnimationFrame||
            _this[_prefix+'CancelAnimationFrame']
        );
        return function(){
            if (!_handler){
                _handler = function(_id){
                    window.clearTimeout(_id);
                };
            }
            return _handler.apply(this,arguments);
        };
    })();
    
    return _p;
});
