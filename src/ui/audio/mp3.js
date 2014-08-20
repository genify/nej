/*
 * ------------------------------------------
 * 音频播放器实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/audio/mp3 */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'ui/base',
    'base/config',
    'util/slider/slider.simple',
    'util/media/playlist',
    'util/audio/audio',
    'util/template/tpl',
    'text!./mp3.css',
    'text!./mp3.html'
],function(NEJ,_k,_e,_v,_u,_c,_t0,_t1,_t2,_t3,_css,_html,_p,_o,_f,_r) {
    var _pro,
        _seed_css = _e._$pushCSSText(_css,{root:_c._$get('root')}),
        _seed_html= _t3._$addNodeTemplate(_html);
    /**
     * 音频播放器
     *
     * @class     module:ui/audio/mp3._$$MP3Player
     * @uses      module:util/slider/simple._$$SimpleSlider
     * @uses      module:util/media/playlist._$$PlayList
     * @extends   module:ui/base._$$Abstract
     * @param     {Object}      config     - 可选配置参数
     * @property  {String|Node} parent     - 父节点
     * @property  {String}      mode       - 播放模式，0:列表(默认)，1:单曲，2:随机
     * @property  {Array}       list       - 歌曲列表
     * @property  {Boolean}     autostart  - 是否自动开始，0:不自动，1:自动(默认)
     */
    _p._$$MP3Player = _k._$klass();
    _pro = _p._$$MP3Player._$extend(_u._$$Abstract);

    /**
     * 重置控件
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__reset
     * @param  {Objec} _options - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__vslide.value = _options.volnumber||100;
        this.__autostart = _options.autostart === 0 ? !1 : !0;
        this.__doInitDomEvent([
            [this.__body,'click',this.__onAction._$bind(this)]
        ]);
        if (!this.__volSlider){
            this.__volSlider = _t0._$$SimpleSlider._$allocate(this.__vslide);
        }
        this._$refreshList(_options);
    };

    /**
     * 销毁控件
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__doClearComponent();
        this.__super();
    };

    /**
     * 初始化播放器结构
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };

    /**
     * 初始化结构
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        // 0 - 播放按钮
        // 1 - 小音量
        // 2 - 当前播放时间
        // 3 - 歌曲总时长
        // 4 - 歌曲播放模式
        var _list  = _e._$getByClassName(this.__body,'ztag'),
            _vlist = _e._$getByClassName(this.__body,'vtag'),
            _tlist = _e._$getByClassName(this.__body,'ttag');
        this.__nplay  = _list[0];
        this.__nvol   = _list[1];
        this.__nctime = _list[2];
        this.__nstime = _list[3];
        this.__nmode  = _list[4];
        this.__vslide = {
            track:_vlist[0],
            thumb:_vlist[2],
            progress:_vlist[1],
            onslidestop:this.__onVolSlideStop._$bind(this)
        };
        this.__tslide = {
            track:_tlist[0],
            thumb:_tlist[2],
            progress:_tlist[1],
            value:0,
            onslidestop:this.__onTimeSlideStop._$bind(this)
        };
    };

    /**
     * 播放器点击事件
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onAction
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onAction = function(_event){
        var _action;
        var _node = _v._$getElement(_event,function(_node){
            _action = _e._$dataset(_node,'name');
            return !!_action;
        });
        if (!_node) return;
        if (_action == 'mode'){
            this.__doModeChange();
        }
        if (!this.__audio) return;
        this.__autostart = !0;
        if (_action == 'pre'){
            this.__onPre();
        }else if (_action == 'play'){
            this.__onPlay();
        }else if (_action == 'next'){
            this.__onNext();
        }
    };

    /**
     * 更新音量大小图标
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onVolumeChange
     * @return {Void}
     */
    _pro.__onVolumeChange = (function(){
        var _map = ['m-vmax','m-vmin','m-vzero'],
            _old = _map.join(' ');
        return function(_event){
            this.__volSlider._$setPosition(_event.volume/this.__vslide.value);
            var _value = _event.volume;
            if (_value == 0){
                _value = 2;
            }else if (_value < 50){
                _value = 1;
            }else{
                _value = 0;
            }
            _e._$replaceClassName(this.__nvol,_old,_map[_value]);
        };
    })();

    /**
     * 播放模式切换
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__doModeChange
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__doModeChange = function(_event){
        var _mode = this.__playlist._$getPlayMode();
        this.__playlist._$setPlayMode((_mode+1)%3);
    };

    /**
     * 切换前一首
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onPre
     * @return {Void}
     */
    _pro.__onPre = function(){
        this.__playlist._$prev();
    };

    /**
     * 播放或暂停
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onPlay
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onPlay = function(_event){
        if (!!this.__audio){
            var _pause = _e._$hasClassName(this.__nplay,'m-play');
            if (_pause){
                this.__audio._$play();
            }else{
                this.__audio._$pause();
            }
        }else{
            this.__playlist._$play();
        }
    };

    /**
     * 切换下一首
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onNext
     * @return {Void}
     */
    _pro.__onNext = function(){
        this.__playlist._$next();
    };

    /**
     * 播放状态更新
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onStateChange
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onStateChange = function(_event){
        var _state = _event.state;
        if (_state == 2){
            _e._$replaceClassName(this.__nplay,'m-play','m-pause');
        }else{
            _e._$replaceClassName(this.__nplay,'m-pause','m-play');
        }
        if (_state == 0 || _state == 4){
            this.__onTimeUpdate({current:0,duration:0});
        }
        if (_state == 4){
            this.__playlist._$autoNext();
        }
    };

    /**
     * 更新时间轴
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onTimeUpdate
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onTimeUpdate = function(_event){
        if (!this.__timeSlider)
            this.__timeSlider = _t0._$$SimpleSlider._$allocate(this.__tslide);
        // 播放第二首的current有问题
        var _current  = _event.current,
            _duration = _event.duration;
        if (parseInt(_current) === 0){
            this.__nctime.innerHTML = '00:00';
            this.__nstime.innerHTML = this.__doFormatSecond(_duration);
        }
        this.__nctime.innerHTML = this.__doFormatSecond(_current);
        var _played = _current / (_duration ? _duration : 1);
        this.__timeSlider._$setPosition(_played);
    };

    /**
     * 格式化秒为小时或分钟
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__doFormatSecond
     * @param  {Number}  _second - 秒数
     * @return {String}  格式化好的时间
     */
    _pro.__doFormatSecond = function(_second){
        var _hour = parseInt(_second/3600),
            _min  = parseInt((_second%3600)/60),
            _sec  = parseInt(_second%60);
            _min = _min > 9 ? _min : '0' + _min;
            _sec = _sec > 9 ? _sec : '0' + _sec;
        return (_hour > 0 ?  _hour + ':' : '') + _min + ':' +  _sec;
    };

    /**
     * 设置播放时间
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onTimeSlideStop
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onTimeSlideStop = function(_event){
        if (!this.__audio._$duration()) return;
        var _value = _event.ratio;
        this.__audio._$seek(_value * this.__audio._$duration());
    };

    /**
     * 设置音量
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onVolSlideStop
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onVolSlideStop = function(_event){
        var _value = _event.ratio;
            _value = _value * this.__vslide.value
        if (!!this.__audio){
            this.__audio._$volume(_value);
        }else{
            this.__onVolumeChange({volume:_value});
        }
    };

    /**
     * 更新播放模式
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onModeChange
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onModeChange = (function(){
        var _map = ['m-repeatb m-repeatd','m-repeatb-1 m-repeatd-1','m-shuffleb m-shuffled'],
            _old = _map.join(' ');
        return function(_event){
            _e._$replaceClassName(this.__nmode,_old,_map[_event.mode]);
        };
    })();

    /**
     * 多媒体状态改变
     *
     * @protected
     * @method ui/audio/mp3._$$MP3Player#__onMediaChange
     * @param  {Object} _options - 配置信息
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onMediaChange = function(_options,_event){
        if (_event.index < 0){
            if (!!this.__audio){
                this.__audio = this.__audio._$recycle();
            }
            this.__onTimeUpdate({current:0,duration:0});
            this.__onStateChange({state:0});
            if (!!this.__timeSlider){
                this.__timeSlider = this.__timeSlider._$recycle();
            }
            return;
        }
        var _url = _event.list[_event.index];
        if (!this.__audio){
            var _volume = this.__volSlider._$getPosition() * this.__vslide.value;
            this.__audio =  _t2._$audio({
                preload:_options.preload||false,
                volume:_volume,
                onstatechange:this.__onStateChange._$bind(this),
                ontimeupdate:this.__onTimeUpdate._$bind(this),
                onvolumechange:this.__onVolumeChange._$bind(this)
            });
        }
        this.__audio._$source(_url);
        if (this.__autostart){
            setTimeout(function(){
                this.__audio._$play();
            }._$bind(this),0);
        }
    };

    /**
     * 指定播放歌曲
     *
     * @method ui/audio/mp3._$$MP3Player#_$playByIndex
     * @param  {Number} arg0 -  歌曲列表的下标，默认为0
     * @return {Void}
     */
    _pro._$playByIndex = function(_index){
        _index = _index || 0;
        this.__autostart = !0;
        this.__playlist._$setPlayIndex(_index);
    };

    /**
     * 开始播放
     *
     * @method ui/audio/mp3._$$MP3Player#_$play
     * @return {Void}
     */
    _pro._$play = function(){
        this.__autostart = !0;
        this.__playlist._$play();
    };

    /**
     * 刷新播放列表
     *
     * @method ui/audio/mp3._$$MP3Player#_$refreshList
     * @param    {Object} arg0 - 配置信息
     * @property {Array}  mode - 歌曲播放模式
     * @property {Array}  list - 歌曲列表
     * @return   {Void}
     */
    _pro._$refreshList = function(_options){
        var _mode = _options.mode||0,
            _list = _options.list||[];
        if (!this.__playlist){
            this.__playlist = _t1._$$PlayList._$allocate({
                mode:_mode,
                list:_list,
                onmodechange:this.__onModeChange._$bind(this),
                onmediachange:this.__onMediaChange._$bind(this,_options)
            });
        }else{
            this.__autostart = !0;
            this.__playlist._$setPlayMode(_mode);
            this.__playlist._$setPlayList(_list);
        }
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});