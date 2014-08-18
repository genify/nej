/*
 * ------------------------------------------
 * 先慢后快动画实现文件
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
     * 先慢后快动画<br/>
     * 页面结构举例
     * ```html
     *   <div id='id-bounce1'></div>
     * ```
     * 脚本举例
     * ```javascript
     *   var _box = document.getElementById('id-bounce1'),_easein;
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
     *           _easein = nej.ut._$$AnimEaseIn._$recycle(_easein);
     *       }
     *   }
     *   // 创建减速动画实例
     *   _easein  = nej.ut._$$AnimEaseIn._$allocate(options);
     *   // 开始动画
     *   _easein._$play();
     * ```
     * @class   {nej.ut._$$AnimEaseIn} 先慢后快动画
     * @extends {nej.ut._$$AnimBezier}
     * @param   {Object} 可选配置参数
     * @property  {String} timing   时间函数，easein
     */
    _p._$$AnimEaseIn = _k._$klass();
    _pro = _p._$$AnimEaseIn._$extend(_t0._$$AnimBezier);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} _options 可选配置参数
     * @property {String} timing   时间函数，easein
     * @return {Void}
     */
    _pro.__reset = function(_options){
        _options = _u._$merge({},_options);
        _options.timing = 'easein';
        this.__super(_options);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});