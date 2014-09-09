/*
 * ------------------------------------------
 * 颜色面板控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/colorpick/colorpanel */
NEJ.define([
    'base/global',
    'base/klass',
    'base/config',
    'base/element',
    'base/event',
    'util/template/tpl',
    'util/slider/slider.y',
    'util/slider/slider.xy',
    'ui/base',
    'ui/colorpick/util',
    'text!./colorpanel.css',
    'text!./colorpanel.html'
],function(NEJ,_k,_c,_e,_v,_t0,_t1,_t2,_i,_i0,_css,_html,_p,_o,_f,_r){
    var _pro,
        _seed_css = _e._$pushCSSText(_css,{root:_c._$get('root')}),
        _seed_html= _t0._$addNodeTemplate(_html);
    /**
     * 颜色选择面板控件<br />
     *
     * 页面结构举例
     * ```html
     * <div id='colorpanel-box'></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'ui/colorpick/colorpanel'
     * ],function(_i0,_p,_o,_f,_r){
     *     var _cp = _i0._$$ColorPanel._$allocate({
     *         parent:'colorpanel-box',
     *         onchange:function(_color){
     *             // 选择颜色或者亮度的时候触发
     *         }
     *     });
     * });
     * ```
     *
     * @class    module:ui/colorpick/colorpanel._$$ColorPanel
     * @uses     module:util/slider/xy._$$SliderXY
     * @uses     module:util/slider/y._$$SliderY
     * @extends  module:ui/event._$$Abstract
     * 
     * @param    {Object} arg0 - 可选配置参数
     * @property {String} color - RGB颜色值，默认为#fff
     */
    /**
     * 颜色变化触发事件
     *
     * @event  module:ui/colorpick/colorpanel._$$ColorPanel#onchange
     * @param  {String} arg0 - RGB颜色串
     *
     */
    _p._$$ColorPanel = _k._$klass();
    _pro = _p._$$ColorPanel._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__hsl  = {};
        this.__sopt = {onchange:this.__onLightChange._$bind(this)};
        this.__dopt = {onchange:this.__onHueSatChange._$bind(this)};
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__lslide = _t2._$$SliderXY._$allocate(this.__dopt);
        this.__rslide = _t1._$$SliderY._$allocate(this.__sopt);
        this._$setColor(_options.color||'#fff');
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__hsl = {};
        this.__lslide._$recycle();
        delete this.__lslide;
        this.__rslide._$recycle();
        delete this.__rslide;
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__initXGui
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
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getByClassName(this.__body,'js-ztag');
        this.__dopt.track = _list[0];
        this.__dopt.slide = _list[1];
        this.__sopt.track = _list[2];
        this.__sopt.slide = _list[3];
        this.__nlprv = _list[4];
    };
    /**
     * 颜色变化回调
     *
     * @protected
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__doColorChange
     * @return {Void}
     */
    _pro.__doColorChange = function(){
        this._$dispatchEvent('onchange',_i0._$hsl2color(this.__hsl));
    };
    /**
     * 亮度变化触发事件
     *
     * @protected
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__onLightChange
     * @param  {Object} arg0 - 位置信息
     * @return {Void}
     */
    _pro.__onLightChange = function(_event){
        var _light = 1-_event.y.rate;
        if (_light==this.__hsl.l)
            return;
        this.__hsl.l = _light;
        this.__doColorChange();
    };
    /**
     * 色度饱和度变化触发事件
     *
     * @protected
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#__onHueSatChange
     * @param  {Object} arg0 - 位置信息
     * @return {Void}
     */
    _pro.__onHueSatChange = function(_event){
        var _hue = _event.x.rate,
            _sat = 1-_event.y.rate;
        if (_hue==this.__hsl.h&&
            _sat==this.__hsl.s)
            return;
        this.__hsl.h = _hue;
        this.__hsl.s = _sat;
        _e._$setStyle(this.__nlprv,
                     'backgroundColor',
                     _i0._$hsl2color({
                        h:this.__hsl.h
                       ,s:this.__hsl.s
                       ,l:0.5
                     }));
        this.__doColorChange();
    };
    /**
     * 设置颜色
     *
     * 脚本举例
     * ```javascript
     * // 先把颜色转成rgb，然后转成hsl,在一个面板设置sh，在另外一个面板设置l
     * _cp._$setColor('#000');
     * ```
     *
     * @method module:ui/colorpick/colorpanel._$$ColorPanel#_$setColor
     * @param  {String} arg0 - 颜色值
     * @return {Void}
     */
    _pro._$setColor = function(_color){
        if (!_i0._$isColor(_color)) return;
        this.__hsl = _i0._$color2hsl(_color);
        this.__lslide._$setPosition({
            x:this.__hsl.h
           ,y:1-this.__hsl.s
        });
        this.__rslide._$setPosition({
            y:1-this.__hsl.l
        });
        this.__doColorChange();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});