/*
 * ------------------------------------------
 * 水平垂直滑动器逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/slider/slider.js'
],function(NEJ,_k,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 水平垂直滑动器逻辑封装<br />
     * 页面结构举例
     * [code type="html"]
     *   <style type="text/css">
     *       #slide{position:absolute;top:0;height:20px;line-height:20px;width:20px;background:green;}
     *       #track{position:relative;height:20px;line-height:20px;width:100%;background:pink;}
     *   </style>
     *   <div id="track"><div id="slide"></div></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _sd = _p._$$SliderXY._$allocate({
     *       range:{x:[0,100],y:[0,0]},
     *       slide:'slide',
     *       track:'track',
     *       onchange:function(_obj){
     *           _e._$style(_e._$get('slide'),{left:_obj.x.value});
     *       }
     *   });
     * [/code]
     * @class   {nej.ut._$$SliderXY} 水平垂直滑动器逻辑封装
     * @extends {nej.ut._$$Slider}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Object}       range 滑动范围，默认为滑块可运动范围，如{x:[0,100],y:[0,1000]}
     * @config  {String|Node} slide 滑动节点
     * @config  {String|Node} track 滑动轨道节点
     *
     * [hr]
     *
     * @event  {onchange} 滑动触发事件，输入格式如{x:{rate:0.4,value:40},y:{rate:0.5,value:50}}
     * @config {Boolean} stopped 是否停止
     * @config {Object}  x          {rate:0.4,value:40}
     * @config {Object}  y          {rate:0.5,value:50}
     *
     */
    _p._$$SliderXY = _k._$klass();
    _pro = _p._$$SliderXY._$extend(_t._$$Slider);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
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