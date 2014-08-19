/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/element'
],function(_e,_p,_o,_f,_r){
    /**
     * 删除IFrame节点，保留历史
     * @param  {Node} iframe节点
     * @return {Void}
     */
    _p.__removeIFrameKeepHistory = function(_iframe){
        _e._$remove(_iframe);
    };
    
    return _p;
});
