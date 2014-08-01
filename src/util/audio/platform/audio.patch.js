define([
    './audio.js'
],function(_h,_p,_o,_f,_r){
	// ie6-8 audio patch
	NEJ.patch('TR<=4.0',['{lib}util/media/flash.js'],function(_t){
	    /**
	     * 取音频播放器实例
	     * @return {Object} 配置信息
	     * @return {nej.ut._$$Media} 音频播放器实例
	     */
	    _h.__getAudioInst =
	    _h.__getAudioInst._$aop(function(_event){
	        // use flash player for ie8-
            _event.stopped = !0;
            _event.value = _t._$$MediaFlash.
	                           _$allocate(_event.args[0]);
	    });
	});

	return _h;
});