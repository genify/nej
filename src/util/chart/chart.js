/*
 * 图表实现文件
 * @author cheng-lin(cheng-lin@corp.netease.com)
 * @version 1.0
 */
/** @module util/chart/chart */
NEJ.define([
    'base/global',
    'base/config',
    'base/element',
    'util/flash/flash',
    'base/chain'
],function(NEJ,_c,_e,_t0,_x,_p,_o,_f,_r){
    /**
     * 绘制图表对象
     *
     * 页面结构举例
     * ```html
     * <div id='box'></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/chart/chart'
     * ],function(_t0,_p,_o,_f,_r){
     *     _t0._$drawChart('box',{data:{}})
     * });
     * ```
     *
     * @method   module:util/chart/chart._$drawChart
     * @param    {String|Node} box     - 图表父节点
     * @param    {Object}      options - 可配置参数
     * @property {Object}      data    - 生成图表需要的数据
     * @return   {Void}
     */
    /**
     * @method CHAINABLE._$request
     * @see module:util/chart/chart._$request
     */
    _p._$drawChart = function(_box,_options){
        _box = _e._$get(_box)||_o;
        _t0._$flash({
            parent:_box,
            width:_options.width||'100%',
            height:_options.height||'100%',
            src:_c._$get('chart.swf'),
            params:{wmode:'transparent'},
            onready:function(_flash){
                _flash.initChart(_options.data);
            }._$bind(this)
        });
    };
    // for chainable method
    _x._$merge(_p);

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});
