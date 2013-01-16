/*
 * ------------------------------------------
 * 通用模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        p = NEJ.P('nej.ut'),
        __proModule,
        __proModuleCP;
    if (!!p._$$Module) return;
    /**
     * 模块对象基类
     * @class   {nej.ut._$$Module} 模块对象基类
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node} parent 模块所在容器节点
     * 
     * [hr]
     * 
     * @event  {onredirect} 模块重定向回调函数
     */
    p._$$Module = NEJ.C();
    __proModule = p._$$Module._$extend(p._$$Event);
    /**
     * 模块初始化
     * @protected
     * @method {__init}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proModule.__init = function(_options){
        this.__supInit();
        this.__buildModule(_options);
        this._$setEvent('onbeforeexit',this.__onBeforeExit._$bind(this));
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proModule.__reset = function(_options){
        this.__supReset(_options);
        this.__parent = e._$get(_options.parent);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proModule.__destroy = function(){
        this.__supDestroy();
        e._$removeByEC(this.__body);
    };
    /**
     * 显示模块
     * @method {_$show}
     * @param  {Object} 可选配置参数
     * @return {nej.ut._$$Module}
     */
    __proModule._$show = function(_options){
        _options = _options||o;
        this.__query = _options.__QUERY__||'';
        this.__referrer = _options.__REFER__||'';
        if (!this.__parent||
            !this.__body) return this;
        this.__onBeforeShow(_options);
        this.__doModuleShow(_options);
        this.__onAfterShow(_options);
        return this;
    };
    /**
     * 隐藏模块
     * @method {_$hide}
     * @return {nej.ut._$$Module}
     */
    __proModule._$hide = function(){
        this.__onBeforeHide();
        this.__doModuleHide();
        this.__onAfterHide();
        return this;
    };
    /**
     * 取模块的查询串
     * @method {_$query}
     * @return {String} 块的查询串
     */
    __proModule._$query = function(){
        return this.__query;
    };
    /**
     * 模块构建，主要构建模块节点及属性
     * @protected
     * @method {__buildModule}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proModule.__buildModule = f;
    /**
     * 是否允许直接退出,子类重写该方法控制模块离开逻辑
     * @protected
     * @method {__onBeforeExit}
     * @param  {Object}  下个模块输入信息
     * @return {Boolean} 是否允许直接退出
     */
    __proModule.__onBeforeExit = function(_options){
        return !0;
    };
    /**
     * 模块显示之前
     * @protected
     * @method {__onBeforeShow}
     * @return {Void}
     */
    __proModule.__onBeforeShow = f;
    /**
     * 执行显示逻辑，子类可重写显示逻辑
     * @protected
     * @method {__doModuleShow}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proModule.__doModuleShow = function(_options){
        if (this.__body.parentNode!=this.__parent)
            this.__parent.appendChild(this.__body);
        if (this.__body.style.display=='none')
            this.__body.style.display = '';
    };
    /**
     * 模块显示之后处理事件
     * @protected
     * @method {__onAfterShow}
     * @return {Void}
     */
    __proModule.__onAfterShow = f;
    /**
     * 模块隐藏之前
     * @protected
     * @method {__onBeforeHide}
     * @return {Void}
     */
    __proModule.__onBeforeHide = f;
    /**
     * 模块隐藏逻辑，子类可重写隐藏逻辑
     * @protected
     * @method {__doModuleHide}
     * @return {Void}
     */
    __proModule.__doModuleHide = function(){
        e._$removeByEC(this.__body);
    };
    /**
     * 模块隐藏之后处理事件
     * @protected
     * @method {__onAfterHide}
     * @return {Void}
     */
    __proModule.__onAfterHide = f;
    /**
     * 级联父模块对象基类
     * @class   {nej.ut._$$ModuleCP} 级联父模块对象基类
     * @extends {nej.ut._$$Module}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    p._$$ModuleCP = NEJ.C();
    __proModuleCP = p._$$ModuleCP._$extend(p._$$Module);
    /**
     * 显示模块
     * @method {_$show}
     * @param  {Object} 输入信息
     * @return {nej.ut._$$ModuleCP}
     */
    __proModuleCP._$show = function(_options){
        this.__manager._$dispatch(_options);
        return this;
    };
    /**
     * 隐藏模块
     * @method {_$hide}
     * @return {nej.ut._$$ModuleCP}
     */
    __proModuleCP._$hide = function(){
        this.__manager._$hide();
        return this;
    };
    /**
     * 取模块的HASH值
     * @method {_$query}
     * @return {String} 块的HASH值
     */
    __proModuleCP._$query = function(){
        var _module = this.__manager._$getModule();
        return !_module?'':_module._$query();
    };
    /**
     * 是否允许直接退出
     * @protected
     * @method {__onBeforeExit}
     * @param  {Object}  下个模块输入信息
     * @return {Boolean} 是否允许直接退出
     */
    __proModuleCP.__onBeforeExit = function(_options){
        var _module = this.__manager._$getModule();
        return !_module?!0:_module._$dispatchEvent('onbeforeexit',_options);
    };
    /**
     * 模块构建
     * @protected
     * @method {__buildModule}
     * @return {Void}
     */
    __proModuleCP.__buildModule = function(_options){
        this.__mopt.parent = (_options||o).parent;
        this.__mopt.onredirect = this._$dispatchEvent._$bind(this,'onredirect');
        this.__manager = new (p._$$Manager)(this.__mopt);
    };
};
define('{lib}util/module/module.js',
      ['{lib}base/element.js','{lib}util/event.js'],f);