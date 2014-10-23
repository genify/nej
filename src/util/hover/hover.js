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
    'base/chain',
    '{platform}hover.js'
],function(NEJ,_e,_x,_h,_p,_o,_f,_r){
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
     *       'util/hover/hover'
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
    /**
     * @method CHAINABLE._$hover
     * @see module:util/hover/hover._$hover
     */
    _p._$hover = function(_element,_clazz){
        if (!_u._$isArray(_element)){
            _element = _e._$get(_element);
            if (!!_element){
                _e._$id(_element);
                _h.__hoverElement(
                    _element,_clazz||
                    _e._$dataset(_element,'hover')||
                    'js-hover'
                );
            }
            return;
        }
        // batch hover
        _u._$forEach(
            _element,function(_node){
                _p._$hover(_node,_clazz);
            }
        );
    };
    /**
     * 低版本移除节点hover行为，高版本不做处理
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
     *       'util/hover/hover'
     *   ],function(_e){
     *       // 如果hover效果的样式名已经通过data-hover指定
     *       _e._$hover('abc');
     * 
     *       // 移除_$hover接口添加的效果
     *       _e._$unhover('abc');
     *   });
     * ```
     *
     * @method module:util/hover/hover._$unhover
     * @param  {String|Node} arg0 - 节点
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$unhover
     * @see module:util/hover/hover._$unhover
     */
    _p._$unhover = function(_element){
        if (!_u._$isArray(_element)){
            var _id = _e._$id(_element);
            if (!!_id){
                _h.__unhoverElement(_id);
            }
            return;
        }
        // batch unhover
        _u._$forEach(
            _element,function(_node){
                _p._$unhover(_node);
            }
        );
    };
     // for chainable method
    _x._$merge(_p);

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});
