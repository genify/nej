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
        _e = _('nej.e'),
        _p = _('nej.ut'),
        _proModule;
    if (!!_p._$$Module) return;
    /**
     * 模块基类对象
     * @class   {nej.ut._$$Module} 模块基类对象
     * @extends {nej.ut._$$Event}
     * @param  {Object}       可选配置参数，已处理参数列表如下所示
     * @config {String} umi 当前模块的统一模块标识符
     */
    _p._$$Module = NEJ.C();
      _proModule = _p._$$Module._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proModule.__init = function(){
        this.__export = {};
        this.__supInit();
        this.__doBuild();
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
        this.__dispatcher = _options.dispatcher;
        this.__composites = _options.composite||_o;
        // void rewrite
        this._$batEvent({
             onshow:this.__onShow._$bind(this)
            ,onhide:this.__onHide._$bind(this)
            ,onrefresh:this.__onRefresh._$bind(this)
            ,onmessage:this.__onMessage._$bind(this)
            ,onbeforehide:this.__onBeforeHide._$bind(this)
        });
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proModule.__destroy = function(){
        delete this.__umi;
        this.__export = {};
        this.__supDestroy();
    };
    /**
     * 阻止事件
     * @protected
     * @method {__stop}
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModule.__stop = function(_event){
        if (!!_event)
            _event.stopped = !0;
    };
    /**
     * 构建模块，子类实现具体业务逻辑
     * @protected
     * @method {__doBuild}
     * @return {Void}
     */
    _proModule.__doBuild = _f;
    /**
     * 显示模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onShow}
     * @param  {Object} _event 事件对象
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
     * 刷新模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onRefresh}
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModule.__onRefresh = _f;
    /**
     * 接受到消息触发事件，子类实现具体逻辑
     * @protected
     * @method {__onMessage}
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModule.__onMessage = _f;
    /**
     * 模块退出前触发事件，通过阻止输入的事件做退出验证，子类实现具体逻辑
     * @protected
     * @method {__onBeforeHide}
     * @param  {Object} _event 事件对象
     * @return {Void}
     */
    _proModule.__onBeforeHide = _f;
    /**
     * 封装消息对象
     * @protected
     * @method {__doWrapMessage}
     * @param  {String}   目标模块UMI
     * @param  {Variable} 消息内容
     * @param  {Number}   消息模式
     * @return {Object}   消息对象
    _proModule.__doWrapMessage = function(_to,_message,_mode){
        return {
                    to:_to,
                    mode:_mode||0,
                    data:_message,
                    from:this.__umi
               };
    };
     */
    /**
     * 向目标模块发送消息
     * @protected
     * @method {__doSendMessage}
     * @param  {String}   目标模块UMI
     * @param  {Variable} 消息内容
     * @param  {Number}   消息模式
     * @return {Void}
     */
    _proModule.__doSendMessage = function(_to,_message,_mode){
        this.__dispatcher._$message({
            to:_to,
            mode:_mode||0,
            data:_message,
            from:this.__umi
        });
    };
    /**
     * 发布消息
     * @protected
     * @method {__doPublish}
     * @param  {String} 消息类型
     * @param  {Object} 消息信息
     * @return {Void}
     */
    _proModule.__doPublishMessage = function(_type,_data){
        this.__dispatcher._$publish(
            _type,{
                from:this.__umi,
                data:_data
            }
        );
    };
    /**
     * 订阅消息
     * @param  {String}   目标模块的UMI
     * @param  {String}   消息类型
     * @param  {Function} 消息处理回调
     * @return {Void}
     */
    _proModule.__doSubscribeMessage = function(){
        if (!!this.__dispatcher)
            this.__dispatcher._$subscribe
                .apply(this.__dispatcher,arguments);
    };
    /**
     * 取模块对外开放的数据信息，依赖此模块的子模块可以访问到此信息
     * @method {_$getExportData}
     * @return {Object} 对外开放的数据信息
     */
    _proModule._$getExportData = function(){
        return this.__export;
    };
    /**
     * 注册模块
     * @api    {nej.e._$regist}
     * @param  {String}           模块UMI或者别名
     * @param  {nej.ut._$$Module} 模块构造函数
     * @return {Void}
     */
    _e._$regist = function(){
        if (!!window.dispatcher){
            dispatcher._$loaded.
                apply(dispatcher,arguments);
        }
    };
};
NEJ.define('{lib}util/dispatcher/module.2.js',
          ['{lib}util/event.js'],f);