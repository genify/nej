/*
 * ------------------------------------------
 * 富媒体编辑器字号选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _p = _('nej.ui.cmd'),
        _pro,_sup,_seed_html;
    if (!!_p._$$FontSizeCard) return;
    /**
     * 字号选择控件
     * @class   {nej.ui.cmd._$$FontSizeCard} 字号选择控件
     * @extends {nej.ui.cmd._$$FontCard}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * 
     * [hr]
     * 
     * @event {onselect} 字号选中回调函数
     * @param {String}   字号
     * 
     */
    _p._$$FontSizeCard = NEJ.C();
    _pro = _p._$$FontSizeCard._$extend(_p._$$FontCard);
    _sup = _p._$$FontSizeCard._$supro;
    /**
     * 字号选项列表
     * @type Array
     */
    _p._$$FontSizeCard.list = 
      [{name:'小',tip:'12px',style:'x-small',value:1}
      ,{name:'标准',tip:'14px',style:'small',value:2}
      ,{name:'大',tip:'16px',style:'medium',value:3}
      ,{name:'特大',tip:'18px',style:'large',value:4}
      ,{name:'极大',tip:'24px',style:'x-large',value:5}];
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        _sup.__initXGui.apply(this,arguments);
        this.__seed_html = _seed_html;
    };
    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _pro.__initNodeTemplate = function(){
        _seed_html = _e._$addNodeTemplate(
                     '<div class="'+this.__seed_css+'">'
                     +this.__doGenFontListXhtml({
                         style:'font-size'
                        ,xlist:this.constructor.list
                      })+
                     '</div>');
        this.__seed_html = _seed_html;
    };
};
NEJ.define(
    '{lib}ui/editor/command/fontsize.js',[
    '{lib}ui/editor/command/font.js'
],f);