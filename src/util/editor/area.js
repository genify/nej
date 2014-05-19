/*
 * ------------------------------------------
 * 富媒体编辑器输入区封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _v = _('nej.v'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _h = _('nej.h'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$EditorArea) return;
    /**
     * 富媒体编辑器输入区封装
     * @class   {nej.ut._$$EditorArea} 富媒体编辑器输入区封装
     * @extends {nej.ut._$$Event}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     * @config  {Node|String|Function} parent  父节点或者编辑器加入父节点执行函数
     * @config  {String}               style   编辑器初始样式
     * @config  {Boolean}              focus   是否自动聚焦
     * @config  {String}               content 文本内容
     * 
     * [hr]
     * 
     * @event  {onselectionchange}
     */
    _p._$$EditorArea = NEJ.C();
    _pro = _p._$$EditorArea._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__fopt = {
            visible:!0,
            onload:this.__onIFrameLoaded._$bind(this)
        };
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _cnttpl = '<head><base href="#<BSUL>"/><style>html,body{margin:0;padding:0;border:0;cursor:text;font-size:14px;font-family:Arial;word-wrap:break-word;}#<UDCS></style></head><body contenteditable="true"></body>';
        return function(_options){
            this.__supReset(_options);
            this.__focus = !!_options.focus;
            this.__content = _cnttpl
                .replace('#<UDCS>',_options.style||'')
                .replace('#<BSUL>',_options.base||location.href);
            this.__initcnt = _options.content||'';
            this.__fopt.parent = 
                _e._$get(_options.parent)||document.body;
            this.__iframe = _e._$createXFrame(this.__fopt);
        };
    })();
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        _h.__clearRange(this._$getDocument());
        delete this.__content;
        delete this.__fopt.parent;
        delete this.__initcnt;
        this.__iframe = _e._$remove(this.__iframe);
    };
    /**
     * 保存选中状态
     * @protected
     * @method {__doSaveRange}
     * @return {Void}
     */
    _pro.__doSaveRange = function(){
        _h.__saveRange(this._$getDocument());
    };
    /**
     * iframe载入完成触发事件
     * @protected
     * @method {__onIFrameLoaded}
     * @return {Void}
     */
    _pro.__onIFrameLoaded = function(_iframe){
        var _document = this._$getDocument();
        _document.open();
        _document.write(this.__content);
        if (location.hostname!=document.domain)
            _document.domain = document.domain;
        _document.close(); // <- will trigger iframe onload
        this.__doInitDomEvent([[
            _document,'click',
            this.__onDocumentClick._$bind(this)
        ],[
            _document,'selectionchange',
            this.__onSelectionChange._$bind(this)
        ],[
            _document,'beforedeactivate',
            this.__doSaveRange._$bind(this)
        ],[
            _document,'keydown',
            this.__onInputCheck._$bind(this)
        ],[
            _document,'mouseup',
            this.__onInputCheck._$bind(this)
        ],[
            _document,'paste',
            this.__onInputCheck._$bind(this)
        ],[
            _document,'drop',
            this.__onInputCheck._$bind(this)
        ]]);
        // init content and focus
        if (!!this.__initcnt){
            this._$setContent(this.__initcnt);
        }
        if (this.__focus){
            this._$focus();
            delete this.__focus;
        }
    };
    /**
     * 文档点击事件
     * @protected
     * @method {__onDocumentClick}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onDocumentClick = function(_event){
        _v._$dispatchEvent(document,'click');
    };
    /**
     * 选中内容变化触发事件
     * @protected
     * @method {__onSelectionChange}
     * @return {Void}
     */
    _pro.__onSelectionChange = function(){
        // TODO something
        this._$dispatchEvent('onselectionchange');
    };
    /**
     * 输入事件
     * @return {[type]} [description]
     */
    _pro.__onInputCheck = function(){
        if (!!this.__timer){
            window.clearTimeout(this.__timer);
        }
        this.__timer = window.setTimeout(
            this.__doCompareContent._$bind(this),100
        );
    };
    /**
     * 比较富文本的内容
     * @return {[type]} [description]
     */
    _pro.__doCompareContent = function(){
        var _document = this._$getDocument();
        if (!_document) return;
        var _content = _document.body.innerHTML;
        if (this.__initcnt!=_content){
            this.__initcnt = _content;
            this._$dispatchEvent('oninput',{
                cont:this._$getContent(),
                txt:this._$getTextContent()
            });
        }
    };
    /**
     * 聚焦编辑器
     * @method {_$focus}
     * @param  {Number} 光标位置，默认为0，0-末尾、1-起始、2-不变
     * @return {nej.ut._$$EditorArea}
     */
    _pro._$focus = function(_cursor){
        var _document = this._$getDocument();
        if (!_document) return this;
        _h.__focusRange(_document.body);
        _h.__moveCursorPosition(
            _document.body,
            parseInt(_cursor)||0
        );
        this.__onSelectionChange();
        return this;
    };
    /**
     * 取编辑器文档对象
     * @method {_$getDocument}
     * @return {Node} 文档对象
     */
    _pro._$getDocument = function(){
        return this.__iframe.contentWindow.document;
    };
    /**
     * 取编辑内容
     * @method {_$getContent}
     * @return {String} 内容
     */
    _pro._$getContent = function(_filter){
        var _document = this._$getDocument();
        _html = _h.__filterContent(!_document?'':_document.body.innerHTML);
        if(!_filter){
            _html = _h.__filterContentStyle(_html);
        }
        return !_h.__filterWordContent?_html:_h.__filterWordContent(_html);
    };
    /**
     * 取纯文本的编辑内容
     * @method {_$getTextContent}
     * @return {String} 内容
     */
    _pro._$getTextContent = function(){
        var _document = this._$getDocument(),
            _text = _document.body.innerText||
                    _document.body.textContent;
        return !_document?'':_text;
    };
    /**
     * 设置内容
     * @method {_$setContent}
     * @param  {String} 编辑内容
     * @return {nej.ut._$$EditorArea}
     */
    _pro._$setContent = function(_content){
        var _document = this._$getDocument();
        if (!_document) return this;
        _document.body.innerHTML = _content;
        this.__onInputCheck();
        return this;
    };
    /**
     * 执行编辑命令
     * @method {_$execCommand}
     * @param  {String} 命令名称
     * @param  {String} 命令值
     * @param  {String} 是否通过style的方式来改变样式，比如superscript命令
     * @return {nej.ut._$$EditorArea}
     */
    _pro._$execCommand = function(_command,_value,_css){
        var _document = this._$getDocument();
        if (!_document) return this;
        this._$focus(2);
        _h.__execCommand(_document,'styleWithCSS',false);
        _h.__execCommand(_document,_command,_value);
        this._$focus(2);
        this.__onInputCheck();
        return this;
    };
    /**
     * 查询命令的状态
     * @method {_$queryCommand}
     * @param  {String}   命令名称
     * @param  {String}   查询类型，State/Enabled/Value
     * @return {Variable} 查询结果
     */
    _pro._$queryCommand = function(_command,_type){
        var _document = this._$getDocument();
        return !_document ? null
               :_document['queryCommand'+_type](_command);
    };
    /**
     * 获取选中内容的文本
     * @method {_$getSelectText}
     * @return {String} 文本内容
     */
    _pro._$getSelectText = function(){
        this._$focus(2);
        return _h.__getSelectText(this._$getDocument());
    };
    /**
     * 获取选择内容的HTML
     * @method {_$getSelectHtml}
     * @return  {String} HTML代码
     */
    _pro._$getSelectHtml = function(){
        this._$focus(2);
        return _h.__getSelectHtml(this._$getDocument());
    };
    /**
     * 取编辑区域容器位置大小信息
     * @return {Object} 位置大小信息
     * [ntb]
     *  scrollTop     | 滚动垂直偏移
     *  scrollLeft    | 滚动水平偏移
     *  clientWidth   | 页面可视宽度
     *  clientHeight  | 页面可视高度
     *  scrollWidth   | 页面滚动宽度
     *  scrollHeight  | 页面滚动高度
     * [/ntb]
     */
    _pro._$getAreaBox = function(){
        var _document = this._$getDocument();
        return !_document?null:_e._$getPageBox(_document);
    };
};
NEJ.define(
    '{lib}util/editor/area.js',[
    '{lib}util/event.js',
    '{patch}editor.js'
],f);