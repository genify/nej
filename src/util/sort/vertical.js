/*
 * ------------------------------------------
 * 垂直排序功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/sort/vertical */
NEJ.define([
    'base/global',
    'base/klass',
    './sortable.js'
],function(NEJ,_k,_t,_p,_o,_f,_r,_pro){
    /**
     * 垂直排序功能封装
     * 
     * 样式举例
     * ```css
     *  .box{position:relative;width:500px;margin:50px;padding:5px;overflow:hidden;background:#FFFF00;}
     *  .box .it{height:50px;line-height:50px;margin:10px 0;background:#fdc;border:1px solid #aaa;text-align:center;cursor:move;}
     *  .box .j-selected{background:#00BB00;}
     *  .box .holder{position:absolute;top:0;left:0;height:12px;background:#0000FF;overflow:hidden;}
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
     *      '../vertical.js'
     *  ],function(_t){
     *      var _sorter = _t._$$VSortable._$allocate({
     *          clazz:'it',
     *          parent:'abc',
     *          placeholder:'def'
     *      });
     *  });
     * ```
     * 
     * @class   module:util/sort/vertical._$$VSortable
     * @extends module:util/sort/sortable._$$Sortable
     * 
     * @param  {Object} conifg - 可选配置参数
     */
    _p._$$VSortable = _k._$klass();
    _pro = _p._$$VSortable._$extend(_t._$$Sortable);
    /**
     * 判断是否可以开始拖拽行为
     *
     * @abstract
     * @method module:util/sort/sortable._$$VSortable#__canStartSort
     * @param  {Object} arg0 - 初始鼠标位置
     * @param  {Object} arg1 - 当前鼠标位置
     * @return {Boolean}       是否可以开始拖拽
     */
    _pro.__canStartSort = function(_pos1,_pos2){
        return Math.abs(_pos2.y-_pos1.y)>this.__delta;
    };
    /**
     * 计算占位符位置信息
     * 
     * @abstract
     * @method module:util/sort/vertical._$$VSortable#__doCalPlaceHolder
     * @param  {Object} arg0 - 当前节点
     * @param  {Object} arg1 - 鼠标位置
     * @return {Object}        占位符信息
     */
    _pro.__doCalPlaceHolder = function(_box,_pointer){
        var _istop = _pointer.top<_box.height/2;
        return {
            left:_box.left,
            width:_box.width,
            top:_istop?(_box.top-this.__holder.offsetHeight):(_box.top+_box.height),
            position:_istop?'beforeBegin':'afterEnd',
            method:_istop?'unshift':'pop'
        };
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
