/*
 * ------------------------------------------
 * 颜色面板控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/config.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/template/tpl.js',
    '{lib}util/slider/slider.y.js',
    '{lib}util/slider/slider.xy.js',
    '{lib}ui/base.js',
    '{lib}ui/colorpick/util.js'
],function(NEJ,_k,_c,_e,_v,_t0,_t1,_t2,_i,_i0,_p,_o,_f,_r){
    var _pro,
        _seed_css,
        _seed_html;
    /**
     * 颜色选择面板控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id='colorpanel-box'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _cp = _p._$$ColorPanel._$allocate({
     *       parent:'colorpanel-box',
     *       onchange:function(_color){
     *           // 选择颜色或者亮度的时候触发
     *       }
     *   });
     * [/code]
     *
     * @class   module:nej.ui._$$ColorPanel 颜色选择面板控件
     * @uses    {nej.ut._$$SliderXY}
     * @uses    {nej.ut._$$SliderY}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数
     * @config  {String} color RGB颜色值，默认为#fff
     *
     * [hr]
     *
     * @event  {onchange} 颜色变化触发事件
     * @param  {String}   RGB颜色串
     *
     */
    _p._$$ColorPanel = _k._$klass();
    _pro = _p._$$ColorPanel._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
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
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
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
     * @protected
     * @method {__destroy}
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
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
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
     * @protected
     * @method {__doColorChange}
     * @return {Void}
     */
    _pro.__doColorChange = function(){
        this._$dispatchEvent('onchange',_i0._$hsl2color(this.__hsl));
    };
    /**
     * 亮度变化触发事件
     * @protected
     * @method {__onLightChange}
     * @param  {Object} 位置信息
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
     * @protected
     * @method {__onHueSatChange}
     * @param  {Object} 位置信息
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
     * 设置颜色<br />
     * 脚本举例
     * [code]
     *   // 先把颜色转成rgb，然后转成hsl,在一个面板设置sh，在另外一个面板设置l
     *   _cp._$setColor('#000');
     * [/code]
     * @method {_$setColor}
     * @param  {String} 颜色值
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

    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{width:160px;margin:0 auto;overflow:hidden;$<user-select>:none;}\
        .#<uispace> .zbg{background:url('+_c._$get('root')+'nej_color_btn.png) no-repeat -50px -50px;}\
        .#<uispace> .zwrp{position:relative;padding:3px;zoom:1;cursor:default;font-size:1px;}\
        .#<uispace> .zwrp .zdot{position:absolute;top:0;left:0;height:9px;overflow:hidden;}\
        .#<uispace> .zwrp .zshw{height:104px;border:1px solid #bdbabd;}\
        .#<uispace> .zpnl{float:left;}\
        .#<uispace> .zpnl .zdot{width:9px;background-position:0 0;}\
        .#<uispace> .zpnl .zshw{width:104px;background:url('+_c._$get('root')+'nej_color.png) no-repeat;}\
        .#<uispace> .zhlt{float:right;padding:3px 7px;}\
        .#<uispace> .zhlt .zdot{width:44px;background-position:0 -30px;}\
        .#<uispace> .zhlt .zshw{width:26px;background:url('+_c._$get('root')+'nej_color_mask.png) repeat-x;}');
    // ui html code
    _seed_html = _t0._$addNodeTemplate('\
        <div class="'+_seed_css+'">\
          <div class="zwrp zpnl js-ztag">\
            <span class="zdot zbg js-ztag">&nbsp;</span>\
            <div class="zshw">&nbsp;</div>\
          </div>\
          <div class="zwrp zhlt js-ztag">\
            <span class="zdot zbg js-ztag">&nbsp;</span>\
            <div class="zshw js-ztag">&nbsp;</div>\
          </div>\
        </div>');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});