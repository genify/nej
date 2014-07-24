var f = function(){
    // gecko api patch
	NEJ.patch('GV',function(){
		var _  = NEJ.P,
	        _e = _('nej.e'),
	        _v = _('nej.v');
		/*
	     * 处理文件选择控件点击事件
	     * @param  {String|Node} 节点
	     * @return {Void}
	     */
	    _e.__handleFileLabelClick = (function(){
	    	var _doLabelClick = function(_event){
	            _v._$stop(_event);
	            _v._$getElement(_event,'t:label').control.click();
	        };
	    	return _e.__handleFileLabelClick._$aop(
		        function(_event){
		            _v._$addEvent(_event.args[0],'click',_doLabelClick);
		        }
	    	);
	    })(); 
	});
    
};
define(['./select.js'],f);