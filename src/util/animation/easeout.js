/*
 * ------------------------------------------
 * 先快后慢动画实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    '{lib}util/animation/bezier.js'
],function(NEJ,_k,_u,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
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
     * @param   {Object} 可选配置参数
     * @config  {String} timing   时间函数，easeout
     */
    _p._$$AnimEaseOut = _k._$klass();
    _pro = _p._$$AnimEaseOut._$extend(_t0._$$AnimBezier);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @config {String} timing   时间函数，easeout
     * @return {Void}
     */
    _pro.__reset = function(_options){
        _options = _u._$merge({},_options);
        _options.timing = 'easeout';
        this.__super(_options);
    };
});