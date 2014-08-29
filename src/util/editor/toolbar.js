/*
 * ------------------------------------------
 * 富媒体编辑器工具栏封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/toolbar */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/event'
],function(NEJ,_k,_e,_v,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 富媒体编辑器工具栏封装，输入的命令节点需使用以下属性标识
     *  - data-command    指定执行的命令，没有设置此属性将被忽略
     *
     * @class     module:util/editor/toolbar._$$EditorToolbar
     * @extends   module:util/event._$$EventTarget
     * @param     {Object} _options - 可选配置参数
     * @property  {Array}  list     - 命令节点列表
     * @property  {String} selected - 命令选中样式，默认为js-selected
     * @property  {String} disabled - 命令禁用样式，默认为js-disabled
     */
    /**
     * 命令执行回调
     *
     * @event    module:util/editor/toolbar._$$EditorToolbar#oncommand
     * @param    {Object}   arg0 - 可选配置参数
     * @property {String}   name - 命令名称
     * @property {Node}     node - 被命令影响的节点
     */
    _p._$$EditorToolbar = _k._$klass();
    _pro = _p._$$EditorToolbar._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/editor/toolbar._$$EditorToolbar#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__command = {};
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/editor/toolbar._$$EditorToolbar#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__selected = _options.selected||'js-selected';
        this.__disabled = _options.disabled||'js-disabled';
        this._$addCommand(_options.list);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/editor/toolbar._$$EditorToolbar#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__command = {};
        delete this.__selected;
        delete this.__disabled;
    };
    /**
     * 执行命令
     *
     * @protected
     * @method module:util/editor/toolbar._$$EditorToolbar#__onCommand
     * @param  {String} arg0 - 命令名称
     * @return {Void}
     */
    _pro.__onCommand = function(_command){
        _v._$stopBubble(arguments[1]);
        var _node = this.__command[_command];
        this._$dispatchEvent('oncommand',{
            name:_command
           ,node:this.__command[_command]
        });
    };
    /**
     * 添加命令节点
     *
     * @method module:util/editor/toolbar._$$EditorToolbar#_$addCommand
     * @param  {String|Node|Array} arg0 - 命令节点
     * @return {Void}
     */
    _pro._$addCommand = function(_node){
        if (!_u._$isArray(_node)){
            var _command = _e._$dataset(_node,'command');
            if (!_command) return;
            this.__command[_command] = _e._$get(_node);
            this.__doInitDomEvent([
                [_node,'click',this.__onCommand._$bind(this,_command)]
            ]);
        }
        _u._$forEach(_node,this._$addCommand,this);
    };
    /**
     * 取需要同步选中状态的命令列表
     *
     * @method module:util/editor/toolbar._$$EditorToolbar#_$getCommandList
     * @return {Array} 命令列表
     */
    _pro._$getCommandList = function(){
        return this.__command;
    };
    /**
     * 设置命令的选中状态
     *
     * @method module:util/editor/toolbar._$$EditorToolbar#_$select
     * @param  {String}  arg0 - 命令名称
     * @param  {Boolean} arg1 - 是否选中
     * @return {Void}
     */
    _pro._$select = function(_command,_selected){
        var _node = this.__command[_command];
        if (!_node) return;
        !_selected ? _e._$delClassName(_node,this.__selected)
                   : _e._$addClassName(_node,this.__selected);
    };
    /**
     * 设置命令的禁用状态
     *
     * @method module:util/editor/toolbar._$$EditorToolbar#_$disable
     * @param  {String}  arg0 - 命令名称
     * @param  {Boolean} arg1 - 是否禁用
     * @return {Void}
     */
    _pro._$disable = function(_command,_disabled,_class){
        var _node = this.__command[_command];
        if (!_node) return;
        _e._$delClassName(_node,_class);
        !_disabled ? _e._$delClassName(_node,this.__disabled)
                   : _e._$addClassName(_node,this.__disabled);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
