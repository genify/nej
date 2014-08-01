define([
    '{lib}util/media/audio.js'
],function(_t,_p,_o,_f,_r){
    /**
     * 取音频播放器实例d
     * @param {Object} 配置信息
     * @return {nej.ut._$$Media} 音频播放器实例
     */
    _p.__getAudioInst = function(_options){
        return _t._$$MediaAudio._$allocate(_options);
    };

    return _p;
});