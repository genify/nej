/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js'
],function(NEJ,_p,_o,_f,_r){
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
    /**
     * 遍历列表
     * @param  {Array}    列表
     * @param  {Function} 迭代回调
     * @param  {Object}   回调执行对象
     * @return {Void}
     */
    _p.__forEach = function(_list,_callback,_this){
        _list.forEach(_callback,_this);
    };
    /**
     * 集合转数组
     * @param  {Object} 集合
     * @return {Array}  数组
     */
    _p.__col2array = function(_list){
        return _r.slice.call(_list,0);
    };
    /**
     * YYYY-MM-DDTHH:mm:ss.sssZ格式时间串转时间戳
     * @param  {String} 时间串
     * @return {Number} 时间戳
     */
    _p.__str2time = function(_str){
        return Date.parse(_str);
    };
    
    return _p;
});
