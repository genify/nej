/*
 * ------------------------------------------
 * 音频播放器实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
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
      .#<uispace> .m-player{height:40px;min-width:530px;background:#606060;cursor:default}\
      .#<uispace> .m-player .ctl{width:300px; float:left;}\
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
      .#<uispace> .m-player .timeline{height:40px;position:absolute;left:300px;right:120px;bottom:0;top:0;min-width:135px;padding-top:15px;}\
      .#<uispace> .m-vol{height:27px;width:90px;padding:13px 0 0 20px;float:left;}\
      .#<uispace> .m-volicn{width:12px;height:20px;margin:10px 0 0 4px;float:left}\
      .#<uispace> .m-vzero .m-volminc{background-position:1px -185px;width:5px;height:20px;float:left;}\
      .#<uispace> .m-vzero .m-volmaxc{background-position:-8px -185px;width:7px;height:20px;float:left;}\
      .#<uispace> .m-vmin .m-volminc{background-position:-40px -186px;width:5px;height:20px;float:left;}\
      .#<uispace> .m-vmax .m-volminc{background-position:-40px -186px;width:5px;height:20px;float:left;}\
      .#<uispace> .m-vmin .m-volmaxc{background-position:-7px -185px;width:7px;margin-left:-1px;height:20px;float:left;}\
      .#<uispace> .m-vmax .m-volmaxc{background-position:-50px -186px;width:7px;margin-left:-1px;height:20px;float:left;}\
      .#<uispace> .m-timeline{position:absolute;width:100%;height:8px;border-radius:4px;background:#3b3b3b;border-top:1px solid #212121;border-bottom:1px solid #636363}\
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
              <span class="m-volicn ztag m-vmax f-ib">\
                <span class="f-ib m-volminc">&nbsp;</span>\
                <span class="f-ib m-volmaxc">&nbsp;</span>\
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
     * @config  {String|Node} parent     父节点
     * @config  {String}      mode       播放模式，0:列表(默认)，1:单曲，2:随机
     * @config  {Array}       list       歌曲列表
     * @config  {Boolean}     autostart  是否自动开始，0:不自动，1:自动(默认)
     */
    _i._$$MP3Player = NEJ.C();
    _pro = _i._$$MP3Player._$extend(_i._$$Abstract);

    /**
     * 重置控件
     * @param  {Objec} _options 可选配置参数
     * @return {void}          
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__vslide.value = _options.volnumber||100;
        this.__autostart = _options.autostart === 0 ? !1 : !0;
        this.__doInitDomEvent([
            [this.__body,'click',this.__onAction._$bind(this)]
        ]);
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
     * 初始化结构
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
    	this.__supInitNode();
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
     * @param  {[type]} _event [description]
     * @return {void}
     */
    _pro.__onAction = function(_event){
        var _action;
        var _node = _v._$getElement(_event,function(_node){
            _action = _e._$dataset(_node,'name');
            return !!_action;
        });
        if(!_node) return;
        if(_action == 'mode'){
            this.__doModeChange();
        }
        if(!this.__audio) return;
        this.__autostart = !0;
        if(_action == 'pre'){
            this.__onPre();
        }else if(_action == 'play'){
            this.__onPlay();
        }else if(_action == 'next'){
            this.__onNext();
        } 
    };

    /**
     * 更新音量大小图标
     * @return {void}
     */
    _pro.__onVolumeChange = (function(){
        var _map = ['m-vmax','m-vmin','m-vzero'],
            _old = _map.join(' ');
        return function(_event){
            this.__volSlider._$setPosition(_event.volume/this.__vslide.value);
            var _value = _event.volume;
            if(_value == 0){
                _value = 2;
            }else if(_value < 50){
                _value = 1;
            }else{
                _value = 0;
            }
            _e._$replaceClassName(this.__nvol,_old,_map[_value]);
        };
    })();

    /**
     * 播放模式切换
     * @return {void}
     */
    _pro.__doModeChange = function(_event){
        var _mode = this.__playlist._$getPlayMode();
        this.__playlist._$setPlayMode((_mode+1)%3);
    };

    /**
     * 切换前一首
     * @return {void}
     */
    _pro.__onPre = function(){
    	this.__playlist._$prev();
    };

    /**
     * 播放或暂停
     * @return {void}
     */
    _pro.__onPlay = function(_event){
        if(!!this.__audio){
            var _pause = _e._$hasClassName(this.__nplay,'m-play');
            if(_pause){
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
     * @return {void}
     */
    _pro.__onNext = function(){
    	this.__playlist._$next();
    };

    /**
     * 播放状态更新
     * @param  {[type]} _event [description]
     * @return {void}
     */
    _pro.__onStateChange = function(_event){
    	var _state = _event.state;
        if(_state == 2){
            _e._$replaceClassName(this.__nplay,'m-play','m-pause');
        }else{
            _e._$replaceClassName(this.__nplay,'m-pause','m-play');
        }
        if(_state == 0 || _state == 4){
            this.__onTimeUpdate({current:0,duration:0});
        }
        if(_state == 4){
            this.__playlist._$autoNext();
        }
    };

    /**
     * 更新时间轴
     * @param  {[type]} _event [description]
     * @return {void}
     */
    _pro.__onTimeUpdate = function(_event){
        if(!this.__timeSlider)
            this.__timeSlider = _t._$$SimpleSlider._$allocate(this.__tslide);
    	// 播放第二首的current有问题
        var _current  = _event.current,
            _duration = _event.duration;
	    if(parseInt(_current) === 0){
	    	this.__nctime.innerHTML = '00:00';
            this.__nstime.innerHTML = this.__doFormatSecond(_duration);
	    }
	    this.__nctime.innerHTML = this.__doFormatSecond(_current);
        var _played = _current / (_duration ? _duration : 1);
        this.__timeSlider._$setPosition(_played);
    };

    /**
     * 格式化秒为小时或分钟
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
     * @param  {[type]} _event [description]
     * @return {void}
     */
    _pro.__onTimeSlideStop = function(_event){
        if(!this.__audio._$duration()) return;
        var _value = _event.ratio;
        this.__audio._$seek(_value * this.__audio._$duration());
    };

    /**
     * 设置音量
     * @param  {[type]} _event [description]
     * @return {void}
     */
    _pro.__onVolSlideStop = function(_event){
    	var _value = _event.ratio;
            _value = _value * this.__vslide.value
        if(!!this.__audio){
            this.__audio._$volume(_value);
        }else{
            this.__onVolumeChange({volume:_value});
        }
    };

    /**
     * 更新播放模式
     * @return {void}
     */
    _pro.__onModeChange = (function(){
        var _map = ['m-repeatb m-repeatd','m-repeatb-1 m-repeatd-1','m-shuffleb m-shuffled'],
            _old = _map.join(' ');
        return function(_event){
            _e._$replaceClassName(this.__nmode,_old,_map[_event.mode]);
        };
    })();

    /**
     * [__onMediaChange description]
     * @param  {[type]} _options [description]
     * @param  {[type]} _event   [description]
     * @return {void}
     */
    _pro.__onMediaChange = function(_options,_event){
        if(_event.index < 0){
            if(!!this.__audio){
                this.__audio = this.__audio._$recycle();
            }
            this.__onTimeUpdate({current:0,duration:0});
            this.__onStateChange({state:0});
            if(!!this.__timeSlider){
                this.__timeSlider = this.__timeSlider._$recycle();
            }
            return;
        }
        var _url = _event.list[_event.index];
        if(!this.__audio){
            var _volume = this.__volSlider._$getPosition() * this.__vslide.value;
            this.__audio =  _e._$audio({
                preload:_options.preload||false,
                volume:_volume,
                onstatechange:this.__onStateChange._$bind(this),
                ontimeupdate:this.__onTimeUpdate._$bind(this),
                onvolumechange:this.__onVolumeChange._$bind(this)
            });
        }
        this.__audio._$source(_url);
        if(this.__autostart){
            setTimeout(function(){
                this.__audio._$play();
            }._$bind(this),0);
        }
    };

    /**
     * 开始播放
     * @return {void}
     */
    _pro._$play = function(){
        this.__autostart = !0;
        this.__playlist._$play();
    };

    /**
     * 刷新播放列表
     * @param  {Array} _list 歌曲列表
     * @return {void}  
     */
    _pro._$refreshList = function(_options){
        var _mode = _options.mode||0,
            _list = _options.list||[];
    	if(!this.__playlist){
    		this.__playlist = _t._$$PlayList._$allocate({
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
};
NEJ.define('{lib}ui/audio/mp3.js',
      ['{lib}ui/base.js'
      ,'{patch}audio.js'
      ,'{patch}config.js'
      ,'{lib}util/media/playlist.js'
      ,'{lib}util/slider/slider.simple.js'],f);