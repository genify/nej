var f = function(){
	var _  = NEJ.P,
        _h = _('nej.h'),
        _t = _('nej.ut');
    /**
     * 取音频播放器实例
     * @param {Object} 配置信息
     * @return {nej.ut._$$Media} 音频播放器实例
     */
    _h.__getAudioInst = function(_options){
        return _t._$$MediaAudio._$allocate(_options);
    };
};
define('{lib}util/audio/platform/audio.js',[
	   '{lib}base/platform.js',
       '{lib}util/media/audio.js'],f);