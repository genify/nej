/*
 * ------------------------------------------
 * 贝塞尔曲线算法实现文件
 * 算法参考webkit动画实现
 * WebCore/platform/graphics/UnitBezier.h
 * WebCore/page/animation/AnimationBase.cpp
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    '{lib}util/animation/animation.js'
],function(NEJ,_k,_u,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 贝塞尔曲线算法
     * [ntb]
     *   初始信息包括 | offset  [Number] | 偏移量
     *   结束信息包括 | offset  [Number] | 偏移量
     * [/ntb]
     * @class   {nej.ut._$$AnimBezier} 贝塞尔曲线算法
     * @extends {nej.ut._$$Animation}
     * @param   {Object} 可选配置参数
     * @property  {Number} duration 持续时间，单位毫秒，默认为200ms
     * @property  {String} timing   时间函数，默认为ease，ease/easein/easeout/easeinout/linear/cubic-bezier(x1,y1,x2,y2)
     */
    _p._$$AnimBezier = _k._$klass();
    _pro = _p._$$AnimBezier._$extend(_t0._$$Animation);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @property {Number} duration 持续时间
     * @property {String} timing   时间函数，默认为ease，ease/easein/easeout/easeinout/linear/cubic-bezier(x1,y1,x2,y2)
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__duration = _options.duration||200;
        this.__epsilon  = 1/(200*this.__duration);
        this.__doParseTiming(_options.timing);
        this.__doCalPolynomialCoefficients();
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__pointer;
        delete this.__coefficient;
    };
    /**
     * 解析时间动画为坐标信息
     * @protected
     * @method {__doParseTiming}
     * @param  {String} 时间动画
     * @return {Void}
     */
    _pro.__doParseTiming = (function(){
        var _reg0 = /^cubic\-bezier\((.*?)\)$/i,
            _reg1 = /\s*,\s*/i,
            _pointers = {
                linear:[0,0,1,1]
               ,ease:[0.25,0.1,0.25,1.0]
               ,easein:[0.42,0,1,1]
               ,easeout:[0,0,0.58,1]
               ,easeinout:[0,0,0.58,1]
            };
        var _doParseFloat = function(_value,_index,_list){
            _list[_index] = parseFloat(_value);
        };
        return function(_timing){
            _timing = (_timing||'').toLowerCase();
            this.__pointer = _pointers[_timing];
            if (_reg0.test(_timing)){
                this.__pointer = RegExp.$1.split(_reg1);
                _u._$forEach(this.__pointer,_doParseFloat);
            }
            if (!!this.__pointer) return;
            this.__pointer = _pointers.ease;
        };
    })();
    /**
     * 计算贝塞尔曲线多项式系数
     * @protected
     * @method {__doCalPolynomialCoefficients}
     * @return {Void}
     */
    _pro.__doCalPolynomialCoefficients = function(){
        var _pt = this.__pointer,
            _cx = 3*_pt[0],
            _bx = 3*(_pt[2]-_pt[0])-_cx,
            _ax = 1-_cx-_bx,
            _cy = 3*_pt[1],
            _by = 3*(_pt[3]-_pt[1])-_cy,
            _ay = 1-_cy-_by;
        this.__coefficient = {
            ax:_ax, ay:_ay,
            bx:_bx, by:_by,
            cx:_cx, cy:_cy
        };
    };
    /**
     * 计算目标接近率
     * @protected
     * @method {__doCalCubicBezierAtTime}
     * @param  {Number} 当前时间
     * @return {Float}  终点接近率
     */
    _pro.__doCalCubicBezierAtTime = (function(){
        var _doSampleCurveX = function(_time,_coef){
            return ((_coef.ax*_time+_coef.bx)*_time+_coef.cx)*_time;
        };
        var _doSampleCurveY = function(_time,_coef){
            return ((_coef.ay*_time+_coef.by)*_time+_coef.cy)*_time;
        };
        var _doSampleCurveDerivativeX = function(_time,_coef){
            return (3*_coef.ax*_time+2*_coef.bx)*_time+_coef.cx;
        };
        var _doSolveCurveX = function(_time,_epsilon,_coef){
            var t0,t1,t2,x2,d2,i;
            // First try a few iterations of Newton's method -- normally very fast.
            for(t2=_time,i=0;i<8;i++){
                x2 = _doSampleCurveX(t2,_coef)-_time;
                if (Math.abs(x2)<_epsilon)
                    return t2;
                d2 = _doSampleCurveDerivativeX(t2,_coef);
                if (Math.abs(d2)<1e-6)
                    break;
                t2 = t2-x2/d2;
            }
            // Fall back to the bisection method for reliability.
            t0 = 0; t1 = 1; t2 = _time;
            if (t2<t0) return t0;
            if (t2>t1) return t1;
            while(t0<t1) {
                x2 = _doSampleCurveX(t2,_coef);
                if (Math.abs(x2-_time)<_epsilon)
                    return t2;
                if (_time>x2)
                    t0 = t2;
                else
                    t1 = t2;
                t2 = (t1-t0)*0.5+t0;
            }
            // Failure.
            return t2;
        };
        return function(_delta){
            return _doSampleCurveY(
                   _doSolveCurveX(_delta/this.__duration,
                   this.__epsilon,this.__coefficient),this.__coefficient);
        };
    })();
    /**
     * 动画帧回调
     * @protected
     * @method {__doAnimationFrame}
     * @param  {Number} 时间值
     * @return {Boolean} 是否停止
     */
    _pro.__doAnimationFrame = function(_time){
        var _delta   = _time-this.__begin.time,
            _percent = this.__doCalCubicBezierAtTime(_delta),
            _offset  = _u._$fixed(this.__begin.offset*(1-_percent)+
                                  this.__end.offset*_percent,2),
            _stop = !1;
        // offset out of begin and end range
        if (_delta>=this.__duration){
            _offset = this.__end.offset;
            _stop = !0;
        }
        this._$dispatchEvent('onupdate',{offset:1*_offset});
        return _stop;
    };
    /**
     * 取消动画监听事件<br/>
     * 脚本举例
     * ```javascript
     *   var options = {
     *         from: {
     *             offset: 100,
     *             velocity: 100
     *         },
     *         acceleration:100,
     *         onstop: function(){
     *             _bounce = nej.ut._$$AnimEaseIn._$recycle(_bounce);
     *         }
     *     }
     *   var _bounce = nej.ut._$$AnimEaseIn._$allocate(options);
     *   // 进行动画
     *   _bounce._$play();
     *   // 停止动画,触发onstop
     *   _bounce._$stop();
     * ```
     * @method {_$stop}
     * @return {Void}
     */
    _pro._$stop = function(){
        this._$dispatchEvent('onupdate',{offset:this.__end.offset});
        this.__super();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});