/**
 * ------------------------------------------
 * 滑动事件对象实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _v = _('nej.v'),
        _p = _('nej.ut.g'),
        __proSwipe;
    if (!!_p._$$Swipe) return;
    /**
     * 滑动事件实现对象，事件可用信息
     * direction [String] - 滑动方向 left/right
     * distance  [Number] - 滑动距离，绝对值
     * movement  [Number] - 移动距离，相对值，带符号
     * @class   {nej.ut.g._$$Drag} 滑动事件实现对象
     * @extends {nej.ut.g._$$Gesture}
     */
    _p._$$Swipe = NEJ.C();
    __proSwipe = _p._$$Swipe._$extend(_p._$$Gesture);
    
    /**
     * 初始化控件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proSwipe.__init = function(_options){
        this.__supInit(_options);
        this.__xdistance = 3;
        this.__threshold = 35;
        this.__checktime = 1000;
    };
    /**
     * 开始触摸事件
     * @param  {Object} _options 事件相关信息
     * @return {Void}
     */
    __proSwipe.__doTouchStart = function(_touches,_event){
        var _touch = _touches[0];
        this.__swiping = !0;
        this.__time = new Date().getTime();
        this.__pointerX = _v._$pageX(_touch);
        this.__pointerY = _v._$pageY(_touch);
    };
    /**
     * 触点移动事件
     * @param  {Object} _options 事件相关信息
     * @return {Void}
     */
    __proSwipe.__doTouchMove = function(_touches,_event){
        if (!this.__swiping) return;
        var _touch = _touches[0];
        var _deltax = _v._$pageX(_touch)-this.__pointerX,
            _deltay = _v._$pageY(_touch)-this.__pointerY,
            _deltat = new Date().getTime()-this.__time,
            _absx = Math.abs(_deltax),
            _absy = Math.abs(_deltay);
        if (_absy-_absx>this.__xdistance||_deltat>this.__checktime){
            this.__swiping = !1;
            return;
        }
        if (_absx>this.__threshold&&_absx>_absy){
            this.__swiping = !1;
            var _options = {};
            _options.direction = _deltax<0?'left':'right';
            _options.distance = _absx;
            _options.movement = _deltax;
            this.__doDispatchEvent('swipe',_touch,_options)
        }
    };
    
    // instance
    _p._$$Swipe._$allocate();
};
define('{lib}util/gesture/swipe.js',
      ['{lib}util/gesture/gesture.js'],f);