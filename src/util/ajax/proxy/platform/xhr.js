/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define(function(_p,_o,_f,_r){
    /**
     * 取XHR对象
     * @return {XMLHttpRequest} XHR对象
     */
    _p.__getXMLHttpRequest = function(){
        return new XMLHttpRequest();
    };
    
    return _p;
});
