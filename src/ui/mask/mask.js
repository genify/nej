/*
 * ------------------------------------------
 * 盖层控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/maks/mask */
NEJ.define([
    'base/global',
    'base/klass',
    'base/constant',
    'base/element',
    'base/util',
    'ui/base',
    'text!./mask.css'
],function(NEJ,_k,_g,_e,_u,_i,_css,_p,_o,_f,_r){
    var _pro,
        _seed_css = _e._$pushCSSText(_css,{blankimage:_g._$BLANK_IMAGE});
    /**
     * 盖层控件
     *
     * 页面结构举例
     * ```html
     * <style type="text/css">
     *     .box{position:relative;}
     * </style>
     * <div id="mask-box" class="box"></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'ui/maks/mask'
     * ],function(_i0,_p,_o,_f,_r){
     *     var _mask = _i0._$$Mask._$allocate({
     *         parent:document.body,
     *         content:'<div style="width:100px;height:100px;margin:0 auto;margin-top:150px;">搞一点盖层的内容</div>'
     *     });
     * });
     * ```
     *
     * @class     module:ui/maks/mask._$$Mask
     * @extends   module:ui/base._$$Abstract
     * @param     {Object}      arg0    - 可选配置参数
     * @property  {String|Node} content - 内容节点或者HTML代码
     */
    _p._$$Mask = _k._$klass();
    _pro = _p._$$Mask._$extend(_i._$$Abstract);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/maks/mask._$$Mask#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        var _content = _options.content||'&nbsp;';
        _u._$isString(_content)
        ? this.__body.innerHTML = _content
        : this.__body.appendChild(_content);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/maks/mask._$$Mask#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__body.innerHTML = '&nbsp;';
    };
    /**
     * 初始化外观
     *
     * @protected
     * @method module:ui/maks/mask._$$Mask#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 显示盖层
     *
     * ```javascript
     * // 先隐藏盖层
     * _mask._$hide();
     * // 显示盖层
     * _mask._$show();
     * ```
     *
     * @method module:ui/maks/mask._$$Mask#_$show
     * @return {Void}
     */
    _pro._$show = function(){
        _e._$fullScreen(this.__body);
        this.__super();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});