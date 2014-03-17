/*
 * ------------------------------------------
 * 多媒体控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _o = NEJ.O,
        _f = NEJ.F,
        _p = NEJ.P('nej.ut'),
        _pro;
    if (!!_p._$$Media) return;
    /**
     * 多媒体控件基类<br />
     * 脚本举例
     * [code]
     *   // 第一步：继承此基类
     *   _p = NEJ.P('nej.ut');
     *   __proMediaAudio = _p._$$MediaAudio._$extend(_p._$$Media);
     *   __supMediaAudio = _p._$$MediaAudio._$supro;
     *   
     *   __proMediaAudio.__reset = function(_options){
     *       this.__audio = new Audio();
     *       v._$addEvent(this.__audio,'loadstart',
     *                this.__onLoading._$bind(this));
     *       v._$addEvent(this.__audio,'timeupdate',
     *                this.__onPlaying._$bind(this));
     *       v._$addEvent(this.__audio,'pause',
     *                this.__onPause._$bind(this));
     *       this.__supReset(_options);
     *  };
     *  // 子类实现以下方法
     *   
     *  // 获取播放对象
     *  __proMediaAudio.__getMedia = function(){
     *        return this.__audio;
     *    };
     *   
     *  //  预加载操作
     *  __proMediaAudio.__doPreload = function(){
     *     if (this.__audio.src!=this.__source){
     *         this.__audio.src = this.__source;
     *         this.__source = this.__audio.currentSrc;
     *     }
     *  };
     *   
     *  //  执行播放操作
     *  __proMediaAudio.__doPlay = function(){
     *      this.__audio.play();
     *  };
     *   
     *   
     *  //  执行暂停操作
     *  __proMediaAudio.__doPause = function(){
     *      this.__audio.pause();
     *  };
     *  
     *  // 第二步：生成子类的实例
     *   var _mda = _p._$$MediaAudio._$allocate({
     *       preload:false,
     *       url:'http://127.0.0.1:8000/nej-baseline/res/test.mp3',
     *       onstatechange:function(_event){
     *           // 状态改变的回调
     *           // 0 | 当前停止状态
     *           // 1 | 当前缓冲状态
     *           // 2 | 当前播放状态
     *           // 3 | 当前暂停状态
     *       }
     *   });
     *   // 开始播放
     *   _mda._$play();
     *   // 暂停播放
     *   _mda._$pause();
     *   // 停止播放
     *   _mda._$stop();
     * [/code]
     * 
     * @class   {nej.ut._$$Media}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数
     * @config  {String} url 多媒体文件地址
     * 
     * [hr] 
     * 状态变化触发事件
     * @event  {onstatechange}
     * @param  {Object} 可选配置参数
     * @config {Number} state 播放状态
     * [ntb]
     *   0 | 当前停止状态
     *   1 | 当前缓冲状态
     *   2 | 当前播放状态
     *   3 | 当前暂停状态
     * [/ntb]
     * @config  {Object} target 播放信息
     * 
     * [hr]
     * 播放过程触发事件
     * @event  {ontimeupdate} 
     * @param  {Object} 可选配置参数
     * @config {Float} current  当前时间，单位秒
     * @config {Float} duration 总时长，单位秒
     * 
     * [hr]
     * 音量变化触发事件
     * @event  {onvolumechange} 
     * @param  {Object} 可选配置参数
     * @config {Float} volume 当前音量，0-100之间的数值
     * 
     * [hr]
     * 播放错误触发事件
     * @event  {onerror}
     * @param  {Object} 错误信息
     * 
     */
    _p._$$Media = NEJ.C();
    _pro = _p._$$Media._$extend(_p._$$Event);
    /**
     * 重置控件
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__state = 0;
        this._$source(_options.url);
        this.__supReset(_options);
    };
    /**
     * 销毁控件
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        this._$stop();
    };
    /**
     * 执行播放操作
     * @protected
     * @method {__doPlay}
     * @return {Void}
     */
    _pro.__doPlay = _f;
    /**
     * 执行暂停操作
     * @protected
     * @method {__doPause}
     * @return {Void}
     */
    _pro.__doPause = _f;
    /**
     * 执行停止操作
     * @protected
     * @method {__doStop}
     * @return {Void}
     */
    _pro.__doStop = _f;
    /**
     * 播放错误
     * @return {Void}
     */
    _pro.__doError = function(){
        this.__state = 0;
    };
    /**
     * 设置播放时间
     * @protected
     * @method {__setCurrentTime}
     * @return {Void}
     */
    _pro.__setCurrentTime = _f;
    /**
     * 获取播放时间
     * @protected
     * @method {__getCurrentTime}
     * @return {Number} 当前时间
     */
    _pro.__getCurrentTime = _f;
    /**
     * 设置音量
     * @protected
     * @method {__setVolume}
     * @return {Void}
     */
    _pro.__setVolume = _f;
    /**
     * 获取音量
     * @protected
     * @method {__getVolume}
     * @return {Number} 音量
     */
    _pro.__getVolume = _f;
    /**
     * 修改媒体播放状态
     * @protected
     * @method {__doStateChange}
     * @param  {Number} 播放状态
     * @return {Void}
     */
    _pro.__doStateChange = function(_state){
        if (_state==this.__state) return;
        this.__state = _state;
        this._$dispatchEvent(
            'onstatechange',{
                state:this.__state
            }
        );
    };
    /**
     * 音量变化触发事件
     * @protected
     * @method {__onVolumeChange}
     * @return {Void}
     */
    _pro.__onVolumeChange = function(){
        this._$dispatchEvent(
            'onvolumechange',{
                volume:this.__getVolume()
            }
        );
    };
    /**
     * 更新多媒体文件地址
     * @method {_$source}
     * @param  {String} 文件地址
     * @return {Void}
     */
    _pro._$source = function(_url){
        _url = _url||'';
        if (!_url) return;
        this._$stop();
        this.__source = _url;
    };
    /**
     * 播放
     * @method {_$play}
     * @return {Void}
     */
    _pro._$play = function(){
        // only stop and pause can do play
        if (this.__state==0||this.__state==3){
            this.__doPlay();
        }
    };
    /**
     * 暂停
     * @method {_$pause}
     * @return {Void}
     */
    _pro._$pause = function(){
        // only buffer and play can do pause
        if (this.__state==1||this.__state==2){
            this.__doPause();
        }
    };
    /**
     * 停止
     * @method {_$stop}
     * @return {Void}
     */
    _pro._$stop = function(){
        // only buffer,play and pause can do stop
        if (this.__state!=0){
            this.__doStop();
        }
    };
    /**
     * 定位到播放位置
     * @method {_$seek}
     * @param  {Number} 播放时间，不传此参数表示获取播放时间
     * @return {Number} 播放时间
     */
    _pro._$seek = function(_time){
        if (_time!=null){
            this.__setCurrentTime(_time);
        }
        return this.__getCurrentTime();
    };
    /**
     * 设置/获取音量
     * @method {_$volume}
     * @param  {Number} 音量大小，0-100之间的数值，不传此参数表示获取音量值
     * @return {Number} 音量大小，0-100之间的数值
     */
    _pro._$volume = function(_volume){
        if (_volume!=null){
            var _volume = Math.max(0,Math.min(_volume,100));
            this.__setVolume(_volume);
        }
        return this.__getVolume();
    };
};
NEJ.define(
    '{lib}util/media/media.js',[
    '{lib}util/event.js'
],f);