var f = function() {
	var _  = NEJ.P,
		_e = _('nej.e'),
		_v = _('nej.v'),
		_c = _('nej.c'),
		_i = _('nej.ui'),
		_t = _('nej.ut'),
		_pro;
    if (!!_i._$$MP3Player) return;
    var _seed_css  = _e._$pushCSSText('\
      .#<uispace> .m-pre, .#<uispace> .m-play, .#<uispace> .m-next, .#<uispace> .m-cur, .#<uispace> .m-pause, .#<uispace> .m-volmin,\
      .#<uispace> .m-volminc, .#<uispace> .m-shuffled, .#<uispace> .m-repeatd-1, .#<uispace> .m-shufflec, .#<uispace> .m-repeatd, .#<uispace> .m-repeatc,\
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
      .#<uispace> .m-player .timeline{height:40px;position:absolute;left:285px;right:120px;bottom:0;top:0;min-width:120px;padding-top:15px;}\
      .#<uispace> .m-vol{height:27px;width:90px;padding:13px 0 0 20px;float:left;}\
      .#<uispace> .m-volicn{width:12px;height:20px;margin:10px 0 0 4px;float:left}\
      .#<uispace> .m-volmin{background-position:1px -185px;width:5px;height:20px;float:left;}\
      .#<uispace> .m-volminc{background-position:-40px -186px;width:5px;height:20px;float:left;}\
      .#<uispace> .m-volmax{background-position:-7px -185px;width:7px;margin-left:-1px;height:20px;float:left;}\
      .#<uispace> .m-volmaxc{background-position:-50px -186px;width:7px;margin-left:-1px;height:20px;float:left;}\
      .#<uispace> .m-timeline{position:absolute;width:100%;height:8px;border-radius:4px;background:-webkit-gradient(linear,0% 0%, 0% 100%, from(#2b2b2b), to(#3b3b3b));border-top:1px solid #212121;border-bottom:1px solid #636363}\
      .#<uispace> .m-timelinei{width:0%;}\
      .#<uispace> .m-timeline-1{margin-top:0px;width:90px;position:absolute;}\
      .#<uispace> .m-progress{background:green;margin-top:-1px;}\
      .#<uispace> .m-cur{position:absolute;right:-5px;margin-left:-5px;background-position:-73px -186px;height:10px;width:10px;}\
      .#<uispace> .m-cur2{position:absolute;right:-5px;margin-left:-5px;background:url('+_c._$get('root')+'audio_sprite.png) no-repeat 9999px 9999px;width:10px;background-position: -73px -186px;}\
      .#<uispace> .m-cur:active, .#<uispace> .m-cur2:active{background-position:-93px -186px;}\
      .#<uispace> .m-shuffleb{height:20px;width:20px;float:right;margin:10px 10px 0 0 }\
      .#<uispace> .m-shuffled{background-position:-55px -115px;}\
      .#<uispace> .m-shufflec{background-position:-56px -115px;}\
      .#<uispace> .m-repeatb, .m-repeatb-1{height:20px;width:20px;float:right;margin:10px 10px 0 0 }\
      .#<uispace> .m-repeatd{background-position:-55px -149px;}\
      .#<uispace> .m-repeatd-1{background-position:-11px -149px;}\
      .#<uispace> .m-repeatc{background-position:-56px -149px;}\
      .m-cnt{width:600px;position: relative;}');
    var _seed_html = _e._$addNodeTemplate('\
      <div class="m-cnt '+_seed_css+'">\
        <div class="cse">\
    	  <div class="m-player">\
    	    <div class="ctl">\
    		  <span class="f-ib m-pre" data-name="pre">&nbsp;</span>\
              <span class="f-ib m-play ztag" data-name="play">&nbsp;</span>\
              <span class="f-ib m-next" data-name="next" value="next">&nbsp;</span>\
              <div class="m-vol">\
    		    <div class="f-ib m-timeline m-timeline-1 vtag">\
                  <div class="f-ib m-timeline m-progress m-timeline-1 vtag">\
                    <span class="f-ib m-cur2 vtag">&nbsp;</span>\
                  </div>\
                </div>\
              </div>\
              <span class="m-volicn f-ib">\
                <span class="f-ib ztag m-volminc" style="opacity: 1;">&nbsp;</span>\
                <span class="f-ib ztag m-volmaxc" style="opacity: 100;">&nbsp;</span>\
    		  </span>\
              <span class="m-curtime ztag">00:00</span>\
    		</div>\
    		<div class="timeline">\
    			<div class="m-timeline ttag">\
                  <div class="m-timeline m-progress ttag m-timelinei">\
                    <span class="m-cur ttag">&nbsp;</span>\
                  </div>\
    			</div>\
    		</div>\
    		<div class="loop">\
    		  <span class="m-time ztag">00:00</span>\
              <span class="m-repeatb m-repeatd ztag" data-name="mode">&nbsp;</span>\
    		</div>\
    	  </div>\
        </div>\
      </div>');
    /**
     * 音频播放器
     * @class   {nej.ui._$$MP3Player} 音频播放器
     * @uses    {nej.ut._$$SimpleSlider}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object}  可选配置参数，已处理参数列表如下：
     * @config  {String|Node}       父节点
     * @config  {String}  mode      播放模式，默认是列表循环
     * @config  {Array}  list       歌曲列表
     * @config  {Boolean} autostart 自动开始播放
     * 
     */
    _i._$$MP3Player = NEJ.C();
    _pro = _i._$$MP3Player._$extend(_i._$$Abstract);
    __supMP3Player = _i._$$MP3Player._$supro;

    /**
     * 初始化播放器结构
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
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
    _pro.__init = function(_options){
    	this.__supInit(_options);
        this.__volnumber = _options.volnumber||100;
    	this.__autostart = _options.autostart;
    };

    /**
     * 初始化结构
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
    	this.__supInitNode();
        // 0 - 播放按钮
        // 1 - 小音量
        // 2 - 大音量
        // 3 - 当前播放时间
        // 4 - 歌曲总时长
        // 5 - 歌曲播放模式
    	var _list  = _e._$getByClassName(this.__body,'ztag'),
            _vlist = _e._$getByClassName(this.__body,'vtag'),
            _tlist = _e._$getByClassName(this.__body,'ttag');
        this.__play  = _list[0];
        this.__vmin  = _list[1];
        this.__vmax  = _list[2];
        this.__ctime = _list[3];
        this.__stime = _list[4];
        this.__nmode = _list[5];
        this.__vslide = {
            track:_vlist[0],
            thumb:_vlist[2],
            progress:_vlist[1],
            value:this.__volnumber,
            onslidestop:this.__onVolSlideStop._$bind(this)
        };
        this.__tslide = {
            track:_tlist[0],
            thumb:_tlist[2],
            progress:_tlist[1],
            value:0,
            onslidestop:this.__onTimeSlideStop._$bind(this)
        };
    	this.__doInitDomEvent([
            [this.__body,'click',this.__onAudioClick._$bind(this)]
    	]);
    };

    _pro.__onAudioClick = function(_event){
        var _node = _v._$getElement(_event),
            _action = _e._$dataset(_node,'name');
        if(_action == 'pre'){
            this.__onPre();
        }else if(_action == 'play'){
            this.__onPlay();
        }else if(_action == 'next'){
            this.__onNext();
        }else if(_action == 'mode'){
            this.__onChangeState();
        }
    };

    /**
     * 重置控件
     * @param  {Objec} _options 可选配置参数
     * @param  {Array} 
     * @return {void}          
     */
    _pro.__reset = function(_options){
    	this.__supReset(_options);
        if(!this.__volSlider){
            this.__volSlider = _t._$$SimpleSlider._$allocate(this.__vslide);
        }
		this._$refreshList(_options);
    };

    /**
     * 销毁控件
     * @return {void}
     */
    _pro.__destroy = function(){
        this.__doClearComponent();
    	this.__supDestroy();
    };

    /**
     * [__onVolumeChange description]
     * @return {[type]} [description]
     */
    _pro.__onVolumeChange = function(_event){
        this.__volSlider._$setPosition(_event.volume/this.__volnumber);
        this.__refreshVolume(_event.volume);
    };

    /**
     * [__onChangeState description]
     * @return {[type]} [description]
     */
    _pro.__onChangeState = function(_event){
        var _mode = this.__playlist._$getPlayMode();
            _mode = _mode == 0 ? _mode + 2 : _mode - 1;
        this.__playlist._$setPlayMode(_mode);
    };

    /**
     * [__onPre description]
     * @return {[type]} [description]
     */
    _pro.__onPre = function(){
        this.__autostart = !0;
    	this.__playlist._$prev();
    };

    /**
     * [__onPlay description]
     * @return {[type]} [description]
     */
    _pro.__onPlay = function(_event){
        this.__autostart = !0;
		if(this.__state == 3){
			this.__audio._$play();
		}else if(this.__state == 2){
			this.__audio._$pause();
		}
        if(!this.__state){
            this._$play();
        }
    };

    /**
     * [__onNext description]
     * @return {[type]} [description]
     */
    _pro.__onNext = function(){
        this.__autostart = !0;
    	this.__playlist._$next();
    };

    /**
     * [__loadMusic description]
     * @return {[type]} [description]
     */
    _pro.__loadMusic = function(_url){
    	this.__audio._$source(_url);
	    setTimeout(function(){
	    	this.__audio._$play();
	    }._$bind(this),0);
    };

    /**
     * [__onStateChange description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    _pro.__onStateChange = function(_event){
    	this.__state = _event.state;
    	this.__updateStateStyle();
        if(this.__state == 4){
            this.__playlist._$autoNext();
        }
    };

    /**
     * [__updateStateStyle description]
     * @return {[type]} [description]
     */
    _pro.__updateStateStyle = function(){
        if(this.__state == 0 || this.__state == 4){
            _e._$replaceClassName(this.__play,'m-pause','m-play');
            this.__duration = null;
            this.__ctime.innerHTML = '00:00';
            this.__timeSlider._$setPosition(0);
        }else if(this.__state == 2){
            _e._$replaceClassName(this.__play,'m-play','m-pause');
        }else if(this.__state == 3){
            _e._$replaceClassName(this.__play,'m-pause','m-play');
        }
    };

    /**
     * [__onTimeUpdate description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    _pro.__onTimeUpdate = function(_event){
        if(!this.__timeSlider)
            this.__timeSlider = _t._$$SimpleSlider._$allocate(this.__tslide);
    	// 播放第二首的current有问题
	    if(parseInt(_event.current) === 0){
	    	this.__refreshTime(_event);
            this.__duration = _event.duration;
	    }
	    this.__onAudioTimeupdate(_event);
    };

    /**
     * [__refreshTime description]
     * @return {[type]} [description]
     */
    _pro.__refreshTime = function(_event){
        this.__ctime.innerHTML = '00:00';
        this.__stime.innerHTML = this.__formatSecond(_event.duration);
    };

    /**
     * [__onAudioTimeupdate description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    _pro.__onAudioTimeupdate = function(_event){
        this.__ctime.innerHTML = this.__formatSecond(_event.current);
        var _played = _event.current / _event.duration;
        this.__timeSlider._$setPosition(_played);
    };

    /**
     * [__formatSecond description]
     * @return {[type]} [description]
     */
    _pro.__formatSecond = function(_second){
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
     * [__onTimeSlideStop description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    _pro.__onTimeSlideStop = function(_event){
    	if(!this.__duration) return;
        var _value = _event.ratio;
        this.__audio._$seek(_value * this.__duration);
    };

    /**
     * [__onVolSlideStop description]
     * @param  {[type]} _event [description]
     * @return {[type]}        [description]
     */
    _pro.__onVolSlideStop = function(_event){
    	var _value = _event.ratio;
        if(!!this.__audio){
            this.__audio._$volume(_value * this.__volnumber);
        }else{
            this.__onVolumeChange({volume:_value * this.__volnumber});
        }
    };

    /**
     * 刷新音量
     * @param  {[type]} _volume [description]
     * @return {[type]}         [description]
     */
    _pro.__refreshVolume = function(_value){
		if(_value < 50){
			_e._$replaceClassName(this.__vmin,'m-volmin','m-volminc');
			_e._$replaceClassName(this.__vmax,'m-volmaxc','m-volmax');
            _e._$setStyle(this.__vmin,'opacity',1);
			if(_value/50 < 30){
			  _e._$replaceClassName(this.__vmin,'m-volminc','m-volmin');
			}else{
                _e._$setStyle(this.__vmin,'opacity', _value/50);
            }
		}else{
			_e._$replaceClassName(this.__vmin,'m-volmin','m-volminc');
			_e._$replaceClassName(this.__vmax,'m-volmax','m-volmaxc');
			_e._$setStyle(this.__vmin,'opacity',1);
			_e._$setStyle(this.__vmax,'opacity',_value/this.__volnumber);
		}
    };

    /**
     * [__setModeStyle description]
     * @return {[type]} [description]
     */
    _pro.__setModeStyle = (function(){
        var _map = ['m-repeatb m-repeatd','m-repeatb-1 m-repeatd-1','m-shuffleb m-shuffled']
        return function(_mode){
            _e._$replaceClassName(this.__nmode,_map.join(' '),_map[_mode]);
        }
    })();

    /**
     * 开始播放
     * @return {[type]} [description]
     */
    _pro._$play = function(){
        if(!this.__audio) return;
    	this.__loadMusic(this.__cururl);
    };

    /**
     * 刷新播放列表
     * @param  {[type]} _list [description]
     * @return {[type]}       [description]
     */
    _pro._$refreshList = function(_options){
        var _mode = _options.mode||0,
            _list = _options.list||[];
    	if(!this.__playlist){
    		this.__playlist = _t._$$PlayList._$allocate({
				mode:_mode,
				list:_list,
				onmodechange:function(_event){
                    this.__setModeStyle(_event.mode);
				}._$bind(this),
				onmediachange:function(_event){
					this.__cururl = _event.list[_event.index];
                    if(!this.__audio){
                        var _volume = this.__volSlider._$getPosition() * this.__volnumber;
                        this.__audio =  _e._$audio({
                            preload:_options.preload||false,
                            volume:_volume,
                            onstatechange:this.__onStateChange._$bind(this),
                            ontimeupdate:this.__onTimeUpdate._$bind(this),
                            onvolumechange:this.__onVolumeChange._$bind(this)
                        });
                    }
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
      ,'{lib}util/slider/slider.simple.js'],f);