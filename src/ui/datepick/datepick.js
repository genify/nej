/*
 * ------------------------------------------
 * 日期选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/util.js',
    '{lib}ui/layer/card.wrapper.js',
    '{lib}util/calendar/calendar.js',
    '{lib}util/template/tpl.js',
    '{lib}util/template/jst.js'
],function(NEJ,_k,_e,_u,_i0,_t0,_t1,_t2,_p,_o,_f,_r){
    var _pro,
        _seed_css,
        _seed_html,
        _seed_date,
        _seed_action = _u._$uniqueID();
    /**
     * 日期选择控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <style>
     *       // 注意，样式的优先级
     *       // 扩展 < 当前 < 禁止
     *       #datepick-box .js-extended{background:green;}
     *       #datepick-box .js-selected{background:yellow;}
     *       #datepick-box .js-disabled{background:red;}
     *   </style>
     *   <div id="datepick-box"></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var pDate = new Date(1997,7,9)
     *   var nDate = new Date(2013,7,9);
     *   var _dp = _p._$$DatePick._$allocate({
     *       parent:_e._$get('datepick-box'),
     *       // 默认选中日期
     *       date:'2012-10-10',
     *       // 设置日期的可选范围
     *       range:[pDate,nDate],
     *       onchange:function(_date){
     *           // 选择了一个日期，返回此日期
     *       }
     *   });
     * [/code]
     * @class   {nej.ui._$$DatePick} 日期选择控件
     * @uses    {nej.ut._$$Calendar}
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Date}  date  设置日期
     * @config  {Array} range 可选范围
     *
     * [hr]
     *
     * @event  {onchange} 日期变化触发事件
     * @param  {Date} 日期
     *
     */
    _p._$$DatePick = _k._$klass();
    _pro = _p._$$DatePick._$extend(_i0._$$CardWrapper);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__copt = {
            onselect:this.__onDateChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__copt.range = _options.range;
        this.__calendar = _t0._$$Calendar
                            ._$allocate(this.__copt);
        this._$setDate(_options.date||(new Date()));
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__copt.range;
        var _calendar = this.__calendar;
        if (!!_calendar){
            delete this.__calendar;
            _calendar._$recycle();
        }
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getChildren(this.__body);
        this.__copt.list = _e._$getByClassName(_list[1],'js-ztag');
        _list = _e._$getChildren(_list[0]);
        this.__copt.yprv = _list[0];
        this.__copt.mprv = _list[1];
        this.__copt.ynxt = _list[2];
        this.__copt.mnxt = _list[3];
        this.__copt.year = _list[4];
        this.__copt.month= _list[5];
    };
    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _pro.__initNodeTemplate = function(){
        _seed_html = _t1._$addNodeTemplate(
            '<div class="'+_seed_css+' zcard">'+
               _t1._$getTextTemplate(_seed_action)+
               _t2._$getHtmlTemplate(_seed_date)+
            '</div>'
        );
        this.__seed_html = _seed_html;
    };
    /**
     * 日期变化回调函数
     * @protected
     * @method {__onDateChange}
     * @param  {Date} 日期
     * @return {Void}
     */
    _pro.__onDateChange = function(_date){
        try{
            this._$dispatchEvent('onchange',_date);
        }catch(e){
            // ignore
        }
        this._$hide();
    };
    /**
     * 设置日期<br />
     * 脚本举例
     * [code]
     *   _dp._$setDate('2012-12-21');
     * [/code]
     * @method {_$setDate}
     * @param  {Date} 日期
     * @return {Void}
     */
    _pro._$setDate = function(_date){
        _date = _u._$var2date(_date);
        this.__calendar._$setDate(_date);
    };
    /**
     * 取当前时间<br />
     * <br />
     * 脚本举例
     * [code]
     *   // 返回一个Date对象
     *   var _date = _dp._$getDate();
     * [/code]
     * @method {_$getDate}
     * @return {Date} 日期
     */
    _pro._$getDate = function(){
        return this.__calendar._$getDate();
    };
    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{width:210px;border:1px solid #aaa;font-size:14px;text-align:center;}\
        .#<uispace> .zact{line-height:30px;overflow:hidden;zoom:1;}\
        .#<uispace> .zact .zfl{float:left;}\
        .#<uispace> .zact .zfr{float:right;}\
        .#<uispace> .zact .zbtn{padding:0 5px;cursor:pointer;}\
        .#<uispace> .zact .ztxt{margin-left:10px;}\
        .#<uispace> .zday{table-layout:fixed;border-collapse:collapse;width:100%;}\
        .#<uispace> .zday th{font-weight:normal;}\
        .#<uispace> .zday a{display:block;height:22px;line-height:22px;color:#333;text-decoration:none;}\
        .#<uispace> .zday a:hover{background:#eee;}\
        .#<uispace> .zday a.js-extended{color:#aaa;}\
        .#<uispace> .zday a.js-selected,\
        .#<uispace> .zday a.js-selected:hover{background:#DAE4E7;}\
        .#<uispace> .zday a.js-disabled,\
        .#<uispace> .zday a.js-disabled:hover{background:#fff;color:#eee;cursor:default;}\
    ');
    // ui date html
    _seed_date = _t2._$addHtmlTemplate('\
        <table class="zday">\
          <tr>{list ["日","一","二","三","四","五","六"] as x}<th>${x}</th>{/list}</tr>\
          {list 1..6 as x}\
          <tr>{list 1..7 as y}<td><a href="javascript:void(0);" class="js-ztag"></a></td>{/list}</tr>\
          {/list}\
        </table>\
    ');
    // button html
    _t1._$addTextTemplate(_seed_action,'\
        <div class="zact">\
          <span class="zbtn zfl" title="上一年">&lt;&lt;</span>\
          <span class="zbtn zfl" title="上一月">&lt;</span>\
          <span class="zbtn zfr" title="下一年">&gt;&gt;</span>\
          <span class="zbtn zfr" title="下一月">&gt;</span>\
          <span class="ztxt"></span>年\
          <span class="ztxt"></span>月\
        </div>\
    ');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});