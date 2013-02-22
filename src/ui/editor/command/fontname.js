/*
 * ------------------------------------------
 * 字体选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _p = _('nej.ui.cmd'),
        _proFontNameCard,
        _supFontNameCard;
    if (!!_p._$$FontNameCard) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('.#<uispace>{width:150px;font-size:16px;}');
    // ui html code
    var _seed_html;
    /**
     * 字体选择控件
     * @class   {nej.ui.cmd._$$FontNameCard} 字体选择控件
     * @extends {nej.ui.cmd._$$FontCard}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * 
     * [hr]
     * 
     * @event {onselect} 字体选中回调函数
     * @param {String}   字体
     * 
     */
    _p._$$FontNameCard = NEJ.C();
      _proFontNameCard = _p._$$FontNameCard._$extend(_p._$$FontCard);
      _supFontNameCard = _p._$$FontNameCard._$supro;
    /**
     * 字体选项列表
     * @type Array
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
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _proFontNameCard.__initNodeTemplate = function(){
        _seed_html = _e._$addNodeTemplate(
                     '<div class="'+_seed_css+'">'
                     +this.__doGenFontListXhtml({
                         style:'font-family'
                        ,xlist:this.constructor.list
                      })+
                     '</div>');
        this.__seed_html = _seed_html;
    };
};
NEJ.define('{lib}ui/editor/command/fontname.js',
      ['{lib}ui/editor/command/font.js'],f);