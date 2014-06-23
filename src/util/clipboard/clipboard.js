/*
 * ------------------------------------------
 * 剪切板操作接口支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _x = _('nej.x');
    /*
     * 覆盖剪切操作功能按钮
     * @param  {Node}   按钮
     * @param  {String} 参数
     * @return {Void}
     */
    var _doCoverClipboard = function(_element,_vars,_options){
        // build holder
        var _box = _e._$wrapInline(_element),
            _height = _element.offsetHeight;
        _e._$style(_box,{
            left:'-1px',
            height:_height+1+'px',
            width:_element.offsetWidth+1+'px',
            top:Math.floor((_box.parentNode.offsetHeight-_height)/2)+'px'
        });
        // cover flash
        _e._$flash(NEJ.X({
            parent:_box,
            target:_element,
            width:'100%',height:'100%',
            src:_c._$get('clipboard.swf'),
            params:{wmode:'transparent',flashvars:_vars}
        },_options));
    };
    /**
     * 绑定复制操作，服务器放置剪切板操作Flash nej_clipboard.swf
     * 如果flash文件不在/res/下可以通过以下方式配置
     * [code]
     *   // 在引入define.js之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * [/code]
     * 使用举例
     * 页面结构：
     * [code type="html"]
     *   <!-- 复制按钮 -->
     *   <input id="copyBtn" type="button" value="复制"/>
     * [/code]
     * 脚本绑定复制功能：
     * [code]
     *   // 或者通过参数在绑定时输入要复制的内容
     *   nej.e._$bindCopyAction('copyBtn','text to clipboard');
     *   // 如果要复制的内容动态生成
     *   nej.e._$bindCopyAction('copyBtn',function(){
     *       // 此函数必须同步返回结果
     *       return 'text to clipboard'
     *   });
     * [/code]
     * @api    {nej.e._$bindCopyAction}
     * @param  {String|Node}     操作节点
     * @param  {String|Function} 要复制的内容，或者动态生成要复制的内容
     * @return {nej.e}
     */
    _e._$bindCopyAction = 
    _x._$bindCopyAction = function(_element,_content){
        _element = _e._$get(_element);
        if (!_element) return;
        // bind flash
        _doCoverClipboard(_element,'op=0',{
            onbeforecopy:function(){
                return _u._$isFunction(_content)?_content():(_content||'');
            }
        });
        return this;
    };
    /*
     * 绑定取剪切板内容操作，服务器放置剪切板操作Flash nej_clipboard.swf
     * 如果flash文件不在/res/下可以通过以下方式配置
     * [code]
     *   // 在引入define.js之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * [/code]
     * 使用举例
     * 页面结构：
     * [code type="html"]
     *   <!-- 粘贴按钮 -->
     *   <input id="pasteBtn" type="button" value="粘贴"/>
     * [/code]
     * 脚本绑定接收剪切板内容功能：
     * [code]
     *   // 绑定接收剪切板内容回调
     *   nej.e._$bindPasteAction('pasteBtn',function(_text){
     *       // _text is content in clipboard
     *       // TODO something
     *   });
     * [/code]
     * @param  {String|Node} 操作节点
     * @param  {Function}    用于接收剪切板数据的回调函数
     * @return {nej.e}
     */
//    _e._$bindPasteAction = function(_element,_callback){
//        _element = _e._$get(_element);
//        if (!_element) return;
//        // bind flash
//        _doCoverClipboard(_element,'op=1',{
//            onpaste:_callback||_f
//        });
//        return this;
//    };
    /**
     * 清空剪切板，服务器放置剪切板操作Flash nej_clipboard.swf
     * 如果flash文件不在/res/下可以通过以下方式配置
     * [code]
     *   // 在引入define.js之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * [/code]
     * 使用举例
     * 页面结构：
     * [code type="html"]
     *   <!-- 粘贴按钮 -->
     *   <input id="clearBtn" type="button" value="清空"/>
     * [/code]
     * 脚本绑定清空功能：
     * [code]
     *   // 绑定清空按钮功能
     *   nej.e._$bindClearAction('clearBtn');
     * [/code]
     * @api    {nej.e._$bindClearAction}
     * @param  {String|Node} 操作节点
     * @return {nej.e}
     */
    _e._$bindClearAction = 
    _x._$bindClearAction =  function(_element){
        _element = _e._$get(_element);
        if (!_element) return this;
        _doCoverClipboard(_element,'op=2');
        return this;
    };
    _x.isChange = !0;
};
NEJ.define(
    '{lib}util/clipboard/clipboard.js',[
    '{patch}config.js',
    '{lib}base/util.js',
    '{lib}base/event.js',
    '{lib}util/flash/flash.js'
],f);