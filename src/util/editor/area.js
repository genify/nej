/*
 * ------------------------------------------
 * 富媒体编辑器输入区封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/editor/area */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    '{platform}editor.js',
    'util/event'
],function(NEJ,_k,_e,_v,_u,_h,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 富媒体编辑器输入区封装
     *
     * @class     module:util/editor/area._$$EditorArea
     * @extends   module:util/event._$$EventTarget
     * @param     {Object} options - 可选配置参数
     * @property  {Node|String|Function} parent  - 父节点或者编辑器加入父节点执行函数
     * @property  {String}               style   - 编辑器初始样式
     * @property  {Boolean}              focus   - 是否自动聚焦
     * @property  {String}               content - 文本内容
     */
    /**
     * 光标改变事件
     *
     * @event  module:util/editor/area._$$EditorArea#onselectionchange
     */
    _p._$$EditorArea = _k._$klass();
    _pro = _p._$$EditorArea._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__fopt = {
            visible:!0,
            onload:this.__onIFrameLoaded._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _cnttpl = '<head><base href="#<BSUL>"/><style>html,body{margin:0;padding:0;border:0;cursor:text;font-size:14px;font-family:Arial;word-wrap:break-word;height:100%;} html{overflow:hidden;}body{overflow:auto;}#<UDCS></style></head><body contenteditable="true"></body>';
        return function(_options){
            this.__super(_options);
            this.__focus = _options.focus;
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
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        _h.__clearRange(this._$getDocument());
        delete this.__content;
        delete this.__fopt.parent;
        delete this.__initcnt;
        this.__iframe = _e._$remove(this.__iframe);
    };
    /**
     * 保存选中状态
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__doSaveRange
     * @return {Void}
     */
    _pro.__doSaveRange = function(){
        _h.__saveRange(this._$getDocument());
    };
    /**
     * iframe载入完成触发事件
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__onIFrameLoaded
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
        if (!!this.__focus){
            this._$focus();
            delete this.__focus;
        }
    };
    /**
     * 文档点击事件
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__onDocumentClick
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDocumentClick = function(_event){
        _v._$dispatchEvent(document,'click');
    };
    /**
     * 选中内容变化触发事件
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__onSelectionChange
     * @return {Void}
     */
    _pro.__onSelectionChange = function(){
        // TODO something
        this._$dispatchEvent('onselectionchange');
    };
    /**
     * 输入事件
     *
     * @protected
     * @method  module:util/editor/area._$$EditorArea#__onInputCheck
     * @return {Void}
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
     *
     * @protected
     * @method  module:util/editor/area._$$EditorArea#__doCompareContent
     * @return {Void}
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
     * 过滤所有style和class标签
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__doRemoveStyle
     * @param  {String} arg0 - 原始富文本内容
     * @return {String}        过滤后的富文本内容
     */
    _pro.__doRemoveStyle = (function(){
        var _reg0 = /style="[^"]*"/gi,
            _reg1 = /style='[^']*'/gi,
            _reg2 = /style=[^>\s]*/gi,
            _reg3 = /class="[^"]*"/gi,
            _reg4 = /class='[^']*'/gi,
            _reg5 = /class=[^>\s]*/gi;
        return function(_html){
            return _html.replace(_reg0,'').replace(_reg1,'').replace(_reg2,'').replace(_reg3,'').replace(_reg4,'').replace(_reg5,'');
        };
    })();
    /**
     * 过滤所有style和class标签
     *
     * @protected
     * @method module:util/editor/area._$$EditorArea#__doRemoveId
     * @param  {String} arg0 - 原始富文本内容
     * @return {String}        过滤后的富文本内容
     */
    _pro.__doRemoveId = (function(){
        var _reg0 = /id="[^"]*"/gi,
            _reg1 = /id='[^']*'/gi,
            _reg2 = /id=[^>\s]*/gi;
        return function(_html){
            return _html.replace(_reg0,'').replace(_reg1,'').replace(_reg2,'');
        };
    })();
    /**
     * 聚焦编辑器
     *
     * @method module:util/editor/area._$$EditorArea#_$focus
     * @param  {Number} arg0 - 光标位置，默认为0，0-末尾、1-起始、2-不变
     * @return {Void}
     */
    _pro._$focus = function(_cursor){
        var _document = this._$getDocument();
        if (!_document) return;
        _h.__focusRange(_document.body);
        _h.__moveCursorPosition(
            _document.body,
            parseInt(_cursor)||0
        );
        this.__onSelectionChange();
    };
    /**
     * 取编辑器文档对象
     *
     * @method module:util/editor/area._$$EditorArea#_$getDocument
     * @return {Node} 文档对象
     */
    _pro._$getDocument = function(){
        return this.__iframe.contentWindow.document;
    };
    /**
     * 取编辑内容
     *
     * @param  {Boolean|Number} arg0 - 是否只保留background-color,font-size,color样式
     * @param  {Boolean|Number|Object}  默认过滤所有style，如果是对象，keepStyle表示不过滤style，noId表示过滤id
     * @method module:util/editor/area._$$EditorArea#_$getContent
     * @return {String} 内容
     */
    _pro._$getContent = function(_options){
        var _document = this._$getDocument(),
            _noId,_keepStyle;
        _html = _h.__filterContent(!_document?'':_document.body.innerHTML);
        if (_u._$isObject(_options)){
            _keepStyle = _options.keepStyle||false;
            _noId   = _options.noId;
        }
        if (!_keepStyle){
            _html = _h.__filterContentStyle(_html);
        }
        if (!!_noId){
            _html = this.__doRemoveId(_html);
        }
        return !_h.__filterWordContent?_html:_h.__filterWordContent(_html);
    };
    /**
     * 取纯文本的编辑内容
     *
     * @method module:util/editor/area._$$EditorArea#_$getTextContent
     * @return {String} 内容
     */
    _pro._$getTextContent = function(){
        var _document = this._$getDocument(),
            _text = _document.body.innerText||
                    _document.body.textContent;
        return !_document?'':_text;
    };
    /**
     * 过滤style和class标签
     *
     * @method module:util/editor/area._$$EditorArea#_$setContentNoStyle
     * @return {Void}
     */
    _pro._$setContentNoStyle = function(){
        var _node = this._$getSelectNode();
        if(!_node) return;
        var _document = this._$getDocument(),
            _outer = _node.outerHTML;
        var _html = !_document?'':_document.body.outerHTML;
        _html = _html.replace(_outer,this.__doRemoveStyle(_outer));
        _html = _h.__filterContent(_html);
        var _content = !_h.__filterWordContent?_html:_h.__filterWordContent(_html);
        this._$setContent(_content);
    };
    /**
     * 设置内容
     *
     * @method module:util/editor/area._$$EditorArea#_$setContent
     * @param  {String} arg0 - 编辑内容
     * @return {Void}
     */
    _pro._$setContent = function(_content){
        var _document = this._$getDocument();
        if (!_document) return;
        _document.body.innerHTML = _content;
        this.__onInputCheck();
    };
    /**
     * 执行编辑命令
     *
     * @method module:util/editor/area._$$EditorArea#_$execCommand
     * @param  {String} arg0 - 命令名称
     * @param  {String} arg1 - 命令值
     * @param  {String} arg2 - 是否通过style的方式来改变样式，比如superscript命令
     * @return {Void}
     */
    _pro._$execCommand = function(_command,_value,_css){
        var _document = this._$getDocument();
        if (!_document) return;
        this._$focus(2);
        _h.__execCommand(_document,'styleWithCSS',false);
        _h.__execCommand(_document,_command,_value);
        this._$focus(2);
        this.__onInputCheck();
    };
    /**
     * 查询命令的状态
     *
     * @method module:util/editor/area._$$EditorArea#_$queryCommand
     * @param  {String} arg0 -   命令名称
     * @param  {String} arg1 -   查询类型，State/Enabled/Value
     * @return {Variable} 查询结果
     */
    _pro._$queryCommand = function(_command,_type){
        var _document = this._$getDocument();
        return !_document ? null
               :_document['queryCommand'+_type](_command);
    };
    /**
     * 获取选中内容的文本
     *
     * @method module:util/editor/area._$$EditorArea#_$getSelectText
     * @return {String} 文本内容
     */
    _pro._$getSelectText = function(){
        this._$focus(2);
        return _h.__getSelectText(this._$getDocument());
    };
    /**
     * 获取选择内容的HTML
     *
     * @method module:util/editor/area._$$EditorArea#_$getSelectHtml
     * @return  {String} HTML代码
     */
    _pro._$getSelectHtml = function(){
        this._$focus(2);
        return _h.__getSelectHtml(this._$getDocument());
    };
    /**
     * 获取选择内容的父节点
     *
     * @method module:util/editor/area._$$EditorArea#_$getSelectHtml
     * @return {Node} 父节点
     */
    _pro._$getSelectNode = function(){
        this._$focus(2);
        return _h.__getSelectNode(this._$getDocument());
    };
    /**
     * 取编辑区域容器位置大小信息
     *
     * @return {Object} 位置大小信息
     * |     属性         |       含义          |
     * |     :---         |       :---          |
     * |     scrollTop    |       滚动垂直偏移  |
     * |     scrollLeft   |       滚动水平偏移  |
     * |     clientWidth  |       页面可视宽度  |
     * |     clientHeight |       页面可视高度  |
     * |     scrollWidth  |       页面滚动宽度  |
     * |     scrollHeight |       页面滚动高度  |
     */
    _pro._$getAreaBox = function(){
        var _document = this._$getDocument();
        return !_document?null:_e._$getPageBox(_document);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});