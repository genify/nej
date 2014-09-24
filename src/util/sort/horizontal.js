/*
 * ------------------------------------------
 * 水平排序功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/sort/horizontal */
NEJ.define([
    'base/global',
    'base/klass',
    './sortable.js'
],function(NEJ,_k,_t,_p,_o,_f,_r,_pro){
    /**
     * 水平排序功能封装
     * 
     * 脚本举例
     * ```javascript
     * 
     * ```
     * 
     * @class   module:util/sort/horizontal._$$HSortable
     * @extends module:util/sort/sortable._$$Sortable
     * 
     * @param  {Object} conifg - 可选配置参数
     */
    _p._$$HSortable = _k._$klass();
    _pro = _p._$$HSortable._$extend(_t._$$Sortable);
    /**
     * 计算占位符位置信息
     * 
     * @abstract
     * @method module:util/sort/horizontal._$$HSortable#__doCalPlaceHolder
     * @param  {Object} arg0 - 当前节点
     * @param  {Object} arg1 - 鼠标位置
     * @return {Object}        占位符信息
     */
    _pro.__doCalPlaceHolder = function(_box,_pointer){
        var _isleft = _pointer.left<_box.width/2;
        return {
            top:_box.top,
            height:_box.height,
            left:_isleft?(_box.left-this.__holder.offsetWidth):(_box.left+_box.width),
            position:_isleft?'beforeBegin':'afterEnd',
            method:_isleft?'unshift':'pop'
        };
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
