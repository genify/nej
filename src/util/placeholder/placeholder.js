/*
 * ------------------------------------------
 * 输入框占位符支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/placeholder/placeholder */
NEJ.define([
    'base/global',
    'base/element',
    '{platform}holder.js',
    'base/chain'
],function(NEJ,_e,_h,_x,_p,_o,_f,_r){
    /**
     * 输入框占位行为，高版本用placeholder属性和样式处理
     *
     * 样式设置占位符文字效果
     * ```css
     * input:-moz-placeholder{color:#aaa;font-style:italic;}
     * input::-ms-input-placeholder{color:#aaa;font-style:italic;}
     * input::-webkit-input-placeholder{color:#aaa;font-style:italic;}
     * .js-placeholder{color:#aaa;font-style:italic;}
     * ```
     *
     * 结构举例
     * ```html
     * <!-- 使用data-holder属性指定占位文字效果样式名称 -->
     * <input id="abc" type="text" placeholder="text content" data-holder="js-placeholder"/>
     * <textarea id="abc" placeholder="text content" data-holder="js-placeholder"></textarea>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/placeholder/placeholder'
     * ],function(_e){
     *     // 如果hover效果的样式名已经通过data-holder指定
     *     _e._$placeholder('abc');
     *     // 如果样式名没有通过data-holder指定，则可以通过参数输入
     *     // 当节点有data-holder指定样式名称，同时参数也输入样式名称，则优先使用data-holder指定的样式名
     *     _e._$placeholder('abc','js-placeholder');
     * });
     * ```
     *
     * @method module:util/placeholder/placeholder._$placeholder
     * @param  {String|Node} arg0 - 输入控件，如input、textarea
     * @param  {String}      arg1 - 占位样式名称，默认为js-placeholder
     * @return {Void}
     */
    /**
     * @method CHAINABLE._$placeholder
     * @see module:util/placeholder/placeholder._$placeholder
     */
    _p._$placeholder = function(_element,_clazz){
        _h.__setPlaceholder(_element,
            _e._$dataset(_element,'holder')
                ||_clazz||'js-placeholder');
    };
    // for chainable method
    _x._$merge(_p);

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});