/*
 * ------------------------------------------
 * 颜色选择卡片实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _i = _('nej.ui'),
        _p = _('nej.ui.cmd'),
        _proColorCard,
        _supColorCard;
    // ui css seed
    if (!!_p._$$ColorCard) return;
    var _seed_css = _e._$pushCSSText('.#<uispace>{width:160px;padding:10px 5px 5px;border:1px solid #9FAC87;}');
    /**
     * 颜色选择卡片
     * @class   {nej.ui.cmd._$$ColorCard} 颜色选择卡片
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} color 颜色值
     * 
     * [hr]
     * 
     * @event  {onchange} 颜色选中回调函数
     * @param  {String}   颜色值
     * 
     */
    _p._$$ColorCard = NEJ.C();
      _proColorCard = _p._$$ColorCard._$extend(_i._$$CardWrapper);
      _supColorCard = _p._$$ColorCard._$supro;
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proColorCard.__init = function(){
        this.__copt = {
            clazz:_seed_css
           ,onselect:this.__onColorSelect._$bind(this)
        };
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proColorCard.__reset = function(_options){
        this.__supReset(_options);
        this.__copt.color = _options.color;
        this.__copt['default'] = _options['default'];
        this.__copt.parent = this.__layer._$getBody();
        this.__colorpick = _i._$$ColorPick._$allocate(this.__copt);
    };
    /**
     * 控件回收
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proColorCard.__destroy = function(){
        if (!!this.__colorpick){
            this.__colorpick._$recycle();
            delete this.__colorpick;
        }
        delete this.__copt.parent;
        this.__supDestroy();
    };
    /**
     * 颜色选择回调
     * @protected
     * @method {__onColorSelect}
     * @param  {String} 颜色值
     * @return {Void}
     */
    _proColorCard.__onColorSelect = function(_color){
        this._$dispatchEvent('onchange',_color);
        this._$hide();
    };
};
define('{lib}ui/editor/command/color.js',
      ['{lib}ui/layer/card.wrapper.js'
      ,'{lib}ui/colorpick/colorpick.js'],f);