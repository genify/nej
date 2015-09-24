/**
 * ------------------------------------------
 * 纯文本编辑器接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/util'
],function(u,p){
    /**
     * 导出图片列表
     * @param datatrans
     * @private
     */
    p.__dumpImages = function(board){
        var ret = [];
        u._$forEach(board.items,function(it){
            if (it.kind==='file'&&
                it.type.indexOf('image')>-1){
                ret.push(it.getAsFile());
            }
        });
        return ret;
    };


});


