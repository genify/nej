/*
 * ------------------------------------------
 * 树节点对象实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    '{lib}util/event.js'
],function(NEJ,_k,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 树节点对象<br/>
     * 
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       '{lib}util/dispatcher/dsp/node.js'
     *   ],function(_p){
     *       //      ___
     *       //     |_/_|       <-- 节点名称为"/"的节点
     *       //     /   \
     *       //   _/_   _\_ 
     *       //  |_a_| |_b_|    <-- 节点名称为"b"的节点
     * 
     *       // 分配一个名称为“/”的节点
     *       var _root = _p._$$Node._$allocate();
     *   
     *       // 分配一个名称为“a”的节点，并指定父节点为_root
     *       var _node = _p._$$Node._$allocate({
     *           parent:_root,
     *           name:'a'
     *       });
     *   
     *       // 分配一个名称为“b”的节点，手动设置父节点
     *       var _node = _$$Node._$allocate({
     *           name:'b'
     *       });
     *       _node._$setParent(_root);
     *   
     *       // 回收树，同时回收节点的所有子孙节点
     *       _root = _root._$recycle();
     *   });
     * ```
     * 
     * @class    {_$$Node}
     * @extends  {util/event#_$$EventTarget}
     * 
     * @param    {Object} 可选配置参数
     * @property   {_$$Node}  parent 父节点
     * @property   {String}   name   节点名称，默认为"/"
     * @property   {Object}   data   节点缓存的数据信息
     * 
     */
    _p._$$Node = _k._$klass();
    _pro = _p._$$Node._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__children = [];
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
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
    _pro.__destroy = (function(){
        var _doRecycle = function(_node,_index,_list){
            _list.splice(_index,1);
            _node._$recycle();
        };
        return function(){
            this.__super();
            delete this.__data;
            _u._$reverseEach(
                this.__children,
                _doRecycle
            );
            this._$setParent(null);
        };
    })();
    /**
     * 是否节点实例
     * @protected
     * @method {__isNode}
     * @param  {_$$Node} 节点
     * @return {Boolean}        是否节点实例
     */
    _pro.__isNode = function(_node){
        return _node instanceof this.constructor;
    };
    /**
     * 是否有子节点
     * @protected
     * @method {__hasChild}
     * @param  {_$$Node} 子节点
     * @return {Boolean} 是否有子节点
     */
    _pro.__hasChild = function(_child){
        return _u._$indexOf(this.__children,_child)>=0;
    };
    /**
     * 取节点名称
     * @method {_$getName}
     * @return {String} 节点名称
     */
    _pro._$getName = function(){
        return this.__name;
    };
    /**
     * 取节点保存的信息
     * @method {_$getData}
     * @return {Object} 数据信息
     */
    _pro._$getData = function(){
        return this.__data;
    };
    /**
     * 取当前节点路径
     * @method {_$getPath}
     * @return {String} 路径
     */
    _pro._$getPath = function(){
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
     * @return {_$$Node} 父节点
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
     * 取指定名称的子节点
     * @method {_$getChildByName}
     * @param  {String}  名称
     * @return {_$$Node} 子节点
     */
    _pro._$getChildByName = function(_name){
        var _index = _u._$indexOf(
            this.__children,function(_node){
                return _name==_node._$getName();
            }
        );
        return this.__children[_index]||null;
    };
    /**
     * 设置父节点
     * @method {_$setParent}
     * @param  {_$$Node} 父节点
     * @return {Void}
     */
    _pro._$setParent = function(_parent){
        _parent = this.__isNode(_parent)?_parent:null;
        if (_parent==this.__parent) return;
        !!_parent ? _parent._$appendChild(this)
                  : this.__parent._$removeChild(this);
        this.__parent = _parent;
    };
    /**
     * 添加子节点
     * @method {_$appendChild}
     * @param  {_$$Node} 子节点
     * @return {Void}
     */
    _pro._$appendChild = function(_child){
        _child = this.__isNode(_child)?_child:null;
        if (!_child||this.__hasChild(_child)) return;
        this.__children.push(_child);
        _child._$setParent(this);
    };
    /**
     * 删除子节点
     * @method {_$removeChild}
     * @param  {_$$Node} 子节点
     * @return {_$$Node} 删除的节点
     */
    _pro._$removeChild = function(_child){
        _child = this.__isNode(_child)?_child:null;
        var _index = _u._$indexOf(this.__children,_child);
        if (_index>=0){
            this.__children.splice(_index,1);
            _child._$setParent(null);
        }
        return _child;
    };
    
    return _p;
});
