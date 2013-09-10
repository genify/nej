/*
 * ------------------------------------------
 * 颜色选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _x = _('nej.ut.c'),
        _p = _('nej.ui'),
        _proColorPick,
        _supColorPick;
    if (!!_p._$$ColorPick) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('\
        .#<uispace> .zbx{background:url('+_c._$get('root')+'nej_color_btn.png) no-repeat -50px -50px;}\
        .#<uispace> .zinf{width:160px;margin:0 auto;padding-bottom:2px;overflow:hidden;font-size:12px;}\
        .#<uispace> .zinf .zfl{float:left;}\
        .#<uispace> .zinf .zes{width:19px;height:19px;margin:0 2px 0 3px;background-position:-22px 0;cursor:pointer;}\
        .#<uispace> .zinf .zpv{width:17px;height:17px;border:1px solid #bdbabd;}\
        .#<uispace> .zinf .ztxt{width:56px;height:13px;line-height:13px;}\
        .#<uispace> .zinf .zbtn{width:49px;height:20px;line-height:20px;padding:0;cursor:pointer;}');
    // ui html code
    var _seed_html = _e._$addNodeTemplate('\
        <div class="'+_seed_css+'">\
          <div class="zinf">\
            <span class="zfl zes zbx js-ztag" title="清除颜色">&nbsp;</span>\
            <span class="zfl zpv js-ztag">&nbsp;</span>\
            <label class="zfl">#<input class="ztxt js-ztag" type="text" maxlength="6"/></label>\
            <input class="zfl zbtn js-ztag" type="button" value="确定"/>\
          </div>\
        </div>');
    /**
     * 颜色选择控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id='colorpanel-box'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _cp = _p._$$ColorPick._$allocate({
     *       parent:'colorpanel-box',
     *       color:'默认rgb颜色',
     *       defaultColor:'默认rgb颜色',
     *       onchange:function(_event){
     *           // 选择颜色或者亮度的时候触发
     *           console.log(_event.color)
     *       },
     *       onselect:function(_color){
     *           // 最后保存颜色的时候触发
     *           console.log(_event.color)
     *       }
     *   });
     * [/code]
     * @class   {nej.ui._$$ColorPick}
     * @uses    {nej.ui._$$ColorPanel}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} color        颜色值
     * @config  {String} defaultColor 默认颜色值
     * 
     * [hr]
     * 颜色变化触发事件
     * @event  {onchange} 
     * @param  {Object}   颜色信息
     * @config {String}   color 颜色值
     * 
     * [hr]
     * 确定选择颜色触发事件
     * @event  {onselect} 
     * @param  {Object}   颜色信息
     * @config {String}   color 颜色值
     * 
     */
    _p._$$ColorPick = NEJ.C();
      _proColorPick = _p._$$ColorPick._$extend(_p._$$Abstract);
      _supColorPick = _p._$$ColorPick._$supro;
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proColorPick.__init = function(){
        this.__popt = {onchange:this.__onColorChange._$bind(this)};
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proColorPick.__reset = function(_options){
        this.__supReset(_options);
        this.__default = _options.defaultColor||'#fff';
        this.__popt.color = _options.color||this.__default;
        this.__panel = _p._$$ColorPanel._$allocate(this.__popt);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proColorPick.__destroy = function(){
        this.__supDestroy();
        this.__panel._$recycle();
        delete this.__panel;
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proColorPick.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proColorPick.__initNode = function(){
        this.__supInitNode();
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
     * @protected
     * @method {__onColorClear}
     * @return {Void}
     */
    _proColorPick.__onColorClear = function(){
        this.__panel._$setColor(this.__default);
    };
    /**
     * 颜色变化触发事件
     * @protected
     * @method {__onColorChange}
     * @param  {String} 颜色值
     * @return {Void}
     */
    _proColorPick.__onColorChange = function(_color){
        this.__ninput.value = _color.substr(1);
        _e._$setStyle(this.__npreview,'backgroundColor',_color);
        this._$dispatchEvent('onchange',{color:_color});
    };
    /**
     * 确定选择颜色
     * @protected
     * @method {__onColorSelect}
     * @return {Void}
     */
    _proColorPick.__onColorSelect = function(){
        var _color = '#'+this.__ninput.value.trim();
        if (!_x._$isColor(_color)) 
            return;
        this.__panel._$setColor(_color);
        _color = '#'+this.__ninput.value.trim();
        this._$dispatchEvent('onselect',{color:_color});
    };
    /**
     * 回车事件侦测
     * @protected
     * @method {__onEnterCheck}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proColorPick.__onEnterCheck = function(_event){
        if (_event.keyCode!=13)
            return;
        this.__onColorSelect();
    };
    /**
     * 设置颜色<br />
     * 脚本举例
     * [code]
     *   // 先把颜色转成rgb，然后转成hsl,在一个面板设置sh，在另外一个面板设置l
     *   _cp._$setColor('#ccc');
     * [/code]
     * @method {_$setColor}
     * @param  {String} 颜色值
     * @return {nej.ui._$$ColorPick}
     */
    _proColorPick._$setColor = function(_color){
        this.__panel._$setColor(_color);
        return this;
    };
};
NEJ.define('{lib}ui/colorpick/colorpick.js',
          ['{lib}ui/colorpick/colorpanel.js'],f);