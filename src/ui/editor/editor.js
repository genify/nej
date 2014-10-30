/*
 * ------------------------------------------
 * 富媒体编辑器基类封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/editor/editor */
NEJ.define([
    'base/global',
    'base/klass',
    'base/config',
    'base/element',
    'base/event',
    'base/util',
    'ui/base',
    'util/editor/editor',
    'util/template/jst',
    'util/editor/area',
    'util/editor/toolbar',
    'util/template/tpl',
    'text!./editor.css',
    'text!./editor.html'
],function(NEJ,_k,_c,_e,_v,_u,_i,_t0,_t1,_t2,_t3,_t4,_css,_html,_p,_o,_f,_r){
    var _seed_css,
        _seed_ui = _t4._$parseUITemplate(_html),
        _seed_icmd = _seed_ui['seedIcmd'],
        _seed_ifnt = _seed_ui['seedIfnt'],
        _seed_iedt = _seed_ui['seedIedt'],
        _pro;
    /**
     * 富媒体编辑器基类封装
     *
     * @class     module:ui/editor/editor._$$Editor
     * @uses      module:util/editor/area._$$EditorArea
     * @uses      module:util/editor/toolbar._$$EditorToolbar
     * @extends   module:ui/base._$$Abstract
     * @param     {Object}  arg0    - 可选配置参数
     * @property  {Boolean} focus   - 是否自动聚焦
     * @property  {String}  content - 文本内容
     *
     */
    _p._$$Editor = _k._$klass();
    _pro = _p._$$Editor._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__aopt = {};
        this.__topt = {};
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        _u._$merge(this.__aopt,_options,function(_value,_key){
            if(_key.search(/^on/)<0){
                return !0;
            }
        });
        this.__aopt.style = _options.style;
        this.__aopt.content = _options.content;
        this.__aopt.focus = _options.focus!==!1;
        this.__editor = _t0._$$Editor._$allocate({
            area:_t2._$$EditorArea._$allocate(this.__aopt)
           ,toolbar:_t3._$$EditorToolbar._$allocate(this.__topt)
        });
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        // recycle editor first
        this.__editor._$recycle();
        this.__super();
        delete this.__editor;
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getChildren(this.__body);
        this.__aopt.parent = _list[1];
        this.__topt.list = _e._$getByClassName(_list[0],
                           'js-'+_t1._$seed());
    };
    /**
     * 获取按钮html代码
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__doGenCmdXhtml
     * @param  {Object} arg0 - 命令数据
     * @return {String} html代码
     */
    _pro.__doGenCmdXhtml = function(_data){
        return _t1._$get(_seed_icmd,_data);
    };
    /**
     * 获取字号选择html代码
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__doGenFontSizeXhtml
     * @return {String} html代码
     */
    _pro.__doGenFontSizeXhtml = function(){
        return _t1._$get(_seed_ifnt,
               {cmd:'fontSize',txt:'标准',icn:'zfs'});
    };
    /**
     * 获取字体选择html代码
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__doGenFontNameXhtml
     * @return {String} html代码
     */
    _pro.__doGenFontNameXhtml = function(){
        return _t1._$get(_seed_ifnt,
               {cmd:'fontName',txt:'Arial',icn:'zfm'});
    };
    /**
     * 获取编辑器html代码
     *
     * @protected
     * @method module:ui/editor/editor._$$Editor#__doGenEditorXhtml
     * @param  {Object} arg0 - 命令数据
     * @return {Void}
     */
    _pro.__doGenEditorXhtml = function(_data){
        return _t1._$get(_seed_iedt,_data);
    };
    /**
     * 取编辑内容
     *
     * @method module:ui/editor/editor._$$Editor#_$getContent
     * @return {String} 内容
     */
    _pro._$getContent = function(){
        return this.__editor._$getContent();
    };
    /**
     * 取编辑内容里的图片id和url列表
     *
     * @method module:ui/editor/editor._$$Editor#_$getContent
     * @return {Array} 编辑内中的图片ID+@+图片地址的列表，根据ID是否为0判断是否需要放入列表
     */
    _pro._$getPhotoIdsAndUrls = (function(){
        var _filter = function(_item){
            if(_item.id!=0)
                this.__idsAndUrls.push(_item.id+'@'+_item.src);
        }
        return function(){
            this.__idsAndUrls = [];
            var _photoIdsAndUrls = [],
                _content = this.__editor._$getContent(),
                _div = document.createElement('div');
            _div.innerHTML = _content;
            var _document = _e._$get(_div),
                _list = _document.getElementsByTagName('img');
            _u._$forEach(_list,_filter,this);
            var _idsAndUrlsLength = this.__idsAndUrls.length;
            for(var i = 0; i < _idsAndUrlsLength; i++)
                _photoIdsAndUrls.push(this.__idsAndUrls[i]);
            return _photoIdsAndUrls;
        }
    })();
    /**
     * 取纯文本编辑内容
     * @method module:ui/editor/editor._$$Editor#_$getTextContent
     * @return {String} 内容
     */
    _pro._$getTextContent = function(){
        return this.__editor._$getTextContent();
    };
    /**
     * 设置编辑内容
     * @method module:ui/editor/editor._$$Editor#_$setContent
     * @param  {String} arg0 - 内容
     * @return {Void}
     */
    _pro._$setContent = function(_content){
        this.__editor._$setContent(_content);
    };
    /**
     * 注册命令实现
     * @method module:ui/editor/editor._$$Editor#_$registCommand
     * @param  {Array|nej.ut._$$EditorCommand} arg0 - 命令实现类构造
     * @return {Void}
     */
    _pro._$registCommand = function(_class){
        this.__editor._$registCommand(_class);
    };
    /**
     * 显示编辑器
     * @method module:ui/editor/editor._$$Editor#_$show
     * @return {Void}
     */
    _pro._$show = function(){
        this.__body.style.display = '';
    };
    /**
     * 隐藏编辑器
     * @method module:ui/editor/editor._$$Editor#_$hide
     * @return {Void}
     */
    _pro._$hide = function(){
        this.__body.style.display = 'none';
    };
    /*
     * 获取图标样式代码
     * @return {String} 图标样式
     */
    var __doGenIconStyle = function(){
        var _arr=[],_row=20,_col=3;
        for(var i=0;i<_row;i++)
            for(var j=0;j<_col;j++)
                _arr.push('.#<uispace> .z-i-'+i+j+'{background-position:-'+(16*j)+'px -'+(40+i*16)+'px;}');
        return _arr.join('');
    };
    // ui css text
    _seed_css = _e._$pushCSSText(_css + __doGenIconStyle(),{root:_c._$get('root')});

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});