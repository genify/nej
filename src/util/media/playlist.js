/*
 * ------------------------------------------
 * 多媒体播放列表管理控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/media/playlist */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'util/event'
],function(NEJ,_k,_u,_t,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 多媒体播放列表管理控件
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/media/playlist'
     * ],function(_t){
     *     var _playlist = _t._$$PlayList._$allocate({
     *         mode:1,
     *         list:[{id:1,url:'a.mp3'},...],
     *         onmodechange:function(_event){
     *             console.log(_event.mode);
     *             // TODO 同步UI状态
     *         },
     *         onmediachange:function(_event){
     *             console.log(_event.list[_event.index]);
     *             // TODO 同步播放歌曲
     *         }
     *     });
     *     // 下一首
     *     _playlist._$next();
     *     // 上一首
     *     _playlist._$prev();
     *     // 修改播放模式
     *     _playlist._$setPlayMode(2);
     * });
     * ```
     *
     * @class    module:util/media/playlist._$$PlayList
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object} config - 可选配置参数
     * @property {Array}  list   - 多媒体列表
     * @property {Number} mode   - 播放模式
     */
    /**
     * 当前媒体变化事件
     * 
     * @event    module:util/media/playlist._$$PlayList#onmediachange
     * @param    {Object}  event - 媒体信息
     * @property {Number}  index - 当前媒体索引
     * @property {Number}  last  - 上一个媒体索引
     * @property {Array}   list  - 播放列表
     */
    /**
     * 多媒体追加触发事件，如果处理过程中将data置空则不追加
     * 
     * @event    module:util/media/playlist._$$PlayList#onbeforeappend
     * @param    {Object}   event - 媒体信息
     * @property {Variable} data  - 媒体对象
     * @property {Array}    list  - 播放列表
     * @property {Number}   index - 当前媒体索引
     */
    /**
     * 播放模式变化事件
     * 
     * @event    module:util/media/playlist._$$PlayList#onmodechange
     * @param    {Object} event - 模式信息
     * @property {Number} mode  - 当前播放模式
     * @property {Number} last  - 上一个播放模式
     */
    _p._$$PlayList = _k._$klass();
    _pro = _p._$$PlayList._$extend(_t._$$EventTarget);
    /**
     * 重置控件
     * 
     * @protected
     * @method module:util/media/playlist._$$PlayList#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this._$setPlayMode(_options.mode);
        this._$setPlayList(_options.list);
    };
    /**
     * 销毁控件
     * 
     * @protected
     * @method module:util/media/playlist._$$PlayList#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__index;
        delete this.__list;
        delete this.__mode;
        delete this.__rlist;
    };
    /**
     * 生成随机列表，子类可重写随机列表生成规则
     * 
     * @protected
     * @method module:util/media/playlist._$$PlayList#__doGenRandList
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
     * 
     * | 值   |   描述 |
     * | :--- | :--- |
     * | 0    |   列表循环【默认】 |
     * | 1    |   单曲循环 |
     * | 2    |   随机播放 |
     * 
     * @method module:util/media/playlist._$$PlayList#_$setPlayMode
     * @param  {Number} arg0 - 播放模式
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
     * 
     * @method module:util/media/playlist._$$PlayList#_$getPlayMode
     * @see    module:util/media/playlist._$$PlayList#_$setPlayMode
     * @return {Number} 播放模式
     */
    _pro._$getPlayMode = function(){
        return this.__mode;
    };
    /**
     * 设置前播放列表
     * 
     * @method module:util/media/playlist._$$PlayList#_$setPlayList
     * @param  {Array} arg0 - 媒体列表
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
     * 
     * @method module:util/media/playlist._$$PlayList#_$getPlayList
     * @return {Array} 媒体列表
     */
    _pro._$getPlayList = function(){
        return this.__list;
    };
    /**
     * 设置播放歌曲索引，没有播放列表或者索引值越界均不做任何处理
     * 
     * @method module:util/media/playlist._$$PlayList#_$setPlayIndex
     * @param  {Number} arg0 - 歌曲索引
     * @return {Void}
     */
    _pro._$setPlayIndex = function(_index){
        // check playlist and index
        var _length = this.__list.length;
        _index = parseInt(_index);
        var _current = _index,
            _last = this.__index;
        if (_index<0||_index>=_length){
            _current = -1;
        }else{
            // save index
            this.__index = _index;
        }
        // onmediachange
        var _event = {
            last:_last,
            index:_current,
            list:this.__list
        };
        this._$dispatchEvent('onmediachange',_event);
    };
    /**
     * 获取播放歌曲索引
     * 
     * @method module:util/media/playlist._$$PlayList#_$getPlayIndex
     * @return {Number} 歌曲索引
     */
    _pro._$getPlayIndex = function(){
        return this.__index;
    };
    /**
     * 追加多媒体项
     * 
     * @method module:util/media/playlist._$$PlayList#_$appendMedia
     * @param  {Variable} arg0 - 多媒体项
     * @return {Void}
     */
    _pro._$appendMedia = function(_media){
        var _event = {
            data:_media,
            list:this.__list,
            index:this.__index
        };
        // for media filter
        this._$dispatchEvent('onbeforeappend',_event);
        _media = _event.data;
        if (!!_media){
            this.__list.push(_media);
            if (this.__mode==2){
                this.__doGenRandList();
            }
        }
        this._$dispatchEvent('onafterappend',_event);
    };
    /**
     * 删除多媒体项，索引值越界不做任何处理
     * 
     * @method module:util/media/playlist._$$PlayList#_$removeMedia
     * @param  {Number} arg0 - 媒体索引
     * @return {Void}
     */
    _pro._$removeMedia = function(_index){
        var _length = this.__list.length;
        if (_index<0||_index>=_legnth) return;
        this.__list.splice(_index,1);
        // re-gen rand list
        if (this.__mode==2){
            this.__doGenRandList();
        }
        // remove current media
        if(_index==this.__index){
            if (this.__index>=_length){
                this.__index = _length-1;
            }
            this._$play();
        }
    };
    /**
     * 播放指定偏移量的歌曲
     * 
     * @method module:util/media/playlist._$$PlayList#_$play
     * @param  {Number} arg0 - 索引偏移量，可以为0，正数，负数
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
                (_fmap[this.__mode]||_f).call(this,_delta)||0
            );
        };
    })();
    /**
     * 自动播放下一首歌曲
     * 
     * @method module:util/media/playlist._$$PlayList#_$autoNext
     * @return {Void}
     */
    _pro._$autoNext = function(){
        if (this.__mode==1){
            this._$setPlayIndex(
                this._$getPlayIndex()
            );
        }else{
            this._$next();
        }
    };
    /**
     * 播放下一首歌曲
     * 
     * @method module:util/media/playlist._$$PlayList#_$next
     * @return {Void}
     */
    _pro._$next = function(){
        this._$play(1);
    };
    /**
     * 播放上一首歌曲
     * 
     * @method module:util/media/playlist._$$PlayList#_$prev
     * @return {Void}
     */
    _pro._$prev = function(){
        this._$play(-1);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej,ut'),_p);
    }

    return _p;
});