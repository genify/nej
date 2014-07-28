/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './util.js'
],function(_h,_p,_o,_f,_r){
    
    // for ie8-
    NEJ.patch('TR<=4.0',function(){
        /**
         * 遍历对象
         * @param  {Object}   对象
         * @param  {Function} 迭代回调
         * @param  {Object}   回调执行对象
         * @return {String}   循环中断时的key值
         */
        _h.__forIn = 
        _h.__forIn._$aop(function(_event){
            _event.stopped = !0;
            // check
            var _args = _event.args,
                _obj  = _args[0],
                _fcb  = _args[1],
                _this = _args[2]||null;
            if (!_obj||!_fcb){
                return;
            }
            // iterate
            var _ret;
            for(var x in _obj){
                if (!_obj.hasOwnProperty(x)) continue;
                _ret = _fcb.call(_this,_obj[x],x,_obj);
                if (!!_ret){
                    _event.value = x;
                    return;
                }
            }
        });
    });
    
    return _h;
});
