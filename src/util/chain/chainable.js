/*
 * ------------------------------------------
 * 利用NEJ原有API包装成链式调用风格API， * @version  0.1
 * @author hzzhenghaibo
 * ------------------------------------------
 */
var f = function() {
    // // import
    // var _  = NEJ.P,
    //     _e = _("nej.e"),
    //     _v = _("nej.v"),
    //     _u = _("nej.u"),
    //     $ = _("nej.$");

    /**
     * TransPort NEJ Methods
     * =================================================
     * 移植，由于没有更好的方法判断是否是可以与node 
     * 这里采用人肉列出方法名的方式, 并将这些方法移入_$()中
     */

    /**
     * 可以扩展的接口列表
     * @type {Object}
     */
    // var _acceptList = $.__acceptList = {
    //     "e" : [//class相关
    //         "addClassName", "delClassName", "hasClassName", "replaceClassName", "toggle",// class相关
    //         //css相关
    //         "setStyle", "getStyle","css3d", "style", "offset", "getScrollViewPort", 
    //         // 动画 特效 UI
    //         "fixed", "effect", "fade", "focus", "highlight", "hover", "page", "placeholder", "tab", "wrapInline",
    //         // 属性相关
    //         "attr", "dataset",
    //         // 节点
    //         "remove", "removeByEC",
    //         // // 杂项
    //         "dom2xml","bindClearAction","bindCopyAction", "counter"],
    //         // event相关
    //     "v" : ["addEvent", "clearEvent", "delEvent", "dispatchEvent"]
    // };

    // /**
    //  * 移植nej接口
    //  * @param  {[type]} proto [description]
    //  * @return {[type]}
    //  */
    // (function _transport(_acceptList){
    //     var _generic = {}
    //     _u._$forIn(_acceptList,function(_list, _name){
    //         var _host = _("nej."+_name);
    //         _u._$forEach(_list, function(_raw){
    //             var _methodName = "_$" + _raw
    //             _generic[_methodName] = _host[_methodName]
    //         });
    //     });
    //     $._$implement(_generic,{static: true})
    // })(_acceptList);

    // $.toString = (function(){
    //     var _str = "NEJ原始支持列表:";
    //     _u._$forIn(_acceptList,function(_list, _name){
    //         _str += [""].concat(_list).join("\nnej."+_name+"._$");
    //     });
    //     return function(){
    //         return _str
    //     }
    // })();

};
NEJ.define('{lib}util/chain/chainable.js', [
    '{lib}util/chain/NodeList.js'
    ], f);