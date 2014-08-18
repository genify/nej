/*
 * ------------------------------------------
 * 富媒体编辑器基类封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/config.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}ui/base.js',
    '{lib}util/editor/editor.js',
    '{lib}util/template/jst.js',
    '{lib}util/editor/area.js',
    '{lib}util/editor/toolbar.js'
],function(NEJ,_k,_c,_e,_v,_u,_i,_t0,_t1,_t2,_t3,_p,_o,_f,_r){
    var _seed_css,
        _seed_icmd,
        _seed_ifnt,
        _seed_iedt,
        _pro;
    /**
     * 富媒体编辑器基类封装
     *
     * @class   module:nej.ui._$$Editor 富媒体编辑器基类封装
     * @uses    {nej.ut._$$EditorArea}
     * @uses    {nej.ut._$$EditorToolbar}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数
     * @config  {Boolean}   focus    是否自动聚焦
     * @config  {String} content  文本内容
     *
     */
    _p._$$Editor = _k._$klass();
    _pro = _p._$$Editor._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__aopt = {};
        this.__topt = {};
        this.__super();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
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
        this.__aopt.focus = _options.focus||1;
        this.__editor = _t0._$$Editor._$allocate({
            area:_t2._$$EditorArea._$allocate(this.__aopt)
           ,toolbar:_t3._$$EditorToolbar._$allocate(this.__topt)
        });
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
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
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getChildren(this.__body);
        this.__aopt.parent = _list[1];
        this.__topt.list = _e._$getByClassName(_list[0],
                           'js-'+_t1._$getHtmlTemplateSeed());
    };
    /**
     * 获取按钮html代码
     * @protected
     * @method {__doGenCmdXhtml}
     * @param  {Object} 命令数据
     * @return {String} html代码
     */
    _pro.__doGenCmdXhtml = function(_data){
        return _t1._$getHtmlTemplate(_seed_icmd,_data);
    };
    /**
     * 获取字号选择html代码
     * @protected
     * @method {__doGenFontSizeXhtml}
     * @return {String} html代码
     */
    _pro.__doGenFontSizeXhtml = function(){
        return _t1._$getHtmlTemplate(_seed_ifnt,
               {cmd:'fontSize',txt:'标准',icn:'zfs'});
    };
    /**
     * 获取字体选择html代码
     * @protected
     * @method {__doGenFontNameXhtml}
     * @return {String} html代码
     */
    _pro.__doGenFontNameXhtml = function(){
        return _t1._$getHtmlTemplate(_seed_ifnt,
               {cmd:'fontName',txt:'Arial',icn:'zfm'});
    };
    /**
     * 获取编辑器html代码
     * @protected
     * @method {__doGenEditorXhtml}
     * @param  {Object} 命令数据
     * @return {Void}
     */
    _pro.__doGenEditorXhtml = function(_data){
        return _t1._$getHtmlTemplate(_seed_iedt,_data);
    };
    /**
     * 取编辑内容
     * @method {_$getContent}
     * @return {String} 内容
     */
    _pro._$getContent = function(){
        return this.__editor._$getContent();
    };
    /**
     * 取编辑内容里的图片id和url列表
     * @method {_$getContent}
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
     * @method {_$getTextContent}
     * @return {String} 内容
     */
    _pro._$getTextContent = function(){
        return this.__editor._$getTextContent();
    };
    /**
     * 设置编辑内容
     * @method {_$setContent}
     * @param  {String} 内容
     * @return {Void}
     */
    _pro._$setContent = function(_content){
        this.__editor._$setContent(_content);
    };
    /**
     * 注册命令实现
     * @method {_$registCommand}
     * @param  {Array|nej.ut._$$EditorCommand} 命令实现类构造
     * @return {Void}
     */
    _pro._$registCommand = function(_class){
        this.__editor._$registCommand(_class);
    };
    /**
     * 显示编辑器
     * @method {_$show}
     * @return {Void}
     */
    _pro._$show = function(){
        this.__body.style.display = '';
    };
    /**
     * 隐藏编辑器
     * @method {_$hide}
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
//        _row = 5;
//        for(var i=0;i<_row;i++)
//            for(var j=0;j<_col;j++)
//                _arr.push('.#<uispace> .z-x-'+i+j+'{background-position:-'+(80+26*j)+'px -'+(70+i*26)+'px;}');
        return _arr.join('');
    };
    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{width:500px;border:1px solid #ddd;text-align:center;}\
        .#<uispace> .zbg{background:url('+_c._$get('root')+'nej_editor.png?20131028) no-repeat 100px 100px;}\
        .#<uispace> .ztbar{height:30px;background-color:#eee;zoom:1;}\
        .#<uispace> .ztbar:after{display:block;clear:both;visibility:hidden;height:0;content:".";}\
        .#<uispace> .zitm{float:left;width:24px;height:24px;margin:3px 0;course:pointer;}\
        .#<uispace> .zitm:hover{background-position:0 0;}\
        .#<uispace> .zitm.js-selected{background-position:-30px 0;}\
        .#<uispace> .zitm .zicn{width:16px;height:16px;margin:4px auto 0;overflow:hidden;text-indent:100px;}\
        .#<uispace> .zitm .ztxt{display:none;}\
        .#<uispace> .zisp{float:left;width:10px;height:24px;margin:3px 0;background-position:-60px 0;overflow:hidden;}\
        .#<uispace> .zsel{float:left;position:relative;height:20px;overflow:hidden;line-height:20px;padding:0 5px;margin:4px;border:1px solid #C5C5C5;background:#fff;font-size:12px;text-align:left;cursor:pointer;}\
        .#<uispace> .zsel .zarw{position:absolute;top:0;right:0;width:18px;height:18px;background-position:0px -244px;}\
        .#<uispace> .zsel.zfs{width:60px;}\
        .#<uispace> .zsel.zfm{width:140px;}\
        .#<uispace> .zarea{height:200px;}\
        .#<uispace> .zarea iframe{width:100%;height:100%;}'+
        __doGenIconStyle()
    );
    // command list html
    _seed_icmd = _t1._$addHtmlTemplate('\
        {list xlist as x}\
        <div class="zitm zbg ${\'js-\'|seed}" data-command="${x.cmd}" title="${x.txt}">\
          <div class="zicn zbg ${x.icn}">&nbsp;</div>\
          <div class="ztxt">${x.txt}</div>\
        </div>\
        {/list}\
        {if defined("hr")&&!!hr}\
        <div class="zbg zisp">&nbsp;</div>\
        {/if}\
    ');
    // font-size and font-family select html
    _seed_ifnt = _t1._$addHtmlTemplate('\
        <div class="zsel ${icn} ${\'js-\'|seed}" data-command="${cmd}">\
          <span class="${\'js-t-\'|seed}">${txt}</span>\
          <span class="zarw zbg">&nbsp;</span>\
        </div>\
    ');
    // editor html
    _seed_iedt = _t1._$addHtmlTemplate('\
        <div class="'+_seed_css+'">\
          <div class="ztbar">${toolbar}</div>\
          <div class="zarea"></div>\
        </div>\
    ');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});