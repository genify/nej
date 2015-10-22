/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './simple.js'
],function(h){
    // for ie
    NEJ.patch('TR',function(){
        /**
         * 插入回车换行
         * @param doc
         * @private
         */
        h.__getOverflowParent = function(parent){
            var ret = parent;
            if (ret.tagName=='BODY'){
                ret = ret.ownerDocument.documentElement;
            }
            return ret;
        };
    });
    return h;
});
