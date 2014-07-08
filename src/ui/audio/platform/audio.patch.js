var f = function(){
	// ie6-9 audio patch
	NEJ.patch('2.0<=TR<=5.0',['{lib}util/media/flash.js'],function(){
	    var _  = NEJ.P,
	        _p = _('nej.p'),
	        _h = _('nej.h'),
	        _t = _('nej.ut');
	    /**
	     * 取音频播放器实例
	     * @return {Object} 配置信息
	     * @return {nej.ut._$$Media} 音频播放器实例
	     */
	    _h.__getAudioInst = 
	    _h.__getAudioInst._$aop(function(_event){
	        // use flash player for ie8-
	        if (_p._$KERNEL.release<'5.0'){
	            _event.stopped = !0;
	            _event.value = _t._$$MediaFlash.
	                           _$allocate(_event.args[0]);
	        }
	    });
	});
};
define(['./audio.js'],f);