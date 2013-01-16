/*
 * ------------------------------------------
 * 字体字号选择卡片基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _i = _('nej.ui'),
        _p = _('nej.ui.cmd'),
        _proFontCard,
        _supFontCard;
    if (!!_p._$$FontCard) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('\
        .#<uispace>{border:1px solid #9FAC87;font-size:12px;text-align:left;}\
        .#<uispace> .zitm{display:block;position:relative;margin:1px;outline:none;padding:2px 0 2px 8px;border:1px solid #ddd;color:#000;background-color:#fff;text-decoration:none;}\
        .#<uispace> .zitm:hover{background-color:#e5e5e1;text-decoration:none;}\
        .#<uispace> .zitm .ztip{position:absolute;top:2px;right:5px;font-size:10px;}');
    // ui font size list
    var _seed_fnt = _e._$addHtmlTemplate('\
        {list xlist as x}\
        <a class="zitm" href="#" hidefocus="true" style="${style}:${x.style|default:x.name};" data-index="${x_index}">\
          ${x.name}\
          {if !!x.tip}<span class="ztip">${x.tip}</span>{/if}\
        </a>\
        {/list}');
    /**
     * 字体字号选择卡片基类
     * @class   {nej.ui.cmd._$$FontCard} 字体字号选择卡片基类
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * 
     * [hr]
     * 
     * @event  {onchange} 字号/字体选中回调函数
     * @param  {String}   字号/字体
     * 
     */
    _p._$$FontCard = NEJ.C();
      _proFontCard = _p._$$FontCard._$extend(_i._$$CardWrapper);
      _supFontCard = _p._$$FontCard._$supro;
    /**
     * 取字体字号提示文字
     * @static
     * @method {_$getText}
     * @return {String} 字体/字号
     */
    _p._$$FontCard._$getText = function(_value){
        var _index = _u._$indexOf(this.list,
            function(_data){
                return (_data.value||_data.name)==_value;
            });
        return (this.list[_index]||_o).name;
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proFontCard.__destroy = function(){
        this.__supDestroy();
        delete this.__flist;
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proFontCard.__initXGui = function(){
        this.__seed_css  = _seed_css;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proFontCard.__initNode = function(){
        this.__supInitNode();
        _v._$addEvent(this.__body,'click',
                      this.__onFontSelect._$bind(this));
    };
    /**
     * 构建字体大小选择列表
     * @protected
     * @method {__doGenFontListXhtml}
     * @param  {Object} 字体大小列表信息
     * @return {Void}
     */
    _proFontCard.__doGenFontListXhtml = function(_data){
        return _e._$getHtmlTemplate(_seed_fnt,_data);
    };
    /**
     * 字体大小选择事件
     * @protected
     * @method {__onFontSelect}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proFontCard.__onFontSelect = (function(){
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
};
define('{lib}ui/editor/command/font.js',
      ['{lib}ui/layer/card.wrapper.js'],f);