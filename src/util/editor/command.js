/*
 * ------------------------------------------
 * 富媒体编辑器执行命令封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _p = _('nej.ut'),
        _impls = {},
        _proEditorCommand;
    if (!!_p._$$EditorCommand) return;
    /**
     * 富媒体编辑器执行命令封装，
     * 子类实现具体命令时注意：
     * - 指定命令识别名称，通过指定类的name属性实现
     * - 实现命令的具体业务逻辑，通过重写_$execute接口实现
     * @class   {nej.ut._$$EditorCommand} 富媒体编辑器执行命令封装
     * @extends {nej.ut._$$EventTarget}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {nej.ut._$$EditorArea}       area       编辑器核心
     * @config  {nej.ut._$$EditorToolBar} toolbar 工具栏实例
     */
    _p._$$EditorCommand = NEJ.C();
      _proEditorCommand = _p._$$EditorCommand._$extend(_p._$$EventTarget);
    /**
     * 注册命令实现
     * @method {_$regist}
     * @return {Void}
     */
    _p._$$EditorCommand._$regist = function(){
        _impls[this.command] = this;
    };
    /**
     * 取命令实现构造
     * @method {_$getImpl}
     * @param  {String}                     命令名称
     * @return {nej.ut._$$EditorCommand} 命令实现
     */
    _p._$$EditorCommand._$getImpl = function(_command){
        return _impls[_command]||null;
    };
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proEditorCommand.__init = function(){
        this.__name = this.constructor.command;
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEditorCommand.__reset = function(_options){
        this.__supReset(_options);
        this.__editor  = _options.area;
        this.__toolbar = _options.toolbar;
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEditorCommand.__destroy = function(){
        this.__supDestroy();
        delete this.__editor;
        delete this.__toolbar;
    };
    /**
     * 执行命令，子类实现具体业务逻辑
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {Void}
     */
    _proEditorCommand._$execute = _f;
    /**
     * 查询命令值，子类实现具体业务逻辑
     * @method {_$queryValue}
     * @param  {Node} 命令按钮节点
     * @return {Void}
     */
    _proEditorCommand._$queryValue = _f;
    /**
     * 查询命令是否已经执行，子类重写具体业务逻辑
     * @method {_$queryState}
     * @return {Boolean} 是否已经被执行，返回null表示不做处理
     */
    _proEditorCommand._$queryState = function(){
        return null;
    };
    /**
     * 查询命令是否允许被执行，子类重写具体业务逻辑
     * @method {_$queryEnabled}
     * @return {Boolean} 是否允许被执行，返回null表示不做处理
     */
    _proEditorCommand._$queryEnabled = function(){
        return null;
    };
};
NEJ.define('{lib}util/editor/command.js',
      ['{lib}util/event.js'],f);