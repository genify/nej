/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './flash.js',
    'base/platform'
],function(_h,_m,_p,_o,_f,_r){
    // for ie
    NEJ.patch('TR',function(){
        /**
         * 判断是否需要对Flash事件做代理，
         * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
         * @return {Boolean} 是否做代理
         */
        _h.__canFlashEventBubble = function(_wmode){
            return !0;
        };

    });

    NEJ.patch('WV',function(){
        /**
         * 判断是否需要对Flash事件做代理，
         * 主要fix flash上的鼠标事件没法响应到DOM节点上的问题
         * @return {Boolean} 是否做代理
         */
        _h.__canFlashEventBubble = function(_wmode){
            return !0;
        };

    });

    return _h;
});
