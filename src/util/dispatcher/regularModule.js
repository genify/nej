/*
 * ------------------------------------------
 * 项目Regualar模块基类实现文件
 * @author   sensen(hzzhaoyusen@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/dispatcher/regularModule */
NEJ.define([
    'base/klass',
    'base/event',
    'util/template/tpl',
    'util/dispatcher/module'
],function(_k,_v,_t,_m,_p){
    var _pro;
    /**
     * Regular模块基类对象
     *
     * @class   {_$$RegularModule}
     * @extends {_$$ModuleAbstract}
     */
    _p._$$RegularModule = _k._$klass();
    _pro = _p._$$RegularModule._$extend(_m._$$ModuleAbstract);
    /**
     * 构建Regular组件
     *
     * @protected
     * @method module:util/dispatcher/regularModule._$$RegularModule#__build
     * @return {Void}
     */
    _pro.__build = function(){
        this._$innerModule = new this._$$InnerModule().$inject(this.__body);
        this.__export.parent = this._$innerModule.$refs.view;

        this._$innerModule.__doSendMessage = this.__doSendMessage._$bind(this);
    }
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/dispatcher/regularModule._$$RegularModule#__init
     * @return {Void}
     */
    _pro.__init = function(_options){
        this.__super(_options);
        this.__nodeKey = _t._$addNodeTemplate('<div></div>');
        this.__body = _t._$getNodeTemplate(this.__nodeKey);

        this.__build();
    }
    /**
     * 显示模块触发事件，子类可重写具体逻辑
     *
     * @protected
     * @method module:util/dispatcher/regularModule._$$RegularModule#__onShow
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onShow = function(_options){
        // 如果Regular组件被destroy了，就重新构建
        if(this._$innerModule._watchers === null)
            this.__build();

        this.__super(_options);
        if(this._$innerModule.__onShow){
            this._$innerModule.data.$param = _options.param;
            this._$innerModule.data.$params = _options.href.split('?')[1];
            this._$innerModule.__onShow(_options);
            this._$innerModule.$update();
        }
    }
    /**
     * 显示模块触发事件，子类实现具体逻辑
     *
     * @protected
     * @method module:util/dispatcher/regularModule._$$RegularModule#__onRefresh
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onRefresh = function(_options){
        this.__super(_options);
        if(this._$innerModule.__onRefresh){
            this._$innerModule.data.$param = _options.param;
            this._$innerModule.data.$params = _options.href.split('?')[1];
            this._$innerModule.__onRefresh(_options);
            this._$innerModule.$update();
        }
    }
    /**
     * 接受到消息触发事件，子类实现具体逻辑
     *
     * @abstract
     * @method module:util/dispatcher/regularModule._$$RegularModule#__onMessage
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onMessage = function(_options){
        this.__super(_options);
        if(this._$innerModule.__onMessage){
            this._$innerModule.__onMessage(_options);
            this._$innerModule.$update();
        }
    }
    /**
     * 模块退出前触发事件，通过阻止输入的事件做退出验证，子类实现具体逻辑
     *
     * @abstract
     * @method module:util/dispatcher/regularModule._$$RegularModule#__onBeforeHide
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onBeforeHide = function(_options){
        this.__super(_options);
        if(this._$innerModule.__onBeforeHide){
            this._$innerModule.__onBeforeHide(_options);
            this._$innerModule.$update();
        }
    }
    /**
     * 隐藏模块触发事件，子类实现具体逻辑
     *
     * @protected
     * @method module:util/dispatcher/regularModule._$$RegularModule#__onHide
     * @return {Void}
     */
    _pro.__onHide = function(){
        this.__super();
        if(this._$innerModule.__onHide){
            this._$innerModule.__onHide();
            this._$innerModule.$update();
        }
    }
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/dispatcher/regularModule._$$RegularModule#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__body = _t._$getNodeTemplate(this.__nodeKey);
        this._$innerModule.destroy();
        delete this.__nodeKey;
        this.__super();
    };

    /**
     * 注册RegularModule
     *
     * @public
     * @method module:util/dispatcher/regularModule._$build
     * @param  {String}  arg0 - 模块UMI或者别名
     * @param  {Regular} arg1 - Regular组件模块
     * @return {_$$RegularModule} RegularModule模块
     */
    _p._$regist = function(_umiAlias, _$$InnerModule){
        /**
         * Regular模块对象
         *
         * @class   {_$$OuterModule}
         * @extends {_$$RegularModule}
         */
        var _$$OuterModule = _k._$klass();
        var _pro = _$$OuterModule._$extend(_p._$$RegularModule);

        _pro.__init = function(_options){
            this.__umiAlias = _umiAlias;
            this._$$InnerModule = _$$InnerModule;
            this.__super(_options);
        }

        _v._$addEvent(document, 'templateready', function(){
            _m._$regist(_umiAlias, _$$OuterModule);
        });

        return _$$OuterModule;
    }

    return _p;
});
