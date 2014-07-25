/*
 * ------------------------------------------
 * 富媒体编辑器工具栏封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proEditorToolbar;
    if (!!_p._$$EditorToolbar) return;
    /**
     * 富媒体编辑器工具栏封装，输入的命令节点需使用以下属性标识
     *  - data-command    指定执行的命令，没有设置此属性将被忽略
     * @class   {nej.ut._$$EditorToolbar} 富媒体编辑器工具栏封装
     * @extends {nej.ut._$$Event}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     * @config  {Array}     list      命令节点列表
     * @config  {String} selected 命令选中样式，默认为js-selected
     * @config  {String} disabled 命令禁用样式，默认为js-disabled
     * 
     * [hr]
     * 
     * @event  {oncommand}
     * @param  {Object} 可选配置参数
     * @config {String} name 命令名称
     * @config {Node}   node 被命令影响的节点
     */
    _p._$$EditorToolbar = NEJ.C();
      _proEditorToolbar = _p._$$EditorToolbar._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proEditorToolbar.__init = function(){
        this.__command = {};
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEditorToolbar.__reset = function(_options){
        this.__supReset(_options);
        this.__selected = _options.selected||'js-selected';
        this.__disabled = _options.disabled||'js-disabled';
        this._$addCommand(_options.list);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEditorToolbar.__destroy = function(){
        this.__supDestroy();
        this.__command = {};
        delete this.__selected;
        delete this.__disabled;
    };
    /**
     * 执行命令
     * @protected
     * @method {__onCommand}
     * @param  {String} 命令名称
     * @return {Void}
     */
    _proEditorToolbar.__onCommand = function(_command){
        _v._$stopBubble(arguments[1]);
        var _node = this.__command[_command];
        this._$dispatchEvent('oncommand',{
            name:_command
           ,node:this.__command[_command]
        });
    };
    /**
     * 添加命令节点
     * @method {_$addCommand}
     * @param  {String|Node|Array} 命令节点
     * @return {nej.ut._$$EditorToolbar}
     */
    _proEditorToolbar._$addCommand = function(_node){
        if (!_u._$isArray(_node)){
            var _command = _e._$dataset(_node,'command');
            if (!_command) return this;
            this.__command[_command] = _e._$get(_node);
            this.__doInitDomEvent([
                [_node,'click',this.__onCommand._$bind(this,_command)]
            ]);
            return this;
        }
        _u._$forEach(_node,this._$addCommand,this);
        return this;
    };
    /**
     * 取需要同步选中状态的命令列表
     * @method {_$getCommandList}
     * @return {Array} 命令列表
     */
    _proEditorToolbar._$getCommandList = function(){
        return this.__command;
    };
    /**
     * 设置命令的选中状态
     * @method {_$select}
     * @param  {String}  命令名称
     * @param  {Boolean} 是否选中
     * @return {nej.ut._$$EditorToolbar}
     */
    _proEditorToolbar._$select = function(_command,_selected){
        var _node = this.__command[_command];
        if (!_node) return this;
        !_selected ? _e._$delClassName(_node,this.__selected)
                   : _e._$addClassName(_node,this.__selected);
        return this;
    };
    /**
     * 设置命令的禁用状态
     * @method {_$disable}
     * @param  {String}  命令名称
     * @param  {Boolean} 是否禁用
     * @return {nej.ut._$$EditorToolbar}
     */
    _proEditorToolbar._$disable = function(_command,_disabled,_class){
        var _node = this.__command[_command];
        if (!_node) return this;
        _e._$delClassName(_node,_class);
        !_disabled ? _e._$delClassName(_node,this.__disabled)
                   : _e._$addClassName(_node,this.__disabled);
        return this;
    };
};
NEJ.define('{lib}util/editor/toolbar.js',
      ['{lib}util/event.js'],f);