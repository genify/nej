/*
 * ------------------------------------------
 * 多媒体播放列表管理控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$PlayList) return;
    /**
     * 多媒体播放列表管理控件
     * 脚本举例
     * [code]
     *   var _playlist = nej.ut._$$PlayList._$allocate({
     *       mode:1,
     *       list:[{id:1,url:'a.mp3'},...],
     *       onmodechange:function(_event){
     *           console.log(_event.mode);
     *           // TODO 同步UI状态
     *       },
     *       onmediachange:function(_event){
     *           console.log(_event.list[_event.index]);
     *           // TODO 同步播放歌曲
     *       }
     *   });
     *   // 下一首
     *   _playlist._$next();
     *   // 上一首
     *   _playlist._$prev();
     *   // 修改播放模式
     *   _playlist._$setPlayMode(2);
     * [/code]
     * 
     * @class   {nej.ut._$$PlayList}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object}  可选配置参数
     * @config  {Array}   list  多媒体列表
     * @config  {Number}  mode  播放模式
     *                           
     * [hr] 
     * 当前媒体变化事件
     * @event  {onmediachange}
     * @param  {Object}  媒体信息
     * @config {Number}  index 当前媒体索引
     * @config {Number}  last  上一个媒体索引
     * @config {Array}   list  播放列表
     * 
     * [hr]
     * 播放模式变化事件
     * @event  {onmodechange}
     * @param  {Object}  模式信息
     * @config {Number}  mode 当前播放模式
     * @config {Number}  last 上一个播放模式
     */
    _p._$$PlayList = NEJ.C();
    _pro = _p._$$PlayList._$extend(_p._$$Event);
    /**
     * 重置控件
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this._$setPlayMode(_options.mode);
        this._$setPlayList(_options.list);
    };
    /**
     * 销毁控件
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        delete this.__index;
        delete this.__list;
        delete this.__mode;
        delete this.__rlist;
    };
    /**
     * 生成随机列表，子类可重写随机列表生成规则
     * @protected
     * @method {__doGenRandList}
     * @return {Void}
     */
    _pro.__doGenRandList = (function(){
        var _default = function(_value,_dft){
            return _value==null?_dft:_value;
        };
        return function(){
            if (!this.__list||!this.__list.length){
                this.__rlist = [];
                return;
            }
            var _result = [0],_ptr1,_tmp0,
                _ptr0 = this.__list.length;
            while(_ptr0>1){
                _ptr1 = Math.floor(Math.random()*_ptr0);
                _ptr0--;
                if (_ptr0!==_ptr1){
                    _tmp = _default(_result[_ptr0],_ptr0);
                    _result[_ptr0] = _default(_result[_ptr1],_ptr1);
                    _result[_ptr1] = _tmp;
                }else{
                    // fill result
                    _result[_ptr0] = _default(_result[_ptr0],_ptr0);
                }
            }
            this.__rlist = _result;
        };
    })();
    /**
     * 设置播放模式，非法输入均使用列表循环模式，可用模式值
     * [ntb]
     *  值   |   描述
     *  0   |   列表循环【默认】
     *  1   |   单曲循环
     *  2   |   随机播放
     * [/ntb]
     * @method {_$setPlayMode}
     * @param  {Number} 播放模式
     * @return {Void}
     */
    _pro._$setPlayMode = function(_mode){
        // check mode
        _mode = parseInt(_mode)||0;
        if (_mode<0||_mode>2){
            _mode = 0;
        }
        if (_mode===this.__mode) return;
        // save mode
        var _event = {
            mode:_mode,
            last:this.__mode
        };
        this.__mode = _mode;
        // for rand mode
        if (this.__mode==2){
            this.__doGenRandList();
        }else{
            delete this.__rlist;
        }
        this._$dispatchEvent('onmodechange',_event);
    };
    /**
     * 获取播放模式
     * @see    {_$setPlayMode}
     * @method {_$getPlayMode}
     * @return {Number} 播放模式
     */
    _pro._$getPlayMode = function(){
        return this.__mode;
    };
    /**
     * 设置前播放列表
     * @method {_$setPlayList}
     * @param  {Array} 媒体列表
     * @return {Void}
     */
    _pro._$setPlayList = function(_list){
        if (!_u._$isArray(_list)){
            _list = [];
        }
        this.__list = _list;
        // replay after list change
        if (this.__mode==2){
            this.__doGenRandList();
            this.__index = this.__rlist[0];
        }else{
            this.__index = 0;
        }
        this._$play();
    };
    /**
     * 取当前播放列表
     * @method {_$getPlayList}
     * @return {Array} 媒体列表
     */
    _pro._$getPlayList = function(){
        return this.__list;
    };
    /**
     * 设置播放歌曲索引，没有播放列表或者索引值越界均不做任何处理
     * @method {_$setPlayIndex}
     * @param  {Number} 歌曲索引
     * @return {Void}
     */
    _pro._$setPlayIndex = function(_index){
        // check playlist and index
        var _length = this.__list.length;
        if (!_length) return;
        _index = parseInt(_index);
        if (_index<0||_index>=_length) return;
        // save index
        var _event = {
            index:_index,
            list:this.__list,
            last:this.__index
        };
        this.__index = _index;
        this._$dispatchEvent('onmediachange',_event);
    };
    /**
     * 获取播放歌曲索引
     * @method {_$getPlayIndex}
     * @return {Number} 歌曲索引
     */
    _pro._$getPlayIndex = function(){
        return this.__index;
    };
    /**
     * 播放指定偏移量的歌曲
     * @method {_$play}
     * @param  {Number} 索引偏移量，可以为0，正数，负数
     * @return {Void}
     */
    _pro._$play = (function(){
        var _loop = function(_delta){
            var _length = this.__list.length,
                _index = (this.__index+_delta)%_length;
            return _index<0?(_length+_index):_index;
        };
        var _rand = function(_delta){
            var _length = this.__list.length,
                _index = _u._$indexOf(
                    this.__rlist,this.__index
                );
            _index = (_index+_delta)%_length;
            _index = _index<0?(_length+_index):_index;
            return this.__rlist[_index];
        };
        var _fmap = [_loop,_loop,_rand];
        return function(_delta){
            _delta = parseInt(_delta)||0;
            this._$setPlayIndex(
                (_fmap[this.__mode]||_f).call(this,_delta)
            );
        };
    })();
    /**
     * 播放下一首歌曲
     * @method {_$next}
     * @return {Void}
     */
    _pro._$next = function(){
        this._$play(1);
    };
    /**
     * 播放上一首歌曲
     * @method {_$prev}
     * @return {Void}
     */
    _pro._$prev = function(){
        this._$play(-1);
    };
};
NEJ.define(
    '{lib}util/media/playlist.js',[
    '{lib}util/event.js'
],f);
