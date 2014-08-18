/*
 * ------------------------------------------
 * 字体字号选择卡片基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}ui/layer/card.wrapper.js',
    '{lib}util/template/jst.js'
],function(NEJ,_k,_e,_v,_u,_i,_t0,_p,_o,_f,_r){
    var _pro,
        _seed_css,
        _seed_fnt;
    /**
     * 字体字号选择卡片基类
     *
     * @class   module:nej.ui.cmd._$$FontCard 字体字号选择卡片基类
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} 可选配置参数
     *
     * [hr]
     *
     * @event  {onchange} 字号/字体选中回调函数
     * @param  {String}   字号/字体
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
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__flist;
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
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
     * @protected
     * @method {__doGenFontListXhtml}
     * @param  {Object} 字体大小列表信息
     * @return {Void}
     */
    _pro.__doGenFontListXhtml = function(_data){
        return _t0._$getHtmlTemplate(_seed_fnt,_data);
    };
    /**
     * 字体大小选择事件
     * @protected
     * @method {__onFontSelect}
     * @param  {Event} 事件对象
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
    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{border:1px solid #9FAC87;font-size:12px;text-align:left;}\
        .#<uispace> .zitm{display:block;position:relative;margin:1px;outline:none;padding:2px 0 2px 8px;border:1px solid #ddd;color:#000;background-color:#fff;text-decoration:none;}\
        .#<uispace> .zitm:hover{background-color:#e5e5e1;text-decoration:none;}\
        .#<uispace> .zitm .ztip{position:absolute;top:2px;right:5px;font-size:10px;}\
    ');
    // ui font size list
    _seed_fnt = _t0._$addHtmlTemplate('\
        {list xlist as x}\
        <a class="zitm" hidefocus="true" style="${style}:${x.style|default:x.name};" data-index="${x_index}">\
          ${x.name}\
          {if !!x.tip}<span class="ztip">${x.tip}</span>{/if}\
        </a>\
        {/list}\
    ');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});