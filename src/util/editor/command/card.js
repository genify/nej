/*
 * ------------------------------------------
 * 命令弹出卡片封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _t = _('nej.ut'),
        _p = _('nej.ut.cmd'),
        _proCardCommand;
    if (!!_p._$$CardCommand) return;
    /**
     * 命令弹出卡片
     * @class   {nej.ut.cmd._$$CardCommand} 命令弹出卡片
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     */
    _p._$$CardCommand = NEJ.C();
      _proCardCommand = _p._$$CardCommand._$extend(_t._$$EditorCommand);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proCardCommand.__init = function(){
        this.__fopt = {parent:document.body,destroyable:!0
                      ,onchange:this.__onChange._$bind(this)};
        this.__supInit();
    };
    /**
     * 卡片内容变化回调，子类实现具体业务逻辑
     * @protected
     * @method {__onChange}
     * @return {Void}
     */
    _proCardCommand.__onChange = _f;
    /**
     * 显示卡片，子类实现具体业务逻辑
     * @protected
     * @method {__doShowCard}
     * @return {Void}
     */
    _proCardCommand.__doShowCard = _f;
    /**
     * 执行命令
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {nej.ut.cmd._$$CardCommand}
     */
    _proCardCommand._$execute = function(_options){
        _v._$dispatchEvent(document,'click');
        var _node = _options.target,
            _offset = _e._$offset(_node);
        this.__fopt.top = _offset.y+_node.offsetHeight+1;
        this.__fopt.left = _offset.x;
        this.__doShowCard();
        return this;
    };
};
define('{lib}util/editor/command/card.js',
      ['{lib}util/editor/command.js'],f);