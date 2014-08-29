/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
define([
    'util/media/audio'
],function(_t,_p,_o,_f,_r){
    /**
     * 取音频播放器实例d
     * @param  {Object} 配置信息
     * @return {_$$Media} 音频播放器实例
     */
    _p.__getAudioInst = function(_options){
        return _t._$$MediaAudio._$allocate(_options);
    };

    return _p;
});