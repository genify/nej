var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident1) return;
    /**
     * 检查事件信息
     * @param  {Node}     _element 节点对象
     * @param  {String}   _type    事件类型
     * @param  {Function} _event   事件处理函数
     * @param  {Boolean}  _capture 是否捕获阶段事件
     * @return {Array}             事件列表
     */
    _h.__checkEvent = (function(){
        var _tmap = {
                touchcancel:'MSPointerCancel',
                touchstart:'MSPointerDown',
                touchmove:'MSPointerMove',
                touchend:'MSPointerUp'
            };
        return _h.__checkEvent._$aop(function(_event){
            var _args = _h.__formatEventArgs
                          .apply(_h,_event.args);
            if (!_args){
                _event.stopped = !0;
                return;
            }
            // check touch event
            var _type = _tmap[_args[1]];
            if (!!_type&&(('on'+_type).toLowerCase() in _args[0])){
                _args[4] = _args[1];
                _args[1] = _type;
                _event.stopped = !0;
                _event.value = _args;
            }
        });
    })();
    /**
     * 判断是否需要对Flash事件做代理，
     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
     * @return {Boolean} 是否做代理
     */
    _h.__canFlashEventBubble = function(_wmode){
        return !0;
    };
};
define('{lib}patched/trident-1/api.js',
      ['{lib}patched/api.js'],f);