/*
 * ------------------------------------------
 * 水平垂直滑动器逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/slider/xy */
NEJ.define([
    'base/global',
    'base/klass',
    'util/slider/slider'
],function(NEJ,_k,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 水平垂直滑动器逻辑封装
     *
     * 样式举例
     * ```css
     * #slide{position:absolute;top:0;height:20px;line-height:20px;width:20px;background:green;}
     * #track{position:relative;height:500px;width:100%;background:pink;}
     * ```
     * 
     * 结构举例
     * ```html
     * <div id="track">
     *   <div id="slide"></div>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/slider/xy'
     * ],function(_t){
     *     var _slider = _t._$$SliderXY._$allocate({
     *         range:{x:[0,100],y:[0,500]},
     *         slide:'slide',
     *         track:'track',
     *         onchange:function(_event){
     *             _e._$style('slide',{
     *                 top:_event.y.value+'px',
     *                 left:_event.x.value+'px'
     *             });
     *         }
     *     });
     * });
     * ```
     * @class    module:util/slider/xy._$$SliderXY
     * @extends  module:util/slider/slider._$$Slider
     * @param    {Object}      config - 轨可选配置参数
     * @property {Object}      range  - 滑动范围，默认为滑块可运动范围，如{x:[0,100],y:[0,1000]}
     * @property {String|Node} thumb  - 滑块节点
     * @property {String|Node} track  - 滑动道节点
     */
    _p._$$SliderXY = _k._$klass();
    _pro = _p._$$SliderXY._$extend(_t._$$Slider);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/slider/xy._$$SliderXY#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__dopt.direction = 0;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});