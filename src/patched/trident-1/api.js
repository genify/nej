var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _e = _('nej.e'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident1) return;
    /**
     * 检查事件类型
     * @param  {Node}   节点
     * @param  {String} 事件类型
     * @return {String} 变化后的事件类型
     */
    _h.__checkEventType = (function(){
        var _emap = {
            touchcancel:'MSPointerCancel',
            touchstart:'MSPointerDown',
            touchmove:'MSPointerMove',
            touchend:'MSPointerUp'
        };
        return _h.__checkEventType._$aop(
            _h.__checkEventTypeWithConf._$bind(_h,_emap)
        );
    })();
    /**
     * 判断是否需要对Flash事件做代理，
     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
     * @return {Boolean} 是否做代理
     */
    _h.__canFlashEventBubble = function(_wmode){
        return !0;
    };
    /**
     * 删除IFrame节点，保留历史
     * @param  {Node} iframe节点
     * @return {Void}
     */
    _h.__removeIFrameKeepHistory = 
    _h.__removeIFrameKeepHistory._$aop(function(_event){
        _event.stopped = !0;
        var _iframe = _event.args[0];
        _e._$setStyle(_iframe,'display','none');
        try{_iframe.contentWindow.document.body.innerHTML = '&nbsp;';}catch(ex){}
    });
};
NEJ.define('{lib}patched/trident-1/api.js',
          ['{lib}patched/api.js'],f);