/*
 * ------------------------------------------
 * 模块管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        u = NEJ.P('nej.u'),
        v = NEJ.P('nej.v'),
        m = NEJ.P('nej.mb'),
        p = NEJ.P('nej.ut'),
        __referrer,
        __proManager,
        __proHashManager;
    if (!!p._$$Manager) return;
    /**
     * 模块管理器对象
     * @class   {nej.ut._$$Manager} 模块管理器对象
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String}       key        模块标识键
     * @config  {String|Node} parent    模块容器节点
     * @config  {Object}       config    模块配置,{key:configuration}
     * 
     * [hr]
     * 
     * @event  {onerror} 异常回调函数
     * @param  {String}  错误模块和信息描述
     * 
     * [hr]
     * 
     * @event  {onredirect} 重定向回调函数
     * 
     * [hr]
     * 
     * @event  {onbeforechange} 模块变化之前触发事件
     * @param  {String} 查询串
     * 
     * [hr]
     * 
     * @event  {onbeforedispatch} 模块调度前触发事件
     * @param  {Object} 可配置参数
     * @config {String} 模块标识键
     * 
     * [hr]
     * 
     * @event  {onafterdispatch} 模块调度后触发事件
     * @param  {Object} 可配置参数
     * @config {String} 模块标识键
     * 
     */
    p._$$Manager = NEJ.C();
    __proManager = p._$$Manager._$extend(p._$$Event);
    /**
     * 初始化管理器
     * @protected
     * @method {__init}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proManager.__init = function(_options){
        this.__supInit();
        _options = _options||o;
        this.__mkey = _options.key||'m';
        this.__copt = {container:_options.parent,
                       onpass:this.__onModuleDispatch._$bind(this),
                       onredirect:this._$dispatchEvent._$bind(this,'onredirect')};
        this._$setEvent('onerror',_options.onerror||f);
        this._$setEvent('onredirect',_options.onredirect||
                                     this._$redirect._$bind(this));
        this._$setEvent('onbeforechange',_options.onbeforechange||f);
        this._$setEvent('onafterdispatch',_options.onafterdispatch||f);
        this._$setEvent('onbeforedispatch',_options.onbeforedispatch||f);
        this.__checkConfig(_options.config);
    };
    /**
     * 查询串转对象
     * @protected
     * @method {__query2obj}
     * @param  {String} 查询串
     * @return {Object} 查询数据对象
     */
    __proManager.__query2obj = function(_query){
        _query = (_query||'').replace(/^#!?/,'');
        var _obj = u._$query2object(_query);
        _obj.__QUERY__ = _query;
        return _obj;
    };
    /**
     * 检查配置信息
     * @protected
     * @method {__checkConfig}
     * @param  {Object} 配置信息
     * @return {Void}
     */
    __proManager.__checkConfig = function(_config){
        this.__config = {};
        _config = _config||o;
        for(var x in _config)
            this._$regist(x,_config[x]);
    };
    /**
     * 构建模块配置对象
     * @protected
     * @method {__buildConfig}
     * @param  {String} 模块ID
     * @return {Void}
     */
    __proManager.__buildConfig = function(_mid){
        var _config = this.__config[_mid];
        if (_config instanceof p._$$Configuration)
            return;
        this.__copt.id = _mid;
        _config = _config._$allocate(this.__copt);
        delete this.__copt.id;
        if (!(_config instanceof p._$$Configuration)){
            delete this.__config[_mid];
            return;
        }
        this.__config[_mid] = _config;
    };
    /**
     * 取配置器
     * @protected
     * @method {__getConfiguration}
     * @param  {String}                  模块ID
     * @return {nej.ut._$$Configuration} 配置器对象
     */
    __proManager.__getConfiguration = function(_mid){
        if (!this.__config[_mid]){
            this.__onModuleError(_mid,'找不到模块配置信息！');
            return;
        }
        this.__buildConfig(_mid);
        var _config = this.__config[_mid];
        if (!_config){
            this.__onModuleError(_mid,'模块配置器不合法！');
            return;
        }
        return _config;
    };
    /**
     * 取模块验证器
     * @protected
     * @method {__getValidator}
     * @param  {String}              模块ID
     * @return {nej.ut._$$Validator} 验证器对象
     */
    __proManager.__getValidator = function(_mid){
        var _config = this.__getConfiguration(_mid);
        if (!_config) return;
        var _validator = _config._$getValidator();
        if (!_validator){
            this.__onModuleError(_mid,'模块验证器不合法！');
            return;
        }
        return _validator;
    };
    /**
     * 取模块
     * @protected
     * @method {__getModule}
     * @param  {String}           模块ID
     * @return {nej.ut._$$Module} 验证模块
     */
    __proManager.__getModule = function(_mid){
        var _config = this.__getConfiguration(_mid);
        if (!_config) return;
        var _module = _config._$getModule();
        if (!_module){
            this.__onModuleError(_mid,'模块对象不合法！');
            return;
        }
        return _module;
    };
    /**
     * 模块出错触发事件
     * @protected
     * @method {__onModuleError}
     * @param  {String} 模块ID
     * @param  {String} 错误提示信息
     * @return {Void}
     */
    __proManager.__onModuleError = function(_mid,_message){
        delete this.__config[_mid];
        if (_mid==this.__mid) return; // void infinite loop
        this._$dispatchEvent('onerror','[MID='+_mid+']'+_message);
    };
    /**
     * 模块变化触发事件
     * @protected
     * @method {__onModuleChange}
     * @param  {String} 查询串
     * @return {Void}
     */
    __proManager.__onModuleChange = function(_query){
        this._$dispatchEvent('onbeforechange',_query);
        this.__onModuleEnterValidate(this.__query2obj(_query));
    };
    /**
     * 模块退出验证
     * @protected
     * @method {__onModuleExitValidate}
     * @param  {Object}  模块输入信息
     * @return {Boolean} 是否允许退出
     */
    __proManager.__onModuleExitValidate = function(_options){
        var _module = this.__getModule(this.__mid);
        return !!_module?_module._$dispatchEvent('onbeforeexit',_options):!0;
    };
    /**
     * 模块进入验证
     * @protected
     * @method {__onModuleEnterValidate}
     * @param  {Object} _options 可选配置
     * @return {Void}
     */
    __proManager.__onModuleEnterValidate = function(_options){
        _options = _options||o;
        var _mid = _options[this.__mkey]||'',
            _validator = this.__getValidator(_mid);
        if (!!_validator) _validator._$validate(_options);
    };
    /**
     * 调度模块
     * @protected
     * @method {__onModuleDispatch}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proManager.__onModuleDispatch = function(_options){
        _options = _options||{};
        var _mid = _options[this.__mkey],
            _module = this.__getModule(_mid);
        if (!_module) return;
        var _noevent = _module instanceof p._$$ModuleCP;
        if (!_noevent) this._$dispatchEvent('onbeforedispatch',_options);
        if (_mid!=this.__mid) this._$hide();
        _options.__REFER__ = __referrer||'';
        this.__mid = _mid;
        _module._$show(_options);
        if (!_noevent) this._$dispatchEvent('onafterdispatch',_options);
    };
    /**
     * 取指定ID模块，没有指定ID则取当前显示模块
     * @method {_$getModule}
     * @param  {String}           模块ID
     * @return {nej.ut._$$Module} 模块对象
     */
    __proManager._$getModule = function(_mid){
        var _mcfg = this.__config[_mid||this.__mid];
        return !!_mcfg?_mcfg._$getModule():null;
    };
    /**
     * 隐藏当前模块
     * @method {_$hide}
     * @return {nej.ut._$$Manager}
     */
    __proManager._$hide = function(){
        var _omdl = this._$getModule();
        if (!!_omdl){
            __referrer = _omdl._$query();
            this.__mid = -100000;
            _omdl._$hide();
        }
        return this;
    };
    /**
     * 注册模块配置信息
     * @method {_$regist}
     * @param  {String}                  模块标识
     * @param  {nej.ut._$$Configuration} 配置信息
     * @return {nej.ut._$$Manager}
     */
    __proManager._$regist = function(_key,_config){
        if (_key==null||!_config) return this;
        var _mcfg = this.__config[_key];
        if (_mcfg instanceof p._$$Configuration)
            _mcfg.constructor._$recycle(_mcfg);
        this.__config[_key] = _config;
        if (this.__mid!=_key) return this;
        this.__onModuleChange(this.__key+'='+_key);
        return this;
    };
    /**
     * 重定向
     * @method {_$redirect}
     * @param  {String} 查询串
     * @return {nej.ut._$$Manager}
     */
    __proManager._$redirect = function(_query){
        if (this.__onModuleExitValidate(
            this.__query2obj(_query)))
            this.__onModuleChange(_query);
        return this;
    };
    /**
     * 调度模块
     * @method {_$dispatch}
     * @param  {Object} 输入信息
     * @return {nej.ut._$$Manager}
     */
    __proManager._$dispatch = function(_options){
        this.__onModuleEnterValidate(_options);
        return this;
    };
    /**
     * HASH模块管理器对象
     * @class   {nej.ut._$$HashManager} HASH模块管理器对象
     * @extends {nej.ut._$$Manager}
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * 
     * [hr]
     * 
     * @event  {onbeforeback} 回退事件前触发事件,接收event参数,
     *                        回调逻辑中可以通过设置event的stopped属性控制是否继续回退,
     *                        参数列表
     * @param  {Object}       可选配置参数
     * @config {String} hash  回退到模块的HASH
     * @config {Number} total 总共历史数量
     *                       
     * [hr]
     * 
     * @event  {onafterback}  回退事件后触发事件,接收参数同前触发事件
     * @param  {Object}       可选配置参数
     * @config {String} hash  回退到模块的HASH
     * @config {Number} total 总共历史数量
     *                                                     
     */
    p._$$HashManager = NEJ.C();
    __proHashManager = p._$$HashManager._$extend(p._$$Manager);
    /**
     * 初始化管理器
     * @protected
     * @method {__init}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proHashManager.__init = function(_options){
        this.__supInit(_options);
        this.__history = [];
        _options = _options||o;
        this._$setEvent('onafterback',_options.onafterback||f);
        this._$setEvent('onbeforeback',_options.onbeforeback||f);
        window.setInterval(this.__checkHash._$bind(this),100);
    //    v._$addEvent(window,'hashchange',
    //                 this.__onHashChange._$bind(this));
    //    this.__onHashChange();
    };
    /**
     * 是否需要记录历史
     * @protected
     * @method {__needHistory}
     * @param  {String}  模块hash
     * @return {Boolean} 是否需要推入历史
     */
    __proHashManager.__needHistory = function(_hash){
        return !0;
    };
    /**
     * 监测Hash变化情况
     * @protected
     * @method {__checkHash}
     * @return {Void}
     */
    __proHashManager.__checkHash = function(){
        if (this.__hash!=location.hash){
            this.__hash = location.hash;
            this.__onHashChange();
        }
    };
    /**
     * HASH变化触发事件
     * @protected
     * @method {__onHashChange}
     * @return {Void}
     */
    __proHashManager.__onHashChange = function(){
        var _hash = location.hash;
        if (!this.__replaced){
            if (this.__needHistory(_hash)&&
                _hash!=this.__history[this.
                            __history.length-1])
                this.__history.push(_hash);
        }else{
            this.__replaced = !1;
        }
        this.__onModuleChange(_hash);
    };
    /**
     * 移除最后一个历史记录
     * @method {_$pop}
     * @return {String} 历史信息
     */
    __proHashManager._$pop = function(){
        return this.__history.pop();
    };
    /**
     * 后退, Z -> A -> B[NH] -> C[NH] -> A'
     *      B[NH] back to A or Z ?
     * @method {_$back}
     * @param  {Boolean} 是否使用native切换
     * @return {nej.ut._$$HashManager}
     */
    __proHashManager._$back = function(_nativable){
        var _length = this.__history.length,
            _hash = this.__history[_length-1];
        if (_hash==location.hash)
            _hash = this.__history[_length-2];
        var _event = {hash:_hash,total:_length};
        // exit app when hash==null
        this._$dispatchEvent('onbeforeback',_event);
        if (!!_event.stopped||_hash==null) return this;
        this.__replaced = !0;
        if (!this._$redirect(_hash,_nativable))
            return this;
        if (_hash!=this.__history[_length-1])
            this.__history.pop();
        this._$dispatchEvent('onafterback',_event);
        return this;
    };
    /**
     * 重定向,android下用native重定向清除textarea非正常回收问题
     * @method {_$redirect}
     * @param  {String}  查询串
     * @param  {String}  是否使用native切换
     * @return {Boolean} 是否重定向
     */
    __proHashManager._$redirect = function(_query,_nativable){
        _query = _query||'';
        if (this.__onModuleExitValidate(
            this.__query2obj(_query))){
            if (!_nativable||!m._$loadURL||
                !m._$loadURL('javascript:location.hash="'+_query+'"'))
                location.hash = _query;
            return !0;
        }
        return !1;
    };
};
NEJ.define('{lib}util/module/manager.js',
      ['{lib}base/event.js','{lib}util/event.js'],f);