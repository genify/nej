/*
 * ------------------------------------------
 * 延时加载控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/lazy/loading */
NEJ.define([
    'base/klass',
    'base/element',
    'base/util',
    'util/event'
],function(_k,_e,_u,_t,_p,_o,_f,_r,_pro){
    /**
     * 延时加载控件基类
     * 
     * @class   module:util/lazy/loading._$$LazyLoading
     * @extends module:util/event._$$EventTarget
     * 
     * @config   {Object}      config - 配置信息
     * @property {Node|String} parent - 滚动条所在容器，默认为根结点
     * @property {String}      attr   - 属性标识名称，多个值用逗号分隔，如src则表示需要用到的信息在data-src上
     */
    /** 
     * 资源检测触发事件
     * 
     * @event    module:util/lazy/loading._$$LazyLoading#oncheck
     * @param    {Object}  event   - 事件信息
     * @property {Node}    target  - 资源节点
     * @property {Object}  config  - 滚动容器信息，scrollTop/clientHeight...
     * @property {Number}  value   - 操作标识，-1 - 移除，0 - 不做处理， 1 - 追加到页面
     */
    /** 
     * 资源从页面移除触发事件
     * 
     * @event    module:util/lazy/loading._$$LazyLoading#onremove
     * @param    {Object}  event   - 事件信息
     * @property {Node}    target  - 资源节点
     * @property {Object}  config  - attr属性指定的配置信息
     * @property {Boolean} stopped - 是否阻止后续逻辑
     */
    /** 
     * 资源追加到页面触发事件
     * 
     * @event    module:util/lazy/loading._$$LazyLoading#onappend
     * @param    {Object}  event   - 事件信息
     * @property {Node}    target  - 资源节点
     * @property {Object}  config  - attr属性指定的配置信息
     * @property {Boolean} stopped - 是否阻止后续逻辑
     */
    _p._$$LazyLoading = _k._$klass();
    _pro = _p._$$LazyLoading._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/lazy/loading._$$LazyLoading#__reset
     * @param  {Object} arg0 - 配置信息
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__name = _options.attr||'';
        this.__parent = _e._$get(_options.parent);
        this.__doInitDomEvent([[
            this.__parent||window,'scroll',
            this.__doCheckScrollPosition._$bind(this)
        ]]);
        this.__doCheckScrollPosition();
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/lazy/loading._$$LazyLoading#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        delete this.__parent;
        this.__super();
    };
    /**
     * 取滚动视图
     * 
     * @protected
     * @method module:util/lazy/loading._$$LazyLoading#__getScrollViewPort
     * @return {Object} 滚动视图信息
     */
    _pro.__getScrollViewPort = function(){
        return this.__parent||_e._$getPageBox();
    };
    /**
     * 取配置信息
     * 
     * @protected
     * @method module:util/lazy/loading._$$LazyLoading#__getSettingInfo
     * @param  {Node} arg0 - 节点
     * @return {Object}      配置信息
     */
    _pro.__getSettingInfo = function(_node){
        var _ret = {};
        _u._$forEach(
            this.__name.split(','),function(_name){
                _ret[_name] = _e._$dataset(_node,_name);
            }
        );
        return _ret;
    };
    /**
     * 滚动检测
     * 
     * @protected
     * @method module:util/lazy/loading._$$LazyLoading#__doCheckScrollPosition
     * @return {Void}
     */
    _pro.__doCheckScrollPosition = (function(){
        var _nmap = {
            '-1':'onremove',
             '1':'onappend'
        };
        return function(_event){
            var _list = this.__getResourceList(
                this.__parent||document
            );
            var _pbox = this.__getScrollViewPort();
            _u._$forEach(
                _list,function(_node){
                    // check node
                    var _eobj = {
                        target:_node,
                        config:_pbox
                    };
                    this._$dispatchEvent('oncheck',_eobj);
                    // check action result
                    var _ret = _eobj.value;
                    if (_ret==null){
                        _ret = this.__doCheckResource(_node,_pbox);
                    }
                    var _name = _nmap[_ret];
                    if (!_name){
                        return;
                    }
                    // check action
                    var _eobj = {
                        target:_node,
                        config:this.__getSettingInfo(_node)
                    };
                    this._$dispatchEvent(_name,_eobj);
                    if (!!_eobj.stopped){
                        return;
                    }
                    // do action
                    if (_ret==-1){
                        this.__doRemoveResource(_node);
                    }else{
                        this.__doAppendResource(
                            _node,_eobj.config
                        );
                    }
                },this
            );
        };
    })();
    /**
     * 取待验证资源列表，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/lazy/loading._$$LazyLoading#__getResourceList
     * @param  {Node} arg0 - 滚动条所在容器节点
     * @return {Void}
     */
    _pro.__getResourceList = _f;
    /**
     * 验证资源是否需要做处理，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/lazy/loading._$$LazyLoading#__getResourceList
     * @param  {Node}   arg0 - 资源节点
     * @param  {Object} arg1 - 滚动容器节点
     * @return {Number}        操作标识，-1 - 移除，0 - 不做处理， 1 - 追加到页面
     */
    _pro.__doCheckResource = _f;
    /**
     * 移除资源，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/lazy/loading._$$LazyLoading#__doRemoveResource
     * @param  {Node} arg0 - 资源节点
     * @return {Void}
     */
    _pro.__doRemoveResource = _f;
    /**
     * 添加资源，子类实现具体逻辑
     * 
     * @abstract
     * @method module:util/lazy/loading._$$LazyLoading#__doAppendResource
     * @param  {Node}   arg0 - 资源节点
     * @param  {Object} arg1 - 配置信息
     * @return {Void}
     */
    _pro.__doAppendResource = _f;
});
