/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author
 * ------------------------------------------
 */
NEJ.define([
    'base/platform'
],function(_m,_p,_o,_f,_r){
    /**
     * 判断是否需要对Flash事件做代理，
     * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
     * @return {Boolean} 是否做代理
     */
    _p.__canFlashEventBubble = function(_wmode){
        return (_wmode||'').toLowerCase()!='transparent';
    };

    return _p;
});
