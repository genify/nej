/**
 * ------------------------------------------
 * 拖拽事件对象实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _v = _('nej.v'),
        _p = _('nej.ut.g'),
        _proDrag;
    if (!!_p._$$Drag) return;
    /**
     * 拖拽事件实现对象，支持以下手势事件
     * [ntb]
     *   dragbegin     | 开始拖拽
     *   dragging      | 拖拽过程
     *   dragcomplete  | 结束拖拽
     * [/ntb]
     * 
     * @class   {nej.ut.g._$$Drag}
     * @extends {nej.ut.g._$$Gesture}
     * 
     * 
     * 
     * 
     */
    _p._$$Drag = NEJ.C();
      _proDrag = _p._$$Drag._$extend(_p._$$Gesture),
    /**
     * 控件初始化
     * @return {Void}
     */
    _proDrag.__init = function(){
        this.__supInit();
        this.__drag_distance = 2;
    };
    /**
     * 取拖放标识
     * @return {Number} 拖放标识
     *                  0 - 无拖放事件
     *                  1 - 水平拖放事件
     *                  2 - 垂直拖放事件
     *                  3 - 水平+垂直拖放事件
     */
    _proDrag.__getDragFlag = function(_dx,_dy){
        var _xflag = 0,
            _yflag = 0;
        if (Math.abs(_dx)>=this.__drag_distance)
            _xflag = 1;
        if (Math.abs(_dy)>=this.__drag_distance)
            _yflag = 2;
        return _xflag+_yflag;
    };
    
    /**
     * 执行开始触摸业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proDrag.__doTouchStart = function(_touch,_event){
        _touch = _touch[0];
        this.__pagex = _v._$pageX(_touch);
        this.__pagey = _v._$pageY(_touch);
        this.__movex = _v._$pageX(_touch);
        this.__movey = _v._$pageY(_touch);
    };
    /**
     * 执行触摸移动业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proDrag.__doTouchMove = function(_touch,_event){
        _touch = _touch[0];
        var _o = this.__getDetal(_touch);
        if(!this.__dragstart&&_o.direction!=0){
            this.__doDispatchEvent('dragbegin',_touch,_o);
            this.__dragstart = !0;
               return;    
        }
        if(!this.__dragstart) return;
        this.__doDispatchEvent('dragging',_touch,_o);
    };
    /**
     * 执行触摸结束业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proDrag.__doTouchEnd = function(_touch,_event){
        if(!this.__dragstart) return;
        _touch = _touch[0];
        var _o = this.__getDetal(_touch)
        this.__doDispatchEvent('dragcomplete',_touch,_o);
        this.__dragstart = !1;
    };
    /**
     * 执行开始触摸业务逻辑
     * @param  {Touch} 触点信息
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proDrag.__doTouchCancel = function(_touch,_event){
        this.__doTouchEnd.apply(this,arguments);
    };
    /**
     * 计算移动距离和移动的总距离
     */
    _proDrag.__getDetal = function(_touch){
        if(!_touch) return;
        var _o = {};
        var _dx = _v._$pageX(_touch)-this.__pagex,
            _dy = _v._$pageY(_touch)-this.__pagey,
            _mx = _v._$pageX(_touch)-this.__movex,
            _my = _v._$pageY(_touch)-this.__movey;
        this.__pagex = _v._$pageX(_touch);
        this.__pagey = _v._$pageY(_touch);
        _o.detalX = _dx;
        _o.detalY = _dy;
        _o.moveX = _mx;
        _o.moveY = _my;
        _o.direction = this.__getDragFlag(_dx,_dy);
        return _o;
    };
    // instance
    _p._$$Drag._$allocate();
};
define('{lib}util/gesture/drag.js',
      ['{lib}util/gesture/gesture.js'],f);