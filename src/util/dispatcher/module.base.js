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
        _f = NEJ.F,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$AbstractModule) return;
    /**
     * 项目模块基类对象
     * @class   {nej.ut._$$AbstractModule}
     * @extends {nej.ut._$$Module}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$AbstractModule = NEJ.C();
      _pro = _p._$$AbstractModule._$extend(_p._$$Module);
    /**
     * 解析模块所在容器节点
     * @param  {Object} 配置信息
     * @return {Node}   模块所在容器节点
     */
    _pro.__doParseParent = function(_options){
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
    _pro.__onShow = function(_options){
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
    _pro.__onRefresh = function(_options){
        this.__supOnRefresh(_options);
        this.__doApplyComposite('onrefresh',_options);
    };
    /**
     * 隐藏模块触发事件，子类实现具体逻辑
     * @protected
     * @method {__onHide}
     * @return {Void}
     */
    _pro.__onHide = function(){
        this.__supOnHide();
        this.__doHideComposite();
        _e._$removeByEC(this.__body);
    };
    /**
     * 是否忽略模块组合
     * @return {Boolean} 是否忽略
     */
    _pro.__isEscapedComposite = (function(){
        var _reg0 = /^onshow|onrefresh|delay$/;
        return function(_umi){
            return _reg0.test(_umi);    
        };
    })();
    /**
     * 生成组合模块的输入参数，子类实现具体业务逻辑
     * @param  {String} 模块类别
     * @param  {Object} 输入信息
     * @return {Object} 参数信息
     */
    _pro.__doGenCompositeParam = _f;
    /**
     * 应用组合模块
     * @param  {String} 类型，onshow/onrefresh
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _pro.__doApplyComposite = (function(){
        var _doRedirect = function(_query,_options,_umi,_pid){
            if (this.__isEscapedComposite(_pid)) return;
            if (!!_query) _umi += (_umi.indexOf('?')>1?'&':'?')+_query;
            var _input = this.__doGenCompositeParam(_pid,_options)||{};
            _input.location = _options;
            _input.parent = this.__export[_pid];
            this.__dispatcher._$redirect(_umi,{input:_input});
        };
        return function(_type,_options){
            if (!_options.nodelay){
                // delay all
                if (!!this.__composites.delay) return;
                // check delay
                var _composite = this.__composites[_type]||_o;
                if (_composite.delay) return;
            }
            // do apply
            var _query = _u._$object2query(_options.param)||'';
            if (_type=='onrefresh'){
                _u._$forIn(
                    this.__composites,
                    _doRedirect._$bind(this,_query,_options)
                );
            }
            _u._$forIn(
                _composite,_doRedirect.
                _$bind(this,_query,_options)
            );
        };
    })();
    /**
     * 隐藏组合模块
     * @return {Void}
     */
    _pro.__doHideComposite = (function(){
        var _doHide = function(_umi,_pid){
            if (!this.__isEscapedComposite(_pid))
                 this.__dispatcher._$hide(_umi);
        };
        return function(){
            _u._$forIn(this.__composites,_doHide,this);
            _u._$forIn(this.__composites.onshow,_doHide,this);
            _u._$forIn(this.__composites.onrefresh,_doHide,this);
        };
    })();
};
NEJ.define(
    '{lib}util/dispatcher/module.base.js',[
    '{lib}util/dispatcher/module.2.js'
],f);