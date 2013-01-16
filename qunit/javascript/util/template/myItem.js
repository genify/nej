var f = function(){
	var _  = NEJ.P,
	    _p = _('nej.ut'),
		_e = _('nej.e'),
		_v = _('nej.v'),
		_u = _('nej.ui'),
		_proMyItem;
	var _html_key = _e._$addNodeTemplate('<div>123</div>');
    _p._$$MyItem = NEJ.C();
	_proMyItem = _p._$$MyItem._$extend(_u._$$Item);
	
	
	_proMyItem.__reset = function(_options){
		this.__data = _options.data;
		this.__supReset(_options);
	}
	/**
	 * 刷新一项的信息
	 */
	_proMyItem.__doRefresh = function(){
		this.__body.innerText = this.__data.name;
	};
	
	_proMyItem.__initXGui = function(){
        this.__seed_html = _e._$getNodeTemplate(_html_key);
    };
	
	
};
define('{pro}util/template/myItem.js',['{lib}ui/item/item.js'],f)
