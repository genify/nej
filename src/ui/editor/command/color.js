/*
 * ------------------------------------------
 * 颜色选择卡片实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}ui/layer/card.wrapper.js',
    '{lib}ui/colorpick/colorpick.js'
],function(NEJ,_k,_e,_u,_u0,_p,_o,_f,_r){
    var _pro,
        _seed_css;
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
    _p._$$ColorCard = _k._$klass();
    _pro = _p._$$ColorCard._$extend(_u._$$CardWrapper);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__copt = {
            onselect:this.__onColorSelect._$bind(this)
        };
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
        this.__copt.color = _options.color;
        this.__copt.parent = this.__layer._$getBody();
        this.__copt.defaultColor = _options.defaultColor;
        this.__colorpick = this.__getColorPicker();
    };
    /**
     * 控件回收
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__colorpick){
            this.__colorpick._$recycle();
            delete this.__colorpick;
        }
        delete this.__copt.parent;
        this.__super();
    };
    /**
     * 取取色器实例
     * @return {Void}
     */
    _pro.__getColorPicker = function(){
        this.__copt.clazz = _seed_css;
        return _u0._$$ColorPick._$allocate(this.__copt);
    };
    /**
     * 颜色选择回调
     * @protected
     * @method {__onColorSelect}
     * @param  {String} 颜色值
     * @return {Void}
     */
    _pro.__onColorSelect = function(_event){
        this._$dispatchEvent('onchange',_event.color);
        this._$hide();
    };

    // ui css seed
    _seed_css = _e._$pushCSSText('.#<uispace>{width:160px;padding:10px 5px 5px;border:1px solid #9FAC87;}');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});