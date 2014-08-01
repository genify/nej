/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './html.js',
    '{lib}base/element.js',
    '{lib}base/platform.js'
],function(_h,_e,_m,_p,_o,_f,_r){
    // for ie6-
    NEJ.patch('TR<=2.0',function(){
        /**
         * 删除IFrame节点，保留历史
         * @param  {Node} iframe节点
         * @return {Void}
         */
        _h.__removeIFrameKeepHistory = function(_iframe){
            _e._$setStyle(_iframe,'display','none');
            try{_iframe.contentWindow.document.body.innerHTML = '&nbsp;';}catch(ex){}
        };
    });
    
    return _h;
});
