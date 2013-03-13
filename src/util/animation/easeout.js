/*
 * ------------------------------------------
 * 先快后慢动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _p = NEJ.P('nej.ut'),
        _proAnimEaseOut;
    if (!!_p._$$AnimEaseOut) return;
    /**
     * 先快后慢动画<br/>
     * 页面结构举例
     * [code type="html"]
     *   <div id='id-bounce1'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _box = document.getElementById('id-bounce1'),_easeout;
     *   var options = {
     *       from:{
     *           offset: 100,
     *           velocity: 10
     *       },
     *       to:{
     *           offset:200
     *       },
     *       duration:1000,
     *       onupdate: function(offset){
     *           _box.style.left = offset.offset + 'px';
     *       },
     *       onstop: function(){
     *           _easeout = nej.ut._$$AnimEaseOut._$recycle(_easeout);
     *       }
     *   }
     *   // 创建减速动画实例
     *   _easeout  = nej.ut._$$AnimEaseOut._$allocate(options);
     *   // 开始动画
     *   _easeout._$play();
     * [/code]
     * @class   {nej.ut._$$AnimEaseOut} 先快后慢动画
     * @extends {nej.ut._$$AnimBezier}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} timing   时间函数，easeout
     */
    _p._$$AnimEaseOut = NEJ.C();
      _proAnimEaseOut = _p._$$AnimEaseOut._$extend(_p._$$AnimBezier);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {String} timing   时间函数，easeout
     * @return {Void}
     */
    _proAnimEaseOut.__reset = function(_options){
        _options = NEJ.X({},_options);
        _options.timing = 'easeout';
        this.__supReset(_options);
    };
};
NEJ.define('{lib}util/animation/easeout.js',
      ['{lib}util/animation/bezier.js'],f)