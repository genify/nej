/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './util.js',
    'base/platform'
],function(_h,_m,_p,_o,_f,_r){
    // for ie8-
    NEJ.patch('TR<=4.0',function(){
        /**
         * 遍历对象
         * @param  {Object}   对象
         * @param  {Function} 迭代回调
         * @param  {Object}   回调执行对象
         * @return {String}   循环中断时的key值
         */
        _h.__forIn = function(_obj,_callback,_this){
            if (!_obj||!_callback){
                return;
            }
            // iterate
            var _ret;
            for(var x in _obj){
                if (!_obj.hasOwnProperty(x)) continue;
                _ret = _callback.call(_this,_obj[x],x,_obj);
                if (!!_ret){
                    return x;
                }
            }
        };
        /**
         * 遍历列表
         * @param  {Array}    列表
         * @param  {Function} 迭代回调
         * @param  {Object}   回调执行对象
         * @return {Void}
         */
        _h.__forEach = function(_list,_callback,_this){
            for(var i=0,l=_list.length;i<l;i++){
                _callback.call(_this,_list[i],i,_list);
            }
        };
        /**
         * 集合转数组
         * @param  {Object} 集合
         * @return {Array}  数组
         */
        _h.__col2array = function(_list){
            var _result = [];
            if (!!_list&&!!_list.length){
                for(var i=0,l=_list.length;i<l;i++){
                    _result.push(_list[i]);
                }
            }
            return _result;
        };
        /**
         * YYYY-MM-DDTHH:mm:ss.sssZ格式时间串转时间戳
         * @param  {String} 时间串
         * @return {Number} 时间戳
         */
        _h.__str2time = (function(){
            var _reg = /-/g;
            return function(_str){
                // only support YYYY/MM/DDTHH:mm:ss
                return Date.parse(_str.replace(_reg,'/').split('.')[0]);
            };
        })();
    });

    return _h;
});
