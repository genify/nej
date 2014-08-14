/*
 * ------------------------------------------
 * 命令弹出卡片封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/editor/command.js'
],function(NEJ,_k,_e,_v,_t0,_p,_o,_f,_r){
   var _pro;
    /**
     * 命令弹出卡片
     * @class   {nej.ut.cmd._$$CardCommand} 命令弹出卡片
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     */
    _p._$$CardCommand = _k._$klass();
    _pro = _p._$$CardCommand._$extend(_t0._$$EditorCommand);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__fopt = {
            destroyable:!0,
            parent:document.body,
            onchange:this.__onChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 卡片内容变化回调，子类实现具体业务逻辑
     * @protected
     * @method {__onChange}
     * @return {Void}
     */
    _pro.__onChange = _f;
    /**
     * 显示卡片，子类实现具体业务逻辑
     * @protected
     * @method {__doShowCard}
     * @return {Void}
     */
    _pro.__doShowCard = _f;
    /**
     * 执行命令
     * @method {_$execute}
     * @param  {Object} 执行参数
     * @return {Void}
     */
    _pro._$execute = function(_options){
        _v._$dispatchEvent(document,'click');
        var _node = _options.target,
            _offset = _e._$offset(_node);
        this.__fopt.top = _offset.y+_node.offsetHeight+1;
        this.__fopt.left = _offset.x-1;
        this.__fopt.width = _node.clientWidth;
        this.__doShowCard();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});