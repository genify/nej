/*
 * ------------------------------------------
 * 模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _p = NEJ.P('nej.ut'),
        _proModule,
        _supModule;
    if (!!_p._$$Module) return;
    /**
     * 模块基类对象
     * @class   {nej.ut._$$Module}模块基类对象
     * @extends {nej.ut._$$Event}
     * @param  {Object}          可选配置参数，已处理参数列表如下所示
     *                           umi  [String] - 当前模块的统一模块标识符
     */
    _p._$$Module = NEJ.C();
      _proModule = _p._$$Module._$extend(_p._$$Event);
      _supModule = _p._$$Module._$supro;
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proModule.__init = function(){
        this.__supInit();
        this._$batEvent({
             onshow:this.__onShow._$bind(this)
            ,onhide:this.__onHide._$bind(this)
            ,onapply:this.__onApply._$bind(this)
            ,onrefresh:this.__onRefresh._$bind(this)
            ,onmessage:this.__onMessage._$bind(this)
            ,onbeforehide:this.__onBeforeHide._$bind(this)
        });
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proModule.__reset = function(_options){
        this.__supReset(_options);
        this.__umi = _options.umi||'';
    };
    /**
     * 阻止事件
     * @protected
     * @method {__stop}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proModule.__stop = function(_event){
        if (!!_event) _event.stopped = !0;
    };
    /**
     * 显示模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onShow}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proModule.__onShow = _f;
    /**
     * 隐藏模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onHide}
     * @return {Void}
     */
    _proModule.__onHide = _f;
    /**
     * 应用私有模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onApply}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proModule.__onApply = _f;
    /**
     * 刷新模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onRefresh}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proModule.__onRefresh = _f;
    /**
     * 接受到消息触发事件，子类实现具体逻辑
     * @protected
     * @method {__onMessage}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proModule.__onMessage = _f;
    /**
     * 模块退出前触发事件，通过阻止输入的事件做退出验证，子类实现具体逻辑
     * @protected
     * @method {__onBeforeHide}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proModule.__onBeforeHide = _f;
    /**
     * 取模块对外开放的数据信息，依赖此模块的子模块可以访问到此信息，子类实现具体逻辑
     * @method {_$getExportData}
     * @return {Object} 对外开放的数据信息
     */
    _proModule._$getExportData = _f;
};
define('{lib}util/dispatcher/v1/module.js'
     ,['{lib}util/event.js'],f);