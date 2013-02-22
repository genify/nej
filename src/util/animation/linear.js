/*
 * ------------------------------------------
 * 线性动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _p = NEJ.P('nej.ut'),
        _proAnimLinear;
    if (!!_p._$$AnimLinear) return;
    /**
     * 线性动画<br/>
     * 页面结构举例
     * [code type="html"]
     *   <div id='id-bounce1'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _box = document.getElementById('id-bounce1'),_linear;
     *   var options = {
     *       from:{
     *           offset: 100,
     *           velocity: 10
     *       },
     *       to{
     *           offset:200
     *       },
     *       duration:1000,
     *       onupdate: function(offset){
     *           _box.style.left = offset.offset + 'px';
     *       },
     *       onstop: function(){
     *           _linear = nej.ut._$$AnimLinear._$recycle(_linear);
     *       }
     *   }
     *   // 创建减速动画实例
     *   _linear  = nej.ut._$$AnimLinear._$allocate(options);
     *   // 开始动画
     *   _linear._$play();
     * [/code]
     * @class   {nej.ut._$$AnimLinear} 线性动画
     * @extends {nej.ut._$$AnimBezier}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} timing   时间函数，linear
     */
    _p._$$AnimLinear = NEJ.C();
      _proAnimLinear = _p._$$AnimLinear._$extend(_p._$$AnimBezier);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {String} timing   时间函数，linear
     * @return {Void}
     */
    _proAnimLinear.__reset = function(_options){
        _options = NEJ.X({},_options);
        _options.timing = 'linear';
        this.__supReset(_options);
    };
};
NEJ.define('{lib}util/animation/linear.js',
      ['{lib}util/animation/bezier.js'],f)