/*
 * ------------------------------------------
 * HOVER接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/hover/hover */
NEJ.define([
    'base/global',
    'base/element',
    '{platform}hover.js'
],function(NEJ,_e,_h,_p,_o,_f,_r){
    /**
     * 节点hover行为，高版本浏览器用:hover样式处理
     *
     * 样式举例
     * ```css
     *    .page .element:hover,
     *    .page .element.js-hover{background:#f00;}
     * ```
     *
     * 结构举例
     * ```html
     *    <!-- 使用data-hover指定hover效果的样式名称 -->
     *    <div id="abc" data-hover="js-hover">aaaaa</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/element'
     *   ],function(_e){
     *       // 如果hover效果的样式名已经通过data-hover指定
     *       _e._$hover('abc');
     *
     *       // 如果hover效果的样式名没有通过data-hover指定
     *       _e._$hover('abc','js-hover');
     *   });
     * ```
     *
     * @method module:util/hover/hover._$hover
     * @param  {String|Node} arg0 - 节点
     * @param  {String}      arg1 - 样式，默认为js-hover
     * @return {Void}
     */
    _p._$hover = function(_element,_clazz){
        _element = _e._$get(_element);
        if (!!_element){
            _e._$id(_element);
            _h.__hoverElement(
                _element,_clazz||
                _e._$dataset(_element,'hover')||
                'js-hover'
            );
        }
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }
    
    return _p;
});
