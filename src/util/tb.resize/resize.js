/*
 * ------------------------------------------
 * 可调整宽度/高度功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _proTBResize;
    if (!!_p._$$TBResize) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('.#<uispace>{position:absolute;top:0;bottom:0;right:0;width:5px;height:100%;margin-left:-2px;}');
    /**
     * 可调整宽度/高度网格控件<br/>
     *
     * @class   {nej.ut._$$TBResize}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 配置参数
     * @config  {String|Node} grid  网格节点
     * @config  {Number}      min   保留最小大小，默认50px
     * 
     * [hr]
     * 宽度高度变化事件
     * @event   {onresize}
     * @param   {Object} 事件信息
     * @config  {Number} value 大小信息
     * 
     */
    _p._$$TBResize = NEJ.C();
      _proTBResize = _p._$$TBResize._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proTBResize.__init = function(){
        this.__supInit();
        _e._$dumpCSSText();
        this.__conf = this.__getConfig();
    };
    /**
     * 控件重置
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proTBResize.__reset = function(_options){
        this.__supReset(_options);
        // init grid and holder
        this.__ngrid = _e._$get(_options.grid);
        this.__nhold = _e._$create('div',_seed_css);
        this.__minbx = parseInt(_options.min)||50;
        this.__ngrid.appendChild(this.__nhold);
        // init event
        this.__doInitDomEvent([[
            this.__nhold,'mousedown',
            this.__onResizeStart._$bind(this)
        ],[
            document,'mousemove',
            this.__onResizeDoing._$bind(this)
        ],[
            document,'mouseup',
            this.__onResizeStop._$bind(this)
        ]]);
        _e._$setStyle(this.__nhold,'cursor',this.__conf.c);
        this._$update(this.__ngrid[this.__conf.b]);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _proTBResize.__destroy = function(){
        this.__supDestroy();
        delete this.__ngrid;
        delete this.__nhold;
    };
    /**
     * 取配置信息，子类实现具体业务逻辑，配置信息格式
     * [code]
     * {
     *     n:'width',        // 大小调整样式名称，width/height
     *     b:'offsetWidth',  // 取原始尺寸的属性名称，offsetWidth/offsetHeight
     *     c:'col-resize',   // 鼠标样式名称，col-resize/row-resize
     *     p:'pageX'         // 获取鼠标位置属性名称，pageX/pageY
     * }
     * [/code]
     * @return {Object} 配置信息
     */
    _proTBResize.__getConfig = _f;
    /**
     * 开始拖拽
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _proTBResize.__onResizeStart = function(_event){
        _v._$stop(_event);
        this.__point = _event[this.__conf.p];
        _e._$setStyle(document.body,'cursor',this.__conf.c);
    };
    /**
     * 拖拽过程
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _proTBResize.__onResizeDoing = function(_event){
        if (this.__point==null) return;
        var _offset = _event[this.__conf.p],
            _delta  = _offset-this.__point;
        this.__point = _offset;
        this._$resize(this.__size+_delta);
    };
    /**
     * 拖拽结束
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _proTBResize.__onResizeStop = function(_event){
        delete this.__point;
        _e._$setStyle(document.body,'cursor','');
    };
    /**
     * 调整大小
     * @param  {Number} 大小值
     * @return {Void}
     */
    _proTBResize._$resize = function(_size){
        _size = Math.max(this.__minbx,_size);
        var _event = {
                value:_size,
                delta:_size-this.__size,
                data:_e._$dataset(this.__ngrid,'value')
            };
        this._$dispatchEvent('onbeforeresize',_event);
        if (_event.result!=null)
            _size = this.__size+_event.delta-_event.result;
        this._$update(_size);
    };
    /**
     * 更新大小
     * @param  {Number} 大小值
     * @return {Number} 实际使用大小值
     */
    _proTBResize._$update = function(_size){
        this.__size = Math.max(this.__minbx,_size);
        _e._$setStyle(this.__ngrid,this.__conf.n,this.__size+'px');
        return this.__size-_size;
    };
    /**
     * 
     */
    _proTBResize._$updateByDelta = function(_delta){
        return this._$update(this.__size+_delta);
    };
};
NEJ.define('{lib}util/tb.resize/resize.js',
          ['{lib}util/event.js'],f);