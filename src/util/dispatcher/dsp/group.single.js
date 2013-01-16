/*
 * ------------------------------------------
 * 模块分组管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _p = _('nej.ut.p'),
        _proSingleGroupManager;
    if (!!_p._$$SingleGroupManager) return;
    /**
     * 模块分组管理器
     * 
     * @class   {nej.ut.p._$$SingleGroupManager}
     * @extends {nej.ut.p._$$GroupManager}
     * 
     * @param  {Object}  可选配置参数
     * @config {Boolean} classed 是否需要切换样式
     * 
     * 
     * 
     */
    _p._$$SingleGroupManager = NEJ.C();
      _proSingleGroupManager = _p._$$SingleGroupManager._$extend(_p._$$GroupManager);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @return {Void}
     */
    _proSingleGroupManager.__reset = function(_options){
        this.__supReset(_options);
        this.__classed = !!_options.classed;
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proSingleGroupManager.__destroy = function(){
        this.__supDestroy();
        delete this.__cmroot;
        delete this.__source;
    };
    /**
     * 判断当前模块是否可以退出
     * @method {_$exitable}
     * @param  {Object}  目标信息
     * @return {Boolean} 是否允许退出当前模块
     */
    _proSingleGroupManager._$exitable = function(_event){
        if (!this.__source) return !0;
        var _module = this.__source._$getData().module;
        // sure module has loaded
        if (_p._$isModule(_module))
            _module._$dispatchEvent('onbeforehide',_event);
        return !_event.stopped;
    };
    /**
     * 刷新当前模块
     * @method {_$refresh}
     * @return {Void}
     */
    _proSingleGroupManager._$refresh = function(){
        if (!this.__source) return;
        // keep asynchronous for finishing last process
        window.setTimeout(
            this._$dispatchUMI._$bind(this,
                this.__source._$getPath()),0
        );
    };
    /**
     * 调度到指定UMI的模块,大致调度策略为:
     * <ol>
     *   <li>计算原始节点与目标节点的公共节点</li>
     *   <li>依次刷新根节点到公共节点之间的节点上注册的模块</li>
     *   <li>依次隐藏原始节点到公共节点之间的节点上注册的模块</li>
     *   <li>依次显示公共节点到目标节点之间的节点上注册的模块</li>
     * </ol>
     * 执行过程中遇到任何需要动态载入的模块均自动载入,
     * 子节点执行操作之前必须确保父节点已执行完相应操作<br/>
     * 以下两种情况忽略本次调度逻辑:
     * <ul>
     *   <li>需要调度的UMI非本组管理器的UMI</li>
     *   <li>需要调度的UMI上没有注册模块</li>
     * </ul>
     * @method {_$dispatchUMI}
     * @param  {String}                 模块UMI
     * @return {nej.ut._$$GroupManager} 分组管理器实例
     */
    _proSingleGroupManager._$dispatchUMI = function(_umi){
        if (!this._$hasUMI(_umi)) return this;
        var _target = _p._$getNodeByUMI(this.__root,_umi),
            _data = _target._$getData();
        // no module registed in target
        if (!_data.module) return this;
        // update event information
        var _source = this.__source,
            _event  = _data.event,
            _odata  = _o;
        this.__source = _target;
        this.__doClearStopped(_target);
        if (!!_source){
            _odata = _source._$getData().event;
            _event.referer = _odata.href||'';
        }
        // source==target do refresh
        if (_source==_target){
            this.__doModuleRefresh(this.__source);
            return this;
        }
        // hide source
        this.__cmroot = _p._$getCommonRoot(this
                          .__root,_source,_target);
        if (_source!=null){
            // hide source -> common root
            if (_source!=this.__cmroot){
                if (this.__classed)
                    _e._$delClassName(document.body,_odata.clazz);
                this.__doModuleHide(_source,this.__cmroot);
            }
            // refresh common root -> root
            this.__doModuleRefresh(this.__cmroot);
        }else{
            // show common root -> root
            this.__doModuleShow(this.__cmroot);
        }
        // show target
        if (_target!=this.__cmroot){
            if (this.__classed)
                _e._$addClassName(document.body,_event.clazz);
            // show target -> common root
            this.__doModuleShow(_target,this.__cmroot);
        }
        return this;
    };
    /**
     * 指定UMI的模块载入完成
     * @method {_$loadedUMI}
     * @param  {String}                 模块UMI
     * @return {nej.ut._$$GroupManager} 分组管理器实例
     */
    _proSingleGroupManager._$loadedUMI = function(_umi){
        if (this._$hasUMI(_umi))
            this.__doModuleAction(this.__source);
        return this;
    };
    /**
     * 隐藏指定UMI的模块，不做任何处理
     * @param  {String}                   模块UMI
     * @return {nej.ut.p._$$GroupManager} 分组管理器实例
     */
    _proSingleGroupManager._$hideUMI = _f;
};
define('{lib}util/dispatcher/dsp/group.single.js',
      ['{lib}util/dispatcher/dsp/group.js'],f);