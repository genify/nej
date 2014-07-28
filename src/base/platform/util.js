/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js'
],function(_g,_p,_o,_f,_r){
    /**
     * 遍历对象
     * @param  {Object}   对象
     * @param  {Function} 迭代回调
     * @param  {Object}   回调执行对象
     * @return {String}   循环中断时的key值
     */
    _p.__forIn = function(_obj,_callback,_this){
        if (!_obj||!_callback){
            return null;
        }
        var _keys = Object.keys(_obj);
        for(var i=0,l=_keys.length,_key,_ret;i<l;i++){
            _key = _keys[i];
            _ret = _callback.call(
                _this||null,
                _obj[_key],_key,_obj
            );
            if (!!_ret){
                return _key;
            }
        }
        return null;
    };
    
    return _p;
});
