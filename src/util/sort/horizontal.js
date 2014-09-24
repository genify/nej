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
     * 样式举例
     * ```css
     *  .box{position:relative;width:560px;margin:50px;padding:5px;overflow:hidden;background:#FFFF00;}
     *  .box .it{float:left;width:100px;height:100px;line-height:100px;margin:5px;background:#fdc;border:1px solid #aaa;text-align:center;cursor:move;}
     *  .box .j-selected{background:#00BB00;}
     *  .box .holder{position:absolute;top:0;left:0;width:12px;background:#0000FF;overflow:hidden;}
     * ```
     * 
     * 结构举例
     * ```html
     *  <div class="box" id="abc">
     *    <div class="it" data-value="1">1</div>
     *    <div class="it" data-value="2">2</div>
     *    <div class="it" data-value="3">3</div>
     *    <div class="it" data-value="4">4</div>
     *    <div class="it" data-value="5">5</div>
     *    <div class="it" data-value="6">6</div>
     *    <div class="it" data-value="7">7</div>
     *    <div class="it" data-value="8">8</div>
     *    <div class="it" data-value="9">9</div>
     *    <div class="it" data-value="a">a</div>
     *    <div class="holder" id="def">&nbsp;</div>
     *  </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     *  NEJ.define([
     *      '../horizontal.js'
     *  ],function(_t){
     *      _t._$$HSortable._$allocate({
     *          clazz:'it',
     *          parent:'abc',
     *          placeholder:'def'
     *      });
     *  });
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
