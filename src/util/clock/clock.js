/*
 * ------------------------------------------
 * 时钟算法实现文件
 * @version  1.0
 * @author   xiejin(hzxiejin@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/clock/clock */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/event'
],function(NEJ,_k,_e,_v,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 时间算法
     *
     * 结构举例
     * ```html
     * <div class="ztime js-clock">
     *   <select class="zper js-ztag" size="2">
     *       <option value="A.M." selected>A.M.</option>
     *       <option value="P.M.">P.M.</option>
     *   </select>
     *   <input type="text" id="z-hour" class="js-ztag"><div class="sep">:</div>
     *   <input type="text" id="z-minute" class="js-ztag"><div class="sep">:</div>
     *   <input type="text" id="z-second" class="js-ztag">
     *   <div class="zbtn-list">
     *       <button class="js-ztag" id="ztime-add">&#9650;</button>
     *       <button class="js-ztag" id="ztime-minus">&#9660;</button>
     *   </div>
     * </div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/clock/clock'
     * ],function(_t){
     *     // 分配时间功能
     *     var _clock = _t._$$Clock._$allocate({
     *         cnxt:'ztime-minus',
     *         cprv:'ztime-add',
     *         hour:'z-hour',
     *         minute:'z-minute',
     *         second:'z-second',
     *         format:'12'
     *     });
     *
     * });
     * ```
     *
     * @class    module:util/clock/clock._$$Clock
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}      config   - 可选配置参数
     * @property {String|Node} cnxt     - 减少时间按钮节点
     * @property {String|Node} cprv     - 增加时间按钮节点
     * @property {String|Node} hour     - 小时输入节点
     * @property {String|Node} minute   - 分钟输入节点
     * @property {String|Node} second   - 秒输入节点
     * @property {String|Node} per      - 时段选择节点
     * @property {Date}        date     - 显示日期，默认为当前时间
     * @property {Number}      format   - 时制，默认为24时制
     */

    _p._$$Clock = _k._$klass();
    _pro = _p._$$Clock._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/clock/clock._$$Clock#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        // init event
        // TODO delegate event
        this.__hnode = _e._$get(_options.hour);
        this.__mnode = _e._$get(_options.minute);
        this.__snode = _e._$get(_options.second);
        this.__pnode = _e._$get(_options.per);
        this.__cnxt  = _e._$get(_options.cnxt);
        this.__cprv  = _e._$get(_options.cprv);
        this.__doInitDomEvent([[
            this.__cnxt,'click',
            this.__onTimeChange._$bind(this,-1)
        ],[
            this.__cprv,'click',
            this.__onTimeChange._$bind(this, 1)
        ],[
            this.__hnode,'input',
            this.__onInput._$bind(this,0)
        ],[
            this.__mnode,'input',
            this.__onInput._$bind(this,1)
        ],[
            this.__snode,'input',
            this.__onInput._$bind(this,2)
        ],[
            this.__hnode,'click',
            this.__onSelect._$bind(this)
        ],[
            this.__mnode,'click',
            this.__onSelect._$bind(this)
        ],[
            this.__snode,'click',
            this.__onSelect._$bind(this)
        ]]);
        this.__flag = this.__hnode;
        this.__temp = [this.__hnode.value,this.__mnode.value,this.__snode.value];
        this._$setClock(_options.date||(new Date()));
        this._$setFormat(_options.format);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/clock/clock._$$Clock#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
    };
    /**
     * 同步时间显示
     *
     * @protected
     * @method module:util/clock/clock._$$Clock#__doSyncTimeShow
     * @return {Void}
     */
    _pro.__doSyncTimeShow = function(){
        if(this.__format == 12){
            if(this.__hour > 11){
                if(this.__hour > 21){
                    this.__hnode.value = this.__hour - 12;
                }else{
                    this.__hnode.value = '0' + (this.__hour - 12);
                }
                this.__pnode.value = 'P.M.';
            }
        }else{
            this.__hnode.value = this.__hour;
        }
        this.__mnode.value = this.__minute;
        this.__snode.value = this.__second;
    };
    /**
     * 输入框被选择触发事件
     *
     * @protected
     * @method module:util/clock/clock._$$Clock#__onSelect
     * @param  {Event} arg0 - 事件对象
     * @return {void}
     */
    _pro.__onSelect = function(_event){
        var _target = _v._$getElement(_event);
        this.__flag = _target;
        _target.select();
    };
    /**
     * 输入框输入触发事件
     *
     * @protected
     * @method module:util/clock/clock._$$Clock#__onInput
     * @param  {Number} arg0 - 输入框标记
     * @param  {Event}  arg1 - 事件对象
     * @return {void}
     */
    _pro.__onInput = (function(){
        var _map = [23,59,59],
            _reg = /^\d{1,2}$/;
        return function(_type,_event){
            var _target = _v._$getElement(_event),
                _tempv  = this.__temp[_type],
                _str    = '' + _target.value,
                _flag   = !_reg.test(_str),
                _flag2  = _str === '';
            if (!_flag2){
                if(parseInt(_target.value,10) > _map[_type] || _flag){
                    _target.value = _tempv;
                }
                if(_type == 0 && this.__format == 12 && (parseInt(_target.value,10) > 11 || _flag)){
                    _target.value = _tempv;
                }
            }
            this.__temp[_type] = _target.value;
        };
    })();

    /**
     * 时间修改触发事件
     *
     * @protected
     * @method module:util/clock/clock._$$Clock#__onTimeChange
     * @param  {Number} arg0 - 输入框标记
     * @param  {Event}  arg1 - 事件对象
     * @return {void}
     */
    _pro.__onTimeChange = function(_index,_event){
        var _node = this.__flag,
            _per = this.__format,
            _temp = 0;
        if(_node.value){
            _temp = parseInt(_node.value,10) + _index;
        }else{
            _node.value = 0;
        }
        if (_temp < 10 && _temp >-1){
            _node.value = '0' + _temp;
        }else{
            _node.value = _temp;
        }
        if(_node.id == 'z-hour'){
            if (_temp == _per){
                _node.value = '00';
            }else if(_temp == -1){
                _node.value = '' + (_per - 1);
            }
            this.__hour = _node.value;
            this.__temp[0] = '';
        }else if(_node.id == 'z-minute' || _node.id == 'z-second'){
            if(_temp == 60){
                _node.value = '00';
            }else if(_temp == -1){
                _node.value = '59';
            }
            if(_node.id == 'z-minute'){
                this.__minute = _node.value;
                this.__temp[1] = '';
            }
            if(_node.id == 'z-second'){
                this.__second = _node.value;
                this.__temp[2] = '';
            }
        }
    };
    /**
     * 设置时间
     *
     * 脚本举例
     * ```javascript
     * _clock._$setClock('11:11:11');
     * ```
     *
     * @method module:util/clock/clock._$$Clock#_$setClock
     * @param  {String|Date} arg0 - 时间
     * @return {Void}
     */
    _pro._$setClock = (function(){
        var _setTime = function(_date,_obj){
            _obj.h = _date.getHours();
            _obj.m = _date.getMinutes();
            _obj.s = _date.getSeconds();
            return _obj;
        };
        var _var2time = function(_time){
            var _date = _time,
                _obj = {};
            if (_u._$isString(_time)){
                var _list = _time.split(':');
                _obj.h = _list[0];
                _obj.m = _list[1];
                _obj.s = _list[2];
            }
            if (!_u._$isDate(_time)){
                _date = new Date(_time);
                _obj = _setTime(_date,_obj);
            }else{
                _obj = _setTime(_date,_obj);
            }
            return _obj;
        };
        return function(_time){
            _time = _var2time(_time);
            this.__hour = _time.h < 10 ? '0' + _time.h : _time.h;
            this.__minute = _time.m < 10 ? '0' + _time.m : _time.m;
            this.__second = _time.s < 10 ? '0' + _time.s : _time.s;
            this.__doSyncTimeShow();
        };
    })();
    /**
     * 取当前选择时间
     *
     * 脚本举例
     * ```javascript
     * _clock._$getClock();
     * ```
     *
     * @method module:util/clock/clock._$$Clock#_$getClock
     * @return {Object} 当前选择时间
     */
    _pro._$getClock = function(){
        var _clock = {
            h:parseInt(this.__hour,10),
            m:parseInt(this.__minute,10),
            s:parseInt(this.__second,10)
        };
        _u._$forEach(this.__temp,function(_temp,_index){
            if (!!_temp){
                if (_index==0){
                    _clock.h = _temp;
                }else if(_index==1){
                    _clock.m = _temp;
                }else{
                    _clock.s = _temp;
                }
            }
        });
        if(this.__format == 12){
            _clock.p = this.__pnode.value;
        }
        return _clock;
    };
    /**
     * 设置时制
     *
     * 脚本举例
     * ```javascript
     * _clock._$setFormat(12);
     * ```
     *
     * @method module:util/clock/clock._$$clock#_$setFormat
     * @param  {Number} arg0 - 时制,默认24
     * @return {void}
     */
    _pro._$setFormat = function(_format){
        this.__format = (_format && _format == 12)? 12 : 24;
        if(this.__format == 12){
            this.__pnode.style.display = 'block';
            this.__doSyncTimeShow();
        }
    };


    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});