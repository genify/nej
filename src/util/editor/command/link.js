/*
 * ------------------------------------------
 * 超链接执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _p = _('nej.ut.cmd'),
        _i = _('nej.ui.cmd'),
        _proLink,
        _supLink;
    if (!!_p._$$Link) return;
    /**
     * 超链接执行命令封装
     * @class   {nej.ut.cmd._$$Link} 超链接执行命令封装
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$Link = NEJ.C();
    _proLink = _p._$$Link._$extend(_p._$$CardCommand);
    _supLink = _p._$$Link._$supro;
    /*
     * 命令名称
     * @type {String}
     */
    _p._$$Link.command = 'link';
    
    /**
     * 卡片内容变化回调，子类实现具体业务逻辑
     * @protected
     * @method {__onChange}
     * @param  {Object} _link 链接地址
     * @return {Void}
     */
    _proLink.__onChange = function(_link){
        if(!_link)
            return;
        var _text = (_link.name != '') ? _link.name : _link.href;
        this.__editor._$execCommand('inserthtml','<a target="_blank" href="'
                        + _link.href + '">'+ _text +'</a>');
        this.__editor._$focus();
    };
    
    /**
     * 显示卡片，一般子类重写
     * @protected
     * @method {__doShowCard}
     * @return {Void}
     */
    _proLink.__doShowCard = function(){
        this.__fopt.name = this.__editor._$getSelectText();
        this.__linkCard = this.__onShowCard();
        this.__linkCard._$doFocus();
    };
    
    /**
     * 子类实现显示具体卡片
     * @protected
     * @method {__onShowCard}
     * @return {Void}
     */
    _proLink.__onShowCard = _f;
    
    // regist command implemention
    _p._$$Link._$regist();
};
NEJ.define('{lib}util/editor/command/link.js',
      ['{lib}util/editor/command/card.js'
      ,'{lib}ui/editor/command/link.js'],f);