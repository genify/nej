/*
 * ------------------------------------------
 * 可调整宽度/高度网格封装实现文件
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
        _proGrid;
    /**
     * 可调整宽度/高度网格控件<br/>
     *
     * @class   {nej.ut._$$Grid}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 配置参数
     * @config  {String|Node}         grid   网格节点
     * @config  {CSSStyleDeclaration} style  样式节点
     * @config  {String}              clazz  用于控制大小的样式名称，默认js-grid
     * @config  {String}              holder 控制节点样式名称，默认js-ctrl
     * 
     * [hr]
     * 宽度高度变化事件
     * @event   {onresize}
     * @param   {Object} value 大小信息
     * 
     */
    _p._$$Grid = NEJ.C();
      _proGrid = _p._$$Grid._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proGrid.__init = function(){
        this.__supInit();
        this.__conf = this.__getConfig();
        this.__nhld = _e._$create('div');
        _v._$addEvent(
            this.__nhld,'mousedown',
            this.__onResizeStart._$bind(this)
        );
    };
    /**
     * 控件重置
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proGrid.__reset = function(_options){
        this.__supReset(_options);
        // init grid and holder
        this.__ngrid = _e._$get(_options.grid);
        this.__hclass = _options.holder||'js-ctrl';
        _e._$addClassName(this.__nhld,this.__hclass);
        this.__ngrid.appendChild(this.__nhld);
        // init style
        var _id = _e._$id(document.body);
        _e._$appendCSSText(
            _options.style,
            '#'+_e._$id(this.__ngrid)+' .'+this.__hclass+'{position:absolute;top:0;bottom:0;right:0;overflow:hidden;width:5px;height:100%;background:#f00;cursor:'+this.__conf.c+';}'
        );
        this.__style = _e._$appendCSSText(
            _options.style,
            '#'+_id+' .'+(_options.clazz||'js-grid-')+'{'+this.__conf.n+':'+this.__ngrid[this.__conf.b]+'px;}'
        ).style;
        // init event
        this.__doInitDomEvent([[
            document,'mousemove',
            this.__onResizeDoing._$bind(this)
        ],[
            document,'mouseup',
            this.__onResizeStop._$bind(this)
        ]]);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _proGrid.__destroy = function(){
        this.__supDestroy();
        delete this.__ngrid;
        _e._$delClassName(this.__nhld,this.__hclass);
        
    };
    /**
     * 取配置信息，子类实现具体业务逻辑，配置信息格式
     * [code]
     * {
     *     n:'width',        // 大小调整样式名称，width/height
     *     b:'clientWidth',  // 取原始尺寸的属性名称，clientWidth/clientHeight
     *     c:'col-resize',   // 鼠标样式名称，col-resize/row-resize
     *     p:'pageX'         // 获取鼠标位置属性名称，pageX/pageY
     * }
     * [/code]
     * @return {Object} 配置信息
     */
    _proGrid.__getConfig = _f;
    /**
     * 
     */
    _proGrid.__onResizeStart = function(_event){
        this.__flag = !0;
        this.__offset = _event[this.__conf.p];
        //_e._$setStyle(document.body,'cursor',this.__conf.c);
    };
    /**
     * 
     */
    _proGrid.__onResizeDoing = function(_event){
        if (!this.__flag) return;
        var _offset = _event[this.__conf.p],
            _delta  = _offset-this.__offset;
        this.__offset = _offset;
        this._$resize(parseInt(this.__style[this.__conf.n])+_delta);
    };
    /**
     * 
     */
    _proGrid.__onResizeStop = function(_event){
        if (!this.__flag) 
            return;
        this.__flag = !1;
        //_e._$setStyle(document.body,'cursor','');
    };
    /**
     * 调整大小
     * @param  {Number} 大小值
     * @return {Void}
     */
    _proGrid._$resize = function(_value){
        try{
            this.__style[this.__conf.n] = Math.max(0,_value)+'px';
        }catch(ex){
            // ignore
        }
    };
    
    
    
    
};
NEJ.define('{lib}util/grid/grid.js',
          ['{lib}util/event.js'],f);