/*
 * ------------------------------------------
 * 验证器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        p = NEJ.P('nej.ut'),
        __proValidator;
    if (!!p._$$Validator) return;
    /**
     * 验证器对象
     * @class   {nej.ut._$$Validator} 验证器对象
     * @extends {nej.ut._$$Event}
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * 
     * [hr]
     * 
     * @event {onpass} 验证通过回调函数
     * 
     * [hr]
     * 
     * @event {onredirect} 模块重定向回调函数
     */
    p._$$Validator = NEJ.C();
    __proValidator = p._$$Validator._$extend(p._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proValidator.__reset = function(_options){
        _options = _options||o;
        this._$setEvent('onpass',_options.onpass||f);
        this._$setEvent('onredirect',_options.onredirect||f);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proValidator.__destroy = function(){
        this._$clearEvent();
    };
    /**
     * 输入验证,子类重写具体验证逻辑
     * @method {_$validate}
     * @param  {Object} 输入参数
     * @return {nej.ut._$$Validator}
     */
    __proValidator._$validate = function(_options){
        this._$dispatchEvent('onpass',_options);
        return this;
    };
};
NEJ.define('{lib}util/module/validator.js',['{lib}util/event.js'],f);