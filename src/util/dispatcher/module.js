/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/dispatcher/module */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'util/event',
    './dispatcher.js'
],function(NEJ,_k,_e,_u,_t0,_t1,_p,_o,_f,_r){
    var _pro;
    /**
     * 项目模块基类对象
     * 
     * @class    module:util/dispatcher/module._$$ModuleAbstract
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object} config    - 可选配置参数
     * @property {String} umi       - 当前模块的统一模块标识符
     * @property {Object} composite - 组合模块配置信息
     * @property {module:util/dispatcher/dispatcher._$$Dispatcher} dispatcher - 调度器实例
     */
    _p._$$ModuleAbstract = _k._$klass();
    _pro = _p._$$ModuleAbstract._$extend(_t0._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__export = {};
        this.__doBuild();
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__umi = _options.umi||'';
        this.__dispatcher = _options.dispatcher;
        this.__composites = _options.composite||_o;
        // void rewrite
        this._$batEvent({
            onshow:this.__onShow._$bind(this),
            onhide:this.__onHide._$bind(this),
            onrefresh:this.__onRefresh._$bind(this),
            onmessage:this.__onMessage._$bind(this),
            onbeforehide:this.__onBeforeHide._$bind(this)
        });
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__export = {};
        delete this.__umi;
        delete this.__composites;
        delete this.__dispatcher;
    };
    /**
     * 阻止事件
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__stop
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__stop = function(_event){
        if (!!_event){
            _event.stopped = !0;
        }
    };
    /**
     * 构建模块，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doBuild
     * @return {Void}
     */
    _pro.__doBuild = _f;
    /**
     * 模块退出前触发事件，通过阻止输入的事件做退出验证，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/dispatcher/module._$$ModuleAbstract#__onBeforeHide
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onBeforeHide = _f;
    /**
     * 清除所有组合控件，除了调度器控件
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doClearComponentExDsp
     * @return {Void}
     */
    _pro.__doClearComponentExDsp = (function(){
        var _doCheck = function(_component){
            return !!_t1._$$Dispatcher&&
                    (_component instanceof _t1._$$Dispatcher);
        };
        return function(){
            this.__doClearComponent(_doCheck);
        };
    })();
    /**
     * 接受到消息触发事件，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/dispatcher/module._$$ModuleAbstract#__onMessage
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onMessage = _f;
    /**
     * 向目标模块发送消息
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doSendMessage
     * @param  {String}   arg0 - 目标模块UMI
     * @param  {Variable} arg1 - 消息内容
     * @param  {Number}   arg2 - 消息模式
     * @return {Void}
     */
    _pro.__doSendMessage = function(_to,_message,_mode){
        this.__dispatcher._$message({
            to:_to,
            mode:_mode||0,
            data:_message,
            from:this.__umi
        });
    };
    /**
     * 发布消息
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doPublishMessage
     * @param  {String} arg0 - 消息类型
     * @param  {Object} arg1 - 消息信息
     * @return {Void}
     */
    _pro.__doPublishMessage = function(_type,_data){
        this.__dispatcher._$publish(
            _type,{
                from:this.__umi,
                data:_data
            }
        );
    };
    /**
     * 订阅消息
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doSubscribeMessage
     * @param  {String}   arg0 - 目标模块的UMI
     * @param  {String}   arg1 - 消息类型
     * @param  {Function} arg2 - 消息处理回调
     * @return {Void}
     */
    _pro.__doSubscribeMessage = function(){
        this.__dispatcher._$subscribe
            .apply(this.__dispatcher,arguments);
    };
    /**
     * 取模块对外开放的数据信息，依赖此模块的子模块可以访问到此信息
     * 
     * @method module:util/dispatcher/module._$$ModuleAbstract#_$getExportData
     * @return {Object} 对外开放的数据信息
     */
    _pro._$getExportData = function(){
        return this.__export;
    };
    /**
     * 解析模块所在容器节点
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doParseParent
     * @param  {Object} arg0 - 配置信息
     * @return {Node}          模块所在容器节点
     */
    _pro.__doParseParent = function(_options){
        // try get parent
        // check input first
        var _parent;
        if (!_parent){
            var _data = _options.input||_o;
            _parent = _e._$get(_data.parent);
        }
        if (!_parent){
            var _data = _options.data||_o;
            _parent = _e._$get(_data.parent);
        }
        if (!_parent){
            _parent = _e._$get(_options.parent);
        }
        return _parent;
    };
    /**
     * 显示模块触发事件，子类可重写具体逻辑
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__onShow
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onShow = function(_options){
        var _parent = this.__doParseParent(_options);
        // show and refresh module
        if (!!_parent&&!!this.__body){
            _parent.appendChild(this.__body);
        }
        this.__doApplyComposite('onshow',_options);
        this.__onRefresh(_options);
    };
    /**
     * 显示模块触发事件，子类实现具体逻辑
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__onRefresh
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onRefresh = function(_options){
        this.__doApplyComposite('onrefresh',_options);
    };
    /**
     * 隐藏模块触发事件，子类实现具体逻辑
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__onHide
     * @return {Void}
     */
    _pro.__onHide = function(){
        this.__doHideComposite();
        _e._$removeByEC(this.__body);
    };
    /**
     * 是否忽略模块组合
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__isEscapedComposite
     * @return {Boolean} 是否忽略
     */
    _pro.__isEscapedComposite = (function(){
        var _reg0 = /^onshow|onrefresh|delay$/;
        return function(_umi){
            return _reg0.test(_umi);    
        };
    })();
    /**
     * 动态生成组合模块的输入参数，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doGenCompositeParam
     * @param  {String} arg0 - 模块类别
     * @param  {Object} arg1 - 输入信息
     * @return {Object}        参数信息
     */
    _pro.__doGenCompositeParam = _f;
    /**
     * 应用组合模块
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doApplyComposite
     * @param  {String} arg0 - 类型，onshow/onrefresh
     * @param  {Object} arg1 - 事件对象
     * @return {Void}
     */
    _pro.__doApplyComposite = (function(){
        var _doRedirect = function(_query,_options,_umi,_pid){
            if (this.__isEscapedComposite(_pid)) return;
            if (!!_query) _umi += (_umi.indexOf('?')>1?'&':'?')+_query;
            var _input = this.__doGenCompositeParam(_pid,_options)||{};
            _input.location = _options;
            _input.parent = this.__export[_pid];
            this.__dispatcher._$redirect(_umi,{input:_input});
        };
        return function(_type,_options){
            if (!_options.nodelay){
                // delay all
                if (!!this.__composites.delay) return;
                // check delay
                var _composite = this.__composites[_type]||_o;
                if (_composite.delay) return;
            }
            // do apply
            var _query = _u._$object2query(_options.param)||'';
            if (_type=='onrefresh'){
                _u._$loop(
                    this.__composites,
                    _doRedirect._$bind(this,_query,_options)
                );
            }
            _u._$loop(
                _composite,_doRedirect.
                _$bind(this,_query,_options)
            );
        };
    })();
    /**
     * 隐藏组合模块
     * 
     * @protected
     * @method module:util/dispatcher/module._$$ModuleAbstract#__doHideComposite
     * @return {Void}
     */
    _pro.__doHideComposite = (function(){
        var _doHide = function(_umi,_pid){
            if (!this.__isEscapedComposite(_pid)){
                this.__dispatcher._$hide(_umi);
            }
        };
        return function(){
            _u._$loop(this.__composites,_doHide,this);
            _u._$loop(this.__composites.onshow,_doHide,this);
            _u._$loop(this.__composites.onrefresh,_doHide,this);
        };
    })();
    /**
     * 注册模块，如果调度器还没有被实例化则先缓存注册内容
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/dispatcher/module'
     * ],function(_t){
     *     // 注册别名
     *     _t._$regist('blog-list',a._$$Module);
     *
     *     // 注册UMI
     *     _t._$regist('/blog/list/',a._$$Module);
     * });
     * ```
     * 
     * @method module:util/dispatcher/module._$regist
     * @param  {String} arg0 - 模块UMI或者别名
     * @param  {module:util/dispatcher/module._$$ModuleAbstract} arg1 - 模块构造函数
     * @return {Void}
     */
    _p._$regist = (function(){
        var _modules;
        // dump modules for dispatcher startup
        _p._$dumpModules = function(){
            if (!_modules) return;
            _u._$loop(_modules,function(_module,_umi){
                dispatcher._$loaded(_umi,_module);
            });
            _modules = null;
        };
        return function(_umi,_module){
            if (!!window.dispatcher){
                dispatcher._$loaded.
                    apply(dispatcher,arguments);
            }else{
                if (!_modules){
                    _modules = {};
                }
                _modules[_umi] = _module;
            }
        };
    })();
    
    if (CMPT){
        NEJ.P('nej.e')._$regist = _p._$regist;
        NEJ.P('nej.ut')._$$AbstractModule = _p._$$ModuleAbstract;
    }
    
    return _p;
});
