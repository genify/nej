var f = function(){
	// ie6 html patch
	NEJ.patch('TR==2.0',function(){
		var _  = NEJ.P,
			_h = _('nej.h');
		/**
	     * 删除IFrame节点，保留历史
	     * @param  {Node} iframe节点
	     * @return {Void}
	     */
	    _h.__removeIFrameKeepHistory = 
	    _h.__removeIFrameKeepHistory._$aop(function(_event){
	        _event.stopped = !0;
	        var _iframe = _event.args[0];
	        _e._$setStyle(_iframe,'display','none');
	        try{_iframe.contentWindow.document.body.innerHTML = '&nbsp;';}catch(ex){}
	    });
	});
};
define(['./html.js'],f);