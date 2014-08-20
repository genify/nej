/*
 * ------------------------------------------
 * 颜色选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/colorpick/colorpick */
NEJ.define([
    'base/global',
    'base/klass',
    'base/config',
    'base/element',
    'base/event',
    'util/template/tpl',
    'ui/base',
    'ui/colorpick/colorpanel',
    'ui/colorpick/util',
    'text!./colorpick.css',
    'text!./colorpick.html'
],function(NEJ,_k,_c,_e,_v,_t0,_i,_i0,_i1,_css,_html,_p,_o,_f,_r){
    var _pro,
        _seed_css = _e._$pushCSSText(_css,{root:_c._$get('root')}),
        _seed_html= _t0._$addNodeTemplate(_html);
    /**
     * 颜色选择控件
     *
     * 页面结构举例
     * ```html
     * <div id='colorpanel-box'></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'ui/colorpick/colorpick'
     * ],function(_i0,_p,_o,_f,_r){
     *     var _cp = _i0._$$ColorPick._$allocate({
     *         parent:'colorpanel-box',
     *         color:'默认rgb颜色',
     *         defaultColor:'默认rgb颜色',
     *         onchange:function(_event){
     *             // 选择颜色或者亮度的时候触发
     *             console.log(_event.color)
     *         },
     *         onselect:function(_color){
     *             // 最后保存颜色的时候触发
     *             console.log(_event.color)
     *         }
     *       });
     * });
     * ```
     *
     * @class    module:ui/colorpick/colorpick._$$ColorPick
     * @uses     module:ui/colorpick/colorpanel._$$ColorPanel
     * @extends  module:ui/base._$$Abstract
     * @param    {Object} arg0         - 可选配置参数
     * @property {String} color        - 颜色值
     * @property {String} defaultColor - 默认颜色值
     */
    /**
     * 颜色变化触发事件
     *
     * @event    module:ui/colorpick/colorpick._$$ColorPick#onchange
     * @param    {Object} arg0  - 颜色信息
     * @property {String} color - 颜色值
     */
    /**
     * 确定选择颜色触发事件
     *
     * @event    module:ui/colorpick/colorpick._$$ColorPick#onselect
     * @param    {Object} arg0  - 颜色信息
     * @property {String} color - 颜色值
     *
     */
    _p._$$ColorPick = _k._$klass();
    _pro = _p._$$ColorPick._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__popt = {onchange:this.__onColorChange._$bind(this)};
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__default = _options.defaultColor||'#fff';
        this.__popt.color = _options.color||this.__default;
        this.__panel = _i0._$$ColorPanel._$allocate(this.__popt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__panel._$recycle();
        delete this.__panel;
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getByClassName(this.__body,'js-ztag');
        this.__ninput = _list[2];
        this.__npreview = _list[1];
        this.__popt.parent = this.__body;
        _v._$addEvent(_list[0],'click'
                     ,this.__onColorClear._$bind(this));
        _v._$addEvent(_list[2],'keypress'
                     ,this.__onEnterCheck._$bind(this));
        _v._$addEvent(_list[3],'click'
                     ,this.__onColorSelect._$bind(this));
    };
    /**
     * 清除颜色
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__onColorClear
     * @return {Void}
     */
    _pro.__onColorClear = function(){
        this.__panel._$setColor(this.__default);
    };
    /**
     * 颜色变化触发事件
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__onColorChange
     * @param  {String} arg0 - 颜色值
     * @return {Void}
     */
    _pro.__onColorChange = function(_color){
        this.__ninput.value = _color.substr(1);
        _e._$setStyle(this.__npreview,'backgroundColor',_color);
        this._$dispatchEvent('onchange',{color:_color});
    };
    /**
     * 确定选择颜色
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__onColorSelect
     * @return {Void}
     */
    _pro.__onColorSelect = function(){
        var _color = '#'+this.__ninput.value.trim();
        if (!_i1._$isColor(_color))
            return;
        this.__panel._$setColor(_color);
        _color = '#'+this.__ninput.value.trim();
        this._$dispatchEvent('onselect',{color:_color});
    };
    /**
     * 回车事件侦测
     *
     * @protected
     * @method module:ui/colorpick/colorpick._$$ColorPick#__onEnterCheck
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onEnterCheck = function(_event){
        if (_event.keyCode!=13)
            return;
        this.__onColorSelect();
    };
    /**
     * 设置颜色
     *
     * 脚本举例
     * ```javascript
     * // 先把颜色转成rgb，然后转成hsl,在一个面板设置sh，在另外一个面板设置l
     * _cp._$setColor('#ccc');
     * ```
     *
     * @method module:ui/colorpick/colorpick._$$ColorPick#_$setColor
     * @param  {String} arg0 - 颜色值
     * @return {Void}
     */
    _pro._$setColor = function(_color){
        this.__panel._$setColor(_color);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});