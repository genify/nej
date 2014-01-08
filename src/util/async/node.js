/*
 * ------------------------------------------
 * 异步任务节点支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$TNode) return;
    /**
     * 异步任务节点，代码示例
     * [code]
     * 
     *   // 创建任务节点
     *   var _node = nej.ut._$$TNode._$allocate({
     *       name:'a'
     *       onaction:function(_event){
     *           // _event.args    -> 所有依赖的父任务的执行结果
     *           // _event.value   -> 当前任务执行结果，子任务可通过_event.args获取
     *           // _event.next()  -> 继续执行下一任务
     *           // _event.error() -> 出错退出任务
     *       }
     *   });
     *   // 回收节点
     *   _node._$recycle();
     * 
     * [/code]
     * @class   {nej.ut._$$TNode}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数
     * @config  {String} name 任务名称
     * 
     * [hr]
     * 执行任务事件
     * @event   {onaction}
     * @param   {Object} 任务信息
     * @config  {Array}    args  参数信息，所有依赖的父任务的执行结果列表
     * @config  {Variable} value 执行结果，子任务可通过args获取
     * @config  {Function} next  继续执行下一任务
     * @config  {Function} error 出错退出所有任务
     * 
     * 
     */
    _p._$$TNode = NEJ.C();
    _pro = _p._$$TNode._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @return {Void}
     */
    _pro.__init = function(){
        this.__supInit();
        
    };
    /**
     * 控件重置
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__name = _options.name
            ||('task-'+_u._$uniqueID());
        this.__parent = [];
        this.__children = [];
        this._$updateState(0);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        delete this.__name;
        
    };
    /**
     * 获取任务执行状态
     * @method {_$getState}
     * @return {Number} 状态值
     */
    _pro._$getState = function(){
        return this.__state;
    };
    /**
     * 取父节点列表
     * @method {_$getParent}
     * @return {Array} 父节点列表
     */
    _pro._$getParent = function(){
        return this.__parent;
    };
    /**
     * 取子节点列表
     * @method {_$getChildren}
     * @return {Array} 子节点列表
     */
    _pro._$getChildren = function(){
        return this.__children;
    };
    /**
     * 节点加入任务树
     * @method {_$appendTo}
     * @param  {nej.ut._$$TNode} 父节点
     * @return {Void}
     */
    _pro._$appendTo = function(_parent){
        // check parent instance
        if (!(_parent instanceof this)){
            return;
        }
        // check parent list
        var _index = _u._$indexOf(
            this.__parent,_parent
        );
        if (_index>=0){
            return;
        }
        // push parent
        this.__parent.push(_parent);
        _parent._$appendChild(this);
    };
    /**
     * 追加子任务节点
     * @method {_$appendChild}
     * @param  {nej.ut._$$TNode} 子任务节点
     * @return {Void}
     */
    _pro._$appendChild = function(_child){
        // check child instance
        if (!(_child instanceof this)){
            return;
        }
        // check children list
        var _index = _u._$indexOf(
            this.__children,_child
        );
        if (_index>=0){
            return;
        }
        // push child
        this.__children.push(_child);
        _child._$appendTo(this);
    };
    /**
     * 更新任务执行状态
     * [ntb]
     *   状态值        |  说明
     *   -1        |  任务执行失败
     *    0        |  任务等待中
     *    1        |  任务执行中
     *    2        |  任务执行成功
     * [/ntb]
     * @method {_$setState}
     * @param  {Number} 状态值
     * @return {Void}
     */
    _pro._$updateState = function(_state){
        _state = parseInt(_state)||0;
        this.__state = Math.max(-1,Math.min(_state,2));
    };
    
    
};
define(
    '{lib}util/async/node.js',[
    '{lib}util/event/event.js'
],f);