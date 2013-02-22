/*
 * ------------------------------------------
 * 盖层控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _g = _('nej.g'),
        _h = _('nej.h'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _v = _('nej.v'),
        _p = _('nej.ui'),
        _proMask,
        _supMask;
    if (!!_p._$$Mask) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('.#<uispace>{position:fixed;_position:absolute;z-index:100;top:0;bottom:0;left:0;right:0;width:100%;height:100%;background-image:url('+_g._$BLANK_IMAGE+');}');
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
    _p._$$Mask = NEJ.C();
      _proMask = _p._$$Mask._$extend(_p._$$Abstract);
      _supMask = _p._$$Mask._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proMask.__reset = function(_options){
        this.__supReset(_options);
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
    _proMask.__destroy = function(){
        this.__supDestroy();
        this.__body.innerHTML = '&nbsp;';
    };
    /**
     * 初始化外观
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proMask.__initXGui = function(){
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
     * @return {nej.ui._$$Mask}
     */
    _proMask._$show = function(){
        _h.__fullScreen(this.__body);
        _supMask._$show.apply(this,arguments);
        return this;
    };
};
NEJ.define('{lib}ui/mask/mask.js',
      ['{lib}ui/base.js'],f);