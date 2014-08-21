/*
 * ------------------------------------------
 * 字体字号选择卡片基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/editor/command/font */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'ui/layer/card.wrapper',
    'util/template/jst',
    'text!./font.css',
    'text!./font.html'
],function(NEJ,_k,_e,_v,_u,_i,_t0,_css,_html,_p,_o,_f,_r){
    var _pro,
        _seed_css = _e._$pushCSSText(_css),
        _seed_fnt = _t0._$addHtmlTemplate(_html);
    /**
     * 字体字号选择卡片基类
     *
     * @class   module:ui/editor/command/font._$$FontCard
     * @extends module:ui/layer/wrapper/card._$$CardWrapper
     * @param   {Object} arg0 - 可选配置参数
     */
    /**
     * 字号/字体选中回调函数
     *
     * @event  module:ui/editor/command/font._$$FontCard#onchange
     * @param  {String} font - 字号/字体
     *
     */
    _p._$$FontCard = _k._$klass();
    _pro = _p._$$FontCard._$extend(_i._$$CardWrapper);
    /**
     * 控件重置
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        if (_options.width!=null){
            _e._$setStyle(
                this.__body,'width',
                _options.width+'px'
            );
        }
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/editor/command/font._$$FontCard#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__flist;
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/editor/command/font._$$FontCard#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/editor/command/font._$$FontCard#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        _v._$addEvent(
            this.__body,'click',
            this.__onFontSelect._$bind(this)
        );
    };
    /**
     * 构建字体大小选择列表
     *
     * @protected
     * @method module:ui/editor/command/font._$$FontCard#__doGenFontListXhtml
     * @param  {Object} arg0 - 字体大小列表信息
     * @return {Void}
     */
    _pro.__doGenFontListXhtml = function(_data){
        return _t0._$getHtmlTemplate(_seed_fnt,_data);
    };
    /**
     * 字体大小选择事件
     *
     * @protected
     * @method module:ui/editor/command/font._$$FontCard#__onFontSelect
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onFontSelect = (function(){
        var _doFilter = function(_node){
            return !isNaN(parseInt(_e._$dataset(_node,'index')));
        };
        return function(_event){
            var _element = _v._$getElement(_event,_doFilter);
            if (!_element) return;
            var _index = parseInt(_e.
                _$dataset(_element,'index'));
            this._$dispatchEvent('onchange',
                this.constructor.list[_index]);
            this._$hide();
        };
    })();
    /**
     * 取字体字号提示文字
     *
     * @method module:ui/editor/command/font._$$FontCard._$getText
     * @param  {String} value - 字体/字号
     * @return {String} 字体/字号
     */
    _p._$$FontCard._$getText = function(_value){
        var _index = _u._$indexOf(this.list,
            function(_data){
                return (_data.value||_data.name)==_value;
            });
        return (this.list[_index]||_o).name;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});