/*
 * ------------------------------------------
 * 日历算法实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proCalendar;
    if (!!_p._$$Calendar) return;
    /**
     * 日历算法<br/>
     * 
     * 日期范围举例：
     * [ntb]
     *     [0,0]                                     | 全部日期可选【默认】
     *     [0,new Date]                              | 可选当前日期之前的
     *     [new Date,0]                              | 可选当前日期之后的
     *     [new Date(1997,1,1),new Date(2000,1,1)]   | 可选指定范围的日期
     * [/ntb]
     * 页面结构举例
     * [code type="html"]
     *   <div id="datepick-box">
     *       <div id="days"></div>
     *       <div id="year"></div>
     *       <div id="month"></div>
     *       <div id="yprv">前一年</div>
     *       <div id="mprv">前一月</div>
     *       <div id="ynxt">后一年</div>
     *       <div id="mnxt">后一月</div>
     *   </div>
     * [/code]
     * [code]
     *   var _ut= NEJ.P('nej.ut'),
     *       _e = NEJ.P('nej.e');
     *   // 前选范围
     *   var pDate = new Date(2011,7,9);
     *   // 后选范围
     *   var nDate = new Date(2013,7,9);
     *   var _days = _e._$get('days');
     *   _html = _e._$addHtmlTemplate('{list 1..2 as x}<div>{list 1..6 as y}<p class="z-day"></p>{/list}</div>{/list}');
     *   _days.innerHTML = _e._$getHtmlTemplate(_html);
     *   var _dp = _ut._$$Calendar._$allocate({
     *       parent:_e._$get('datepick-box'),
     *       offset:1,
     *       list:_e._$getByClassName(_days,"z-day"),
     *       year:_e._$get('year'),
     *       month:_e._$get('month'),
     *       yprv:_e._$get('yprv'),
     *       mprv:_e._$get('mprv'),
     *       ynxt:_e._$get('ynxt'),
     *       mnxt:_e._$get('mnxt'),
     *       onchange:function(_date){
     *           // 日期列表变化
     *       },
     *       onselect:function(_date){
     *           // 选择了一个日期，返回此日期
     *       },
     *       // 日期的范围，超过范围不可选
     *       range:[pDate,nDate]
     *   });
     * [/code]
     * @class   {nej.ut._$$Calendar}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object}      可选配置参数，已处理参数列表如下
     * @config  {Number}      offset   开始星期偏移，默认为0，0-星期天、1-星期一 ...
     * @config  {Array}       list     日期显示节点列表
     * @config  {Number}      year     年份显示节点
     * @config  {Number}      month    月份显示节点
     * @config  {String|Node} mprv     上一月按钮节点
     * @config  {String|Node} mnxt     下一月按钮节点
     * @config  {String|Node} yprv     上一年按钮节点
     * @config  {String|Node} ynxt     下一年按钮节点
     * @config  {String|Node} wprv     上一星期按钮节点
     * @config  {String|Node} wnxt     下一星期按钮节点
     * @config  {String|Node} dprv     上一天按钮节点
     * @config  {String|Node} dnxt     下一天按钮节点
     * @config  {Array}       range    日期可选范围，默认全部可选
     * @config  {String}      selected 当前项样式，默认为js-selected
     * @config  {String}      extended 扩展项样式，默认为js-extended
     * @config  {String}      disabled 禁用项样式，默认为js-disabled
     * @config  {Date}        date     显示日期，默认为当前时间
     * 
     * [hr]
     * 
     * @event {onchange} 
     * @param {Date} 当前日期
     * 
     * [hr]
     * 
     * @event {onselect}
     * @param {Date} 当前日期
     *                            
     */
    _p._$$Calendar = NEJ.C();
      _proCalendar = _p._$$Calendar._$extend(_p._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object}       可选配置参数
     * @return {Void}
     */
    _proCalendar.__reset = function(_options){
        this.__supReset(_options);
        this.__doInitDomEvent([
            [_options.mprv,'click',this.__onMonthChange._$bind(this,-1)]
           ,[_options.mnxt,'click',this.__onMonthChange._$bind(this, 1)]
           ,[_options.yprv,'click',this.__onYearChange._$bind(this,-1)]
           ,[_options.ynxt,'click',this.__onYearChange._$bind(this, 1)]
           ,[_options.wprv,'click',this.__onWeekChange._$bind(this,-1)]
           ,[_options.wnxt,'click',this.__onWeekChange._$bind(this, 1)]
           ,[_options.wprv,'click',this.__onDayChange._$bind(this,-1)]
           ,[_options.wnxt,'click',this.__onDayChange._$bind(this, 1)]
        ]);
        this.__offset = _options.offset||0;
        this.__nyear  = _e._$get(_options.year);
        this.__nmonth = _e._$get(_options.month);
        this.__selected = _options.selected||'js-selected';
        this.__extended = _options.extended||'js-extended';
        this.__disabled = _options.disabled||'js-disabled';
        this.__doRangeCheck(_options.range);
        this.__doDateListCheck(_options.list);
        this._$setDate(_options.date||(new Date()));
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proCalendar.__destroy = function(){
        this.__supDestroy();
        delete this.__list;
        delete this.__range;
        delete this.__nyear;
        delete this.__nmonth;
    };
    /**
     * 可选范围检测
     * @protected
     * @method {__doRangeCheck}
     * @param  {Array} 可选择范围
     * @return {Void}
     */
    _proCalendar.__doRangeCheck = function(_range){
        this.__range = _range||[];
        var _value = this.__range[0];
        this.__range[0] = _u._$isDate(_value)
                        ? (+_value):(_value||0);
        var _value = this.__range[1];
        this.__range[1] = _u._$isDate(_value)
                        ? (+_value):(_value||0);
    };
    /**
     * 检查日期列表
     * @protected
     * @method {__doDateListCheck}
     * @param  {Array} 日期显示列表
     * @return {Void}
     */
    _proCalendar.__doDateListCheck = (function(){
        var _doCheck = function(_node){
            this.__list.push(_node);
            this.__doInitDomEvent([
                [_node,'click',this.__onDateChange._$bind(this)]
            ]);
        };
        return function(_list){
            this.__list = [];
            _u._$forEach(_list,_doCheck,this);
        };
    })();
    /**
     * 保存日期信息
     * @protected
     * @method {__doSaveDateInfo}
     * @param  {Node}   节点
     * @param  {Number} 年份
     * @param  {Number} 月份
     * @param  {Number} 日期
     * @return {Void}
     */
    _proCalendar.__doSaveDateInfo = (function(){
        var _isDisabled = function(_range,_time){
            var _min = _range[0],
                _max = _range[1];
            return _time<_min||(!!_max&&_time>_max);
        };
        return function(_node,_year,_month,_date){
            _e._$dataset(_node,'y',_year);
            _e._$dataset(_node,'m',_month);
            _e._$dataset(_node,'d',_date);
            _node.innerText = _date;
            if (_year==this.__year&&
                _month==this.__month&&
                _date==this.__date){
                _e._$addClassName(_node,this.__selected);
            }else{
                _e._$delClassName(_node,this.__selected);
            }
            _isDisabled(this.__range,
                       +new Date(_year,_month-1,_date))
            ? _e._$addClassName(_node,this.__disabled)
            : _e._$delClassName(_node,this.__disabled);
        };
    })();
    /**
     * 同步日历显示
     * @protected
     * @method {__doSyncDateShow}
     * @return {Void}
     */
    _proCalendar.__doSyncDateShow = (function(){
        var _days = [31,28,31,30,31,30,31,31,30,31,30,31];
        var _isLeap = function(_year){
            return !(_year%400)||!(_year%4)&&!!(_year%100);
        };
        var _getMonthDay = function(_year,_month){
            return _month==2&&_isLeap(_year)?29:_days[_month-1];
        };
        return function(){
            var _year  = this.__year,
                _month = this.__month,
                _date  = new Date(_year,_month-1,1),
                _beg = ((7+_date.getDay())-this.__offset)%7,
                _end = Math.min(
                    this.__list.length,
                    _beg+_getMonthDay(_year,_month)
                );
            // sync year and month
            if (!!this.__nyear){
                this.__nyear.innerText = this.__year;
            }
            if (!!this.__nmonth){
                this.__nmonth.innerText = this.__month;
            }
            // offset with limit
            // current month
            for(var i=_beg,_node;i<_end;i++){
                _node = this.__list[i];
                this.__doSaveDateInfo(
                    _node,_year,_month,i-_beg+1
                );
                _e._$delClassName(_node,this.__extended);
            }
            // 0 -> begin
            // last month
            if (_beg>0){
                var _date = new Date(_year,_month-2||0,1);
                var _yearTemp  = _date.getFullYear();
                var _monthTemp = _date.getMonth()+1;
                var _limit = _getMonthDay(_yearTemp,_monthTemp);
                for(var i=_beg-1,_node;i>=0;i--){
                    _node = this.__list[i];
                    this.__doSaveDateInfo(
                        _node,_yearTemp,_monthTemp,_limit--
                    );
                    _e._$addClassName(_node,this.__extended);
                }
            }
            // end -> length
            // next moth
            var _length = this.__list.length;
            if (_end<_length-1){
                var _date = new Date(_year,_month,1);
                var _yearTemp  = _date.getFullYear();
                var _monthTemp = _date.getMonth()+1;
                for(var i=_end,k=1;i<_length;i++){
                    _node = this.__list[i];
                    this.__doSaveDateInfo(
                        _node,_yearTemp,_monthTemp,k++
                    );
                    _e._$addClassName(_node,this.__extended);
                }
            }
        };
    })();
    /**
     * 调整年份
     * @protected
     * @method {__onYearChange}
     * @param  {Number} 步进
     * @return {Void}
     */
    _proCalendar.__onYearChange = function(_flag){
        this.__year += _flag;
        this.__doSyncDateShow();
        this._$dispatchEvent('onchange',this._$getDate());
    };
    /**
     * 调整月份
     * @protected
     * @method {__onMonthChange}
     * @param  {Number} 步进
     * @return {Void}
     */
    _proCalendar.__onMonthChange = function(_flag){
        this.__month += _flag;
        if (this.__month<1){
            this.__year--;
            this.__month += 12;
        }
        if (this.__month>12){
            this.__year += Math.floor(this.__month/12);
            this.__month = (this.__month-1)%12+1;
        }
        this.__doSyncDateShow();
        this._$dispatchEvent('onchange',this._$getDate());
    };
    /**
     * 日期选择触发事件
     * @protected
     * @method {__onDateChange}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proCalendar.__onDateChange = function(_event){
        var _element = _v._$getElement(_event);
        if (_e._$hasClassName(
            _element,this.__disabled))
            return;
        this.__year  = parseInt(_e._$dataset(_element,'y'));
        this.__month = parseInt(_e._$dataset(_element,'m'));
        this.__date  = parseInt(_e._$dataset(_element,'d'));
        this.__doSyncDateShow();
        this._$dispatchEvent('onselect',this._$getDate());
    };
    /**
     * 周变化触发事件
     * @protected
     * @method {__onWeekChange}
     * @param  {Number} 上下周标识
     * @return {Void}
     */
    _proCalendar.__onWeekChange = function(_flag){
        // TODO something
    };
    /**
     * 日变化触发事件
     * @protected
     * @method {__onDayChange}
     * @param  {Number} 上下日标识
     * @return {Void}
     */
    _proCalendar.__onDayChange = function(_flag){
        // TODO something
    };
    /**
     * 设置日期<br/>
     * [code]
     *   _dp._$setDate('1998-09-28');
     * [/code]
     * @method {_$setDate}
     * @param  {String|Number|Date} 日期
     * @return {nej.ut._$$Calendar}
     */
    _proCalendar._$setDate = function(_date){
        _date = _u._$var2date(_date);
        this.__year  = _date.getFullYear();
        this.__month = _date.getMonth()+1;
        this.__date  = _date.getDate();
        this.__doSyncDateShow();
        return this;
    };
    /**
     * 取当前选择时间<br/>
     * [code]
     *   _dp._$getDate();
     * [/code]
     * @method {_$getDate}
     * @return {Date} 当前选择时间
     */
    _proCalendar._$getDate = function(){
        return new Date(this.__year,
                        this.__month-1,
                        this.__date);
    };
};
NEJ.define('{lib}util/calendar/calendar.js',
      ['{lib}util/event.js'],f);
