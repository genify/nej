/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proAbstractModule;
    if (!!_p._$$AbstractModule) return;
    /**
     * 项目模块基类对象
     * @class   {nej.ut._$$AbstractModule}
     * @extends {nej.ut._$$Module}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$AbstractModule = NEJ.C();
      _proAbstractModule = _p._$$AbstractModule._$extend(_p._$$Module);
    /**
     * 显示模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onShow}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proAbstractModule.__onShow = function(_options){
        var _parent = _e._$get((_options.data||_o).parent);
        if (!!_parent&&!!this.__body) 
            _parent.appendChild(this.__body);
        this.__supOnShow(_options);
        this.__onRefresh(_options);
    };
    /**
     * 隐藏模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onHide}
     * @return {Void}
     */
    _proAbstractModule.__onHide = function(){
        this.__supOnHide();
        _e._$removeByEC(this.__body);
    };
};
define('{lib}util/dispatcher/module.base.js'
     ,['{lib}util/dispatcher/module.2.js'],f);