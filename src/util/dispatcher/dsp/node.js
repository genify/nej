/*
 * ------------------------------------------
 * 树节点对象实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ut.p'),
        _proNode;
    if (!!_p._$$Node) return;
    /**
     * 树节点对象<br/>
     * 
     * 脚本举例
     * [code]
     *   //      ___
     *   //     |_/_|       <-- 节点名称为"/"的节点
     *   //     /   \
     *   //   _/_   _\_ 
     *   //  |_a_| |_b_|    <-- 节点名称为"b"的节点
     * 
     *   // 分配一个名称为“/”的节点
     *   var _root = nej.ut.p._$$Node._$allocate();
     *   
     *   // 分配一个名称为“a”的节点，并指定父节点为_root
     *   var _aNode = nej.ut.p._$$Node._$allocate({
     *       parent:_root,
     *       name:'a'
     *   });
     *   
     *   // 分配一个名称为“b”的节点，手动设置父节点
     *   var _bNode = nej.ut.p._$$Node._$allocate({
     *       name:'b'
     *   });
     *   _bNode._$setParent(_root);
     *   
     *   // 回收树，同时回收节点的所有子孙节点
     *   _root = _root._$recycle();
     * [/code]
     * 
     * @class    {nej.ut.p._$$Node}
     * @extends  {nej.ut._$$Event}
     * 
     * @param    {Object} 可选配置参数
     * @config   {nej.ut.p._$$Node}  父节点
     * @config   {String}            节点名称，默认为"/"
     * @config   {Object}            节点缓存的数据信息
     * 
     */
    _p._$$Node = NEJ.C();
      _proNode = _p._$$Node._$extend(_t._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proNode.__init = function(){
        this.__supInit();
        this.__children = [];
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proNode.__reset = function(_options){
        this.__supReset(_options);
        this._$setParent(_options.parent);
        this.__name = _options.name||'/';
        this.__data = _options.data||{};
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proNode.__destroy = (function(){
        var _doRecycle = function(_node,_index,_list){
            _list.splice(_index,1);
            _node._$recycle();
        };
        return function(){
            this.__supDestroy();
            delete this.__data;
            _u._$reverseEach(this
              .__children,_doRecycle);
            this._$setParent(null);
        };
    })();
    /**
     * 是否节点实例
     * @protected
     * @method {__isNode}
     * @param  {nej.ut.p._$$Node} 节点
     * @return {Boolean}        是否节点实例
     */
    _proNode.__isNode = function(_node){
        return _node instanceof _p._$$Node;
    };
    /**
     * 是否有子节点
     * @protected
     * @method {__hasChild}
     * @param  {nej.ut.p._$$Node} 子节点
     * @return {Boolean}        是否有子节点
     */
    _proNode.__hasChild = function(_child){
        return _u._$indexOf(this.__children,_child)>=0;
    };
    /**
     * 取节点名称
     * @method {_$getName}
     * @return {String} 节点名称
     */
    _proNode._$getName = function(){
        return this.__name;
    };
    /**
     * 取节点保存的信息
     * @method {_$getData}
     * @return {Object} 数据信息
     */
    _proNode._$getData = function(){
        return this.__data;
    };
    /**
     * 取当前节点路径
     * @method {_$getPath}
     * @return {String} 路径
     */
    _proNode._$getPath = function(){
        var _parent = this._$getParent(),
            _name = this._$getName();
        if (!_parent) return _name;
        var _pname = _parent._$getName();
        if (_pname!='/'&&_name!='/')
            _name = '/'+_name;
        return _parent._$getPath()+_name;
    };
    /**
     * 取父节点
     * @method {_$getParent}
     * @return {nej.ut.p._$$Node} 父节点
     */
    _proNode._$getParent = function(){
        return this.__parent;
    };
    /**
     * 取子节点列表
     * @method {_$getChildren}
     * @return {Array} 子节点列表
     */
    _proNode._$getChildren = function(){
        return this.__children;
    };
    /**
     * 取指定名称的子节点
     * @method {_$getChildByName}
     * @param  {String}         名称
     * @return {nej.ut.p._$$Node} 子节点
     */
    _proNode._$getChildByName = function(_name){
        var _index = _u._$indexOf(this.__children,
                     function(_node){
                         return _name==_node._$getName();
                     });
        return this.__children[_index]||null;
    };
    /**
     * 设置父节点
     * @method {_$setParent}
     * @param  {nej.ut.p._$$Node} 父节点
     * @return {nej.ut.p._$$Node} 当前节点
     */
    _proNode._$setParent = function(_parent){
        _parent = this.__isNode(_parent)?_parent:null;
        if (_parent==this.__parent) return;
        !!_parent ? _parent._$appendChild(this)
                  : this.__parent._$removeChild(this);
        this.__parent = _parent;
        return this;
    };
    /**
     * 添加子节点
     * @method {_$appendChild}
     * @param  {nej.ut.p._$$Node} 子节点
     * @return {nej.ut.p._$$Node} 当前节点
     */
    _proNode._$appendChild = function(_child){
        _child = this.__isNode(_child)?_child:null;
        if (!_child||this.__hasChild(_child)) return;
        this.__children.push(_child);
        _child._$setParent(this);
        return this;
    };
    /**
     * 删除子节点
     * @method {_$removeChild}
     * @param  {nej.ut.p._$$Node} 子节点
     * @return {nej.ut.p._$$Node} 删除的节点
     */
    _proNode._$removeChild = function(_child){
        _child = this.__isNode(_child)?_child:null;
        var _index = _u._$indexOf(this.__children,_child);
        if (_index>=0){
            this.__children.splice(_index,1);
            _child._$setParent(null);
        }
        return _child;
    };
};
NEJ.define('{lib}util/dispatcher/dsp/node.js'
     ,['{lib}util/event.js'],f);