var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _i = _('nej.ui'),
        _p = _('tst.ut'),
        _proItem,
        _supItem;
        
        
    _p._$$Item = NEJ.C();
      _proItem = _p._$$Item._$extend(_i._$$ListItem);
    /**
     * 初始化模版
     */
    _proItem.__initXGui = function() {
        this.__seed_html = 'ntp-item';
    };
    /**
     * 
     */
    _proItem.__initNode = function(){
    	this.__supInitNode();
    	var _list = _e._$getByClassName(this.__body,'js-flag');
    	this.__nbox = _list[2];
    	_v._$addEvent(_list[0],'click',this.__onDelete._$bind(this));
    	_v._$addEvent(_list[1],'click',this.__onUpdate._$bind(this));
    };
    /**
     * 刷新项,子类实现具体逻辑
     * @protected
     * @method {__doRefresh}
     * @return {Void}
     */
    _proItem.__doRefresh = function(_data){
    	this.__nbox.innerText = this.__index+'. '+_data.name+'：'+_u._$format(_data.loginTime,'yyyy-MM-dd HH:mm:ss');
    };
};
define('{pro}item.js',['{lib}ui/item/list.js'],f);
