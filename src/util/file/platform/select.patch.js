NEJ.define([
    '{lib}base/global.js',
    '{lib}base/event.js',
	'./select.js'
],function(NEJ,_v,_h,_p,_o,_f,_r){
    // gecko api patch
	NEJ.patch('GV',function(){
		/*
	     * 处理文件选择控件点击事件
	     * @param  {String|Node} 节点
	     * @return {Void}
	     */
	    _h.__handleFileLabelClick = (function(){
	    	var _doLabelClick = function(_event){
	            _v._$stop(_event);
	            _v._$getElement(_event).control.click();
	        };
	    	return _h.__handleFileLabelClick._$aop(
		        function(_event){
		            _v._$addEvent(_event.args[0],'click',_doLabelClick);
		        }
	    	);
	    })();
	});

	return _h;
});