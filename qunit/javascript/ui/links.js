/*
 * ------------------------------------------
 * 超链接执行命令封装实现文件
 * @version  1.0
 * @author   luzhongfang(luzhongfang@corp.netease.com)
 * ------------------------------------------
 */

define(['{lib}util/editor/command/card.js'
		,'{lib}util/editor/command/link.js'],
function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _p = _('nej.ut2.cmd'),
        _i = _('nej.ui.cmd');
    if (!!_p._$$Link ) return;
    /**
     * 超链接执行命令封装
     * @class   {nej.ut.cmd._$$Link } 超链接执行命令封装
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$Link2  = NEJ.C();
    var proto = _p._$$Link2._$extend(nej.ut.cmd._$$Link);

    /*
     * 命令名称
     * @type {String}
     */
    _p._$$Link2.command = 'link';
    /**
     * 链接错误提示
     * @param  {Object} type 错误类型
     * @return {Void}
     */
    proto.__onError = function(){
        this.__linkCard.__showErrorTips('请输入合法的链接地址（http://或https://）');
    };
    // /**
    //  * 显示卡片，一般子类重写
    //  * @protected
    //  * @method {__doShowCard}
    //  * @return {Void}
    //  */
    // proto.__doShowCard = function(){
    //     this.__fopt.name = this.__editor._$getSelectText();
    //     this.__linkCard = _i._$$LinkCard._$allocate({
    //         draggable: true,
    //         destroyable: true,
    //         maskclazz: 'm-mask',
    //         name: this.__fopt.name,
    //         clazz: 'm-layer m-layer-link',
    //         title: '添加超链接',
    //         onchange: this.__onChange._$bind(this),
    //         onErrorLink: this.__onError._$bind(this)
    //     });
    //     this.__linkCard._$show();
    //     this.__linkCard._$doFocus();
    // };
    
    // regist command implemention
    _p._$$Link2._$regist();
});