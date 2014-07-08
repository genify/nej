var f = function(){
	var _  = NEJ.P,
		_h = _('nej.h');
	/**
     * 将Hash推入历史
     * @param  {String} _hash HASH值
     * @return {Void}
     */
    _h.__pushHistory = function(_hash){
        // do nothing
    };
};
define(['{lib}base/platform.js'],f);