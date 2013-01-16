var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.webkit) return;
    /**
     * 判断是否需要对Flash事件做代理，
     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
     * @return {Boolean} 是否做代理
     */
    _h.__canFlashEventBubble = function(_wmode){
        return !0;
    };
};
define('{lib}patched/webkit/api.js',
      ['{lib}patched/com/api.js'],f);