/**
 * ------------------------------------------
 * 播放器控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _  = NEJ.P, 
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _n = _('nej.n'),
        _p = _('nej.cef.ut'),
        _player = _('window.player'),
        _proPlayer;
    /**
     * 播放器控件，单例模式使用
     * 
     * @singleton
     * @class   {nej.cef.ut._$$Player}
     * @extends {nej.ut._$$Event}
     * @param   {Object} 配置参数
     * 
     * [hr]
     * 播放状态变化触发事件，播放状态值说明
     * [ntb]
     *   状态值  |  说明
     *   ------------------
     *   0    |  缓冲阶段
     *   1    |  播放状态
     *   2    |  暂停状态
     *   3    |  停止状态
     *   4    |  播放至结尾
     *   5    |  播放异常
     * [/ntb]
     * @event  {onstatechange}
     * @param  {Object} 状态信息
     * @config {Number} state 状态值，见说明表
     * 
     * [hr]
     * 播放位置变化触发事件
     * @event  {onpositionchange}
     * @param  {Object} 播放信息
     * @config {Float} current  当前位置
     * @config {Float} duration 音乐总时长
     * 
     * [hr]
     * 音量变化触发事件
     * @event  {onvolumechange}
     * @param  {Object} 音量信息
     * @config {Float}  volume 当前音量值，0.0-1.0
     * 
     * [hr]
     * 静音状态变化触发事件
     * @event  {onmutechange}
     * @param  {Object}  静音状态信息
     * @config {Boolean} mute 静音状态，true-静音，false-非静音
     * 
     * [hr]
     * 歌曲变化触发事件
     * @event  {ontrackchange}
     * @param  {Object}  静音状态信息
     * @config {Boolean} flag 变化标识，-1-上一首，1-下一首
     * 
     * [hr]
     * 播放模式变化触发事件，模式说明
     * [ntb]
     *   名称                       |  说明
     *   -----------------------
     *   playorder  |  顺序播放
     *   playcycle  |  循环播放
     *   playrandom |  随机播放
     * [/ntb]
     * @event  {onmodechange}
     * @param  {Object}  静音状态信息
     * @config {Boolean} mode 模式，见描述
     * 
     * [hr]
     * 歌词更新触发事件
     * @event  {onlrcupdate}
     * @param  {Object}  歌词信息
     * @config {String}  id  歌曲ID
     * @config {String}  lrc 歌词内容
     * 
     * 
     */
    _p._$$Player = NEJ.C();
      _proPlayer = _p._$$Player._$extend(_t._$$Event);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proPlayer.__init = function(){
        this.__nevt = [
            'volumechange','notify',
            'dataloaded','play','pause',
            'ended',,'playmode','error','playpre',
            'playnext','timeupdate','lyricsupdate'
        ];
        this.__supInit();
    };
    /**
     * 控件重置
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proPlayer.__reset = (function(){
        // add native event
        var _doAddEvent = function(_name){
            _player['on'+_name] = this.
                __onNativeEvent._$bind(this,_name);
        };
        return function(_options){
            this.__supReset(_options);
            _u._$forEach(
                this.__nevt,_doAddEvent,this
            );
            if (!_player.paused){
                this.__onNativeEvent('play');
            }
        };
    })();
    /**
     * 控件销毁
     * @return {Void}
     */
    _proPlayer.__destroy = (function(){
        var _doDelEvent = function(_name){
            delete _player['on'+_name];
        };
        return function(){
            this.__supDestroy();
            _u._$forEach(
                this.__nevt,_doDelEvent
            );
        };
    })();
    /**
     * 播放音乐
     * @param  {Object} 音乐信息
     * @return {Void}
     */
    _proPlayer._$play = function(_options){
        _n._$exec('player.load',_options);
        _n._$exec('player.setInfo',_options);
        this._$dispatchEvent('onstatechange',{
            state:0
        });
    };
    /**
     * 恢复状态
     * @return {Void}
     */
    _proPlayer._$resume = function(){
        _n._$exec('player.play');
    };
    /**
     * 暂停播放
     * @return {Void}
     */
    _proPlayer._$pause = function(){
        _n._$exec('player.pause');
    };
    /**
     * 停止播放
     * @return {Void}
     */
    _proPlayer._$stop = function(){
        _n._$exec('player.stop');
    };
    /**
     * 设置静音
     * @param  {Boolean} 静音，true-静音，false-非静音
     * @return {Void}
     */
    _proPlayer._$setMute = function(_mute){
        _n._$exec('player.mute',!!_mute);
        this._$dispatchEvent('onmutechange',{
            mute:!!_mute
        });
    };
    /**
     * 设置模式
     * @param  {String} 播放模式
     * @return {Void}
     */
    _proPlayer._$setMode = function(_mode){
        _n._$exec('player.setPlayMode',_mode);
        this.__onNativeEvent('playmode',_mode);
    };
    /**
     * 设置音量
     * @param  {Float} 音量，范围：[0.0,1.0]
     * @return {Void}
     */
    _proPlayer._$setVolume = function(_volume){
        _n._$exec('player.setVolume',_volume);
    };
    /**
     * 设置播放位置
     * @param  {Float} 播放位置，百分比
     * @return {Void}
     */
    _proPlayer._$setPosition = function(_ratio){
        _n._$exec('player.setCurrentTime',_ratio*(_player.duration||0));
    };
    /**
     * 设置歌词
     * @param  {String} 歌词内容
     * @return {Void}
     */
    _proPlayer._$setLRC = function(_lrc){
        !_lrc ? _n._$exec('player.setLRCEmpty')
              : _n._$exec('player.setLRC',_lrc||'');
    };
    /**
     * 设置封面
     * @param  {String} 专辑ID
     * @return {Void}
     */
    _proPlayer._$setCover = function(_aid){
        !_aid ? _n._$exec('player.setCoverDefault')
              : _n._$exec('player.setCover',''+_aid,'album');
    };
    /**
     * native事件回调
     * @param  {String} 事件名称
     * @return {Void}
     */
    _proPlayer.__onNativeEvent = function(_name){
        switch(_name){
            case 'dataloaded':
                this._$resume();
            return;
            case 'play':
                this._$dispatchEvent('onstatechange',{
                    state:1
                });
            return;
            case 'pause':
                this._$dispatchEvent('onstatechange',{
                    state:2
                });
            return;
            case 'ended':
                this._$dispatchEvent('onstatechange',{
                    state:4
                });
            return;
            case 'timeupdate':
                this._$dispatchEvent('onpositionchange',{
                    current:_n._$exec('player.getCurrentTime')||0,
                    duration:_player.duration||0
                });
            return;
            case 'volumechange':
                this._$dispatchEvent('onvolumechange',{
                    volume:_n._$exec('player.getVolume')
                });
            return;
            case 'error':
                this._$dispatchEvent('onstatechange',{
                    state:5
                });
            return;
            case 'notify':
                
            return;
            case 'playpre':
            case 'playnext':
                this._$dispatchEvent('ontrackchange',{
                    flag:_name=='playpre'?-1:1
                });
            return;
            case 'playmode':
                this._$dispatchEvent('onmodechange',{
                    mode:arguments[1]
                });
            return;
            case 'lyricsupdate':
                this._$dispatchEvent('onlrcupdate',{
                    id:arguments[1],lrc:arguments[2]
                });
            return;
        }
    };
};
NEJ.define('{lib}native/cef/util/player.js',
          ['{lib}util/event.js'
          ,'{lib}native/command.js'],f);