/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proAbstractModule;
    if (!!_p._$$AbstractModule) return;
    /**
     * 项目模块基类对象
     * @class   {nej.ut._$$AbstractModule}
     * @extends {nej.ut._$$Module}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$AbstractModule = NEJ.C();
      _proAbstractModule = _p._$$AbstractModule._$extend(_p._$$Module);
    /**
     * 解析模块所在容器节点
     * @param  {Object} 配置信息
     * @return {Node}   模块所在容器节点
     */
    _proAbstractModule.__doParseParent = function(_options){
        // try get parent
        // check input first
        var _parent;
        if (!_parent){
            var _data = _options.input||_o;
            _parent = _e._$get(_data.parent);
        }
        if (!_parent){
            var _data = _options.data||_o;
            _parent = _e._$get(_data.parent);
        }
        if (!_parent){
            _parent = _e._$get(_options.parent);
        }
        return _parent;
    };
    /**
     * 显示模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onShow}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proAbstractModule.__onShow = function(_options){
        var _parent = this.__doParseParent(_options);
        // show and refresh module
        if (!!_parent&&!!this.__body) 
            _parent.appendChild(this.__body);
        this.__supOnShow(_options);
        this.__doApplyComposite('onshow',_options);
        this.__onRefresh(_options);
    };
    /**
     * 显示模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onRefresh}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proAbstractModule.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        this.__doApplyComposite('onrefresh',_options);
    };
    /**
     * 隐藏模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onHide}
     * @return {Void}
     */
    _proAbstractModule.__onHide = function(){
        this.__supOnHide();
        _e._$removeByEC(this.__body);
    };
    /**
     * 应用组合模块
     * @param  {String} 类型，onshow/onrefresh
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proAbstractModule.__doApplyComposite = function(_type,_options){
        var _query = _u._$object2query(_options.param);
        _u._$forIn(
            this.__composites[_type],
            function(_umi,_pid){
                if (!!_query) _umi += '?'+_query;
                this.__dispatcher._$redirect(_umi,{
                    input:{parent:this.__export[_pid]}
                });
            },this
        );
    };
};
NEJ.define('{lib}util/dispatcher/module.base.js',
          ['{lib}util/dispatcher/module.2.js'],f);