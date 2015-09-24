/*
 * ------------------------------------------
 * 富文本模拟纯文本编辑器封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/editor/text */
NEJ.define([
    'base/klass',
    'base/element',
    'util/event',
    'util/template/jst',
    'text!./text.html'
],function(k,e,t,l,html,p,pro){
    // cache jst
    var sn = l._$add(html);

    /**
     * 富文本模拟纯文本编辑器
     *
     * @class     module:util/editor/text._$$Editor
     * @extends   module:util/event._$$EventTarget
     * @param     {Object}               arg0   - 可选配置参数
     * @property  {String|Node|Function} parent - 控件所在容器节点或者追加控件节点执行函数
     * @property  {String}               css    - 编辑内容样式
     * @property  {String}               height - 高度设置，
     */
    p._$$Editor = k._$klass();
    pro = p._$$Editor._$extend(t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__init
     * @return {Void}
     */
    pro.__init = function(options){
        this.__sopt = {};
        this.__fopt = {
            visible:!0,
            onload:this.__onIFrameLoaded._$bind(this)
        };
        this.__super(options);
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__reset
     * @return {Void}
     */
    pro.__reset = function(options){
        this.__super(options);
        this.__sopt.css = options.css||'';
        this.__fopt.parent = e._$get(options.parent);
        this.__body = e._$createXFrame(this.__fopt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__destroy
     * @return {Void}
     */
    pro.__destroy = function(){
        this.__super();
        this._$setContent('');
        delete this.__body;
    };
    /**
     * 取编辑器节点
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__getBody
     * @return {Void}
     */
    pro.__getBody = function(){
        try{
            return this.__body.contentWindow.document.body;
        }catch(ex){
            // ignore
        }
    };
    /**
     * 初始化输入区域
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__doInitTextArea
     * @return {Void}
     */
    pro.__onIFrameLoaded = function(){
        // init content
        var doc = this.__body.contentWindow.document;
        doc.open();
        doc.write(l._$get(sn,this.__sopt));
        doc.close();
        // init event
        this.__doInitDomEvent([[
            doc,'paste',
            this.__onContentPaste._$bind(this)
        ],[
            doc,'beforepaste',
            this.__onBeforeContentPaste._$bind(this)
        ],[
            doc,'drop',
            this.__onContentPaste._$bind(this)
        ],[
            doc,'keydown',
            this.__doCheckEnter._$bind(this)
        ]]);
    };
    /**
     * 检查回车
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__doCheckEnter
     * @return {Void}
     */
    pro.__doCheckEnter = function(event){
        if (event.keyCode!=13){
            return;
        }
        var options = {
            ctrl:event.ctrlKey,
            event:event
        };
        this._$dispatchEvent('onenter',options);
        if (options.newline&&!!options.ctrl){
            // TODO insert new line
        }
    };
    /**
     * 检查黏贴内容
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__doCheckContentPaste
     * @return {Void}
     */
    pro.__doCheckContentPaste = function(){
        this._$setContent(
            this._$getContent()
        );
    };
    /**
     * 拖拽内容事件
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__onContentDrop
     * @return {Void}
     */
    pro.__onContentDrop = function(event){
        
    };
    /**
     * 黏贴内容之前事件
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__onBeforeContentPaste
     * @return {Void}
     */
    pro.__onBeforeContentPaste = function(event){
        console.log(event);
    };
    /**
     * 黏贴内容事件
     *
     * @protected
     * @method module:util/editor/text._$$Editor#__onContentPaste
     * @return {Void}
     */
    pro.__onContentPaste = function(event){
        event.clipboardData.setData('text','aaaaaaaaaaaaaaa\nbbbbbbbbbbbbbbb');
        // TODO dump image
        console.log(event);
        // remove tags
        //window.setTimeout(
        //    this.__doCheckContentPaste._$bind(this),15
        //);
    };
    /**
     * 设置内容
     *
     * @method module:util/editor/text._$$Editor#_$setContent
     * @param  {String} content - 内容
     * @return {Void}
     */
    pro._$setContent = function(content){
        var body = this.__getBody();
        if (!body){
            // TODO cache content
            return;
        }
        if ('innerText' in body){
            body.innerText = content||'';
        }else{
            body.textContent = content||'';
        }
    };
    /**
     * 取内容
     *
     * @method module:util/editor/text._$$Editor#_$getContent
     * @return {String} 内容
     */
    pro._$getContent = function(){
        var body = this.__getBody();
        if (!!body){
            return body.innerText||body.textContent;
        }
        return '';
    };
    /**
     * 取滚动高度
     *
     * @method module:util/editor/text._$$Editor#_$getScrollHeight
     * @return {Number} 滚动高度
     */
    pro._$getScrollHeight = function(){
        var body = this.__getBody();
        if (!!body){
            return body.scrollHeight;
        }
        return 0;
    };
});


