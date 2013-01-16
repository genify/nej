/*
 * ------------------------------------------
 * 范围裁剪控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _proResizer;
    if (!!_p._$$Resizer) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('\
        .#<uispace>-parent{position:relative;}\
        .#<uispace>{position:absolute;width:50px;height:50px;border:1px solid #aaa;cursor:move;$<user-select>:none;}\
        .#<uispace> .zpc{border:1px solid #aaa;}\
        .#<uispace> .zpt{position:absolute;width:5px;height:5px;font-size:1px;overflow:hidden;}\
        .#<uispace> .znt{top:-1px;left:-1px;width:100%;cursor:n-resize;}\
        .#<uispace> .znr{top:-1px;right:-1px;height:100%;cursor:e-resize;}\
        .#<uispace> .znb{bottom:-1px;left:-1px;width:100%;cursor:s-resize;}\
        .#<uispace> .znl{top:-1px;left:-1px;height:100%;cursor:w-resize;}\
        .#<uispace> .zntl{top:-1px;left:-1px;cursor:nw-resize;}\
        .#<uispace> .zntr{top:-1px;right:-1px;cursor:ne-resize;}\
        .#<uispace> .znbr{bottom:-1px;right:-1px;cursor:se-resize;}\
        .#<uispace> .znbl{bottom:-1px;left:-1px;cursor:sw-resize;}\
        ');
    // html code
    var _seed_point = _e._$addHtmlTemplate('\
        {list 1..8 as x}\
        <div class="zpt ${clazz[x-1]} js-rs-${x}">&nbsp;</div>\
        {/list}');
    var _seed_html
    /**
     * 范围裁剪控件封装
     * 
     * 
     * 
     * @class   {nej.ui._$$Range}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object}  可选配置参数，其他参数见nej.ut._$$Resize控件所示
     * 
     * 
     * [hr]
     * 大小开始变化触发事件
     * @event  {onresizestart}
     * @param  {Object} 事件信息
     * @config {}
     * 
     * [hr]
     * 大小变化过程触发事件
     * @event  {onresize}
     * 
     * [hr]
     * 大小变化结束触发事件
     * @event  {onresizeend}
     * 
     */
    _p._$$Resizer = NEJ.C();
      _proResizer = _p._$$Resizer._$extend(_p._$$Abstract);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proResizer.__init = function(){
        this.__ropt = {
            onresize:this._$dispatchEvent._$bind(this,'onresize'),
            onresizeend:this._$dispatchEvent._$bind(this,'onresizeend'),
            onresizestart:this._$dispatchEvent._$bind(this,'onresizestart')
        };
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proResizer.__reset = function(_options){
        this.__supReset(_options);
        _options = NEJ.X({},_options);
        _options = NEJ.X(_options,this.__ropt);
        _options.view = this.__parent;
        delete _options.clazz;
        this.__resize = _t._$$Resize._$allocate(_options);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proResizer.__destroy = function(){
        if (!!this.__resize)
            this.__resize = this.__resize._$recycle();
        this.__supDestroy();
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proResizer.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _proResizer.__initNodeTemplate = (function(){
        var _clazz = ['znt','znr','znb','znl','zpc zntl','zpc zntr','zpc znbr','zpc znbl'];
        return function(){
            _seed_html = _e._$addNodeTemplate(
                '<div class="'+_seed_css+'">'+
                   _e._$getHtmlTemplate(_seed_point,{clazz:_clazz})+
                '</div>'
            );
            this.__seed_html = _seed_html;
        };
    })();
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proResizer.__initNode = function(){
        this.__supInitNode();
        this.__ropt.body = this.__body;
    };
};
define('{lib}ui/resizer/resizer.js',
      ['{lib}ui/base.js'
      ,'{lib}util/resize/resize.js'],f);