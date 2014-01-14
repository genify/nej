/**
 * ------------------------------------------
 * 滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _pro,_sup;
    if (!!_p._$$SimpleScroll) return;
    /**
     * 滚动控件
     * 结构举例：
     * [code type="html"]
     *  <div class="xbc" id="bbox">
     *    <div class="bar x" id="xbar"><!-- 水平滚动条 --></div>
     *    <div class="bar y" id="ybar"><!-- 垂直滚动条 --></div>
     *    <div class="abc" id="box">
     *      <!-- 滚动内容 -->
     *      <p>11111111111111111</p>
     *      <p>11111111111111111</p>
     *      <p>11111111111111111</p>
     *      <p>11111111111111111</p>
     *      <p>11111111111111111</p>
     *    </div>
     *  </div>
     * [/code]
     * 脚本举例
     * [code]
     *     var _v = NEJ.P('nej.v'),
     *         _t = NEJ.P('nej.ut');
     * 
     *     // 应用模拟滚动行为
     *     _t._$$SimpleScroll._$allocate({
     *         xbar:'xbar',
     *         ybar:'ybar',
     *         parent:'box'
     *     });
     * 
     *     // 滚动过程可以通过监听parent上的onscroll事件获得
     *     _v._$addEvent(
     *         'box','scroll',function(_event){
     *             var _node = _v._$getElement(_event);
     *             // get scrollTop from _node.scrollTop
     *         }
     *     );
     * [/code]
     * 
     * @class   {nej.ut._$$SimpleScroll}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} _options 可选配置参数
     * @config  {Node|Object} xbar    水平滚动条节点或者配置信息，配置如{body:'bar-id',min:10,speed:1}
     * @config  {Node|Object} ybar    垂直滚动条节点或者配置信息，配置如{body:'bar-id',min:10,speed:1}
     * @config  {String|Node} parent  滚动容器节点，默认为滚动条的父容器，滚动过程触发该节点上的onscroll事件
     * @config  {String|Node} trigger 滚动条显示隐藏触点，不传表示不做显示隐藏切换
     */
    _p._$$SimpleScroll = NEJ.C();
    _pro = _p._$$SimpleScroll._$extend(_p._$$Event);
    /**
     * 初始化控件
     * @return {Void}
     */
    _pro.__init = function(){
        this.__aopt = {
            to:{},
            from:{},
            duration:500,
            onstop:this.__doStopBarOpacity._$bind(this),
            onupdate:this.__doUpdateBarOpacity._$bind(this)
        };
        this.__dopt = {
            x:{
                direction:1,
                ondragend:this.__onUpdateBarEnd._$bind(this),
                onbeforechange:this.__onBeforeUpdateBar._$bind(this,'x')
            },
            y:{
                direction:2,
                ondragend:this.__onUpdateBarEnd._$bind(this),
                onbeforechange:this.__onBeforeUpdateBar._$bind(this,'y')
            }
        };
        this.__dragger = {};
        this.__supInit();
    };
    /**
     * 控件重置
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _bcnf = {
            x:{
                min:10,
                speed:1,
                sb:'scrollWidth',
                cb:'clientWidth',
                sr:'scrollLeft',
                ss:'width',
                sp:'left'
            },
            y:{
                min:10,
                speed:1,
                sb:'scrollHeight',
                cb:'clientHeight',
                sr:'scrollTop',
                ss:'height',
                sp:'top'
            }
        };
        // init scrollbar
        var _doInitBar = function(_name,_conf){
            if (!(_conf||_o).body){
                _conf = {body:_conf};
            }
            return NEJ.X(
                NEJ.X({},_bcnf[_name]),_conf
            );
        };
        var _doInitBarDrag = function(_name,_body){
            if (!_body) return;
            var _options = this.__dopt[_name];
            _options.body = _body;
            _options.view = this.__parent;
            this.__dragger[_name] = 
                _p._$$Dragger._$allocate(_options);
        };
        return function(_options){
            this.__supReset(_options);
            this.__bar = {
                x:_doInitBar('x',_options.xbar),
                y:_doInitBar('y',_options.ybar)
            };
            this.__parent = _e._$get(_options.parent);
            // init event
            this.__doInitDomEvent([[
                this.__parent,'mousewheel',
                this.__onMouseWheel._$bind(this)
            ]]);
            var _node = _e._$get(_options.trigger);
            if (!!_node){
                this.__doInitDomEvent([[
                    _options.trigger,'mouseenter',
                    this.__onMouseEnter._$bind(this)
                ],[
                    _options.trigger,'mouseleave',
                    this.__onMouseLeave._$bind(this)
                ]]);
                this.__doUpdateBarOpacity({offset:0});
            }else{
                this._$resize();
            }
            // init dragdrop
            _doInitBarDrag.call(
                this,'x',this.__bar.x.body
            );
            _doInitBarDrag.call(
                this,'y',this.__bar.y.body
            );
        };
    })();
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = (function(){
        var _doClearDragger = function(_dragger,_key,_map){
            _dragger._$recycle();
            delete _map[_key];
            var _conf = this.__dopt[_key];
            delete _conf.view;
            delete _conf.body;
        };
        return function(){
            this.__supDestroy();
            delete this.__bar;
            delete this.__isout;
            delete this.__parent;
            delete this.__dragging;
            this.__doStopBarOpacity();
            _u._$forIn(
                this.__dragger,
                _doClearDragger._$bind(this)
            );
        };
    })();
    /**
     * 根据配置信息重置滚动条
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _pro.__doResetBarSize = function(_conf){
        var _sbox = this.__parent[_conf.sb],
            _cbox = this.__parent[_conf.cb],
            _delta = _sbox-_cbox,
            _style = {};
        if (_delta<=0){
            _conf.ratio = 0;
            _style.visibility = 'hidden';
            _style[_conf.ss] = _cbox+'px';
        }else{
            var _size = Math.max(
                _conf.min,
                _cbox-_cbox/_sbox*_delta
            );
            _conf.max = Math.ceil(_cbox-_size);
            _size = Math.ceil(_size);
            _style.visibility = 'visible';
            _style[_conf.ss] = _size+'px';
            _conf.ratio = (_cbox-_size)/_delta;
        }
        _e._$style(_conf.body,_style);
    };
    /**
     * 重置滚动条位置
     * @param  {Object} 配置信息
     * @param  {Number} 偏移量
     * @return {Void}
     */
    _pro.__doResetBarPosition = function(_conf,_delta){
        if (_delta!=0){
            this.__parent[_conf.sr] -= _delta*_conf.speed;
        }
        var _value = this.__parent[_conf.sr];
        _e._$setStyle(
            _conf.body,_conf.sp,
            Math.ceil(_value*_conf.ratio)+'px'
        );
    };
    /**
     * 更新滚动位置
     * @return {Void}
     */
    _pro.__doUpdateScrollBar = function(_dx,_dy){
        this.__doResetBarPosition(
            this.__bar.y,_dy
        );
        this.__doResetBarPosition(
            this.__bar.x,_dx
        );
    };
    /**
     * 动画更新滚动条透明度
     * @return {Void}
     */
    _pro.__doAnimScrollBar = function(){
        this.__doStopBarOpacity();
        this.__aopt.from.offset = _e._$getStyle(
            this.__bar.y.body||
            this.__bar.x.body,'opacity'
        );
        this.__anim = _p._$$AnimEaseInOut.
                      _$allocate(this.__aopt);
        this.__anim._$play();
    };
    /**
     * 更新滚动条的透明度
     * @return {Void}
     */
    _pro.__doUpdateBarOpacity = function(_event){
        var _value = _event.offset;
        _e._$setStyle(this.__bar.x.body,'opacity',_value);
        _e._$setStyle(this.__bar.y.body,'opacity',_value);
    };
    /**
     * 清理显示动画
     * @return {Void}
     */
    _pro.__doStopBarOpacity = function(){
        if (!!this.__anim){
            this.__anim._$recycle();
            delete this.__anim;
        }
    };
    /**
     * 鼠标滚动事件
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__onMouseWheel = function(_event){
        this.__doUpdateScrollBar(
            _event.wheelDeltaX||0,
            _event.wheelDeltaY||
            _event.wheelDelta||0
        );
    };
    /**
     * 鼠标移入事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onMouseEnter = function(_event){
        this.__isout = !1;
        this._$resize();
        this.__aopt.delay = 0;
        this.__aopt.to.offset = 1;
        this.__doAnimScrollBar();
    };
    /**
     * 鼠标移出事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__onMouseLeave = function(_event){
        this.__isout = !0;
        if (this.__dragging) return;
        this.__aopt.delay = 500;
        this.__aopt.to.offset = 0;
        this.__doAnimScrollBar();
    };
    /**
     * 更新水平滚动条
     * @param  {Object} 拖拽信息
     * @return {Void}
     */
    _pro.__onBeforeUpdateBar = function(_name,_event){
        this.__dragging = !0;
        var _conf = this.__bar[_name],
            _offset = Math.min(
                _conf.max,
                _event[_conf.sp]
            );
        this.__parent[_conf.sr] = 
            Math.ceil(_offset/_conf.ratio);
        _event[_conf.sp] = _offset;
    };
    /**
     * 拖拽滚动结束
     * @return {Void}
     */
    _pro.__onUpdateBarEnd = function(){
        this.__dragging = !1;
        if (this.__isout){
            this.__onMouseLeave();
        }
    };
    /**
     * 容器大小变化执行逻辑
     * @return {Void}
     */
    _pro._$resize = function(){
        this.__doResetBarSize(this.__bar.x);
        this.__doResetBarSize(this.__bar.y);
        this.__doUpdateScrollBar(0,0);
    };
};
NEJ.define(
    '{lib}util/scroll/scroll.simple.js',[
    '{lib}util/event.js',
    '{lib}util/dragger/dragger.js',
    '{lib}util/animation/easeinout.js'
],f);
