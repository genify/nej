/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define([
    './audio.js'
],function(_h,_p,_o,_f,_r){
	// for ie8-
	NEJ.patch('TR<=4.0',['util/media/flash'],function(_t){
	    /**
	     * 取音频播放器实例d
	     * @param  {Object} 配置信息
	     * @return {_$$Media} 音频播放器实例
	     */
	    _h.__getAudioInst = function(_options){
	        return _t._$$MediaFlash._$allocate(_options);
	    };
	});

	return _h;
});