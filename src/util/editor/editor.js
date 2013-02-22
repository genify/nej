/*
 * ------------------------------------------
 * 富媒体编辑器封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _e = _('nej.e'),
        _proEditor;
    if (!!_p._$$Editor) return;
    /**
     * 富媒体编辑器封装
     * @class   {nej.ut._$$Editor} 富媒体编辑器封装
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {nej.ut._$$EditorArea}       area       编辑器核心区
     * @config  {nej.ut._$$EditorToolbar} toolbar 编辑器工具栏
     */
    _p._$$Editor = NEJ.C();
      _proEditor = _p._$$Editor._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proEditor.__init = function(){
        this.__copt = {};
        this.__impl = {};
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEditor.__reset = (function(){
        var _doRegist = function(){
            this._$registCommand(
                 _p._$$EditorCommand
                   ._$getImpl(arguments[1]));
        };
        return function(_options){
            this.__supReset(_options);
            // check editor toolbar
            var _toolbar = _options.toolbar,
                _isok = _toolbar instanceof 
                        _p._$$EditorToolbar;
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
                        _p._$$EditorArea;
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
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEditor.__destroy = (function(){
        var _doClearImpl = function(_impl,_key,_map){
            if (_impl instanceof _p._$$EditorCommand)
                _impl._$recycle();
            delete _map[_key];
        };
        return function(){
            this.__supDestroy();
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
     * @protected
     * @method {__getCommandImpl}
     * @param  {String}                     命令名称
     * @return {nej.ut._$$EditorCommand} 命令实现实例
     */
    _proEditor.__getCommandImpl = function(_command){
        var _impl = this.__impl[_command];
        if (!_impl) return null;
        if (!(_impl instanceof _p._$$EditorCommand)){
            _impl = _impl._$allocate(this.__copt);
            this.__impl[_command] = _impl;
        }
        return _impl;
    };
    /**
     * 执行命令触发事件
     * @protected
     * @method {__onCommand}
     * @param  {Object} 命令信息
     * @return {Void}
     */
    _proEditor.__onCommand = function(_event){
        this.__getCommandImpl(_event.name)
            ._$execute({target:_event.node});
    };
    /**
     * 编辑器选择内容变化触发事件
     * @protected
     * @method {__onSelectionChange}
     * @return {Void}
     */
    _proEditor.__onSelectionChange = (function(){
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
     * @method {_$registCommand}
     * @param  {Array|nej.ut._$$EditorCommand} 命令实现类构造
     * @return {nej.ut._$$Editor}
     */
    _proEditor._$registCommand = function(_class){
        if (!_u._$isArray(_class)){
            var _name = (_class||_o).command;
            if (!!_name)
                this.__impl[_name] = _class;
            return this;
        }
        _u._$forEach(_class,this._$registCommand,this);
        return this;
    };
    /**
     * 设置编辑内容
     * @method {_$setContent}
     * @param  {String} 编辑内容
     * @return {nej.ut._$$Editor}
     */
    _proEditor._$setContent = function(_content){
        if (!!this.__copt.area)
              this.__copt.area
                  ._$setContent(_content);
        return this;
    };
    /**
     * 取编辑内容
     * @method {_$getContent}
     * @return {String} 编辑内容
     */
    _proEditor._$getContent = function(){
        return !this.__copt.area ? ''
               :this.__copt.area._$getContent();
    };
    
     /**
     * 取纯文本编辑内容
     * @method {_$getTextContent}
     * @return {String} 编辑内容
     */
    _proEditor._$getTextContent = function(){
        return !this.__copt.area ? ''
               :this.__copt.area._$getTextContent();
    };
};
NEJ.define('{lib}util/editor/editor.js',
      ['{lib}util/editor/area.js'
      ,'{lib}util/editor/toolbar.js'
      ,'{lib}util/editor/command.js'],f);