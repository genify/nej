/*
 * ------------------------------------------
 * 剪切板操作接口支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/clipboard/clipboard */
NEJ.define([
    'base/global',
    'base/config',
    'base/util',
    'base/element',
    'util/flash/flash'
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
        _t0._$flash(_u._$merge({
            parent:_box,
            target:_element,
            width:'100%',height:'100%',
            src:_c._$get('clipboard.swf'),
            params:{wmode:'transparent',flashvars:_vars}
        },_options));
    };
    /**
     * 绑定复制操作，服务器放置剪切板操作Flash nej_clipboard.swf，
     * 如果flash文件不在/res/下可以通过以下方式配置
     *
     * 脚本举例
     * ```javascript
     *   // 在引入define之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * ```
     * 
     * 页面结构
     * ```html
     *   <!-- 复制按钮 -->
     *   <input id="copyBtn" type="button" value="复制"/>
     * ```
     * 
     * 脚本绑定复制功能
     * ```javascript
     * NEJ.define([
     *     'util/clipboard/clipboard'
     * ],function(_e){
     *     // 或者通过参数在绑定时输入要复制的内容
     *     _e._$copy('copyBtn','text to clipboard');
     *     // 如果要复制的内容动态生成
     *     _e._$copy('copyBtn',function(){
     *         // 此函数必须同步返回结果
     *         return 'text to clipboard'
     *     });
     * });
     * ```
     * 
     * @method module:util/clipboard/clipboard._$copy
     * @param  {String|Node}     arg0 - 操作节点
     * @param  {String|Function} arg1 - 要复制的内容，或者动态生成要复制的内容
     * @return {Void}
     */
    _p._$copy = function(_element,_content){
        _element = _e._$get(_element);
        if (!_element) return;
        // bind flash
        _doCoverClipboard(_element,'op=0',{
            onbeforecopy:function(){
                return _u._$isFunction(_content)?_content():(_content||'');
            }
        });
    };
    /**
     * 清空剪切板，服务器放置剪切板操作Flash nej_clipboard.swf，
     * 如果flash文件不在/res/下可以通过以下方式配置
     *
     * 脚本举例
     * ```javascript
     *   // 在引入define之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * ```
     * 
     * 页面结构
     * ```html
     *   <!-- 粘贴按钮 -->
     *   <input id="clearBtn" type="button" value="清空"/>
     * ```
     * 
     * 脚本绑定清空功能
     * ```javascript
     * NEJ.define([
     *     'util/clipboard/clipboard'
     * ],function(_e){
     *     // 绑定清空按钮功能
     *     _e._$clear('clearBtn');
     * });
     * ```
     * 
     * @method module:util/clipboard/clipboard._$clear
     * @param  {String|Node} arg0 - 操作节点
     * @return {Void}
     */
    _p._$clear =  function(_element){
        _element = _e._$get(_element);
        if (!_element) return;
        _doCoverClipboard(_element,'op=2');
    };

    if (CMPT){
        var _x = NEJ.P('nej.e');
        _x._$bindCopyAction = _p._$copy;
        _x._$bindClearAction = _p._$clear;
    }

    return _p;
});