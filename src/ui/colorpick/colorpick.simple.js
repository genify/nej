/*
 * ------------------------------------------
 * 颜色选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}ui/base.js',
    '{lib}util/template/tpl.js',
    '{lib}util/template/jst.js'
],function(NEJ,_k,_e,_v,_u,_t,_t0,_p,_o,_f,_r){
    var _pro,
        _seed_css,
        _seed_html,
        _seed_color;
    /**
     * 颜色选择控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id='colorpanel-box'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _cp = _p._$$SimpleColorPick._$allocate({
     *       parent:'colorpanel-box',
     *       defaultColor:'默认rgb颜色',
     *       onselect:function(_color){
     *           // 最后保存颜色的时候触发
     *       }
     *   });
     * [/code]
     * @class   {nej.ui._$$SimpleColorPick}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} defaultColor 默认颜色值
     *
     * [hr]
     * 确定选择颜色触发事件
     * @event  {onselect}
     * @param  {Object} 颜色信息
     * @config {String} color 颜色值
     *
     */
    _p._$$SimpleColorPick = _k._$klass();
    _pro = _p._$$SimpleColorPick._$extend(_u._$$Abstract);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__default = _options.defaultColor||'#ffffff';
        this.__doInitDomEvent([[
            this.__nprv.parentNode,'click',
            this.__onClearColor._$bind(this)
        ],[
            this.__nbox,'click',
            this.__onSelectColor._$bind(this)
        ],[
            this.__nbox,'mouseover',
            this.__onPreviewColor._$bind(this)
        ]]);
        this.__doPreviewColor(this.__default);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__default;
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        // 0 - color preview
        // 1 - color list box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__nprv = _list[0];
        this.__nbox = _list[1];
        this.__doRenderColorList();
    };
    /**
     * 绘制可选颜色列表
     * @return {Void}
     */
    _pro.__doRenderColorList = (function(){
        var _xlist = [
            {t:'黑色',v:'#000000'},{t:'褐色',v:'#993300'},{t:'橄榄色',v:'#333300'},{t:'深绿',v:'#003300'},{t:'深青',v:'#003366'},{t:'深蓝',v:'#000080'},{t:'靛蓝',v:'#333399'},{t:'灰色-80%',v:'#333333'},
            {t:'深红',v:'#800000'},{t:'橙色',v:'#ff6600'},{t:'深黄',v:'#808000'},{t:'绿色',v:'#008000'},{t:'青色',v:'#008080'},{t:'蓝色',v:'#0000ff'},{t:'蓝-灰',v:'#666699'},{t:'灰色-50%',v:'#808080'},
            {t:'红色',v:'#ff0000'},{t:'浅橙色',v:'#ff9900'},{t:'酸橙色',v:'#99cc00'},{t:'海绿',v:'#339966'},{t:'水绿色',v:'#33cccc'},{t:'浅蓝',v:'#3366ff'},{t:'紫罗兰',v:'#800080'},{t:'灰色-40%',v:'#999999'},
            {t:'粉红',v:'#ff00ff'},{t:'金色',v:'#ffcc00'},{t:'黄色',v:'#ffff00'},{t:'鲜绿',v:'#00ff00'},{t:'青绿',v:'#00ffff'},{t:'天蓝',v:'#00ccff'},{t:'梅红',v:'#993366'},{t:'灰色-25%',v:'#c0c0c0'},
            {t:'玫瑰红',v:'#ff99cc'},{t:'茶色',v:'#ffcc99'},{t:'浅黄',v:'#ffff99'},{t:'浅绿',v:'#ccffcc'},{t:'浅青绿',v:'#ccffff'},{t:'淡蓝',v:'#99ccff'},{t:'淡紫',v:'#cc99ff'},{t:'白色',v:'#ffffff'}
        ];
        return function(){
            _e._$renderHtmlTemplate(
                this.__nbox,_seed_color,{
                    xlist:_xlist
                }
            );
        };
    })();
    /**
     * 清除颜色
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__onClearColor = function(_event){
        _v._$stop(_event);
        this.__doChangeColor(this.__default);
    };
    /**
     * 颜色选择事件
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__onSelectColor = function(_event){
        var _element = _v._$getElement(_event,'d:value');
        if (!_element) return;
        _v._$stop(_event);
        this.__doChangeColor(
            _e._$dataset(_element,'value')
        );
    };
    /**
     * 预览颜色
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__onPreviewColor = function(_event){
        var _element = _v._$getElement(_event,'d:value');
        if (!_element) return;
        this.__doPreviewColor(
            _e._$dataset(_element,'value')
        );
    };
    /**
     * 预览颜色
     * @param  {String} 颜色值
     * @return {Void}
     */
    _pro.__doPreviewColor = function(_color){
        _e._$setStyle(this.__nprv,'backgroundColor',_color);
    };
    /**
     * 修改颜色
     * @param  {String} 颜色值
     * @return {Void}
     */
    _pro.__doChangeColor = function(_color){
        this._$dispatchEvent('onselect',{
            color:_color
        });
    };

    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{text-align:left;}\
        .#<uispace> .zdft{display:block;padding:3px 1px 3px 5px;margin:3px;cursor:pointer;}\
        .#<uispace> .zdft:hover{padding:2px 0 2px 4px;background:#ffeec2;border:1px solid #000080;text-decoration:none;}\
        .#<uispace> .zprv{display:block;width:28px;height:11px;overflow:hidden;border:1px solid #aca899;}\
        .#<uispace> .zbox{width:152px;margin:0 5px;overflow:hidden;}\
        .#<uispace> .zbox .zitm{display:block;float:left;width:11px;height:11px;overflow:hidden;margin:3px;border:1px solid #aca899;cursor:pointer;}\
        .#<uispace> .zbox2{width:220px;margin-left:9px;border-width:1px 0 0 1px;border-color:#000;border-style:solid;}\
        .#<uispace> .zbox2 .zitm2{width:10px;height:10px;margin:-1px 0 0 -1px;border-color:#000;}'
    );
    // ui html code
    _seed_html = _t._$addNodeTemplate('\
        <div class="'+_seed_css+'">\
          <a class="zdft" title="去除颜色" href="#">\
            <span class="zprv j-flag">&nbsp;</span>\
          </a>\
          <div class="zbox j-flag"></div>\
        </div>'
    );
    // color list
    _seed_color = _t0._$addHtmlTemplate('\
        {list xlist as x}\
        <a class="zitm" title="${x.t}" style="background-color:${x.v}" data-value="${x.v}" href="#">&nbsp;</a>\
        {/list}'
    );

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});