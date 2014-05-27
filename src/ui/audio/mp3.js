var f = function() {
	var _ = NEJ.P,
		f = NEJ.F,
		_e = _('nej.e'),
		_v = _('nej.v'),
		_c = _('nej.c'),
		_p = _('nej.ui'),
		_ut= _('nej.ut'),
		__proMP3Player,
        __supMP3Player;
    var _seed_css  = _e._$pushCSSText('\
                    .#<uispace> .m-pre, .#<uispace> .m-play, .#<uispace> .m-next, .#<uispace> .m-cur, .#<uispace> .m-pause, .#<uispace> .m-volmin,\
					.#<uispace> .m-volminc, .#<uispace> .m-shuffled, .#<uispace> .m-repeatd-1, .#<uispace> .m-shufflec,\
					.#<uispace> .m-repeatd, .#<uispace> .m-repeatc,\
					.#<uispace> .m-volmax, .#<uispace> .m-volmaxc{background:url('+_c._$get('root')+'audio_sprite.png) no-repeat 9999px 9999px;}\
					.#<uispace> .m-player{height:40px;min-width:530px;background:-webkit-gradient(linear,0% 0%, 0% 100%, from(#606060), to(#4e4e4e));background:-moz-linear-gradient(top, #606060, #4e4e4e);cursor:default}\
					.#<uispace> .m-player .ctl{width:285px; float:left;}\
					.#<uispace> .m-pre{height:30px;width:25px;background-position:0 0;float:left;margin-top:8px;margin-left: 10px;}\
					.#<uispace> .m-pre:active, .#<uispace> .m-preatv{background-position:-104px -1px;}\
					.#<uispace> .m-play{height:40px;width:32px;background-position:0 -35px;float:left;margin:2px 4px 0;}\
					.#<uispace> .m-play:active{background-position:-202px -36px;}\
					.#<uispace> .m-pause{height:40px;width:32px;background-position:-103px -35px;float:left;margin:2px 4px 0;}\
					.#<uispace> .m-pause:active{background-position:-155px -36px;}\
					.#<uispace> .m-next{height:30px;width:25px;background-position:0 -80px;float:left;margin-top:8px;}\
					.#<uispace> .m-next:active, .#<uispace>  .m-nextatv{background-position:-103px -81px;}\
					.#<uispace> .m-player .loop{width:120px;float:right}\
					.#<uispace> .m-curtime{float: right;margin-right: 10px;color:#fff;line-height: 40px;}\
					.#<uispace> .m-time{float: left;margin-left: 10px;color:#fff;line-height: 40px;}\
					.#<uispace> .m-player .timeline{height:40px;position:absolute;left:285px;right:120px;bottom:0;top:0;min-width:120px}\
					.#<uispace> .m-vol{height:27px;width:90px;padding:13px 0 0 20px;float:left;}\
					.#<uispace> .m-volicn{width:12px;height:20px;margin:10px 0 0 4px;float:left}\
					.#<uispace> .m-volmin{background-position:1px -185px;width:5px;height:20px;}\
					.#<uispace> .m-volminc{background-position:-40px -186px;width:5px;height:20px;}\
					.#<uispace> .m-volmax{background-position:-7px -185px;width:7px;margin-left:-1px;height:20px;}\
					.#<uispace> .m-volmaxc{background-position:-50px -186px;width:7px;margin-left:-1px;height:20px;}\
					.#<uispace> .m-timeline{position: relative;height:8px;border-radius:4px;margin-top:15px;background:-webkit-gradient(linear,0% 0%, 0% 100%, from(#2b2b2b), to(#3b3b3b));border-top:1px solid #212121;border-bottom:1px solid #636363}\
					.#<uispace> .m-timeline-1{margin-top:0px;width:90px;position:absolute;}\
					.#<uispace> .m-cur{background-position:-73px -186px;height:10px;width:10px;\
						position:absolute;top:-1px}\
					.#<uispace> .m-cur2{position: absolute;left: 80px;background:url('+_c._$get('root')+'audio_sprite.png) no-repeat 9999px 9999px;top: -1px;width:10px;background-position: -73px -186px;}\
					.#<uispace> .m-cur:active{background-position:-93px -186px;}\
					.#<uispace> .m-shuffleb{height:20px;width:20px;float:right;margin:10px 10px 0 0 }\
					.#<uispace> .m-shuffled{background-position:-55px -115px;}\
					.#<uispace> .m-shufflec{background-position:-56px -115px;}\
					.#<uispace> .m-repeatb, .m-repeatb-1{height:20px;width:20px;float:right;margin:10px 10px 0 0 }\
					.#<uispace> .m-repeatd{background-position:-55px -149px;}\
					.#<uispace> .m-repeatd-1{background-position:-11px -149px;}\
					.#<uispace> .m-repeatc{background-position:-56px -149px;}\
					.m-cnt{width:600px;position: relative;}\
                     ');
    var _seed_html = _e._$addNodeTemplate('\
                     <div class="m-cnt '+_seed_css+'">\
						<div class="cse">\
							<div class="m-player">\
								<div class="ctl">\
									<span class="f-ib m-pre ztag">&nbsp;</span> <span class="f-ib ztag m-play">&nbsp;</span> <span class="f-ib m-next ztag" value="next">&nbsp;</span><span class="m-vol">\
										<span class="f-ib m-timeline m-timeline-1 ztag"> <span class="f-ib m-cur2 ztag">&nbsp;</span></span></span><span class="m-volicn f-ib "><span class="f-ib ztag m-volminc" style="opacity: 1;">&nbsp;</span><span class="f-ib ztag m-volmaxc" style="opacity: 100;">&nbsp;</span>\
									</span><span class="m-curtime ztag">00:00</span>\
								</div>\
								<div class="timeline">\
									<div class="m-timeline ztag">\
										<span class="m-cur ztag" style="left: 1px;">&nbsp;</span>\
									</div>\
								</div>\
								<div class="loop">\
									<span class="m-time ztag">00:00</span><span class="m-repeatb m-repeatd ztag">&nbsp;</span>\
								</div>\
							</div>\
						</div>\
					</div>');
    if (!!_p._$$MP3Player) return;
    /**
     * 音频播放器
     * @class   {nej.ui._$$MP3Player} 音频播放器
     * @uses    {nej.ut._$$SliderX}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object}  可选配置参数，已处理参数列表如下：
     * @config  {String|Node}       父节点
     * @config  {String}  mode      播放模式，默认是列表循环
     * @config  {String}  list      歌曲列表
     * @config  {Boolean} autostart 自动开始播放
     * 
     * [hr]
     * 
     * @event  {onstatechange} 状态变化事件
     * @param  {Object}        事件对象
     * 
     */
    _p._$$MP3Player = NEJ.C();
    __proMP3Player = _p._$$MP3Player._$extend(_p._$$Abstract);
    __supMP3Player = _p._$$MP3Player._$supro;

    /**
     * 初始化播放器结构
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proMP3Player.__initXGui = function(){
    	this.__seed_css = _seed_css;
    	this.__seed_html = _seed_html;
    };

    /**
     * 初始化方法
     * @protected
     * @param  {Object} _options 可选配置参数
     * @method {__init}
     * @return {Void}
     */
    __proMP3Player.__init = function(_options){
    	this.__supInit(_options);
    	this.__autoNext = !0;
    	this.__autostart = _options.autostart;
    };

    /**
     * 初始化结构
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    __proMP3Player.__initNode = function(){
    	this.__supInitNode();
    	this.__ztags = _e._$getByClassName(this.__body,'ztag');
    	this.__doInitDomEvent([
    		[this.__ztags[0],'click',this.__onPre._$bind(this)],
    		[this.__ztags[1],'click',this.__onPlay._$bind(this)],
    		[this.__ztags[2],'click',this.__onNext._$bind(this)],
    		[this.__ztags[11],'click',this.__onChangeState._$bind(this)]
    	]);
    };

    /**
     * 重置控件
     * @param  {Objec} _options 可选配置参数
     * @param  {Array} 
     * @return {void}          
     */
    __proMP3Player.__reset = function(_options){
    	this.__supReset(_options);
        if(!this.__volSlider)
            this.__volSlider = _ut._$$SliderX._$allocate({
                slide:this.__ztags[4],
                track:this.__ztags[3],
                onchange:this.__onVolSlideChange._$bind(this)
            });
		this._$refreshList(_options);
    };

    /**
     * [__destroy description]
     * @return {[type]} [description]
     */
    __proMP3Player.__destroy = function(){
    	this.__supDestroy();
    	if(!!this.__playlist)
    		this.__playlist = this.__playlist._$recycle();
    	if(!!this.__audio) 
    		this.__audio = this.__audio._$recycle();
    	if(!!this.__timeSlider) 
    		this.__timeSlider = this.__timeSlider._$recycle();
    	if(!!this.__volSlider) 
    		this.__volSlider = this.__volSlider._$recycle();
    };

    /**
     * [__onVolumeChange description]
     * @return {[type]} [description]
     */
    __proMP3Player.__onVolumeChange = function(_event){
        var _value = _event.volume;
            _value = this.__ztags[3].clientWidth  * (_value/100) - 10;
        _e._$setStyle(this.__ztags[4],'left',_value + 'px');
    };

    /**
     * [__onChangeState description]
     * @return {[type]} [description]
     */
    __proMP3Player.__onChangeState = function(_event){
    	var _node = _v._$getElement(_event);
    	if(this.__mode == 0){
    		_e._$replaceClassName(_node,'m-repeatb m-repeatd','m-shuffleb m-shuffled');
    		this.__playlist._$setPlayMode(2);
    	}else if(this.__mode == 2){
    		_e._$replaceClassName(_node,'m-shuffleb m-shuffled','m-repeatb-1 m-repeatd-1');
    		this.__playlist._$setPlayMode(1);
    	}else if(this.__mode == 1){
    		_e._$replaceClassName(_node,'m-repeatb-1 m-repeatd-1','m-repeatb m-repeatd');
    		this.__playlist._$setPlayMode(0);
    	}
    };

    /**
     * [__onPre description]
     * @return {[type]} [description]
     */
    __proMP3Player.__onPre = function(){
    	this.__autoNext = !1;
    	this.__playlist._$next();
    };

    /**
     * [__onPlay description]
     * @return {[type]} [description]
     */
    __proMP3Player.__onPlay = function(_event){
		if(this.__state == 3){
			this.__audio._$play();
		}else if(this.__state == 2){
			this.__audio._$pause();
		}
    };

    /**
     * [__onNext description]
     * @return {[type]} [description]
     */
    __proMP3Player.__onNext = function(){
    	this.__autoNext = !1;
    	this.__playlist._$prev();
    };

    /**
     * [__loadMusic description]
     * @return {[type]} [description]
     */
    __proMP3Player.__loadMusic = function(_url){
    	this.__audio._$source(_url);
	    setTimeout(function(){
	    	this.__audio._$play();
	    }._$bind(this),0);
    };

    /**
     * [__updateStateStyle description]
     * @return {[type]} [description]
     */
    __proMP3Player.__updateStateStyle = function(){
    	if(this.__state == 0){
    		_e._$replaceClassName(this.__ztags[1],'m-pause','m-play');
			this.__currentTime = null;
			this.__duration = null;
			this.__ztags[7].innerHTML = '00:00';
			this.__ztags[10].innerHTML = '00:00';
			_e._$setStyle(this.__ztags[9],'left','0px');
    	}else if(this.__state == 2){
    		_e._$replaceClassName(this.__ztags[1],'m-play','m-pause');
    	}else if(this.__state == 3){
    		_e._$replaceClassName(this.__ztags[1],'m-pause','m-play');
    	}
    };

    /**
     * [__onStateChange description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    __proMP3Player.__onStateChange = function(_event){
    	this.__state = _event.state;
    	this.__updateStateStyle();
		if(this.__state == 0){
			// 当前停止状态
			this.__audio._$seek(0);
			// 是否歌曲自己播放完了,如果是，自动播放下一首
			if(this.__autoNext){
				if(this.__playlist._$getPlayMode() == 1){
					// 单曲循环的情况
					var _index = this.__playlist._$getPlayIndex();
					this.__playlist._$setPlayIndex(_index);
				}else{
					this.__playlist._$next();
				}
			}
		}else if(this.__state == 2){
    		// 当前播放状态
			// 播放的时候，设置歌曲自己播放完
            this.__refreshVolume(); 
			this.__autoNext = true;
		}
    };

    /**
     * [__onTimeUpdate description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    __proMP3Player.__onTimeUpdate = function(_event){
        if(!this.__timeSlider)
            this.__timeSlider = _ut._$$SliderX._$allocate({
                slide:this.__ztags[9],
                track:this.__ztags[8],
                onchange:this.__onTimeSlideChange._$bind(this)
            });
        var _time = _event.current;
    	// 播放第二首的current有问题
	    if(parseInt(_time) === 0){
	    	this.__refreshTime(_event);
	    }
        
        // if(this.__currentTime && parseInt(this.__currentTime) == parseInt(_time)) return;
        this.__currentTime = _time;
	    this.__onAudioTimeupdate(_event);
    };

    /**
     * [__refreshTime description]
     * @return {[type]} [description]
     */
    __proMP3Player.__refreshTime = function(_event){
		this.__ztags[7].innerHTML ='00:00';
		this.__ztags[10].innerHTML =  this.__formatSecond(_event.duration);
    };

    /**
     * [__formatSecond description]
     * @return {[type]} [description]
     */
    __proMP3Player.__formatSecond = function(_second){
    	if(_second>=3600){
    		var _hour = parseInt(_second/3600),
    			_min  = parseInt((_second%3600)/60),
    			_sec  = parseInt(_second%60);
    		_min = _min > 9 ? _min : '0' + _min;
    		_sec = _sec > 9 ? _sec : '0' + _sec;
    		return _hour + ':' + _min + ':' +  _sec;
    	}else{
    		var _min  = parseInt(_second/60),
    			_sec  = parseInt(_second%60);
    		_min = _min > 9 ? _min : '0' + _min;
    		_sec = _sec > 9 ? _sec : '0' + _sec;
    		return _min + ':' +  _sec;
    	}
    };

    /**
     * [__onAudioTimeupdate description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    __proMP3Player.__onAudioTimeupdate = function(_event){
        if(!!this.__timelineMouseDown) return;
        this.__duration = _event.duration;
        this.__ztags[7].innerHTML = this.__formatSecond(this.__currentTime);
        var _played = this.__currentTime / this.__duration;
        var _left = Math.floor((this.__ztags[8].clientWidth - 10) * _played) + 'px';
        _e._$setStyle(this.__ztags[9],'left',_left);
    };

    /**
     * [__onTimeSlideChange description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    __proMP3Player.__onTimeSlideChange = function(_event){
    	if(!this.__duration || !this.__currentTime) return;
    	var _value = _event.x.value;
    	_e._$setStyle(this.__ztags[9],'left',_value + 'px');
    	this.__timelineMouseDown = true;
    	if(!!_event.stopped){
    		var _time = (_value / (this.__ztags[8].clientWidth - 10)) * this.__duration;
    		this.__currentTime = _time;
        	this.__audio._$seek(this.__currentTime);
    		this.__timelineMouseDown = false;
    	}
    };

    /**
     * [__onVolSlideChange description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    __proMP3Player.__onVolSlideChange = function(_event){
    	var _value = _event.x.value;
    	this.__volume = (_value + 10)/(this.__ztags[3].clientWidth);
	    this.__refreshVolume();
    };

    /**
     * 刷新音量
     * @param  {[type]} _volume [description]
     * @return {[type]}         [description]
     */
    __proMP3Player.__refreshVolume = function(){
		if(this.__volume < 0.5){
			_e._$replaceClassName(this.__ztags[5],'m-volmin','m-volminc');
			_e._$replaceClassName(this.__ztags[6],'m-volmaxc','m-volmax');
            _e._$setStyle(this.__ztags[5],'opacity',1);
			if(this.__volume / 0.5 < 0.3){
			  _e._$replaceClassName(this.__ztags[5],'m-volminc','m-volmin');
			}else{
                _e._$setStyle(this.__ztags[5],'opacity', this.__volume / 0.5);
            }
		}else{
			_e._$replaceClassName(this.__ztags[5],'m-volmin','m-volminc');
			_e._$replaceClassName(this.__ztags[6],'m-volmax','m-volmaxc');
			_e._$setStyle(this.__ztags[5],'opacity',1);
			_e._$setStyle(this.__ztags[6],'opacity',this.__volume);
		}
        if(!!this.__audio){
            this.__volume = this.__volume||1;
            this.__audio._$volume(this.__volume * 100);
        }
    };

    /**
     * [__setModeStyle description]
     * @return {[type]} [description]
     */
    __proMP3Player.__setModeStyle = function(){
        if(this.__mode == 0){
            _e._$replaceClassName(this.__ztags[11],'m-repeatb-1 m-repeatd-1','m-repeatb m-repeatd');
        }else if(this.__mode == 1){
            _e._$replaceClassName(this.__ztags[11],'m-shuffleb m-shuffled','m-repeatb-1 m-repeatd-1');
        }else{
            _e._$replaceClassName(this.__ztags[11],'m-repeatb m-repeatd','m-shuffleb m-shuffled');
        }
    };

    /**
     * 开始播放
     * @return {[type]} [description]
     */
    __proMP3Player._$play = function(){
    	this.__autostart = !0;
    	this.__loadMusic(this.__cururl);
    };

    /**
     * 刷新播放列表
     * @param  {[type]} _list [description]
     * @return {[type]}       [description]
     */
    __proMP3Player._$refreshList = function(_options){
        var _mode = _options.mode||0,
            _list = _options.list||[];
    	if(!this.__playlist){
    		this.__playlist = _ut._$$PlayList._$allocate({
				mode:_mode,
				list:_list,
				onmodechange:function(_event){
                    this.__mode = _event.mode;
                    this.__setModeStyle();
				}._$bind(this),
				onmediachange:function(_event){
					this.__cururl = _event.list[_event.index];
                    if(!this.__audio)
                        this.__audio =  _e._$audio({
                            preload:_options.preload||false,
                            onstatechange:this.__onStateChange._$bind(this),
                            ontimeupdate:this.__onTimeUpdate._$bind(this),
                            onvolumechange:this.__onVolumeChange._$bind(this)
                        });
					if(!!this.__autostart){
						this.__loadMusic(this.__cururl);
					}
				}._$bind(this)
			});
    	}else{
    		this.__playlist._$setPlayMode(_mode);
    		this.__playlist._$setPlayList(_list);
    	}
    };
};
NEJ.define('{lib}ui/audio/mp3.js',
      ['{lib}ui/base.js'
      ,'{patch}audio.js'
      ,'{patch}config.js'
      ,'{lib}util/media/playlist.js'
      ,'{lib}util/slider/slider.x.js'
      ,'{lib}util/media/audio.js'],f);