/*
 * ------------------------------------------
 * 盖层控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/constant.js',
    '{lib}base/element.js',
    '{lib}base/util.js',
    '{lib}ui/base.js'
],function(NEJ,_k,_g,_e,_u,_u0,_p,_o,_f,_r){
    var _pro,
        _seed_css;
    /**
     * 盖层控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <style type="text/css">
     *       .box{position:relative;}
     *   </style>
     *   <div id="mask-box" class="box"></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _mask = _p._$$Mask._$allocate({
     *       parent:document.body,
     *       content:'<div style="width:100px;height:100px;margin:0 auto;margin-top:150px;">搞一点盖层的内容</div>'
     *   });
     * [/code]
     * @class   {nej.ui._$$Mask} 盖层控件
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node} content 内容节点或者HTML代码
     *
     */
    _p._$$Mask = _k._$klass();
    _pro = _p._$$Mask._$extend(_u0._$$Abstract);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        var _content = _options.content||'&nbsp;';
        _u._$isString(_content)
        ? this.__body.innerHTML = _content
        : this.__body.appendChild(_content);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__body.innerHTML = '&nbsp;';
    };
    /**
     * 初始化外观
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 显示盖层<br />
     * [code]
     *   // 先隐藏盖层
     *   _mask._$hide();
     *   // 显示盖层
     *   _mask._$show();
     * [/code]
     * @method {_$show}
     * @return {Void}
     */
    _pro._$show = function(){
        _e._$fullScreen(this.__body);
        _supMask._$show.apply(this,arguments);
    };
    // ui css text
    _seed_css = _e._$pushCSSText('.#<uispace>{position:fixed;_position:absolute;z-index:100;top:0;bottom:0;left:0;right:0;width:100%;height:100%;background-image:url('+_g._$BLANK_IMAGE+');}');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});