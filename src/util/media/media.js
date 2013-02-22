/*
 * ------------------------------------------
 * 多媒体控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        p = NEJ.P('nej.ut'),
        __proMedia,
        __supMedia;
    if (!!p._$$Media) return;
    /**
     * 多媒体控件基类<br />
     * 脚本举例
     * [code]
     *   // 第一步：继承此基类
     *   p = NEJ.P('nej.ut');
     *   __proMediaAudio = p._$$MediaAudio._$extend(p._$$Media);
     *   __supMediaAudio = p._$$MediaAudio._$supro;
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
     * @class   {nej.ut._$$Media} 多媒体控件基类
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下所示
     * @config  {String} url 多媒体文件地址
     * @config  {String} preload 是否预加载文件
     * 
     * [hr]
     * 
     * @event  {onstatechange} 状态变化触发事件
     * @param  {Object} 可选配置参数
     * @config {Number} 播放状态
     * [ntb]
     *   0 | 当前停止状态
     *   1 | 当前缓冲状态
     *   2 | 当前播放状态
     *   3 | 当前暂停状态
     * [/ntb]
     * @config  {Object|Node} 多媒体实体控件
     * 
     * [hr]
     * 
     * @event  {ontimeupdate} 播放过程触发事件
     * 
     */
    p._$$Media = NEJ.C();
    __proMedia = p._$$Media._$extend(p._$$Event);
    __supMedia = p._$$Media._$supro;
    /**
     * 重置控件
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {String} url 多媒体文件地址
     * @config {String} preload 是否预加载文件
     * @return {Void}
     */
    __proMedia.__reset = function(_options){
        this.__supReset(_options);
        this.__state = 0;
        this._$preload(!!_options.preload);
        this._$source(_options.url);
    };
    /**
     * 销毁控件
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proMedia.__destroy = function(){
        this.__supDestroy();
        this._$stop();
    };
    /**
     * 取多媒体实体控件对象，可以取到播放相关数据
     * [ntb]
     *  currentTime | [Float] | 当前播放的时间【单位秒】
     *  duration    | [Float] | 多媒体总时间【单位秒】
     *  volume      | [Float] | 当前声音值[0.0~1.0]
     * [/ntb]
     * @protected 
     * @method {__getMedia}
     * @return {Object||Node} 多媒体实体控件
     */
    __proMedia.__getMedia = f;
    /**
     * 执行播放操作
     * @protected
     * @method {__doPlay}
     * @return {Void}
     */
    __proMedia.__doPlay = f;
    /**
     * 执行暂停操作
     * @protected
     * @method {__doPause}
     * @return {Void}
     */
    __proMedia.__doPause = f;
    /**
     * 执行停止操作
     * @protected
     * @method {__doStop}
     * @return {Void}
     */
    __proMedia.__doStop = f;
    /**
     * 执行预加载操作
     * @protected
     * @method {__doPreload}
     * @return {Void}
     */
    __proMedia.__doPreload = f;
    /**
     * 修改媒体播放状态
     * @protected
     * @method {__doStateChange}
     * @param  {Number} 播放状态
     * @return {Void}
     */
    __proMedia.__doStateChange = function(_state){
        if (_state==this.__state) return;
        this.__state = _state;
        this._$dispatchEvent('onstatechange',
                            {state:this.__state
                            ,target:this.__getMedia()});
    };
    /**
     * 更新多媒体文件地址
     * @method {_$source}
     * @param  {String} 文件地址
     * @return {nej.ut._$$Media}
     */
    __proMedia._$source = function(_url){
        _url = _url||'';
        if (this.__state!=0)
            this._$stop();
        this.__source = _url;
        if (!!this._$preload())
            this.__doPreload();
        return this;
    };
    /**
     * 获取或者设置是否预加载文件
     * @method {_$preload}
     * @param  {Boolean} 是否预加载文件
     * @return {Boolean} 是否预加载文件
     */
    __proMedia._$preload = function(_preload){
        if (_preload===undefined)
            return this.__preload;
        this.__preload = !!_preload;
        return this.__preload;
    };
    /**
     * 播放
     * @method {_$play}
     * @return {nej.ut._$$Media}
     */
    __proMedia._$play = function(){
        // only stop and pause can do play
        if (this.__state==0||
            this.__state==3){
            if (!this._$preload())
                this.__doPreload();
            this.__doPlay();
        }
        return this;
    };
    /**
     * 暂停
     * @method {_$pause}
     * @return {nej.ut._$$Media}
     */
    __proMedia._$pause = function(){
        // only buffer and play can do pause
        if (this.__state==1||
            this.__state==2)
            this.__doPause();
        return this;
    };
    /**
     * 停止
     * @method {_$stop}
     * @return {nej.ut._$$Media}
     */
    __proMedia._$stop = function(){
        // only buffer,play and pause can do stop
        if (this.__state!=0)
            this.__doStop();
        return this;
    };
};
NEJ.define('{lib}util/media/media.js',['{lib}util/event.js'],f);