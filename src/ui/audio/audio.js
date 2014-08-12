/*
 * ------------------------------------------
 * 音频播放器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}ui/base.js',
    '{lib}util/media/audio.js',
    '{lib}util/template/tpl.js'
],function(NEJ,_k,_e,_v,_u,_t0,_t1,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css,
        _seed_html;
    /**
     * 音频播放器
     * @class   {_$$AudioPlayer}
     * @uses    {util/audio/audio#_$$MediaAudio}
     * @extends {ui/base#_$$Abstract}
     * @param   {Object}  可选配置参数，已处理参数列表如下：
     * @config  {String}  url       音乐地址
     * @config  {String}  title     音乐标题
     * @config  {Boolean} autostart 自动开始播放
     *
     * [hr]
     * 状态变化事件
     * @event  {onstatechange}
     * @param  {Object}        事件对象
     *
     */
    _p._$$AudioPlayer = _k._$klass();
    _pro = _p._$$AudioPlayer._$extend(_u._$$Abstract);
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html= _seed_html;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
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
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__nttl.innerHTML = _options.title||'音乐标题';
        this.__audio = this.__getAudio(_options.url);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
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
     * @protected
     * @method {__onAction}
     * @return {Void}
     */
    _pro.__onAction = function(){
        _e._$hasClassName(this.__nact,'js-play')?this._$play():this._$pause();
    };
    /**
     * 返回音频对象
     * @protected
     * @method {__getAudio}
     * @return {Object} 音频对象
     */
    _pro.__getAudio = function(_source){
        return _t0._$$MediaAudio._$allocate({url:_source,
               onstatechange:this.__onStateChange._$bind(this)});
    };
    /**
     * 音频控件状态变化回调事件
     * @protected
     * @method {__onStateChange}
     * @param {Object} 事件对象
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
     * @method {_$play}
     * @return {Void}
     */
    _pro._$play = function(){
        if (!!this.__audio)
            this.__audio._$play();
    };
    /**
     * 暂停播放
     * @method {_$pause}
     * @return {Void}
     */
    _pro._$pause = function(){
        if (!!this.__audio)
            this.__audio._$pause();
    };
    /**
     * 停止播放
     * @method {_$stop}
     * @return {Void}
     */
    _pro._$stop = function(){
        if (!!this.__audio)
            this.__audio._$stop();
    };

    // ui css text
    _seed_css = _e._$pushCSSText('\
      .#<uispace>{display:$<box>;$<box-pack>:end;width:150px;height:30px;line-height:30px;overflow:hidden;text-align:left;}\
      .#<uispace> .z-ttl{display:block;$<box-flex>:1;overflow-x:$<marquee>;border:2px solid #aaa;background:#fdc;}\
      .#<uispace> .z-act{width:30px;background:none center center no-repeat;background-size:30px 30px;cursor:default;}\
      .#<uispace> .js-play{background-image:url("data:image/png;base64,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");}\
      .#<uispace> .js-pause{background-image:url("data:image/png;base64,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");}\
      .#<uispace> .js-loading{background-image:url("data:image/png;base64,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")}');
    _seed_html = _t1._$addNodeTemplate('\
      <div class="'+_seed_css+'">\
        <marquee class="z-ttl"></marquee>\
        <div class="z-act js-play">&nbsp;</div>\
      </div>');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});