/*
 * ------------------------------------------
 * 模块分组管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/util.js',
    '{lib}base/klass.js',
    '{lib}base/constant.js',
    '{lib}base/element.js',
    '{lib}util/ajax/tag.js',
    '{lib}util/event.js',
    '{lib}util/template/tpl.js',
    './util.js'
],function(_u,_k,_g,_e,_j,_t0,_t1,_t2,_p,_o,_f,_r){
    var _pro;
    /**
     * 模块分组管理器
     * 
     * @class   {_$$GroupManager}
     * @extends {_$$EventTarget}
     * 
     * @param  {Object}  可选配置参数
     * @config {_$$Node}       root       树根节点
     * @config {_$$Dispatcher} dispatcher 调度器
     */
    _p._$$GroupManager = _k._$klass();
    _pro = _p._$$GroupManager._$extend(_t0._$$EventTarget);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {_$$Node} root 树根节点
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__root = _options.root;
        this.__dispatcher = _options.dispatcher;
        this.__mpool = {}; // umi in this group
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__root;
        delete this.__mpool;
        delete this.__dispatcher;
    };
    /**
     * 判断父节点是否被阻止行为
     * @protected
     * @method {__isStopped}
     * @param  {_$$Node} 节点
     * @return {Boolean} 是否被阻止
     */
    _pro.__isStopped = function(_node){
        if (!_t2._$isNode(_node)) return !1;
        return !!_node._$getData().stopped||
               this.__isStopped(_node._$getParent());
    };
    /**
     * 清理阻止标记
     * @protected
     * @method {__doClearStopped}
     * @param  {_$$Node} 节点
     * @return {Void}
     */
    _pro.__doClearStopped = function(_node){
        if (!_t2._$isNode(_node)) return;
        delete _node._$getData().stopped;
        this.__doClearStopped(_node._$getParent());
    };
    /**
     * 隐藏模块
     * @protected
     * @method {__doModuleHide}
     * @param  {_$$Node} 起始节点（包含）
     * @param  {_$$Node} 结束节点（不包含）
     * @return {Void}
     */
    _pro.__doModuleHide = function(_from,_to){
        this.__doModuleCheck('onhide',_from,_to);
    };
    /**
     * 模块显示并检测
     * @protected
     * @method {__doModuleShow}
     * @param  {_$$Node} 起始节点（包含）
     * @param  {_$$Node} 结束节点（不包含）
     * @return {Void}
     */
    _pro.__doModuleShow = function(_from,_to){
        this.__doModuleCheck('onshow',_from,_to);
        this.__doModuleAction(_from);
    };
    /**
     * 刷新模块
     * @protected
     * @method {__doModuleRefresh}
     * @param  {_$$Node} 节点对象
     * @return {Void}
     */
    _pro.__doModuleRefresh = function(_node){
        this.__doModuleCheck('onrefresh',_node);
        this.__doModuleAction(_node);
    };
    /**
     * 标记操作
     * @protected
     * @method {__doModuleCheck}
     * @param  {String}  调度类型
     * @param  {_$$Node} 起始节点（包含）
     * @param  {_$$Node} 结束节点（不包含）
     * @return {Void}
     */
    _pro.__doModuleCheck = function(_type,_from,_to){
        if (_from==_to||!_t2._$isNode(_from)){
            return;
        }
        // dispatch first if hide module
        if (_type=='onhide'){
            this.__doModuleDispatch(_from,_type);
        }
        this.__doModuleCheck(
            _type,_from._$getParent(),_to
        );
        if (_type!='onhide'){
            this.__doModuleDispatch(_from,_type);
        }
    };
    /**
     * 执行模块行为
     * @protected
     * @method {__doModuleAction}
     * @param  {_$$Node} 节点对象
     * @return {Boolean} 节点行为是否执行完成
     */
    _pro.__doModuleAction = function(_node){
        if (!_t2._$isNode(_node)){
            return !0;
        }
        var _data = _node._$getData(),
            _action = _data.action,
            _module = _data.module;
        // check parent dispatched
        // check module loading
        if (!this.__doModuleAction(_node._$getParent())||
           (!!_action&&_u._$isString(_module))){
            return !1;
        }
        // dispatch action
        if (!!_module&&
            !!_module._$allocate&&
           (!!_action&&_action!='onhide')){
            // check node stopped
            if (this.__isStopped(_node)) return;
            var _options = {
                umi:_node._$getPath(),
                composite:_data.composite,
                dispatcher:this.__dispatcher
            };
            _module = _module._$allocate(_options);
            if (_t2._$isModule(_module)){
                _data.module = _module;
                this.__doModuleDispatch(_node,'onshow');
            }else{
                delete _data.module;
            }
        }
        delete _data.action;
        
        return !0;
    };
    /**
     * 调度模块事件，如果模块已经载入则调度相应操作，如果模块未载入则先载入模块
     * @protected
     * @method {__doModuleDispatch}
     * @param  {_$$Node} 节点对象
     * @param  {String}  事件名称 onshow/onhide/onrefresh
     * @return {Void}
     */
    _pro.__doModuleDispatch = (function(){
        // get nearest parent export data
        var _getParentExport = function(_node){
            var _module;
            _node = _node._$getParent();
            while(!!_node){
                _module = _node._$getData().module;
                if (_t2._$isModule(_module)){
                    return _module._$getExportData();
                }
                _node = _node._$getParent();
            }
            return null;
        };
        return function(_node,_name){
            if (!_t2._$isNode(_node)){
                return;
            }
            // format data
            var _data = _node._$getData(),
                _module = _data.module,
                _nothide = _name!='onhide';
            if (_t2._$isModule(_module)){
                // check node stopped
                if (_nothide&&this.__isStopped(_node)){
                    return;
                }
                // check event
                var _event = !this.__source ? _data.event
                             :this.__source._$getData().event;
                if (!!_event){
                    _event.umi = _node._$getPath();
                    _event.data = _getParentExport(_node);
                }
                // check event name
                // order must be onhide->onshow->onrefresh
                // onshow must after onhide
                var _xname = _data.xname||'onhide';
                if (_name=='onshow'&&_xname!='onhide'){
                    _name = 'onrefresh';
                }
                // onrefresh must after onshow
                if (_name=='onrefresh'&&_xname=='onhide'){
                    _name = 'onshow';
                }
                _data.xname = _name;
                // do dispatch event
                _module._$dispatchEvent(_name,_event||{});
                // position to element
                if (_nothide&&
                    !!_event&&
                    !!_event.pos&&
                    _event.umi==_event.target){
                    _e._$scrollTo(_event.pos);
                }
                // check stopped flag
                if (_nothide&&!!_event){
                    _data.stopped = _event.stopped;
                    delete _event.stopped;
                }
            }else if(!!_module){
                _data.action = _name;
                if (_name=='onshow'&&_u._$isString(_module)){
                    // check module template inline
                    var _element = _e._$get('umi://'+_module);
                    if (!!_element){
                        _t1._$parseTemplate(_element);
                    }else{
                        var _config = location.config||_o;
                        _j._$loadHtml((_config.root||'')+_module,{
                            version:(_config.ver||_o)[_module],
                            onloaded:_t1._$parseTemplate
                        });
                    }
                }
            }
        };
    })();
    /**
     * 判断UMI是否属于该分组管理器
     * @method {_$hasUMI}
     * @param  {String}  模块UMI
     * @return {Boolean} 是否属于该分组管理器
     */
    _pro._$hasUMI = function(_umi){
        return !!this.__mpool[_umi];
    };
    /**
     * 将UMI加入分组管理器中
     * @method {_$addUMI}
     * @param  {String} 模块UMI
     * @return {Void}
     */
    _pro._$addUMI = function(_umi){
        this.__mpool[_umi] = !0;
    };
    /**
     * 删除分组管理器中的UMI
     * @method {_$delUMI}
     * @param  {Object} 模块UMI
     * @return {Void}
     */
    _pro._$delUMI = function(_umi){
        delete this.__mpool[_umi];
    };
    /**
     * 指定UMI的模块载入完成
     * @method {_$loadedUMI}
     * @param  {String} 模块UMI
     * @return {Void}
     */
    _pro._$loadedUMI = function(_umi){
        if (this._$hasUMI(_umi)){
            this.__doModuleAction(
                _t2._$getNodeByUMI(this.__root,_umi)
            );
        }
    };
    /**
     * 调度到指定UMI的模块
     * @method {_$dispatchUMI}
     * @param  {String} 模块UMI
     * @return {Void}
     */
    _pro._$dispatchUMI = function(_umi){
        if (this._$hasUMI(_umi)){
            var _node = _t2._$getNodeByUMI(this.__root,_umi);
            this.__doClearStopped(_node);
            this.__doModuleShow(_node);
        }
    };
    /**
     * 隐藏指定UMI的模块
     * @method {_$hideUMI}
     * @param  {String} 模块UMI
     * @return {Void}
     */
    _pro._$hideUMI = function(_umi){
        if (this._$hasUMI(_umi)){
            this.__doModuleHide(
                _t2._$getNodeByUMI(this.__root,_umi)
            );
        }
    };
    
    return _p;
});
