/*
 * 图表实现文件
 * @author cheng-lin(cheng-lin@corp.netease.com)
 * @version 1.0 
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _o = NEJ.O,
        _c = _('nej.c'),
        _e = _('nej.e');
        
    /*
     * 用flash绘制图表
     */
    var _drawFlashChart = function(_box,_options){
        _box = _e._$get(_box)||_o;
        _e._$flash({
            parent:_box,
            width:_options.width||'100%',height:_options.height||'100%',
            src:_c._$get('chart.swf'),
            params:{wmode:'transparent'},
            onready:function(_flash){
                _flash.initChart(_options.data);
            }._$bind(this)
        });
    };
    /**
     * 绘制图表对象<br/>
     * 页面结构举例
     * [code type="html"]
     *   <div id='box'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P('nej.e');
     *   _e._$drawChart('box',{data:{}})
     * [/code]
     * @api    {nej.e._$drawChart}
     * @param  {String|Node}  图表父节点
     * @param  {Object} 可配置参数
     * @config {Object}       data 生成图表需要的数据
     * @return {nej.e}
     */
    _e._$drawChart = function(_box,_options){
        _drawFlashChart(_box,_options);
        return this;
    };
};

NEJ.define('{lib}util/chart/chart.js',['{patch}config.js','{lib}base/event.js','{lib}util/flash/flash.js'],f);
