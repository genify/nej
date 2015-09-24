/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/event',
	'./select.js'
],function(_v,_h,_p,_o,_f,_r){
    // fro gecko
	NEJ.patch('GR',function(){
		/**
		 * 关联file的label点击事件
		 * @return {Void}
		 */
	    _h.__handleFileLabelClick = (function(){
	    	var _doLabelClick = function(_event){
	            _v._$stop(_event);
	            _v._$getElement(_event,'t:label').control.click();
	        };
	    	return function(_label){
		    	_v._$addEvent(
		    		_label,'click',_doLabelClick
		    	);
		    };
	    })();
	});

	return _h;
});
