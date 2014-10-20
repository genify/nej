/*
 * ------------------------------------------
 * 字体选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/editor/command/fontname */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'ui/editor/command/font',
    'util/template/tpl'
],function(NEJ,_k,_e,_i0,_t0,_p,_o,_f,_r){
    var _pro,
        _seed_html;
    /**
     * 字体选择控件
     *
     * @class   module:ui/editor/command/fontname._$$FontNameCard
     * @extends module:ui/editor/command/font._$$FontCard
     * @param   {Object} arg0 - 可选配置参数
     */
    /**
     * 字体选中回调函数
     *
     * @event module:ui/editor/command/fontname._$$FontNameCard#onselect
     * @param {String} arg0 - 字体
     *
     */
    _p._$$FontNameCard = _k._$klass();
    _pro = _p._$$FontNameCard._$extend(_i0._$$FontCard);
    /**
     * 字体选项列表
     *
     * @const {Array} module:ui/editor/command/fontname._$$FontNameCard.list
     */
    _p._$$FontNameCard.list =
      [{name:'宋体'}
      ,{name:'微软雅黑'}
      ,{name:'黑体'}
      ,{name:'楷体'}
      ,{name:'隶书'}
      ,{name:'幼圆'}
      ,{name:'Arial'}
      ,{name:'Arial Narrow'}
      ,{name:'Arial Black'}
      ,{name:'Comic Sans MS'}
      ,{name:'Courier'}
      ,{name:'System'}
      ,{name:'Verdana'}
      ,{name:'Times New Roman'}];
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/editor/command/fontname._$$FontNameCard#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__super();
        this.__seed_html = _seed_html;
    };
    /**
     * 动态构建控件节点模板
     *
     * @protected
     * @method module:ui/editor/command/fontname._$$FontNameCard#__initNodeTemplate
     * @return {Void}
     */
    _pro.__initNodeTemplate = function(){
        _seed_html = _t0._$addNodeTemplate(
                     '<div class="'+this.__seed_css+'">'
                     +this.__doGenFontListXhtml({
                         style:'font-family'
                        ,xlist:this.constructor.list
                      })+
                     '</div>');
        this.__seed_html = _seed_html;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});