/*
 * ------------------------------------------
 * 剪切板操作接口支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/config.js',
    '{lib}base/util.js',
    '{lib}base/element.js',
    '{lib}util/flash/flash.js'
],function(NEJ,_c,_u,_e,_t0,_p,_o,_f,_r){
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
        _t0._$flash(NEJ.X({
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
     * ```javascript
     *   // 在引入define.js之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * ```
     * 使用举例
     * 页面结构：
     * ```html
     *   <!-- 复制按钮 -->
     *   <input id="copyBtn" type="button" value="复制"/>
     * ```
     * 脚本绑定复制功能：
     * ```javascript
     *   // 或者通过参数在绑定时输入要复制的内容
     *   nej.e._$bindCopyAction('copyBtn','text to clipboard');
     *   // 如果要复制的内容动态生成
     *   nej.e._$bindCopyAction('copyBtn',function(){
     *       // 此函数必须同步返回结果
     *       return 'text to clipboard'
     *   });
     * ```
     * @api    {nej.e._$bindCopyAction}
     * @param  {String|Node}     操作节点
     * @param  {String|Function} 要复制的内容，或者动态生成要复制的内容
     * @return {Void}
     */
    _p._$bindCopyAction = function(_element,_content){
        _element = _e._$get(_element);
        if (!_element) return;
        // bind flash
        _doCoverClipboard(_element,'op=0',{
            onbeforecopy:function(){
                return _u._$isFunction(_content)?_content():(_content||'');
            }
        });
    };
    /*
     * 绑定取剪切板内容操作，服务器放置剪切板操作Flash nej_clipboard.swf
     * 如果flash文件不在/res/下可以通过以下方式配置
     * ```javascript
     *   // 在引入define.js之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * ```
     * 使用举例
     * 页面结构：
     * ```html
     *   <!-- 粘贴按钮 -->
     *   <input id="pasteBtn" type="button" value="粘贴"/>
     * ```
     * 脚本绑定接收剪切板内容功能：
     * ```javascript
     *   // 绑定接收剪切板内容回调
     *   nej.e._$bindPasteAction('pasteBtn',function(_text){
     *       // _text is content in clipboard
     *       // TODO something
     *   });
     * ```
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
     * ```javascript
     *   // 在引入define.js之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * ```
     * 使用举例
     * 页面结构：
     * ```html
     *   <!-- 粘贴按钮 -->
     *   <input id="clearBtn" type="button" value="清空"/>
     * ```
     * 脚本绑定清空功能：
     * ```javascript
     *   // 绑定清空按钮功能
     *   nej.e._$bindClearAction('clearBtn');
     * ```
     * @api    {nej.e._$bindClearAction}
     * @param  {String|Node} 操作节点
     * @return {Void}
     */
    _p._$bindClearAction =  function(_element){
        _element = _e._$get(_element);
        if (!_element) return;
        _doCoverClipboard(_element,'op=2');
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});