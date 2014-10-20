/*
 * ------------------------------------------
 * 音频播放器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/audio/audio */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'ui/base',
    'util/media/audio',
    'util/template/tpl',
    'text!./audio.css',
    'text!./audio.html'
],function(NEJ,_k,_e,_v,_u,_t0,_t1,_css,_html,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css = _e._$pushCSSText(_css),
        _seed_html= _t1._$addNodeTemplate(_html);
    /**
     * 音频播放器
     *
     * @class   module:ui/audio/audio._$$AudioPlayer
     * @uses    module:util/audio/audio._$$MediaAudio
     * @extends module:ui/base._$$Abstract
     * @param     {Object}  config    - 可选配置参数
     * @property  {String}  url       - 音乐地址
     * @property  {String}  title     - 音乐标题
     * @property  {Boolean} autostart - 自动开始播放
     */
    /**
     * 状态变化事件
     *
     * @event  module:ui/audio/audio._$$AudioPlayer#onstatechange
     * @param  {Object} arg0 - 事件对象
     */
    _p._$$AudioPlayer = _k._$klass();
    _pro = _p._$$AudioPlayer._$extend(_u._$$Abstract);
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/audio/audio._$$AudioPlayer#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html= _seed_html;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method ui/audio/audio._$$AudioPlayer#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _child = _e._$getChildren(this.__body);
        this.__nttl = _child[0];
        this.__nact = _child[1];
        _v._$addEvent(this.__nact,'tap',
                     this.__onAction._$bind(this));
    };
    /**
     * 控件重置
     *
     * @protected
     * @method ui/audio/audio._$$AudioPlayer#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__nttl.innerHTML = _options.title||'音乐标题';
        this.__audio = this.__getAudio(_options.url);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method ui/audio/audio._$$AudioPlayer#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        if (!!this.__audio)
            this.__audio = this.__audio.constructor
                               ._$recycle(this.__audio);
    };
    /**
     * 操作事件
     *
     * @protected
     * @method ui/audio/audio._$$AudioPlayer#__onAction
     * @return {Void}
     */
    _pro.__onAction = function(){
        _e._$hasClassName(this.__nact,'js-play')?this._$play():this._$pause();
    };
    /**
     * 返回音频对象
     *
     * @protected
     * @method ui/audio/audio._$$AudioPlayer#__getAudio
     * @param  {String} arg0 - 音频URI
     * @return {Object} 音频对象
     */
    _pro.__getAudio = function(_source){
        return _t0._$$MediaAudio._$allocate({url:_source,
               onstatechange:this.__onStateChange._$bind(this)});
    };
    /**
     * 音频控件状态变化回调事件
     *
     * @protected
     * @method ui/audio/audio._$$AudioPlayer#__onStateChange
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onStateChange = (function(){
        var _state_list = ['js-play','js-loading','js-pause'],
            _state_str  = _state_list.join(' ');
        return function(_event){
            this.__state = _event.state;
            _e._$replaceClassName(this.__nact,_state_str,
              _state_list[_event.state]||_state_list[0]);
            this._$dispatchEvent('onstatechange',_event);
        };
    })();
    /**
     * 播放音乐
     * @method ui/audio/audio._$$AudioPlayer#_$play
     * @return {Void}
     */
    _pro._$play = function(){
        if (!!this.__audio)
            this.__audio._$play();
    };
    /**
     * 暂停播放
     *
     * @method ui/audio/audio._$$AudioPlayer#_$pause
     * @return {Void}
     */
    _pro._$pause = function(){
        if (!!this.__audio)
            this.__audio._$pause();
    };
    /**
     * 停止播放
     *
     * @method ui/audio/audio._$$AudioPlayer#_$stop
     * @return {Void}
     */
    _pro._$stop = function(){
        if (!!this.__audio)
            this.__audio._$stop();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});