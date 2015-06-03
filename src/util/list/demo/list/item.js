NEJ.define([
    'base/klass',
    'base/util',
    'base/event',
    'base/element',
    'ui/item/list',
    'util/template/tpl',
    'text!./ntp.html'
],function(_k,_u,_v,_e,_i,_t,_html,_p,_pro){
    /**
     *
     */
    _p._$$Item = NEJ.C();
    _pro = _p._$$Item._$extend(_i._$$ListItem);
    /**
     *
     * @param _options
     * @private
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__doInitDomEvent(this.__xxev);
    };
    /**
     * 初始化模版
     */
    _pro.__initXGui = (function(){
        var _seed = _t._$addNodeTemplate(_html);
        return function() {
            this.__seed_html = _seed;
        };
    })();
    /**
     *
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getByClassName(
            this.__body,'js-flag'
        );
        this.__nbox = _list[2];
        this.__xxev = [[
            _list[0],'click',this.__onDelete._$bind(this)
        ],[
            _list[1],'click',this.__onUpdate._$bind(this)
        ]];
    };
    /**
     *
     * @param _event
     * @private
     */
    _pro.__onDelete = function(_event){
        _v._$stop(_event);
        this.__super();
    };
    /**
     *
     * @param _event
     * @private
     */
    _pro.__onUpdate = function(_event){
        _v._$stop(_event);
        this.__super();
    };
    /**
     * 刷新项,子类实现具体逻辑
     * @protected
     * @method {__doRefresh}
     * @return {Void}
     */
    _pro.__doRefresh = function(_data){
        this.__nbox.innerText =
            this.__index+'. '+_data.name+'：'+
            _u._$format(_data.loginTime,'yyyy-MM-dd HH:mm:ss');
    };
});