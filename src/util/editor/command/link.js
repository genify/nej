/*
 * ------------------------------------------
 * 超链接执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/editor/command/card.js',
    '{lib}ui/editor/command/link.js'
],function(NEJ,_k,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 超链接执行命令封装
     * @class   {nej.ut.cmd._$$Link} 超链接执行命令封装
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    _p._$$Link = _k._$klass();
    _pro = _p._$$Link._$extend(_t0._$$CardCommand);
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
    _pro.__onChange = function(_link){
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
    _pro.__doShowCard = function(){
        this.__fopt.name = this.__editor._$getSelectText();
        this.__linkCard = this.__onShowCard();
        this.__linkCard._$show();
        this.__linkCard._$doFocus();
    };

    /**
     * 子类实现显示具体卡片
     * @protected
     * @method {__onShowCard}
     * @return {Void}
     */
    _pro.__onShowCard = function(){
        return _i0._$$LinkCard._$allocate({
            draggable: true,
            destroyable: true,
            maskclazz: 'm-mask',
            name: this.__fopt.name,
            title: '添加超链接',
            onchange: this.__onChange._$bind(this),
            onErrorLink: this.__onError._$bind(this)
        });
    };
    /**
     * 链接错误提示
     * @param  {Object} type 错误类型
     * @return {Void}
     */
    _pro.__onError = function(){
        this.__linkCard.__showErrorTips('请输入合法的链接地址（http://或https://）');
    };

    // regist command implemention
    _p._$$Link._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});