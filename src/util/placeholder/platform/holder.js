/*
 * ------------------------------------------
 * 占位提示接口平台适配实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define(function(_p,_o,_f,_r){
    /**
     * 节点占位符行为，高版本浏览器用样式处理
     * @param  {String|Node} 节点
     * @param  {String}      样式
     * @return {Void}
     */
    _p.__setPlaceholder = function(_element,_clazz){
        // do nothing
    };

    return _p;
});