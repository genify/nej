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
    'util/dispatcher/module',
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

    _pro.__init = function(){
        this.__super();
        this.__nodeKey = _t._$addNodeTemplate('<div></div>');
        this.__body = _t._$getNodeTemplate(this.__nodeKey);
        this._$innerModule = new this._$$InnerModule().$inject(this.__body);
        this.__export.parent = this._$innerModule.$refs.view;
    }

    _pro.__onShow = function(_options){
        this.__super(_options);
        if(this._$innerModule.__onShow){
            this._$innerModule.data.$param = _options.param;
            this._$innerModule.data.$params = _options.href.split('?')[1];
            this._$innerModule.__onShow(_options);
            this._$innerModule.$update();
        }
    }

    _pro.__onRefresh = function(_options){
        this.__super(_options);
        if(this._$innerModule.__onRefresh){
            this._$innerModule.data.$param = _options.param;
            this._$innerModule.data.$params = _options.href.split('?')[1];
            this._$innerModule.__onRefresh(_options);
            this._$innerModule.$update();
        }
    }

    _pro.__onMessage = function(_options){
        this.__super(_options);
        if(this._$innerModule.__onMessage){
            this._$innerModule.__onMessage(_options);
            this._$innerModule.$update();
        }
    }

    _pro.__onBeforeHide = function(_options){
        this.__super(_options);
        if(this._$innerModule.__onBeforeHide){
            this._$innerModule.__onBeforeHide(_options);
            this._$innerModule.$update();
        }
    }

    _pro.__onHide = function(){
        this.__super();
        if(this._$innerModule.__onHide){
            this._$innerModule.__onHide();
            this._$innerModule.$update();
        }
    }

    _pro.__destroy = function(){
        this.__body = _t._$getNodeTemplate(this.__nodeKey);
        this._$innerModule.destroy();
        delete this.__nodeKey;
        this.__super();
    };

    /**
     * 生成RegularModule
     * 
     * @public
     * @method module:util/dispatcher/regularModule._$build
     * @param  {String}  arg0 - 模块UMI或者别名
     * @param  {Regular} arg1 - Regular组件模块
     * @return {_$$RegularModule} RegularModule模块
     */
    _p._$build = function(_umiAlias, _$$InnerModule){
        /**
         * Regular模块对象
         *
         * @class   {_$$OuterModule}
         * @extends {_$$RegularModule}
         */
        var _$$OuterModule = _k._$klass();
        var _pro = _$$OuterModule._$extend(_p._$$RegularModule);

        _pro.__init = function(){
            this.__umiAlias = _umiAlias;
            this._$$InnerModule = _$$InnerModule;
            this.__super();
        }

        _v._$addEvent(document, 'templateready', function(){
            _m._$regist(_umiAlias, _$$OuterModule);
        });

        return _$$OuterModule;
    }

    return _p;
});