/**
 * ------------------------------------------
 * 挤捏事件对象实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _v = _('nej.v'),
        _p = _('nej.ut.g'),
        __proPinch;
    if (!!_p._$$Pinch) return;
    /**
     * 挤捏事件实现对象，事件对象可用信息
     * [ntb]
     *  distance  [Number] - 两个触点之间的距离
     *  center    [Object] - 两个触点中心坐标{x:123,y:456}
     *  scale     [Float]  - 两个触点相对于最初的缩放比例
     * [/ntb] 
     * @class   {nej.ut.g._$$Pinch} 挤捏事件实现对象
     * @extends {nej.ut.g._$$Gesture}
     */
    _p._$$Pinch = NEJ.C();
    __proPinch = _p._$$Pinch._$extend(_p._$$Gesture);
    __supPinch = _p._$$Pinch._$supro;
    /**
     * 初始化控件
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proPinch.__init = function(_options){
        this.__supInit(_options);
        this.__number = 2;
    };
    /**
     * 解析触点信息
     * @return {Void}
     */
    __proPinch.__doParseTouchInfo = function(_touch1,_touch2){
        var _x1 = _v._$pageX(_touch1),
            _y1 = _v._$pageY(_touch1),
            _x2 = _v._$pageX(_touch2),
            _y2 = _v._$pageY(_touch2);
        this.__pincher = {};
        this.__pincher.distance = Math.sqrt(
            Math.pow(Math.abs(_x2-_x1),2)+
            Math.pow(Math.abs(_y2-_y1),2)
        );
        this.__pincher.center = {x:(_x1+_x2)/2,y:(_y1+_y2)/2};
        if (!this.__distance){
            this.__distance = this.__pincher.distance;
        }
        this.__pincher.scale = this.__pincher.distance/this.__distance;
    };
    /**
     * 开始触摸事件
     * @param  {Object} _options 事件相关信息
     * @return {Void}
     */
    __proPinch.__doTouchStart = function(_touches,_event){
        this.__pinching = !0;
        this.__target = _v._$getElement(_touches[0]);
        this.__doParseTouchInfo(_touches[0],_touches[1]);
        this.__doDispatchEvent('pinchstart',_touches[0]);
    };
    /**
     * 触点移动事件
     * @param  {Object} _options 事件相关信息
     * @return {Void}
     */
    __proPinch.__doTouchMove = function(_touches,_event){
        if (this.__pinching){
            this.__doParseTouchInfo(_touches[0],_touches[1]);
            this.__doDispatchEvent('pinch',_touches[0],this.__pincher);
        }
    };
    /**
     * 结束触摸事件
     * @param  {Object} _options 事件相关信息
     * @return {Void}
     */
    __proPinch.__doTouchEnd = function(_touches,_event){
        if (this.__pinching){
            this.__pinching = !1;
            delete this.__distance;
            _touches[0].target = this.__target;
            this.__doDispatchEvent('pinchend',_touches[0],this.__pincher);
        }
    };
    
    // instance
    _p._$$Pinch._$allocate();
};
NEJ.define('{lib}util/gesture/pinch.js',
      ['{lib}base/event.js','{lib}util/gesture/gesture.js'],f);