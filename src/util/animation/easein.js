/*
 * ------------------------------------------
 * 先慢后快动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _p = NEJ.P('nej.ut'),
        _proAnimEaseIn;
    if (!!_p._$$AnimEaseIn) return;
    /**
     * 先慢后快动画<br/>
     * 页面结构举例
     * [code type="html"]
     *   <div id='id-bounce1'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _box = document.getElementById('id-bounce1'),_easein;
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
     *           _easein = nej.ut._$$AnimEaseIn._$recycle(_easein);
     *       }
     *   }
     *   // 创建减速动画实例
     *   _easein  = nej.ut._$$AnimEaseIn._$allocate(options);
     *   // 开始动画
     *   _easein._$play();
     * [/code]
     * @class   {nej.ut._$$AnimEaseIn} 先慢后快动画
     * @extends {nej.ut._$$AnimBezier}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} timing   时间函数，easein
     */
    _p._$$AnimEaseIn = NEJ.C();
      _proAnimEaseIn = _p._$$AnimEaseIn._$extend(_p._$$AnimBezier);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} _options 可选配置参数
     * @config {String} timing   时间函数，easein
     * @return {Void}
     */
    _proAnimEaseIn.__reset = function(_options){
        _options = NEJ.X({},_options);
        _options.timing = 'easein';
        this.__supReset(_options);
    };
};
define('{lib}util/animation/easein.js',
      ['{lib}util/animation/bezier.js'],f)