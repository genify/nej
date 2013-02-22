/*
 * ------------------------------------------
 * 垂直滑动器逻辑封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _p = NEJ.P('nej.ut'),
        _proSliderY;
    if (!!_p._$$SliderY) return;
    /**
     * 水平滑动器逻辑封装<br />
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
     *   var _sd = _p._$$SliderY._$allocate({
     *       range:{y:[0,100]},
     *       slide:'slide',
     *       track:'track',
     *       onchange:function(_obj){
     *           _e._$style(_e._$get('slide'),{left:_obj.x.value});
     *       }
     *   });
     * [/code]
     * @class   {nej.ut._$$SliderY} 水平滑动器逻辑封装
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
    _p._$$SliderY = NEJ.C();
      _proSliderY = _p._$$SliderY._$extend(_p._$$Slider);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proSliderY.__init = function(){
        this.__supInit();
        this.__dopt.direction = 2;
    };
};
NEJ.define('{lib}util/slider/slider.y.js',
      ['{lib}util/slider/slider.js'],f);