/*
 * ------------------------------------------
 * 自动滚动机制实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/auto/scroll */
NEJ.define([
    'base/klass',
    'base/event',
    'base/element',
    'util/event'
],function(_k,_v,_e,_t,_p,_o,_f,_r,_pro){
    /**
     * 自动滚动控件
     * 
     * 结构举例
     * ```html
     * <div id="box">
     *   <p>aaaaaaaaaaaaaaa</p>
     *   <p>aaaaaaaaaaaaaaa</p>
     *   <p>aaaaaaaaaaaaaaa</p>
     *   <p>aaaaaaaaaaaaaaa</p>
     *   <p>aaaaaaaaaaaaaaa</p>
     *   <p>aaaaaaaaaaaaaaa</p>
     *   <p>aaaaaaaaaaaaaaa</p>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/auto/scroll'
     * ],function(_t){
     *     var _scroll = _t._$$SmartScroll._$allocate({
     *         viewport:'box',
     *         onscrollcheck:function(_event){
     *             // _event.stopped - 是否禁止自动滚动
     *         }
     *     });
     * });
     * ```
     * 
     * @class    module:util/auto/scroll._$$SmartScroll
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object} config    - 可选配置参数
     * @property {Node}   viewport  - 滚动容器，默认为根结点
     * @property {Array}  range     - 自动滚动临界范围定义，[lower,upper]，鼠标位置均相对于viewport，如
     *                                [10,200]  - 表示小于10时向上滚，大于200时向下滚
     *                                [10,-10]  - 值为负数，表示小于10时向上滚，大于viewport可视区高度减10时向下滚
     *                                [0.1,0.9] - 值在0-1之间，表示小于viewport可视区高度*0.1时向上滚，大于viewport可视区高度*0.9时向下滚
     * @property {Array}  limit     - 上下限制区域，0表示无限制，如[10,100]，表示viewport可视区上面保留10像素，下面保留100像素
     */
    _p._$$SmartScroll = _k._$klass();
    _pro = _p._$$SmartScroll._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * @param {Object} _options
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        var _port = _e._$get(_options.viewport);
        this.__viewport = _port||_e._$getScrollViewPort();
        this.__doUpdateRange(_options.range);
        this.__doUpdateLimit(_options.limit);
        // init event
        this.__doInitDomEvent([[
            _port||document,'mousemove',
            this.__onScrollCheck._$bind(this)
        ],[
            document,'mouseup',
            this.__doStopScroll._$bind(this)
        ]]);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__doStopScroll();
        delete this.__range;
        delete this.__limit;
        delete this.__viewport;
    };
    /**
     * 更新限制区域
     * @return {Void}
     */
    _pro.__doUpdateLimit = function(_limit){
        var _height = this.__viewport.scrollHeight;
        _limit = _limit||_r;
        this.__limit = [
            _limit[0]||0,
            _height-(_limit[1]||0)
        ];
    };
    /**
     * 更新临界位置信息
     * @return {Void}
     */
    _pro.__doUpdateRange = (function(){
        var _doFormat = function(_value,_height,_default){
            _value = parseInt(_value)||_default;
            if (_value<0){
                return _height+_value;
            }
            if (0<_value&&_value<1){
                return Math.floor(_height*_value);
            }
            return _value;
        };
        return function(_range){
            var _xrng = _range||_r,
                _height = this.__viewport.clientHeight,
                _lower = _doFormat(_xrng[0],_height,0.2),
                _upper = _doFormat(_xrng[1],_height,0.8);
            this.__range = [
                Math.min(_lower,_upper),
                Math.max(_lower,_upper)
            ];
        };
    })();
    /**
     * 自动滚动
     * @return {Void}
     */
    _pro.__doAutoScroll = function(_flag){
        if (!_flag){
            this.__doStopScroll();
            return;
        }
        this.__flag = _flag;
        if (!this.__timer){
            this.__timer = window.setInterval(
                this.__doAutoScrollStep._$bind(this),
                1000/50
            );
        }
    };
    /**
     * 自动滚动
     * @return {Void}
     */
    _pro.__doAutoScrollStep = function(){
        this.__count = (this.__count||0)+1;
        var _top = this.__viewport.scrollTop,
            _value = _top+this.__flag*Math.min(80,this.__count);
        if (this.__flag<0){
            // up with min
            this.__viewport.scrollTop = Math.max(
                this.__limit[0],_value
            );
        }else{
            // down with max
            this.__viewport.scrollTop = Math.min(
                this.__limit[1],_value
            );
        }
    };
    /**
     * 停止滚动检测
     * @param {Object} _event
     */
    _pro.__doStopScroll = function(){
        this.__count = 0;
        delete this.__flag;
        this.__timer = window.clearInterval(this.__timer);
    };
    /**
     * 滚动检测
     * @param {Object} _event
     */
    _pro.__onScrollCheck = function(_evt){
        var _event = {};
        this._$dispatchEvent(
            'onscrollcheck',_event
        );
        if (!!_event.stopped){
            this.__doStopScroll();
            return;
        }
        var _range = this.__range,
            _delta = _v._$pageY(_evt)
                   - _e._$offset(this.__viewport).y;
        this.__doAutoScroll(
            _delta<=_range[0]?-1:(
                _delta>=_range[1]?1:0
            )
        );
    };
});


