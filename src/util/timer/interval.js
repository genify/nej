/*
 * ------------------------------------------
 * 统一处理间隔时钟实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/timer/interval */
NEJ.define([
    'base/global',
    'base/util'
],function(NEJ,_u,_p,_o,_f,_r){
    var _tcache = {}; // interval:{tm:timer,fn:[{id:23,cb:function} ...]}
                      // timer_id:interval
    /**
     * 请求定时器操作
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/timer/interval'
     * ],function(_p){
     *     // 设置一个定时器，一秒一次
     *     var _id1 = _p.requestInterval(
     *         function(_options){
     *             // TODO
     *         },1000
     *     );
     *     
     *     // 设置一个定时器，一秒一次
     *     var _id2 = _p.requestInterval(
     *         function(_options){
     *             // TODO
     *         },1000
     *     );
     *     
     *     // 时间间隔相同的回调，按照里面的列表进行一次循环。
     *     // 回调顺序是id1的回调，id2的回调
     * });
     * ```
     * 
     * @method module:util/timer/interval.requestInterval
     * @param  {Function} arg0 - 回调函数
     * @param  {Number}   arg1 - 时钟间隔
     * @return {String}          时钟ID
     */
    _p.requestInterval = (function(){
        var _doCallback = function(_item){
            try{_item.cb(+new Date);}catch(ex){}
        };
        var _doTimerTrigger = function(_interval){
            var _cache = _tcache[_interval];
            if (!_cache) return;
            _u._$forEach(_cache.fn,_doCallback);
        };
        return function(_callback,_interval){
            if (!_u._$isFunction(_callback)){
                return null;
            }
            var _cache = _tcache[_interval];
            if (!_cache){
                _cache = {fn:[]};
                _tcache[_interval] = _cache;
            }
            var _id = _u._$uniqueID();
            _tcache[_id] = _interval;
            _cache.fn.push({id:_id,cb:_callback});
            if (_cache.tm==null){
                _cache.tm = window.setInterval(
                    _doTimerTrigger._$bind(
                        null,_interval
                    ),_interval
                );
            }
            return _id;
        };
    })();
    /**
     * 取消时钟操作
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/timer/interval'
     * ],function(_p){
     *     // 取消掉id1的定时器，保留一秒一次的id2的回调
     *     // 如果同一个时间间隔的，id2也被取消，整个回调被取消
     *     _p.cancelInterval(_id1);
     * });
     * ```
     * 
     * @method module:util/timer/interval.cancelInterval
     * @param  {String} arg0 - 时钟ID
     * @return {Void}
     */
    _p.cancelInterval = function(_tid){
        var _interval = _tcache[_tid],
            _cache = _tcache[_interval];
        if (!_cache) return;
        var _list = _cache.fn;
        _u._$reverseEach(
            _list,function(_item,_index,_list){
                if (_item.id==_tid){
                    _list.splice(_index,1);
                    return !0;
                }
            }
        );
        if (!_list.length){
            window.clearInterval(_cache.tm);
            delete _tcache[_tid];
            delete _tcache[_interval];
        }
    };
    
    if (CMPT){
        NEJ.copy(this,_p);
    }
    
    return _p;
});
