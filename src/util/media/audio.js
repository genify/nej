/*
 * ------------------------------------------
 * 音频播放控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        v = NEJ.P('nej.v'),
        p = NEJ.P('nej.ut'),
        __proMediaAudio,
        __supMediaAudio;
    if (!!p._$$MediaAudio) return;
    /**
     * 音频播放控件<br />
     * 脚本举例
     * [code]
     *   // 首先生成播放对象,只负责逻辑部分，要配合UI来使用
     *   // preload：是否预加载
     *   // url：音频地址
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
     * @class   {nej.ut._$$MediaAudio} 音频播放控件
     * @extends {nej.ut._$$Media}
     * @param   {Object} 可选配置参数，已处理参数列表如下所示
     * @config  {String} url 音频地址
     */
    p._$$MediaAudio = NEJ.C();
    __proMediaAudio = p._$$MediaAudio._$extend(p._$$Media);
    __supMediaAudio = p._$$MediaAudio._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proMediaAudio.__reset = function(_options){
        this.__audio = new Audio();
        v._$addEvent(this.__audio,'loadstart',
                     this.__onLoading._$bind(this));
        v._$addEvent(this.__audio,'timeupdate',
                     this.__onPlaying._$bind(this));
        v._$addEvent(this.__audio,'pause',
                     this.__onPause._$bind(this));
        this.__supReset(_options);
    };
    /**
     * 销毁控件
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proMediaAudio.__destroy = function(){
        this.__supDestroy();
        delete this.__audio;
    };
    /**
     * 取多媒体实体控件
     * @protected
     * @method {__getMedia}
     * @return {Node} 多媒体实体控件
     */
    __proMediaAudio.__getMedia = function(){
        return this.__audio;
    };
    /**
     * 执行预加载操作
     * @protected
     * @method {__doPreload}
     * @return {Void}
     */
    __proMediaAudio.__doPreload = function(){
        if (this.__audio.src!=this.__source){
            this.__audio.src = this.__source;
            this.__source = this.__audio.currentSrc;
        }
    };
    /**
     * 执行播放操作
     * @protected
     * @method {__doPlay}
     * @return {Void}
     */
    __proMediaAudio.__doPlay = function(){
        this.__audio.play();
    };
    /**
     * 执行暂停操作
     * @protected
     * @method {__doPause}
     * @return {Void}
     */
    __proMediaAudio.__doPause = function(){
        this.__audio.pause();
    };
    /**
     * 执行停止操作
     * @protected
     * @method {__doStop}
     * @return {Void}
     */
    __proMediaAudio.__doStop = function(){
        this.__skip = !0;
        this.__doPause();
        this.__audio.currentTime = 0;
        this.__doStateChange(0);
    };
    /**
     * 文件载入触发事件
     * @protected
     * @method {__onLoading}
     * @return {Void}
     */
    __proMediaAudio.__onLoading = function(){
        if (!this.__audio.paused)
            this.__doStateChange(1);
    };
    /**
     * 暂停触发事件
     * @protected
     * @method {__onPause}
     * @return {Void}
     */
    __proMediaAudio.__onPause = function(){
        if (!this.__skip)
            this.__doStateChange(3);
        this.__skip = !1;
    };
    /**
     * 播放过程触发事件
     * @protected
     * @method {__onPlaying}
     * @return {Void}
     */
    __proMediaAudio.__onPlaying = function(){
        if (this.__audio.paused) return;
        this.__doStateChange(2);
        this._$dispatchEvent('ontimeupdate',this.__getMedia());
    };
};
NEJ.define('{lib}util/media/audio.js',
      ['{lib}base/event.js','{lib}util/media/media.js'],f);