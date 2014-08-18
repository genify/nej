/*
 * ------------------------------------------
 * 重写History API封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/event',
    './history.js'
],function(_v,_t,_p,_o,_f,_r){
    var _hflag = !1, // is history
        _hpool = []; // history url list
    /**
     * 当前历史索引
     * 
     * @member {Number} external:history.index
     */
    history.index = 0;
    /**
     * 历史队列长度
     * 
     * @member {Number} external:history.size
     */
    history.size = _hpool.length;
    /**
     * 跳转到历史
     * 
     * @method external:history.go
     * @param  {Number} arg0 - 步长
     * @return {Void}
     */
    history.go = function(_step){
        if (history.size<2) return this;
        var _index = history.index+_step;
        history.index = Math.max(0,
                        Math.min(_index,
                        history.size-1));
        _hflag = !0;
        location.redirect(_hpool[history.index],!0);
    };
    /**
     * 从历史记录移出一个历史
     *
     * @method external:history.pop
     * @return {Void}
     */
    history.pop = function(){
        _hpool.pop();
        history.size = _hpool.length;
        history.index = Math.min(
            history.index,
            history.size-1
        );
    };
    /**
     * 后退
     * 
     * @method external:history.back
     * @return {Void}
     */
    history.back = function(){
        history.go(-1);
    };
    /**
     * 前进
     * 
     * @method external:history.forward
     * @return {Void}
     */
    history.forward = function(){
        history.go(1);
    };
    // listener history change
    _v._$addEvent(
        location,'urlchange',
        function(_event){
            // from history
            if (_hflag){
                _hflag = !1;
                return;
            }
            // save history
            var _url = _event.href,
                _cur = _hpool[history.index];
            if (_url!=_cur){
                if (_cur!=null)
                    history.index++;
                _hpool[history.index] = _url;
                history.size  = history.index+1;
                // remove size -> length
                var _count = _hpool.length-history.size;
                if (_count>0) _hpool.splice(history.size,_count);
            }
        }
    );

    return _p;
});
