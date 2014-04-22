/**
 * ------------------------------------------
 * 语音接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h'),
        _t = _('nej.ut');
    if (_p._$NOT_PATCH.trident) return;
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
};
NEJ.define(
    '{lib}patched/trident/audio.js',[
    '{lib}patched/audio.js',
    '{lib}util/media/flash.js'
],f);