/**
 * ------------------------------------------
 * 语音接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _e = _('nej.e'),
        _h = _('nej.h'),
        _t = _('nej.ut');
    /**
     * 取音频播放器实例
     * @api    {nej.e._$audio}
     * @param {Object} 配置信息
     * @return {nej.ut._$$Media} 音频播放器实例
     */
    _e._$audio = function(_options){
        return _h.__getAudioInst(_options);
    };
    /**
     * 播放音频，代码示例
     * [code]
     *     // 播放音频
     *     // 如果之前有音频在播放
     *     // 则会先触发之前音频的0状态onstatechange事件
     *     nej.e._$playBgSound(
     *         'http://a.b.com/a/a.mp3',{
     *             key:'test-audio'
     *             extra:'xxx_id',
     *             onstatechange:function(_event){
     *                 // _event.state -> 状态值
     *                 // _event.data  -> extra值
     *             },
     *             onerror:function(_event){
     *                 // _event.code  -> 错误类型
     *             }
     *         }
     *     );
     *     // 停止音频播放
     *     // 如果有音频在播放
     *     // 则会触发0状态的onstatechange事件
     *     nej.e._$stopBgSound('test-audio');
     * [/code]
     * @api    {nej.e._$playBgSound}
     * @param  {String} 音频文件地址
     * @param  {Object} 可选配置参数
     * @config {String}   key           播放标识，同一标识只允许一个播放实例
     * @config {Variable} extra         onstatechange/onerror时传回数据
     * @config {Number}   retry         出错重试次数，0表示不重试，默认为0
     * @config {Number}   interval      如果设置了retry则通过此参数指定每次重试间隔，单位毫秒，默认500
     * @config {Function} onstatechange 播放状态变化回调事件，state值为
     *                                  [ntb]
     *                                   0 | 当前停止状态
     *                                   1 | 当前缓冲状态
     *                                   2 | 当前播放状态
     *                                   3 | 当前暂停状态
     *                                  [/ntb]
     * @config {Function} ontimeupdate 时间轴变化事件，输入{current:1.000,duration:50.000,data:'extra data'}
     * @config {Function} onerror      播放异常回调事件
     * @return {Void}
     */
    _e._$playBgSound = (function(){
        // audio player cache
        // url   - audio url
        // conf  - play config
        // audio - audio instance
        // timer - retry timer
        var _pcache = {};
        // callback
        var _doCallback = function(_key,_name,_event,_cleared){
            var _cch = _pcache[_key];
            if (!_cch) return;
            var _conf = _cch.conf,
                _func = _conf[_name]||_f,
                _extr = _conf.extra;
            if (!!_cleared){
                delete _pcache[_key];
            }
            _event.data = _extr;
            _func(_event);
        };
        // state change callback
        var _doStateChangeCallback = function(_key,_state){
            _doCallback(
                _key,'onstatechange',
                {state:_state},_state==0
            );
        };
        // error callback
        var _doErrorCallback = function(_key,_code){
            _doCallback(_key,'onerror',{code:_code},!0);
        };
        // timeupdate callback
        var _doTimeUpdateCallback = function(_key,_event){
            _doCallback(_key,'ontimeupdate',_event);
        };
        // state change action
        var _doStateChangeAction = function(_key,_event){
            if (_event.state==0){
                _doClearAction(_key);
            }
            _doStateChangeCallback(_key,_event.state);
        };
        // play action
        var _doPlayAction = function(_key){
            var _cch = _pcache[_key];
            if (!_cch) return;
            _cch.audio = _h.__getAudioInst({
                url:_cch.url,
                onerror:_doErrorAction._$bind(null,_key),
                ontimeupdate:_doTimeUpdateCallback._$bind(null,_key),
                onstatechange:_doStateChangeAction._$bind(null,_key)
            });
            _cch.audio._$play();
        };
        // stop action
        var _doClearAction = function(_key){
            var _cch = _pcache[_key];
            if (!_cch) return;
            if (!!_cch.audio){
                _cch.audio = _cch.audio._$recycle();
            }
            if (!!_cch.timer){
                _cch.timer = window.clearTimeout(_cch.timer);
            }
        };
        // error action
        var _doErrorAction = function(_key,_event){
            var _cch = _pcache[_key];
            if (!_cch) return;
            _doClearAction(_key);
            var _conf = _cch.conf;
            if (_conf.retry>0){
                _conf.retry--;
                _cch.timer = window.setTimeout(
                    _doPlayAction._$bind(null,_key),
                    _conf.interval||500
                );
            }else{
                _doErrorCallback(_key,_event.code);
            }
        };
        /**
         * 停止单例音频播放
         * @api    {nej.e._$stopBgSound}
         * @see    {nej.e._$playBgSound}
         * @param  {String} 播放标识
         * @return {Void}
         */
        _e._$stopBgSound = function(_key){
            var _cch = _pcache[_key||'auto-audio'];
            if (!!_cch){
                _cch.audio._$stop();
            }
        };
        return function(_url,_options){
            if (!_url) return;
            var _playing = NEJ.X({},_options),
                _key = _playing.key||'auto-audio',
                _cch = _pcache[_key];
            // stop last
            if (!!_cch){
                _doClearAction(_key);
                _doStateChangeCallback(_key,0);
            }
            // save audio config
            _pcache[_key] = {
                url:_url,
                conf:_playing
            };
            // play current
            _doPlayAction(_key);
        };
    })();
};
NEJ.define('{lib}util/audio/audio.js',['{platform}audio.js'],f);