/*
 * ------------------------------------------
 * 先慢后快再慢动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _p = NEJ.P('nej.ut'),
        _proAnimEaseInOut;
    if (!!_p._$$AnimEaseInOut) return;
    /**
     * 先慢后快再慢动画<br/>
     * 页面结构举例
     * [code type="html"]
     *   <div id='id-bounce1'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _box = document.getElementById('id-bounce1'),_easeinout;
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
     *           _easeinout = nej.ut._$$AnimEaseInOut._$recycle(_easeinout);
     *       }
     *   }
     *   // 创建减速动画实例
     *   _easeinout  = nej.ut._$$AnimEaseInOut._$allocate(options);
     *   // 开始动画
     *   _easeinout._$play();
     * [/code]
     * @class   {nej.ut._$$AnimEaseInOut} 先慢后快再慢动画
     * @extends {nej.ut._$$AnimBezier}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} timing   时间函数，easeinout
     */
    _p._$$AnimEaseInOut = NEJ.C();
      _proAnimEaseInOut = _p._$$AnimEaseInOut._$extend(_p._$$AnimBezier);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {String} timing   时间函数，easeinout
     * @return {Void}
     */
    _proAnimEaseInOut.__reset = function(_options){
        _options = NEJ.X({},_options);
        _options.timing = 'easeinout';
        this.__supReset(_options);
    };
};
define('{lib}util/animation/easeinout.js',
      ['{lib}util/animation/bezier.js'],f)