/*
 * ------------------------------------------
 * 富媒体编辑器字号选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}util/template/tpl.js',
    '{lib}ui/editor/command/font.js'
],function(NEJ,_k,_e,_t0,_u,_p,_o,_f,_r){
    var _pro,
        _seed_html;
    /**
     * 字号选择控件
     * @class   {nej.ui.cmd._$$FontSizeCard} 字号选择控件
     * @extends {nej.ui.cmd._$$FontCard}
     * @param   {Object} 可选配置参数
     *
     * [hr]
     *
     * @event {onselect} 字号选中回调函数
     * @param {String}   字号
     *
     */
    _p._$$FontSizeCard = _k._$klass();
    _pro = _p._$$FontSizeCard._$extend(_u._$$FontCard);
    /**
     * 字号选项列表
     * @type Array
     */
    _p._$$FontSizeCard.list =
      [{name:'小',style:'x-small',value:1}
      ,{name:'标准',style:'small',value:2}
      ,{name:'大',style:'medium',value:3}
      ,{name:'特大',style:'large',value:4}
      ,{name:'极大',style:'x-large',value:5}];
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__super();
        this.__seed_html = _seed_html;
    };
    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _pro.__initNodeTemplate = function(){
        _seed_html = _t0._$addNodeTemplate(
                     '<div class="'+this.__seed_css+'">'
                     +this.__doGenFontListXhtml({
                         style:'font-size'
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