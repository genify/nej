/**
 * ------------------------------------------
 * 占位提示接口平台适配实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _h = _('nej.h');
    /**
     * 节点占位符行为，高版本浏览器用样式处理
     * @param  {String|Node} 节点
     * @param  {String}      样式
     * @return {Void}
     */
    _h.__setPlaceholder = function(_element,_clazz){
        // do nothing
    };
//    /**
//     * 清理节点占位行为
//     * @param  {String|Node} 节点
//     * @return {Void}
//     */
//    _h.__clearPlaceHolder = function(_element){
//        // do nothing
//    };
};
NEJ.define('{lib}patched/holder.js',
          ['{lib}base/element.js'],f);