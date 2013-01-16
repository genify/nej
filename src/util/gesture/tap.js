/**
 * ------------------------------------------
 * 轻击事件对象实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _v = _('nej.v'),
        _p = _('nej.ut.g'),
        _proTap;
    if (!!_p._$$Tap) return;
    /**
     * 轻击事件实现对象，支持以下手势事件
     * [ntb]
     *   tapdown   | 按下点击，类似mousedown
     *   taphold   | 按下不动，长时间持续
     *   tapup     | 触点离开，类似mouseup
     *   tap       | 轻击，类似click
     *   dbltap    | 双击，类似dblclick
     *   tapcancel | 取消轻击
     * [/ntb]
     * 
     * @class   {nej.ut.g._$$Tap}
     * @extends {nej.ut.g._$$Gesture}
     * 
     * 
     * 
     * 
     */
    _p._$$Tap = NEJ.C();
      _proTap = _p._$$Tap._$extend(_p._$$Gesture),
    /**
     * 控件初始化
     * @return {Void}
     */
    _proTap.__init = function(){
        this.__supInit();
        this.__cancel_distance = 2;
        this.__double_interval = 650;
        this.__hold_interval   = 1000;
    };
    /**
     * 触摸持续事件监测
     * @param  {Touch} 触点信息
     * @return {Void}
     */
    _proTap.__doTapHoldCheck = function(_touch){
        this.__timer = window.clearTimeout(this.__timer);
        this.__doDispatchEvent('taphold',_touch);
    };
    /**
     * 执行开始触摸业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proTap.__doTouchStart = function(_touches,_event){
        this.__flag = !0;
        var _touch = _touches[0];
        this.__doDispatchEvent('tapdown',_touch);
        this.__pagex = _v._$pageX(_touch);
        this.__pagey = _v._$pageY(_touch);
        this.__timer = window.setTimeout(
                       this.__doTapHoldCheck
                           ._$bind(this,_touch),this.__hold_interval);
    };
    /**
     * 执行触摸移动业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proTap.__doTouchMove = function(_touches,_event){
        if (!this.__flag) return;
        var _touch = _touches[0];
        var _dx = Math.abs(_v._$pageX(_touch)-this.__pagex),
            _dy = Math.abs(_v._$pageY(_touch)-this.__pagex);
        if (_dx>=this.__cancel_distance||
            _dy>=this.__cancel_distance)
            this.__doTouchCancel(_touch,_event);
    };
    /**
     * 执行触摸结束业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proTap.__doTouchEnd = function(_touches,_event){
        if (!this.__flag) return;
        var _touch = _touches[0];
        this.__flag = !1;
        this.__timer = window.clearTimeout(this.__timer);
        this.__doDispatchEvent('tapup',_touch);
        this.__doDispatchEvent('tap',_touch);
        var _time = +new Date;
        if (this.__taptime==null){
            this.__taptime = _time;
            return;
        }
        if ((_time-this.__taptime)<=
            this.__double_interval)
            this.__doDispatchEvent('dbltap',_touch);
        delete this.__taptime;
    };
    /**
     * 执行开始触摸业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proTap.__doTouchCancel = function(_touches,_event){
        if (!this.__flag) return;
        var _touch = _touches[0];
        this.__flag = !1;
        this.__timer = window.clearTimeout(this.__timer);
        this.__doDispatchEvent('tapcancel',_touch);
    };
    // instance
    _p._$$Tap._$allocate();
};
define('{lib}util/gesture/tap.js',
      ['{lib}util/gesture/gesture.js'],f);