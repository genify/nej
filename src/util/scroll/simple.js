/**
 * ------------------------------------------
 * 滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/scroll/simple */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/event',
    'util/dragger/dragger',
    'util/animation/easeinout'
],function(NEJ,_e,_v,_u,_t,_t0,_t1,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 滚动控件
     * 
     * 结构举例
     * ```html
     * <div class="xbc" id="bbox">
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
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/event',
     *     'util/scroll/simple'
     * ],function(_v,_t){
     *     // 应用模拟滚动行为
     *     _t._$$SimpleScroll._$allocate({
     *         xbar:'xbar',
     *         // 纵向滚动条至少保留20px高度，上下留5px间隙
     *         ybar:{body:'ybar',min:20,top:5,bottom:5},
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
     * });
     * ```
     *
     * @class    module:util/scroll/simple._$$SimpleScroll
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}       config  - 可选配置参数
     * @property {Node|Object}  xbar    - 水平滚动条节点或者配置信息，如果不配置min值则默认取body的初始宽度，配置如{body:'bar-id',track:':parent',min:10,speed:1,left:10,right:10,step:10,hover:'js-hover'}
     * @property {Node|Object}  ybar    - 垂直滚动条节点或者配置信息，如果不配置min值则默认取body的初始高度，配置如{body:'bar-id',track:'parent-id',min:10,speed:1,top:10,bottom:10,step:10,hover:'js-hover'}
     * @property {String|Node}  parent  - 滚动容器节点，默认为滚动条的父容器，滚动过程触发该节点上的onscroll事件
     * @property {String|Node}  trigger - 滚动条显示隐藏触点，不传表示不做显示隐藏切换
     */
    _p._$$SimpleScroll = _k._$klass();
    _pro = _p._$$SimpleScroll._$extend(_t._$$EventTarget);
    /**
     * 初始化控件
     * 
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__init
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
                ondragend:this.__onUpdateBarEnd._$bind(this,'x'),
                onbeforechange:this.__onBeforeUpdateBar._$bind(this,'x')
            },
            y:{
                direction:2,
                ondragend:this.__onUpdateBarEnd._$bind(this,'y'),
                onbeforechange:this.__onBeforeUpdateBar._$bind(this,'y')
            }
        };
        this.__dragger = {};
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _bcnf = {
            x:{
                min:0,
                speed:1,
                step:50,
                interval:50,
                left:0,
                right:0,
                hover:'js-hover',
                sb:'scrollWidth',
                cb:'clientWidth',
                ob:'offsetWidth',
                sr:'scrollLeft',
                ss:'width',
                sp:'left',
                dr:'right'
            },
            y:{
                min:0,
                speed:1,
                interval:50,
                step:50,
                top:0,
                bottom:0,
                hover:'js-hover',
                sb:'scrollHeight',
                cb:'clientHeight',
                ob:'offsetHeight',
                sr:'scrollTop',
                ss:'height',
                sp:'top',
                dr:'bottom'
            }
        };
        // init scrollbar
        var _doInitBar = function(_name,_conf){
            if (!(_conf||_o).body){
                _conf = {body:_conf};
            }
            var _result = NEJ.X(
                NEJ.X({},_bcnf[_name]),_conf
            );
            _result.body = _e._$get(_result.body);
            if (!!_result.body&&!!_result.track){
                if (_result.track==':parent'){
                    _result.track = _result.body.parentNode;
                }
                _result.track = _e._$get(_result.track);
            }
            if (!_result.min){
                _result.min = !_result.body?10:(_result.body[_result.ob]||10);
            }
            return _result;
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
            this.__super(_options);
            this.__bar = {
                x:_doInitBar('x',_options.xbar),
                y:_doInitBar('y',_options.ybar)
            };
            this.__parent = _e._$get(_options.parent);
            // init event
            this.__doInitDomEvent([[
                this.__parent,'mousewheel',
                this.__onMouseWheel._$bind(this)
            ],[
                this.__parent,'scroll',
                this.__doSyncScrollBar._$bind(this)
            ],[
                this.__bar.x.track,'mousedown',
                this.__onTrackDown._$bind(this,'x')
            ],[
                this.__bar.y.track,'mousedown',
                this.__onTrackDown._$bind(this,'y')
            ],[
                this.__bar.x.track,'mousewheel',
                this.__onMouseWheel._$bind(this)
            ],[
                this.__bar.y.track,'mousewheel',
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
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__destroy
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
        var _doClearBarStyle = function(_conf,_key,_map){
            if (!_conf.body) return;
            var _style = {};
            _style[_conf.ss] = '';
            _style[_conf.sp] = '';
            _e._$style(_conf.body,_style);
            delete _conf.body;
        };
        return function(){
            this.__super();
            delete this.__isout;
            delete this.__parent;
            delete this.__dragging;
            this.__doStopBarOpacity();
            _u._$forIn(
                this.__dragger,
                _doClearDragger._$bind(this)
            );
            _u._$forIn(
                this.__bar,
                _doClearBarStyle._$bind(this)
            );
            delete this.__bar;
        };
    })();
    /**
     * 根据配置信息重置滚动条
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__doResetBarSize
     * @param  {Object} arg0 - 配置信息
     * @return {Void}
     */
    _pro.__doResetBarSize = function(_conf){
        var _sbox = this.__parent[_conf.sb],
            _cbox = this.__parent[_conf.cb],
            _sdlt = _sbox-_cbox,
            _cbox = _cbox-_conf[_conf.sp]
                    -_conf[_conf.dr],
            _delta = _sbox-_cbox,
            _style = {},
            _oshow = {};
        if (_sdlt<=0){
            _conf.ratio = 0;
            _oshow.visibility = 'hidden';
            _style[_conf.ss] = _cbox+'px';
        }else{
            var _size = Math.ceil(Math.max(
                _conf.min,
                _cbox-_cbox/_sbox*_delta
            ));
            _oshow.visibility = 'visible';
            _style[_conf.ss] = _size+'px';
            _conf.max = Math.ceil(
                _cbox-_size+
                _conf[_conf.sp]
            );
            _conf.ratio = (_cbox-_size)/_delta;
        }
        _conf.delta = 0;
        if (!!_conf.body){
            _conf.delta =
                _conf.body[_conf.ob]-
                _conf.body[_conf.cb];
        }
        _e._$style(_conf.track||_conf.body,_oshow);
        _e._$style(_conf.body,_style);
    };
    /**
     * 重置滚动条位置
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__doResetBarPosition
     * @param  {Object} arg0 - 配置信息
     * @param  {Number} arg1 - 偏移量
     * @return {Void}
     */
    _pro.__doResetBarPosition = function(_conf,_delta){
        if (_delta!=0){
            this.__parent[_conf.sr] -= _delta*_conf.speed;
        }
        if (!!_conf.body){
            var _value = this.__parent[_conf.sr],
                _offset = Math.ceil(_value*_conf.ratio)-
                         _conf.delta+_conf[_conf.sp];
            _e._$setStyle(_conf.body,_conf.sp,_offset+'px');
        }
    };
    /**
     * 同步滚动条位置
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__doSyncScrollBar
     * @return {Void}
     */
    _pro.__doSyncScrollBar = function(){
        if (!this.__dragging){
            this._$resize();
        }
    };
    /**
     * 更新滚动位置
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__doUpdateScrollBar
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
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__doAnimScrollBar
     * @return {Void}
     */
    _pro.__doAnimScrollBar = function(){
        this.__doStopBarOpacity();
        var _tmp = this.__bar.y,
            _body = _tmp.track||_tmp.body;
        if (!_body){
            _tmp = this.__bar.x;
            _body = _tmp.track||_tmp.body;
        }
        this.__aopt.from.offset = _e._$getStyle(
            _body,'opacity'
        );
        this.__anim = _p._$$AnimEaseInOut.
                      _$allocate(this.__aopt);
        this.__anim._$play();
    };
    /**
     * 更新滚动条的透明度
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__doUpdateBarOpacity
     * @return {Void}
     */
    _pro.__doUpdateBarOpacity = function(_event){
        var _value = _event.offset;
        _e._$setStyle(
            this.__bar.x.track||
            this.__bar.x.body,
            'opacity',_value
        );
        _e._$setStyle(
            this.__bar.y.track||
            this.__bar.y.body,
            'opacity',_value
        );
    };
    /**
     * 清理显示动画
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__doStopBarOpacity
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
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__onMouseWheel
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
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__onMouseEnter
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onMouseEnter = function(_event){
        this.__isout = !1;
        this._$resize();
        this.__aopt.delay = 0;
        this.__aopt.to.offset = 0.6;
        this.__doAnimScrollBar();
    };
    /**
     * 鼠标移出事件
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__onMouseLeave
     * @param  {Event} arg0 - 事件对象
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
     * 轨道点击事件
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__onTrackDown
     * @param  {String} arg0 - 类型
     * @param  {Event}  arg1 - 事件对象
     * @return {Void}
     */
    _pro.__onTrackDown = (function(){
        var _fmap = {
            x:function(_delta){
                this.__doUpdateScrollBar(_delta,0);
            },
            y:function(_delta){
                this.__doUpdateScrollBar(0,_delta);
            }
        };
        var _timer,_onstop,_count;
        var _doClearScroll = function(_conf){
            _count = 1;
            _onstop = null;
            _timer = window.clearTimeout(_timer);
            _v._$delEvent(_conf.track,'mouseup',_onstop);
        };
        var _doAutoScroll = function(_type,_point,_size){
            var _conf = this.__bar[_type],
                _left = parseInt(_e._$getStyle(
                    _conf.body,_conf.sp
                )),
                _right = _left+_size;
            // stop scroll
            if (_left<=_point&&_point<=_right){
                _doClearScroll(_conf);
                return;
            }
            // init stop event
            if (!_onstop){
                _onstop = _doClearScroll._$bind(this,_conf);
                _v._$addEvent(_conf.track,'mouseup',_onstop);
            }
            // update scrollbar
            _fmap[_type].call(this,(_point<_left?1:-1)*_conf.step*_count);
            // next scrollbar
            _timer = window.setTimeout(
                _doAutoScroll._$bind(this,_type,_point,_size),
                _conf.interval
            );
            _count++;
        };
        return function(_type,_event){
            var _conf = this.__bar[_type],
                _offset = _e._$offset(_conf.track)[_type],
                _pointer = _v._$page(_event)[_type],
                _size = _conf.body[_conf.ob];
            _doClearScroll(_conf);
            _doAutoScroll.call(
                 this,_type,
                _pointer-_offset,_size
            );
        };
    })();
    /**
     * 更新水平滚动条
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__onBeforeUpdateBar
     * @param  {Object} arg0 - 拖拽信息
     * @return {Void}
     */
    _pro.__onBeforeUpdateBar = function(_name,_event){
        this.__dragging = !0;
        var _conf = this.__bar[_name],
            _delta = _conf[_conf.sp],
            _offset = Math.max(
                _delta,Math.min(
                    _conf.max,
                    _event[_conf.sp]
                )
            );
        this.__parent[_conf.sr] = Math.ceil(
            (_offset-_delta)/_conf.ratio
        );
        _event[_conf.sp] = _offset;
        _e._$addClassName(
            _conf.track,_conf.hover
        );
    };
    /**
     * 拖拽滚动结束
     *
     * @protected
     * @method module:util/scroll/simple._$$SimpleScroll#__onUpdateBarEnd
     * @return {Void}
     */
    _pro.__onUpdateBarEnd = function(_name){
        this.__dragging = !1;
        if (this.__isout){
            this.__onMouseLeave();
        }
        var _conf = this.__bar[_name];
        _e._$delClassName(
            _conf.track,_conf.hover
        );
    };
    /**
     * 容器大小变化执行逻辑
     *
     * @method module:util/scroll/simple._$$SimpleScroll#_$resize
     * @return {Void}
     */
    _pro._$resize = function(){
        this.__doResetBarSize(this.__bar.x);
        this.__doResetBarSize(this.__bar.y);
        this.__doUpdateScrollBar(0,0);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});