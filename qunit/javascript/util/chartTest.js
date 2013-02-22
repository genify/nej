var f = function(){
    //定义测试模块
    module("chart");
    var p = NEJ.P('nej.u'),
        e = NEJ.P('nej.e'),
		v = NEJ.P('nej.v');
    
    //开始单元测试
    test('chart', function() {
        var _box = e._$get('box');
		v._$addEvent(_box,'click',function(){
			ok(true,'触发click事件')
		})
        var _obj = {
                 width:500,
                 height:500,
                 box:_box,
                 data:{
				 	type: 'line',
                        title: 'title',
                        xAxis: 'datetime',
                        series:[{data: 1350878400000, t1: 41.71}, {data: 1350878400000, t1: 42.9}],
                        style: {
                            showDataTips: true,
                            title: {
                                autoSize: 'center',
                                size: 16
                            },
                            subtitle: {
                                autoSize: 'center',
                                size: 14
                            },
                            xAxis: {
                                format: 'YYYY-MM-DD JJ:NN',
                                autoFormat: true
                            },
                            graphic: {
                                radius: 3,
                                line: {color:[0x1e90ff,0xd6300f,0x2b59c3,0xd8814,0x8b008b],
                                       weidht:2,
                                       alpha:0.6,
                                       curve:false}
                            }
                        }
				 }
        }
        e._$drawChart(_box,_obj);
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}chartTest.js',
    ['{lib}util/chart/chart.js','{pro}log.js'],f);
});
