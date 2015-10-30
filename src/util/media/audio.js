/*
 * ------------------------------------------
 * 音频播放控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/media/audio */
NEJ.define([
    'base/global',
    'base/klass',
    './media.js'
],function(NEJ,_k,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 音频播放控件
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/media/audio'
     * ],function(_t){
     *     // 首先生成播放对象,只负责逻辑部分，要配合UI来使用
     *     // preload：是否预加载
     *     // url：音频地址
     *     var _audio = _t._$$MediaAudio._$allocate({
     *         preload:false,
     *         url:'http://127.0.0.1:8000/nej-baseline/res/test.mp3',
     *         onstatechange:function(_event){
     *             // 状态改变的回调
     *             // 0 | 当前停止状态
     *             // 1 | 当前缓冲状态
     *             // 2 | 当前播放状态
     *             // 3 | 当前暂停状态
     *             // 4 | 播放结束状态
     *         }
     *     });
     *     
     *     // 开始播放
     *     _audio._$play();
     *     // 暂停播放
     *     _audio._$pause();
     *     // 停止播放
     *     _audio._$stop();
     * });
     * ```
     * 
     * @class    module:util/media/audio._$$MediaAudio
     * @extends  module:util/media/media._$$Media
     * @param    {Object} config - 可选配置参数
     * @property {String} url    - 音频地址
     */
    _p._$$MediaAudio = _k._$klass();
    _pro = _p._$$MediaAudio._$extend(_t._$$Media);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__audio = new Audio();
        this.__doInitDomEvent([[
            this.__audio,'loadstart',
            this.__onLoading._$bind(this)
        ],[
            this.__audio,'timeupdate',
            this.__onPlaying._$bind(this)
        ],[
            this.__audio,'pause',
            this.__onPause._$bind(this)
        ],[
            this.__audio,'volumechange',
            this.__onVolumeChange._$bind(this)
        ],[
            this.__audio,'ended',
            this.__onStop._$bind(this)
        ],[
            this.__audio,'error',
            this.__onError._$bind(this)
        ]]);
        this.__super(_options);
    };
    /**
     * 销毁控件
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__audio;
    };
    /**
     * 执行播放操作
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__doPlay
     * @return {Void}
     */
    _pro.__doPlay = function(){
        if (this.__audio.src!=this.__source){
            this.__audio.src = this.__source;
            this.__source = this.__audio.src;
        }
        this.__audio.play();
    };
    /**
     * 执行暂停操作
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__doPause
     * @return {Void}
     */
    _pro.__doPause = function(){
        this.__audio.pause();
    };
    /**
     * 执行停止操作
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__doStop
     * @return {Void}
     */
    _pro.__doStop = function(){
        this.__stopped = !0;
        this.__doPause();
        if (this.__state==3){
            this.__onPause();
        }
    };
    /**
     * 文件载入触发事件
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__onLoading
     * @return {Void}
     */
    _pro.__onLoading = function(){
        if (!this.__audio.paused){
            this.__doStateChange(1);
        }
    };
    /**
     * 暂停触发事件
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__onPause
     * @return {Void}
     */
    _pro.__onPause = function(){
        var _state = !this.__stopped?3:0;
        this.__stopped = !1;
        this.__doStateChange(_state);
        if (_state==0){
            try{
                this.__audio.removeAttribute('src');
            }catch(ex){
                // ignore
            }
        }
    };
    /**
     * 播放过程触发事件
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__onPlaying
     * @return {Void}
     */
    _pro.__onPlaying = function(){
        var _duration = this.__audio.duration;
        // for stop or loading
        if (this.__audio.paused||isNaN(_duration)){
            return;
        }
        // for playing
        this.__doStateChange(2);
        this._$dispatchEvent(
            'ontimeupdate',{
                duration:this.__audio.duration,
                current:this.__audio.currentTime
            }
        );
    };
    /**
     * 播放错误事件
     *
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__onError
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__onError = function(_event){
        this.__doError();
        var _error = this.__audio.error;
        this._$dispatchEvent('onerror',{
            code:_error.code
        });
    };
    /**
     * 设置播放时间
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__setCurrentTime
     * @return {Void}
     */
    _pro.__setCurrentTime = function(_time){
        if (this.__state==1) return;
        this.__audio.currentTime = _time||0;
    };
    /**
     * 获取播放时间
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__getCurrentTime
     * @return {Number} 当前时间
     */
    _pro.__getCurrentTime = function(){
        return this.__audio.currentTime;
    };
    /**
     * 设置音量
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__setVolume
     * @return {Void}
     */
    _pro.__setVolume = function(_volume){
        this.__audio.volume = _volume;
    };
    /**
     * 获取音量
     * 
     * @protected
     * @method module:util/media/audio._$$MediaAudio#__getVolume
     * @return {Number} 音量值
     */
    _pro.__getVolume = function(){
        return this.__audio.volume;
    };
    /**
     * 取媒体总时长
     * 
     * @method module:util/media/audio._$$MediaAudio#_$duration
     * @return {Number} 媒体总时长
     */
    _pro._$duration = function(){
        return !this.__audio?0:this.__audio.duration;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
