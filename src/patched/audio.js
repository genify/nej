/**
 * ------------------------------------------
 * 语音接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _e = _('nej.e'),
        _h = _('nej.h'),
        _t = _('nej.ut'),
        _audio,
        _playing;
    /**
     * 取音频播放器实例
     * @return {Object} 配置信息
     * @return {nej.ut._$$Media} 音频播放器实例
     */
    _h.__getAudioInst = function(_options){
        return _t._$$MediaAudio._$allocate(_options);
    };
    /**
     * 单例播放音频
     * @api    {nej.e._$playBgSound}
     * @param  {String} 音频文件地址
     * @param  {Object} 可选配置参数
     * @config {Function} onstop 播放结束事件
     * @config {Variable} extra  onstop时传回数据
     * @return {Void}
     */
    _e._$playBgSound = (function(){
        var _doStopCallback = function(){
            if (!_playing) return;
            var _func = _playing.onstop||_f,
                _extr = _playing.extra;
            _playing = null;
            _func(_extr);
        };
        return function(_url,_options){
            if (!!_audio){
                _audio = _audio._$recycle();
            }
            _doStopCallback();
            _playing = NEJ.X({},_options);
            _audio = _h.__getAudioInst({
                url:_url,
                onstatechange:function(_event){
                    if (_event.state!=0) return;
                    _audio = _audio._$recycle();
                    _doStopCallback();
                }
            });
            _audio._$play();
        };
    })();
    /**
     * 停止单例音频播放
     * @api    {nej.e._$stopBgSound}
     * @return {Void}
     */
    _e._$stopBgSound = function(){
        if (!!_audio){
            _audio._$stop();
        }
    };
};
NEJ.define(
    '{lib}patched/audio.js',[
    '{lib}base/platform.js',
    '{lib}util/media/audio.js'
],f);