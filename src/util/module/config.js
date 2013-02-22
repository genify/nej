/*
 * ------------------------------------------
 * 配置器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        p = NEJ.P('nej.ut'),
        __proConfiguration;
    if (!!p._$$Configuration) return;
    /**
     * 验证器对象
     * @class   {nej.ut._$$Configuration} 验证器对象
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String}       id         模块ID
     * @config  {String|Node} container 模块容器节点
     * 
     * [hr]
     * 
     * @event  {onpass} 验证通过回调函数
     * 
     * [hr]
     * 
     * @event  {onredirect} 模块重定向回调函数
     * 
     */
    p._$$Configuration = NEJ.C();
    __proConfiguration = p._$$Configuration._$extend(p._$$Event);
    /**
     * 初始化函数
     * @protected
     * @method {__init}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proConfiguration.__init = function(_options){
        this.__supInit();
        var _redirect = this._$dispatchEvent._$bind(this,'onredirect');
        this.__vopt = {onpass:this._$dispatchEvent._$bind(this,'onpass'),
                       onredirect:_redirect};
        this.__mopt = {onredirect:_redirect};
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {String}      id        验证器id
     * @config {String|Node} container 验证器父节点
     * @return {Void}
     */
    __proConfiguration.__reset = function(_options){
        this.__supReset(_options);
        this.__id = _options.id||'';
        this.__mopt.parent = _options.container;
    };
    /**
     * 控件销毁,子类重写此接口销毁验证器
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proConfiguration.__destroy = function(){
        this.__supDestroy();
        if (!!this.__module)
            this.__module = this.__module.constructor
                                ._$recycle(this.__module);
        if (!!this.__validator)
            this.__validator = this.__validator.constructor
                                   ._$recycle(this.__validator);
    };
    /**
     * 取验证器实例,验证器只创建一次
     * @method {_$getValidator}
     * @return {nej.ut._$$Validator} 验证器实例
     */
    __proConfiguration._$getValidator = function(){
        if (!this.__validator){
            this.__validator = this.__getValidator();
            if (!(this.__validator instanceof p._$$Validator))
                delete this.__validator;
        }
        return this.__validator;
    };
    /**
     * 取模块实例,模块只创建一次
     * @method {_$getModule}
     * @return {nej.ut._$$Module} 模块实例
     */
    __proConfiguration._$getModule = function(){
        if (!this.__module){
            this.__module = this.__getModule();
            if (!(this.__module instanceof p._$$Module))
                delete this.__module;
        }
        return this.__module;
    };
    /**
     * 取验证器实例,新建验证器
     * @protected
     * @method {__getValidator}
     * @return {nej.ut._$$Validator} 验证器实例
     */
    __proConfiguration.__getValidator = function(){
        return p._$$Validator._$allocate(this.__vopt);
    };
    /**
     * 取模块实例,新建模块
     * @protected
     * @method {__getModule}
     * @return {nej.ut._$$Module} 模块实例
     */
    __proConfiguration.__getModule = f;
};
NEJ.define('{lib}util/module/config.js',['{lib}util/event.js'],f);