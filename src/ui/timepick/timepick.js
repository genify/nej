/*
 * ------------------------------------------
 * 时间选择控件实现文件
 * @version  1.0
 * @author   xiejin(hzxiejin@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/timepick/timepick */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/layer/card.wrapper',
    'util/clock/clock',
    'util/template/tpl',
    'util/template/jst',
    'util/calendar/calendar',
    'text!./timepick.css',
    'text!./timepick.html'
],function(NEJ,_k,_e,_u,_i0,_t0,_t1,_t2,_t3,_css,_html,_p,_o,_f,_r){
    var _pro,
        _seed_html,
        _seed_css = _e._$pushCSSText(_css),
        _seed_ui = _t1._$parseUITemplate(_html),
        _seed_date = _seed_ui['seedDate'],
        _seed_action = _seed_ui['seedAction'],
        _seed_time = _seed_ui['seedTime'];
    /**
     * 日期选择控件
     *
     * 页面结构举例
     * ```html
     * <style>
     *     // 注意，样式的优先级
     *     // 扩展 < 当前 < 禁止
     *     #timepick-box .js-extended{background:green;}
     *     #timepick-box .js-selected{background:yellow;}
     *     #timepick-box .js-disabled{background:red;}
     * </style>
     * <div id="timepick-box"></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/element',
     *     'ui/timepick/timepick'
     * ],function(_e,_i0,_p,_o,_f,_r){
     *     var pDate = new Date(1997,7,9)
     *     var nDate = new Date(2013,7,9);
     *     var _dp = _i0._$$TimePick._$allocate({
     *         parent:_e._$get('timepick-box'),
     *         // 默认选中日期
     *         date:'2012-10-10',
     *         // 设置日期的可选范围
     *         range:[pDate,nDate],
     *         onchange:function(_time){
     *             // 选择了一个日期，返回此日期
     *         }
     *     });
     * });
     * ```
     *
     * @class     module:ui/timepick/timepick._$$TimePick
     * @uses      module:util/calendar/calendar._$$Calendar
     * @extends   module:ui/layer/card._$$CardWrapper
     * @param     {Object} arg0  - 可选配置参数
     * @property  {Date}   date  - 设置日期
     * @property  {Array}  range - 可选范围
     */
    /**
     * 日期变化触发事件
     *
     * @event  module:ui/timepick/timepick._$TimePick#onchange
     * @param  {Date} arg0 - 日期
     *
     */
    _p._$$TimePick = _k._$klass();
    _pro = _p._$$TimePick._$extend(_i0._$$CardWrapper);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/timepick/timepick._$$TimePick#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__dopt = {
            onselect:this.__onDateChange._$bind(this)
        };
        this.__copt = {};
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/timepick/timepick._$$TimePick#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__dopt.range = _options.range;
        this.__calendar = _t3._$$Calendar
                            ._$allocate(this.__dopt);
        this.__copt.format = _options.format||'24';
        this.__clock = _t0._$$Clock
                            ._$allocate(this.__copt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/timepick/timepick._$$TimePick#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__dopt.range;
        delete this.__copt.format;
        var _clock = this.__clock;
        if (!!_clock){
            delete this.__clock;
            _clock._$recycle();
        }
        var _calendar = this.__calendar;
        if (!!_calendar){
            delete this.__calendar;
            _calendar._$recycle();
        }
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/timepick/timepick._$$TimePick#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/timepick/timepick._$$TimePick#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getChildren(this.__body);
        this.__dopt.list = _e._$getByClassName(_list[1],'js-ztag');
        _list = _e._$getChildren(_list[0]);
        this.__dopt.yprv = _list[0];
        this.__dopt.mprv = _list[1];
        this.__dopt.ynxt = _list[2];
        this.__dopt.mnxt = _list[3];
        this.__dopt.year = _list[4];
        this.__dopt.month= _list[5];
        var _cpnode = _e._$getByClassName(this.__body,'js-clock')[0],
            _clds = _e._$getByClassName(_cpnode,'js-ztag');
        this.__copt.per = _clds[0];
        this.__copt.hour = _clds[1];
        this.__copt.minute = _clds[2];
        this.__copt.second = _clds[3];
        this.__copt.cprv = _clds[4];
        this.__copt.cnxt = _clds[5];
    };
    /**
     * 动态构建控件节点模板
     *
     * @protected
     * @method module:ui/timepick/timepick._$$TimePick#__initNodeTemplate
     * @return {Void}
     */
    _pro.__initNodeTemplate = function(){
        _seed_html = _t1._$addNodeTemplate(
            '<div class="'+_seed_css+' zcard">'+
               _t1._$getTextTemplate(_seed_action)+
               _t2._$get(_seed_date)+
               _t1._$getTextTemplate(_seed_time)+
            '</div>'
        );
        this.__seed_html = _seed_html;
    };
    /**
     * 日期变化回调函数
     *
     * @protected
     * @method module:ui/timepick/timepick._$$TimePick#__onDateChange
     * @return {Void}
     */
    _pro.__onDateChange = function(){
        var _date = this._$getDate();
        try{
            this._$dispatchEvent('onchange',_date);
        }catch(e){
            // ignore
        }
        this._$hide();
    };
    /**
     * 设置日期
     *
     * 脚本举例
     * ```javascript
     * _dp._$setDate('2012-12-21');
     * ```
     *
     * @method module:ui/datepick/datepick._$$DatePick#_$setDate
     * @param  {Date} arg0 - 日期
     * @return {Void}
     */
    _pro._$setDate = function(_date){
        _date = _u._$var2date(_date);
        this.__calendar._$setDate(_date);
    };
    /**
     * 取当前日期时间
     *
     * 脚本举例
     * ```javascript
     * // 返回一个日期时间对象
     * var _dateTime = _dp._$getDate();
     * ```
     *
     * @method module:ui/datepick/datepick._$$DatePick#_$getDate
     * @return {Object} 日期时间对象
     */
    _pro._$getDate = function(){
        return {
            date:this.__calendar._$getDate(),
            clock:this.__clock._$getClock()
        };
    };
    /**
     * 设置时间
     *
     * 脚本举例
     * ```javascript
     * _dp._$setClock('23:23:23');
     * ```
     *
     * @method module:ui/timepick/timepick._$$TimePick#_$setClock
     * @param  {Date|String} arg0 - 时间
     * @return {Void}
     */
    _pro._$setClock = function(_time){
        this.__clock._$setClock(_time);
    };
    /**
     * 取当前时间
     *
     * 脚本举例
     * ```javascript
     * // 返回一个时间对象
     * var _time = _dp._$getClock();
     * ```
     *
     * @method module:ui/timepick/timepick._$$TimePick#_$getClock
     * @return {Object} 时间对象
     */
    _pro._$getClock = function(){
        return this.__clock._$getClock();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});