/*
 * ------------------------------------------
 * 多媒体控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/media/media */
NEJ.define([
    'base/global',
    'base/klass',
    'util/event'
],function(NEJ,_k,_t,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 多媒体控件基类
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/media/media'
     * ],function(_t,_p,_o,_f,_r){
     *     // 第一步：继承此基类
     *     _pro = _p._$$MediaAudio._$extend(_t._$$Media);
     *
     *     _pro.__reset = function(){
     *         this.__audio = new Audio();
     *         // TODO
     *         this.__super();
     *     };
     *     // 子类实现以下方法
     *
     *     // 获取播放对象
     *     _pro.__getMedia = function(){
     *         return this.__audio;
     *     };
     *     //  预加载操作
     *     _pro.__doPreload = function(){
     *          if (this.__audio.src!=this.__source){
     *              this.__audio.src = this.__source;
     *              this.__source = this.__audio.currentSrc;
     *          }
     *     };
     *     //  执行播放操作
     *     _pro.__doPlay = function(){
     *         this.__audio.play();
     *     };
     *     //  执行暂停操作
     *     _pro.__doPause = function(){
     *         this.__audio.pause();
     *     };
     * });
     * ```
     *
     * 脚本举例
     * ```javascript
     *  NEJ.define([
     *      'path/to/custom/media.js'
     *  ],function(_t,_p,_o,_f,_r){
     *      // 第二步：生成子类的实例
     *      var _mda = _t._$$MediaAudio._$allocate({
     *          preload:false,
     *          url:'http://127.0.0.1:8000/nej-baseline/res/test.mp3',
     *          onstatechange:function(_event){
     *              // 状态改变的回调
     *              // 0 | 当前停止状态
     *              // 1 | 当前缓冲状态
     *              // 2 | 当前播放状态
     *              // 3 | 当前暂停状态
     *              // 4 | 播放结束状态
     *          }
     *      });
     *      
     *      // 开始播放
     *      _mda._$play();
     *      // 暂停播放
     *      _mda._$pause();
     *      // 停止播放
     *      _mda._$stop();
     *   });
     * ```
     *
     * @class    module:util/media/media._$$Media
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object} config - 可选配置参数
     * @property {String} url    - 多媒体文件地址
     * @property {Number} volume - 音量大小，0-100之间的数值
     */
    /**
     * 状态变化触发事件，播放状态说明
     * 
     * | 状态 | 说明 |
     * | :--- | :--- |
     * | 0 | 当前停止状态 |
     * | 1 | 当前缓冲状态 |
     * | 2 | 当前播放状态 |
     * | 3 | 当前暂停状态 |
     * | 4 | 播放结束状态 |
     *
     * @event    module:util/media/media._$$Media#onstatechange
     * @param    {Object} event  - 可选配置参数
     * @property {Number} state  - 播放状态
     * @property {Object} target - 播放信息
     */
    /**
     * 播放过程触发事件
     * 
     * @event    module:util/media/media._$$Media#ontimeupdate
     * @param    {Object} event    - 可选配置参数
     * @property {Float}  current  - 当前时间，单位秒
     * @property {Float}  duration - 总时长，单位秒
     */
    /**
     * 音量变化触发事件
     * 
     * @event    module:util/media/media._$$Media#onvolumechange
     * @param    {Object} event  - 可选配置参数
     * @property {Float}  volume - 当前音量，0-100之间的数值
     */
    /**
     * 播放错误触发事件
     * 
     * @event module:util/media/media._$$Media#onerror
     * @param {Object} event - 错误信息
     */
    _p._$$Media = _k._$klass();
    _pro = _p._$$Media._$extend(_t._$$EventTarget);
    /**
     * 重置控件
     * 
     * @protected
     * @method module:util/media/media._$$Media#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__state = 0;
        this._$source(_options.url);
        if (_options.volume!=null){
            this._$volume(_options.volume);
        }
        this.__super(_options);
    };
    /**
     * 销毁控件
     * 
     * @protected
     * @method module:util/media/media._$$Media#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this._$stop();
    };
    /**
     * 执行播放操作
     * 
     * @protected
     * @method module:util/media/media._$$Media#__doPlay
     * @return {Void}
     */
    _pro.__doPlay = _f;
    /**
     * 执行暂停操作
     * 
     * @protected
     * @method module:util/media/media._$$Media#__doPause
     * @return {Void}
     */
    _pro.__doPause = _f;
    /**
     * 执行停止操作
     * 
     * @protected
     * @method module:util/media/media._$$Media#__doStop
     * @return {Void}
     */
    _pro.__doStop = _f;
    /**
     * 播放停止触发事件
     * 
     * @protected
     * @method module:util/media/media._$$Media#__onStop
     * @return {Void}
     */
    _pro.__onStop = function(){
        this.__doStateChange(4);
        this.__doStateChange(0);
    };
    /**
     * 播放错误
     *
     * @protected
     * @method module:util/media/media._$$Media#__doError
     * @return {Void}
     */
    _pro.__doError = function(){
        this.__state = 0;
    };
    /**
     * 设置播放时间
     * 
     * @abstract
     * @method module:util/media/media._$$Media#__setCurrentTime
     * @return {Void}
     */
    _pro.__setCurrentTime = _f;
    /**
     * 获取播放时间
     * 
     * @abstract
     * @method module:util/media/media._$$Media#__getCurrentTime
     * @return {Number} 当前时间
     */
    _pro.__getCurrentTime = _f;
    /**
     * 设置音量
     * 
     * @abstract
     * @method module:util/media/media._$$Media#__setVolume
     * @return {Void}
     */
    _pro.__setVolume = _f;
    /**
     * 获取音量
     * 
     * @abstract
     * @method module:util/media/media._$$Media#__getVolume
     * @return {Number} 音量
     */
    _pro.__getVolume = _f;
    /**
     * 修改媒体播放状态
     * 
     * @protected
     * @method module:util/media/media._$$Media#__doStateChange
     * @param  {Number} arg0 - 播放状态
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
     * 
     * @protected
     * @method module:util/media/media._$$Media#__onVolumeChange
     * @return {Void}
     */
    _pro.__onVolumeChange = function(){
        this._$dispatchEvent(
            'onvolumechange',{
                volume:this._$volume()
            }
        );
    };
    /**
     * 取媒体总时长
     * 
     * @method module:util/media/media._$$Media#_$duration
     * @return {Number} 媒体总时长
     */
    _pro._$duration = _f;
    /**
     * 更新多媒体文件地址
     * 
     * @method module:util/media/media._$$Media#_$source
     * @param  {String} arg0 - 文件地址
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
     * 
     * @method module:util/media/media._$$Media#_$play
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
     * 
     * @method module:util/media/media._$$Media#_$pause
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
     * 
     * @method module:util/media/media._$$Media#_$stop
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
     * 
     * @method module:util/media/media._$$Media#_$seek
     * @param  {Number} arg0 - 播放时间，不传此参数表示获取播放时间
     * @return {Number}        播放时间
     */
    _pro._$seek = function(_time){
        if (_time!=null){
            this.__setCurrentTime(_time);
        }
        return this.__getCurrentTime();
    };
    /**
     * 设置/获取音量
     * 
     * @method module:util/media/media._$$Media#_$volume
     * @param  {Number} arg0 - 音量大小，0-100之间的数值，不传此参数表示获取音量值
     * @return {Number}        音量大小，0-100之间的数值
     */
    _pro._$volume = function(_volume){
        if (_volume!=null){
            var _volume = Math.max(0,Math.min(_volume,100));
            this.__setVolume(_volume/100);
        }
        return this.__getVolume()*100;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej,ut'),_p);
    }

    return _p;
});