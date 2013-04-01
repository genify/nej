/*
 * ------------------------------------------
 * 重写History API封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _v = NEJ.P('nej.v'),
        _hflag = !1, // is history
        _hpool = []; // history url list
    /**
     * 当前历史索引
     * @type Number
     */
    history.index = 0;
    /**
     * 历史队列长度
     * @type Number
     */
    history.size = _hpool.length;
    /**
     * 跳转到历史
     * @api    {history.go}
     * @param  {Number} 步长
     * @return {history}
     */
    history.go = function(_step){
        if (history.length<2) return this;
        var _index = history.index+_step;
        history.index = Math.max(0,
                        Math.min(_index,
                        history.size-1));
        _hflag = !0;
        location.redirect(_hpool[history.index],!0);
        return this;
    };
    /**
     * 后退
     * @api    {history.back}
     * @return {history}
     */
    history.back = function(){
        history.go(-1);
        return this;
    };
    /**
     * 前进
     * @api    {history.forward}
     * @return {history}
     */
    history.forward = function(){
        history.go(1);
        return this;
    };
    // listener history change
    _v._$addEvent(location,'urlchange',
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
        });
};
NEJ.define('{lib}util/history/history.override.js',
          ['{lib}util/history/history.js'],f);
