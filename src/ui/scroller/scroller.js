/**
 * ------------------------------------------
 * 滚动控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        v = NEJ.P('nej.v'),
        u = NEJ.P('nej.u'),
        t = NEJ.P('nej.ut'),
        p = NEJ.P('nej.ui'),
        __proScroller,
        __supScroller;
    /**
     * 滚动控件
     * @class   滚动控件
     * @extends nej.ui._$$Abstract
     * @param  {Object} _options 可选配置参数，已处理参数列表如下：
     *                           config        [Object]      - 滚动配置信息
     *                                                         bcfactor     [Float]  - 弹性移动距离与触点移动距离比例，默认0.5 表示触点移动2px弹性增加1px
     *                                                         minbar       [Float]  - 滚动条保留的最小高度与窗体可视高度比例，默认1/3
     *                                                         reset        [Number] - 滚动加速检测时间间隔【单位ms】，默认350，连续滚动操作350ms后重新开始计算加速初始速度
     *                                                         acceleration [Number] - 减速度，值越大加速越慢，默认30
     *                                                         minvelocity  [Number] - 加速最小初始速度，默认为1
     *                           container     [String|Node] - 内容容器节点ID或者对象
     *                           onscroll      [Function]    - 滚动过程触发事件
     *                           onscrollend   [Function]    - 滚动动画结束触发事件（不包括弹性）
     *                           onbounce      [Function]    - 弹性效果过程触发事件
     *                           onbouncend    [Function]    - 弹性结束触发事件
     *                           onbouncestart [Function]    - 弹性开始触发事件
     *                           onrelease     [Function]    - 释放滚动触发事件
     */
    p._$$Scroller = NEJ.C();
    __proScroller = p._$$Scroller._$extend(p._$$Abstract);
    __supScroller = p._$$Scroller._$supro;
    /**
     * 初始化控件
     * @return {Void}
     */
    __proScroller.__init = function(){
        this.__supInit();
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
     * @return {Object} 滚动配置信息
     */
    __proScroller.__getConfig = f;
    /**
     * 控件重置
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proScroller.__reset = function(_options){
        this.__supReset(_options);
        this.__doInitDomEvent([
            [this.__parent.parentNode,'touchstart',v._$stopDefault],
            [this.__parent.parentNode,'touchmove',v._$stopDefault]
        ]);
        // init param
        this.__bpoint = [0,0];
        this.__animate = {minvelocity:1,
                          bcfactor:0.5,minbar:1/5,
                          reset:300,acceleration:30};
        NEJ.EX(this.__animate,_options.config);
        this.__cbox = e._$get(_options.container)||
                      e._$getChildren(this.__parent)[0];
        e._$addClassName(this.__cbox,this.__seed+'-view');
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    __proScroller.__destroy = function(){
        this.__supDestroy();
        e._$delClassName(this.__cbox,this.__seed+'-view');
        delete this.__offset;
        e._$setStyle(this.__cbox,'transform','');
    };
    /**
     * 刷新滚动控件参数
     * @return {Void}
     */
    __proScroller.__refresh = (function(){
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
     * @return {Void}
     */
    __proScroller.__clearScrollBarTimer = function(){
        if (!this.__timer) return;
        this.__timer = window.clearTimeout(this.__timer);
    };
    /**
     * 显示滚动条
     * @return {Void}
     */
    __proScroller.__showScrollBar = function(){
        if (!this.__barable||
            !this.__scrollable) return;
        this.__clearScrollBarTimer();
        this.__body.style.opacity = 1;
    };
    /**
     * 隐藏滚动条
     * @return {Void}
     */
    __proScroller.__hideScrollBar = function(){
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
     * @return {Number} 偏移量
     */
    __proScroller.__getOffset = function(){
        var _transform = e._$matrix(e.
            _$getStyle(this.__cbox,'transform'));
        return parseInt(_transform[this.__config.dx])||0;
    };
    /**
     * 取弹性距离
     * @param  {Number} _offset 偏移量
     * @return {Number}         弹性距离
     *                          <0  - 下超出
     *                          =0  - 非弹性超出
     *                          >0  - 上超出
     */
    __proScroller.__getOutofBounce = function(_offset){
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
     * @param  {Boolean} _force 强制刷新
     * @return {Void}
     */
    __proScroller.__doRefresh = function(_force){
        _force = !!_force||this.__offset===undefined;
        if (!!_force) this.__refresh();
    };
    /**
     * 恢复弹性
     * @return {Void}
     */
    __proScroller.__doRevertBounce = function(_offset,_duration){
        var _distance = this.__getOutofBounce();
        if (_distance!=0&&!this.__linear){
            var _end = _offset!=null ? _offset
                     : this.__bpoint[_distance<0?0:1];
            this.__alopt.duration = _duration||200;
            this.__alopt.from.offset = this.__offset;
            this.__alopt.to.offset = _end;
            this.__linear = t._$$AnimEaseOut._$allocate(this.__alopt);
            this.__linear._$play();
            return !0;
        }
    };
    /**
     * 弹性恢复动画回收
     * @return {Void}
     */
    __proScroller.__doStopBounceRevert = function(){
        if (!!this.__linear)
            this.__linear = this.__linear._$recycle();
        this.__skip = !1;
    };
    /**
     * 更新弹性恢复
     * @param  {Number} _offset 偏移量
     * @return {Void}
     */
    __proScroller.__doUpdateBounceRevert = function(_event){
        this.__doScrollTo(_event.offset);
    };
    /**
     * 减速动画回收
     * @return {Void}
     */
    __proScroller.__doStopDecelerate = function(_nohide){
        if (!!this.__decelerator)
            this.__decelerator = this.__decelerator._$recycle();
        if (!_nohide){
            this.__hideScrollBar();
            this._$dispatchEvent('onscrollend',this.__getOffset());
        }
    };
    /**
     * 减速动画
     * @param  {Number} _offset   偏移量
     * @param  {Number} _velocity 当前速度
     * @return {Void}
     */
    __proScroller.__doUpdateDecelerate = function(_event){
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
        this.__bouncer = t._$$AnimBounce._$allocate(this.__abopt);
        this.__bouncer._$play();
    };
    /**
     * 弹性动画回收
     * @return {Void}
     */
    __proScroller.__doStopBounce = function(){
        if (!!this.__bouncer)
            this.__bouncer = this.__bouncer._$recycle();
        this.__hideScrollBar();
    };
    /**
     * 弹性动画
     * @param  {Number} _offset 偏移量
     * @return {Void}
     */
    __proScroller.__doUpdateBounce = function(_event){
        this.__doScrollTo(_event.offset);
    };
    /**
     * 滚动至指定位置
     * @param  {Number} _delta 偏移量
     * @return {Void}
     */
    __proScroller.__doScrollBy = function(_delta){
        this.__doScrollTo(this.__offset+_delta);
    };
    /**
     * 滚动至指定位置
     * @param  {Number} _offset 偏移量
     * @return {Void}
     */
    __proScroller.__doScrollTo = function(_offset){
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
        _map[this.__config.of] = u._$fixed(this.__offset,2)+'px';
        e._$css3d(this.__cbox,'translate',_map);
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
            _map[this.__config.of] = u._$fixed(_offset,2)+'px';
            e._$css3d(this.__body,'translate',_map);
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
     * @return {Void}
     */
    __proScroller.__onTouchStart = function(){
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
     * @param  {Touch} _touch 触点对象
     * @return {Void}
     */
    __proScroller.__onDragStart = function(){
        //v._$stopBubble(_event);
        this.__refresh();
        this.__scrolling = !0;
        this.__showScrollBar();
        this.__momentum.offset = this.__offset;
        this.__momentum.time = new Date().getTime();
    };
    /**
     * 过程事件
     * @param  {Touch} _touch 触点对象
     * @return {Void}
     */
    __proScroller.__onDragging = function(_touch){
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
     * @param  {Touch} _touch 触点对象
     * @return {Void}
     */
    __proScroller.__onDragEnd = function(_touch){
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
        this.__decelerator = t._$$AnimDecelerate._$allocate(this.__adopt);
        this.__decelerator._$play();
    };
    /**
     * 动画结束触发事件
     * @return {Void}
     */
    __proScroller.__onTransitionEnd = function(){
        this.__cbox.style.webkitTransitionDuration = '0ms';
    };
    /**
     * 控件节点追加至容器
     * @param  {String|Node} 控件所在容器节点
     * @return {Void}
     */
    __proScroller._$appendTo = function(_parent){
        __supScroller._$appendTo.apply(this,arguments);
        this.__barable = e._$getStyle(
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
     * @return {Void}
     */
    __proScroller._$revertBounce = function(){
        if (!!this.__linear)
            this.__linear._$stop();
        // skip bounce event
        this.__skip = !0;
        this.__doRevertBounce(null,200);
    };
    /**
     * 判断偏移是否在可视范围内
     * @param  {String|Node} _element 检测节点
     * @return {Boolean}              是否在可视范围内
     */
    __proScroller._$isInViewPoint = function(_element){
        _element = e._$get(_element);
        if (!_element) return !1;
        var _range0 = e._$offset(_element,
                      this.__cbox)[this.__config.of],
            _range1 = _range0+_element.offsetHeight;
        this.__doRefresh();
        var _beg = Math.abs(Math.min(0,this.__offset)),
            _end = _beg+this.__boxsize;
        return !(_range1<_beg||_range0>_end);
    };
    /**
     * 取当前滚动高度
     * @return {Number} 滚动高度
     */
    __proScroller._$getScrollTop = function(){
        this.__doRefresh();
        return Math.abs(Math.max(this.__bpoint[0],
                        Math.min(this.__bpoint[1],this.__offset)));
    };
    /**
     * 滚动至偏移位置
     * @param  {Number}  _delta   偏移量
     * @param  {Boolean} _refresh 是否需要刷新
     * @return {Void}
     */
    __proScroller._$scrollBy = function(_delta,_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo(Math.abs(this.__offset)+
                                (parseInt(_delta)||0));
    };
    /**
     * 滚动至指定位置
     * @param  {Number}  _offset  偏移量
     * @param  {Boolean} _refresh 是否需要刷新
     * @return {Void}
     */
    __proScroller._$scrollTo = function(_offset,_refresh){
        this.__onTouchStart();
        this.__doRefresh(_refresh);
        _offset = Math.max(this.__bpoint[0],
                  Math.min(this.__bpoint[1],0-_offset));
        e._$setStyle(this.__cbox,'transitionDuration','150ms');
        this.__doScrollTo(_offset);
        if (!!this.__timer2)
            this.__timer2 = window.clearTimeout(this.__timer2);
        this.__timer2 = window.setTimeout(this.__evopt.ontransitionend,150);
    };
    /**
     * 滚动至顶部
     * @param  {Boolean} _refresh 是否需要刷新
     * @return {Void}
     */
    __proScroller._$scrollTop = function(_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo(Math.abs(this.__bpoint[1]));
    };
    /**
     * 滚动至中部
     * @param  {Boolean} _refresh 是否需要刷新
     * @return {Void}
     */
    __proScroller._$scrollMiddle = function(_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo((this.__bpoint[1]-this.__bpoint[0])/2);
    };
    /**
     * 滚动至底部
     * @param  {Boolean} _refresh 是否需要刷新
     * @return {Void}
     */
    __proScroller._$scrollBottom = function(_refresh){
        this.__doRefresh(_refresh);
        this._$scrollTo(Math.abs(this.__bpoint[0]));
    };
    /**
     * 滚动到指定元素
     * @param  {String|Node} _element 目标元素
     * @param  {Boolean}     _refresh 是否需要刷新
     * @return {Void}
     */
    __proScroller._$scrollToElement = function(_element,_refresh){
        var _offset = e._$offset(_element,this.__cbox);
        if (!_offset) return;
        this._$scrollTo(_offset[this.__config.of],_refresh);
    };
};
define('{lib}ui/scroller/scroller.js',
      ['{lib}ui/base.js'
      ,'{lib}util/gesture/tap.js'
      ,'{lib}util/gesture/drag.js'
      ,'{lib}util/animation/bounce.js'
      ,'{lib}util/animation/easeout.js'
      ,'{lib}util/animation/decelerate.js'],f);
