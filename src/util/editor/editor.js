/*
 * ------------------------------------------
 * 富媒体编辑器封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/editor */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'util/event',
    'util/editor/area',
    'util/editor/toolbar',
    'util/editor/command'
],function(NEJ,_k,_u,_t,_t0,_t1,_t2,_p,_o,_f,_r){
    var _pro;
    /**
     * 富媒体编辑器封装
     *
     * @class     module:util/editor/editor._$$Editor
     * @extends   module:util/event._$$EventTarget
     * @param     {Object}                  arg0    - 可选配置参数
     * @property  {nej.ut._$$EditorArea}    area    - 编辑器核心区
     * @property  {nej.ut._$$EditorToolbar} toolbar - 编辑器工具栏
     */
    _p._$$Editor = _k._$klass();
    _pro = _p._$$Editor._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/editor/editor._$$Editor#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__copt = {};
        this.__impl = {};
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/editor/editor._$$Editor#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _doRegist = function(){
            this._$registCommand(
                 _t2._$$EditorCommand
                   ._$getImpl(arguments[1]));
        };
        return function(_options){
            this.__super(_options);
            // check editor toolbar
            var _toolbar = _options.toolbar,
                _isok = _toolbar instanceof
                        _t1._$$EditorToolbar;
            !_isok ? _toolbar = null
                   : this.__copt.toolbar = _toolbar;
            if (!!_toolbar){
                _toolbar._$setEvent('oncommand',
                    this.__onCommand._$bind(this));
                _u._$forIn(_toolbar
                  ._$getCommandList(),_doRegist,this);
            }
            // check editor area
            var _area = _options.area,
                _isok = _area instanceof
                        _t0._$$EditorArea;
            !_isok ? _area = null
                   : this.__copt.area = _area;
            if (!!_area){
                _area._$setEvent('onselectionchange',
                    this.__onSelectionChange._$bind(this));
            }
        };
    })();
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/editor/editor._$$Editor#__destroy
     * @return {Void}
     */
    _pro.__destroy = (function(){
        var _doClearImpl = function(_impl,_key,_map){
            if (_impl instanceof _t2._$$EditorCommand)
                _impl._$recycle();
            delete _map[_key];
        };
        return function(){
            this.__super();
            if (!!this.__copt.area){
                this.__copt.area._$recycle();
                delete this.__copt.area;
            }
            if (!!this.__copt.toolbar){
                this.__copt.toolbar._$recycle();
                delete this.__copt.toolbar;
            }
            _u._$forIn(this.__impl,_doClearImpl);
        };
    })();
    /**
     * 取命令实现实例
     *
     * @protected
     * @method module:util/editor/editor._$$Editor#__getCommandImpl
     * @param  {String} arg0 - 命令名称
     * @return {nej.ut._$$EditorCommand} 命令实现实例
     */
    _pro.__getCommandImpl = function(_command){
        var _impl = this.__impl[_command];
        if (!_impl) return null;
        if (!(_impl instanceof _t2._$$EditorCommand)){
            _impl = _impl._$allocate(this.__copt);
            this.__impl[_command] = _impl;
        }
        return _impl;
    };
    /**
     * 执行命令触发事件
     *
     * @protected
     * @method module:util/editor/editor._$$Editor#__onCommand
     * @param  {Object} arg0 - 命令信息
     * @return {Void}
     */
    _pro.__onCommand = function(_event){
        this.__getCommandImpl(_event.name)
            ._$execute({target:_event.node});
    };
    /**
     * 编辑器选择内容变化触发事件
     *
     * @protected
     * @method module:util/editor/editor._$$Editor#__onSelectionChange
     * @return {Void}
     */
    _pro.__onSelectionChange = (function(){
        var _doSyncToolbar = function(_node,_command){
            var _impl = this.__getCommandImpl(_command);
            if (!_impl) return;
            var _toolbar = this.__copt.toolbar,
                _value = _impl._$queryState();
            if (_value!=null)
                _toolbar._$select(_command,_value);
            var _value = _impl._$queryEnabled();
            if (_value!=null)
                _toolbar._$disable(_command,!_value);
            _impl._$queryValue(_node);
        };
        return function(){
            var _toolbar = this.__copt.toolbar;
            if (!_toolbar) return;
            _u._$forIn(_toolbar.
               _$getCommandList(),_doSyncToolbar,this);
        };
    })();
    /**
     * 注册命令实现
     *
     * @method module:util/editor/editor._$$Editor#_$registCommand
     * @param  {Array|nej.ut._$$EditorCommand} arg0 - 命令实现类构造
     * @return {Void}
     */
    _pro._$registCommand = function(_class){
        if (!_u._$isArray(_class)){
            var _name = (_class||_o).command;
            if (!!_name)
                this.__impl[_name] = _class;
            return;
        }
        _u._$forEach(_class,this._$registCommand,this);
    };
    /**
     * 设置编辑内容
     *
     * @method module:util/editor/editor._$$Editor#_$setContent
     * @param  {String} arg0 - 编辑内容
     * @return {Void}
     */
    _pro._$setContent = function(_content){
        if (!!this.__copt.area)
            this.__copt.area._$setContent(_content);
    };
    /**
     * 取编辑内容
     *
     * @method module:util/editor/editor._$$Editor#_$getContent
     * @return {String} 编辑内容
     */
    _pro._$getContent = function(_filter){
        return !this.__copt.area ? ''
               :this.__copt.area._$getContent(_filter);
    };

     /**
     * 取纯文本编辑内容
     *
     * @method module:util/editor/editor._$$Editor#_$getTextContent
     * @return {String} 编辑内容
     */
    _pro._$getTextContent = function(){
        return !this.__copt.area ? ''
               :this.__copt.area._$getTextContent();
    };
    /**
     * 取编辑区实例
     *
     * @method module:util/editor/editor._$$Editor#_$getArea
     * @return {nej.ut._$$EditorArea}
     */
    _pro._$getArea = function(){
        return this.__copt.area;
    };
    /**
     * 取工具条实例
     *
     * @method module:util/editor/editor._$$Editor#_$getToolbar
     * @return {nej.ut._$$EditorToolbar}
     */
    _pro._$getToolbar = function(){
        return this.__copt.toolbar;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});