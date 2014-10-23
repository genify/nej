/**
 * ------------------------------------------
 * 滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/scroller/scroller */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'ui/base',
    'util/gesture/tap',
    'util/gesture/drag',
    'util/animation/bounce',
    'util/animation/easeout',
    'util/animation/decelerate'
],function(NEJ,_k,_e,_v,_u,_i,_t0,_t1,_t2,_t3,_t4,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 滚动配置信息
     * @typedef  {Object}      module:ui/scroller/scroller._$$Scroller~Config
     * @property {Float}       bcfactor - 弹性移动距离与触点移动距离比例，默认0.5 表示触点移动2px弹性增加1px
     * @property {Float}       minbar - 滚动条保留的最小高度与窗体可视高度比例，默认1/3
     * @property {Number}      reset  - 滚动加速检测时间间隔【单位ms】，默认350，连续滚动操作350ms后重新开始计算加速初始速度
     * @property {Number}      acceleration - 减速度，值越大加速越慢，默认30
     * @property {Number}      minvelocity  - 加速最小初始速度，默认为1
     * @property {String|Node} container    - 内容容器节点ID或者对象
     */
    /**
     * 滚动控件
     * @class    module:ui/scroller/scroller._$$Scroller
     * @extends  module:ui/base._$$Abstract
     * @param    {Object} options - 可选配置参数
     * @property {module:ui/scroller/scroller._$$Scroller~Config} config  - 滚动配置信息
     */
    /**
     * 滚动过程触发事件
     *
     * @event module:ui/scroller/scroller._$$Scroller#onscroll
     */
    /**
     * 滚动动画结束触发事件（不包括弹性）
     *
     * @event module:ui/scroller/scroller._$$Scroller#onscrollend
     */
    /**
     * 弹性效果过程触发事件
     *
     * @event module:ui/scroller/scroller._$$Scroller#onbounce
     */
    /**
     * 弹性结束触发事件
     *
     * @event module:ui/scroller/scroller._$$Scroller#onbouncend
     */
    /**
     * 弹性开始触发事件
     *
     * @event module:ui/scroller/scroller._$$Scroller#onbouncestart
     */
    /**
     * 释放滚动触发事件
     *
     * @event module:ui/scroller/scroller._$$Scroller#onrelease
     */
    _p._$$Scroller = _k._$klass();
    _pro = _p._$$Scroller._$extend(_i._$$Abstract);
    /**
     * 初始化控件
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__momentum = {};
        this.__config = this.__getConfig();
        this.__alopt = {from:{},to:{},
                        onstop:this.__doStopBounceRevert._$bind(this),
                        onupdate:this.__doUpdateBounceRevert._$bind(this)};
        this.__adopt = {from:{},
                        onstop:this.__doStopDecelerate._$bind(this),
                        onupdate:this.__doUpdateDecelerate._$bind(this)};
        this.__abopt = {from:{},
                        onstop:this.__doStopBounce._$bind(this),
                        onupdate:this.__doUpdateBounce._$bind(this)};
        this.__evopt = {ontapstart:this.__onTouchStart._$bind(this),
                        ondragstart:this.__onDragStart._$bind(this),
                        ondrag:this.__onDragging._$bind(this),
                        ondragend:this.__onDragEnd._$bind(this),
                        ontransitionend:this.__onTransitionEnd._$bind(this)};
    };
    /**
     * 取滚动配置信息，子类实现具体逻辑
     *
     * @abstract
     * @return {Object} 滚动配置信息
     */
    _pro.__getConfig = _f;
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__reset
     * @param  {Object} _options - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__doInitDomEvent([
            [this.__parent.parentNode,'touchstart',v._$stopDefault],
            [this.__parent.parentNode,'touchmove',v._$stopDefault]
        ]);
        // init param
        this.__bpoint = [0,0];
        this.__animate = {minvelocity:1,
                          bcfactor:0.5,minbar:1/5,
                          reset:300,acceleration:30};
        _u._$fetch(this.__animate,_options.config);
        this.__cbox = _e._$get(_options.container)||
                      _e._$getChildren(this.__parent)[0];
        _e._$addClassName(this.__cbox,this.__seed+'-view');
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        _e._$delClassName(this.__cbox,this.__seed+'-view');
        delete this.__offset;
        _e._$setStyle(this.__cbox,'transform','');
    };
    /**
     * 刷新滚动控件参数
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__refresh
     * @return {Void}
     */
    _pro.__refresh = (function(){
        var _offset = function(_element,_attr){
            if (!_element) return 0;
            var _value = _element[_attr];
            while(!!_element&&!_value){
                _element = _element.parentNode;
                if (!!_element)
                    _value = _element[_attr];
            }
            return _value;
        };
        return function(){
            var _sbox = this.__cbox[this.__config.sb],
                _obox = _offset(this.__parent,this.__config.ob);
            this.__scrollable = _sbox>_obox;
            this.__boxsize = _obox;
            this.__barsize = Math.max(_obox*_obox/_sbox,
                                      _obox*this.__animate.minbar);
            this.__scratio = (_obox-this.__barsize)/(_sbox-_obox);
            this.__body.style[this.__config.g] = this.__barsize+'px';
            this.__bpoint = [Math.min(0,_obox-_sbox),0];
            this.__offset = this.__getOffset();
        };
    })();
    /**
     * 清理定时器
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__clearScrollBarTimer
     * @return {Void}
     */
    _pro.__clearScrollBarTimer = function(){
        if (!this.__timer) return;
        this.__timer = window.clearTimeout(this.__timer);
    };
    /**
     * 显示滚动条
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__showScrollBar
     * @return {Void}
     */
    _pro.__showScrollBar = function(){
        if (!this.__barable||
            !this.__scrollable) return;
        this.__clearScrollBarTimer();
        this.__body.style.opacity = 1;
    };
    /**
     * 隐藏滚动条
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__hideScrollBar
     * @return {Void}
     */
    _pro.__hideScrollBar = function(){
        if (!this.__barable||
            !this.__scrollable) return;
        this.__clearScrollBarTimer();
        // delay 0.5s hide scrollbar
        this.__timer = window.setTimeout(function(){
            this.__body.style.opacity = 0;
        }._$bind(this),300);
    };
    /**
     * 取偏移量
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__getOffset
     * @return {Number} 偏移量
     */
    _pro.__getOffset = function(){
        var _transform = _e._$matrix(e.
            _$getStyle(this.__cbox,'transform'));
        return parseInt(_transform[this.__config.dx])||0;
    };
    /**
     * 取弹性距离
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__getOutofBounce
     * @param  {Number} _offset - 偏移量
     * @return {Number}         弹性距离
     * |        数值         |        含义          |
     * |        :---         |        :---          |
     * |        <0           |        下超出        |
     * |        =0           |        非弹性超出    |
     * |        >0           |        上超出        |
     */
    _pro.__getOutofBounce = function(_offset){
        var _out = _offset==null?this.__offset:_offset;
        if (this.__bpoint[0]<=_out&&
            this.__bpoint[1]>=_out)
            return 0;
        var _delta = _out-this.__bpoint[0];
        if (_delta<0) return _delta;
        _delta = _out-this.__bpoint[1];
        if (_delta>0) return _delta;
    };
    /**
     * 刷新布局信息
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doRefresh
     * @param  {Boolean} _force - 强制刷新
     * @return {Void}
     */
    _pro.__doRefresh = function(_force){
        _force = !!_force||this.__offset===undefined;
        if (!!_force) this.__refresh();
    };
    /**
     * 恢复弹性
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doRevertBounce
     * @param  {Number} _offset   - 弹性距离
     * @param  {Number} _duration - 持续时间
     * @return {Void}
     */
    _pro.__doRevertBounce = function(_offset,_duration){
        var _distance = this.__getOutofBounce();
        if (_distance!=0&&!this.__linear){
            var _end = _offset!=null ? _offset
                     : this.__bpoint[_distance<0?0:1];
            this.__alopt.duration = _duration||200;
            this.__alopt.from.offset = this.__offset;
            this.__alopt.to.offset = _end;
            this.__linear = _t3._$$AnimEaseOut._$allocate(this.__alopt);
            this.__linear._$play();
            return !0;
        }
    };
    /**
     * 弹性恢复动画回收
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doStopBounceRevert
     * @return {Void}
     */
    _pro.__doStopBounceRevert = function(){
        if (!!this.__linear)
            this.__linear = this.__linear._$recycle();
        this.__skip = !1;
    };
    /**
     * 更新弹性恢复
     *
     * @protected
     * @method   module:ui/scroller/scroller._$$Scroller#__doUpdateBounceRevert
     * @param    {Object} _event  - 偏移量对象
     * @property {Number} offset  - 偏移量
     * @return {Void}
     */
    _pro.__doUpdateBounceRevert = function(_event){
        this.__doScrollTo(_event.offset);
    };
    /**
     * 减速动画回收
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doStopDecelerate
     * @param  {Boolean} _nohide  - 是否回收
     * @return {Void}
     */
    _pro.__doStopDecelerate = function(_nohide){
        if (!!this.__decelerator)
            this.__decelerator = this.__decelerator._$recycle();
        if (!_nohide){
            this.__hideScrollBar();
            this._$dispatchEvent('onscrollend',this.__getOffset());
        }
    };
    /**
     * 减速动画
     *
     * @protected
     * @method   module:ui/scroller/scroller._$$Scroller#__doUpdateDecelerate
     * @param    {Object} _event   - 配置参数
     * @property {Number} offset   - 偏移量
     * @property {Number} velocity - 当前速度
     * @return   {Void}
     */
    _pro.__doUpdateDecelerate = function(_event){
        var _offset = _event.offset,
            _velocity = _event.velocity,
            _distance = this.__getOutofBounce(_offset);
        if (_distance==0){
            this.__doScrollTo(_offset);
            return;
        }
        this.__doStopDecelerate(!0);
        this.__abopt.from.velocity = _velocity;
        this.__abopt.from.offset = this.__bpoint[_distance<0?0:1];//this.__offset;
        this.__bouncer = _t2._$$AnimBounce._$allocate(this.__abopt);
        this.__bouncer._$play();
    };
    /**
     * 弹性动画回收
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doStopBounce
     * @return {Void}
     */
    _pro.__doStopBounce = function(){
        if (!!this.__bouncer)
            this.__bouncer = this.__bouncer._$recycle();
        this.__hideScrollBar();
    };
    /**
     * 弹性动画
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doUpdateBounce
     * @param    {Object} _event  - 偏移量对象
     * @property {Number} offset  - 偏移量
     * @return {Void}
     */
    _pro.__doUpdateBounce = function(_event){
        this.__doScrollTo(_event.offset);
    };
    /**
     * 滚动至指定位置
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doScrollBy
     * @param  {Number} _delta - 偏移量
     * @return {Void}
     */
    _pro.__doScrollBy = function(_delta){
        this.__doScrollTo(this.__offset+_delta);
    };
    /**
     * 滚动至指定位置
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__doScrollTo
     * @param  {Number} _offset - 偏移量
     * @return {Void}
     */
    _pro.__doScrollTo = function(_offset){
        // 正向滚动(远离顶部的滚动)：<0
        // 反向滚动(接近顶部的滚动)：>0
        var _delta = _offset-this.__offset;
        if (!_delta) return;
        this.__offset = _offset;
        var _distance = this.__getOutofBounce(),
            _index = _distance<0?0:1,
            _bounce = _distance!=0;
        if (_bounce)
            this.__offset = Math.ceil(this.__offset-_delta+
                                      this.__animate.bcfactor*_delta);
        var _map = {};
        _map[this.__config.of] = _u._$fixed(this.__offset,2)+'px';
        _e._$css3d(this.__cbox,'translate',_map);
        // synchronize scrollbar
        if (this.__barable){
            var _offset = Math.floor(Math.max(0,-this.__scratio*this.__offset));
            if (_bounce){
                var _size = Math.max(8,this.__barsize-Math.abs(_distance)*2);
                this.__body.style[this.__config.g] = _size+'px';
                if (_distance<0)
                    _offset = this.__boxsize-_size;
            }else{
                this.__body.style[this.__config.g] = this.__barsize+'px';
                _offset = Math.min(_offset,this.__boxsize-this.__barsize);
            }
            var _map = {};
            _map[this.__config.of] = _u._$fixed(_offset,2)+'px';
            _e._$css3d(this.__body,'translate',_map);
        }
        // event trigger
        if (!_bounce){
            var _name = this.__bouncing?'onbouncend':'onscroll';
            this.__bouncing = !1;
            this._$dispatchEvent(_name,this.__offset);
            return;
        }
        if (!!this.__skip) return;
        var _event = {movement:_distance,
                      direction:_delta>0?-1:1};
        if (!!this.__bouncing){
            this._$dispatchEvent('onbounce',_event);
            return;
        }
        this.__bouncing = !0;
        this._$dispatchEvent('onbouncestart',_event);
    };
    /**
     * 开始触摸触发事件
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__onTouchStart
     * @return {Void}
     */
    _pro.__onTouchStart = function(){
        // stop all animation
        if (!!this.__linear)
            this.__linear._$stop();
        if (!!this.__bouncer)
            this.__bouncer._$stop();
        if (!!this.__decelerator)
            this.__decelerator._$stop();
        if (!!this.__timer2){
            this.__timer2 = window.clearInterval(this.__timer2);
            this.__onTransitionEnd();
        }
    };
    /**
     * 开始事件
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__onDragStart
     * @param  {Touch} _touch - 触点对象
     * @return {Void}
     */
    _pro.__onDragStart = function(){
        //v._$stopBubble(_event);
        this.__refresh();
        this.__scrolling = !0;
        this.__showScrollBar();
        this.__momentum.offset = this.__offset;
        this.__momentum.time = new Date().getTime();
    };
    /**
     * 过程事件
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__onDragging
     * @param  {Touch} _touch - 触点对象
     * @return {Void}
     */
    _pro.__onDragging = function(_touch){
        if (!this.__scrolling) return;
        var _delta = _touch.detalY;
        this.__doScrollBy(_delta);
        var _time = new Date().getTime();
        if (_time-this.__momentum.time>this.__animate.reset){
            this.__momentum.time = _time;
            this.__momentum.offset = this.__offset;
        }
    };
    /**
     * 结束事件
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__onDragEnd
     * @param  {Touch} _touch - 触点对象
     * @return {Void}
     */
    _pro.__onDragEnd = function(_touch){
        if (!this.__scrolling) return;
        this.__scrolling = !1;
        var _event = {};
        this._$dispatchEvent('onrelease',_event);
        var _bounce = this.__doRevertBounce(_event.offset);
        if (!!_bounce){
            this.__hideScrollBar();
            return;
        }
        var _duration = new Date().getTime()-this.__momentum.time,
            _distance = this.__offset-this.__momentum.offset,
            _velocity = _distance/_duration*this.__animate.acceleration;
        if (Math.abs(_velocity)<this.__animate.minvelocity){
            this.__hideScrollBar();
            this._$dispatchEvent('onscrollend',this.__getOffset());
            return;
        }
        this.__adopt.from.offset = this.__offset;
        this.__adopt.from.velocity = _velocity;
        this.__decelerator = _t4._$$AnimDecelerate._$allocate(this.__adopt);
        this.__decelerator._$play();
    };
    /**
     * 动画结束触发事件
     *
     * @protected
     * @method module:ui/scroller/scroller._$$Scroller#__onTransitionEnd
     * @return {Void}
     */
    _pro.__onTransitionEnd = function(){
        this.__cbox.style.webkitTransitionDuration = '0ms';
    };
    /**
     * 控件节点追加至容器
     * @method module:ui/scroller/scroller._$$Scroller#_$appendTo
     * @param  {String|Node} arg0 - 控件所在容器节点
     * @return {Void}
     */
    _pro._$appendTo = function(_parent){
        this.__super();
        this.__barable = _e._$getStyle(
             this.__body,'display')!='none';
        if (!this.__parent) return;
        this.__doInitDomEvent([
            [document,'dragging',this.__evopt.ondrag],
            [document,'dragcomplete',this.__evopt.ondragend],
            [this.__parent,'tapdown',this.__evopt.ontapstart],
            [this.__parent,'dragbegin',this.__evopt.ondragstart]
        ]);
    };
    /**
     * 恢复弹性
     * @method module:ui/scroller/scroller._$$Scroller#_$revertBounce
     * @return {Void}
     */
    _pro._$revertBounce = function(){
        if (!!this.__linear)
            this.__linear._$stop();
        // skip bounce event
        this.__skip = !0;
        this.__doRevertBounce(null,200);
    };
    /**
     * 判断偏移是否在可视范围内
     * @method module:ui/scroller/scroller._$$Scroller#_$isInViewPoint
     * @param  {String|Node} _element - 检测节点
     * @return {Boolean}              是否在可视范围内
     */
    _pro._$isInViewPoint = function(_element){
        _element = _e._$get(_element);
        if (!_element) return !1;
        var _range0 = _e._$offset(_element,
                      this.__cbox)[this.__config.of],
            _range1 = _range0+_element.offsetHeight;
        this.__doRefresh();
        var _beg = Math.abs(Math.min(0,this.__offset)),
            _end = _beg+this.__boxsize;
        return !(_range1<_beg||_range0>_end);
    };
    /**
     * 取当前滚动高度
     * @method module:ui/scroller/scroller._$$Scroller#_$getScrollTop
     * @return {Number} 滚动高度
     */
    _pro._$getScrollTop = function(){
        this.__doRefresh();
        return Math.abs(Math.max(this.__bpoint[0],
                        Math.min(this.__bpoint[1],this.__offset)));
    };
    /**
     * 滚动至偏移位置
     * @method module:ui/scroller/scroller._$$Scroller#_$scrollBy
     * @param  {Number}  _delta   - 偏移量
     * @param  {Boolean} _refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollBy = function(_delta,_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo(Math.abs(this.__offset)+
                                (parseInt(_delta)||0));
    };
    /**
     * 滚动至指定位置
     * @method module:ui/scroller/scroller._$$Scroller#_$scrollTo
     * @param  {Number}  _offset  - 偏移量
     * @param  {Boolean} _refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollTo = function(_offset,_refresh){
        this.__onTouchStart();
        this.__doRefresh(_refresh);
        _offset = Math.max(this.__bpoint[0],
                  Math.min(this.__bpoint[1],0-_offset));
        _e._$setStyle(this.__cbox,'transitionDuration','150ms');
        this.__doScrollTo(_offset);
        if (!!this.__timer2)
            this.__timer2 = window.clearTimeout(this.__timer2);
        this.__timer2 = window.setTimeout(this.__evopt.ontransitionend,150);
    };
    /**
     * 滚动至顶部
     * @method module:ui/scroller/scroller._$$Scroller#_$scrollTop
     * @param  {Boolean} _refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollTop = function(_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo(Math.abs(this.__bpoint[1]));
    };
    /**
     * 滚动至中部
     * @method module:ui/scroller/scroller._$$Scroller#_$scrollMiddle
     * @param  {Boolean} _refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollMiddle = function(_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo((this.__bpoint[1]-this.__bpoint[0])/2);
    };
    /**
     * 滚动至底部
     * @method module:ui/scroller/scroller._$$Scroller#_$scrollBottom
     * @param  {Boolean} _refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollBottom = function(_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo(Math.abs(this.__bpoint[0]));
    };
    /**
     * 滚动到指定元素
     * @method module:ui/scroller/scroller._$$Scroller#_$scrollToElement
     * @param  {String|Node} _element - 目标元素
     * @param  {Boolean}     _refresh - 是否需要刷新
     * @return {Void}
     */
    _pro._$scrollToElement = function(_element,_refresh){
        var _offset = _e._$offset(_element,this.__cbox);
        if (!_offset) return;
        this._$scrollTo(_offset[this.__config.of],_refresh);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});