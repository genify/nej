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
     */
    _p._$$Player = NEJ.C();
      _proPlayer = _p._$$Player._$extend(_t._$$Event);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proPlayer.__init = function(){
        this.__nevt = [
            'dataloaded','play','pause','timeupdate',
            'ended','volumechange','error','notify'
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
     * @param  {String} 音乐地址
     * @return {Void}
     */
    _proPlayer._$play = function(_url){
        _n._$exec('player.load',_url);
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
        _n._$exec('player.setCurrentTime',_ratio*_player.duration);
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
                    current:_n._$exec('player.getCurrentTime'),
                    duration:_player.duration
                });
            return;
            case 'volumechange':
                
            return;
            case 'error':
                
            return;
            case 'notify':
                
            return;
        }
    };
};
NEJ.define('{lib}native/cef/util/player.js',
          ['{lib}util/event.js'
          ,'{lib}native/command.js'],f);