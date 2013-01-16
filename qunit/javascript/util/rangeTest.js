var f = function(){
    //定义测试模块
    module("range");
    var p = NEJ.P('nej.ut'),
        e = NEJ.P('nej.e');
    //开始单元测试
	test('range',function(){
		stop();
		var _box2  = e._$get('box2');
		var _rg = p._$$Range._$allocate({
			body:_box2,
			onchange:function(_event){
				ok(true,'选择区域');
			},
			onbeforechange:function(_event){
            },
			onafterchange:function(_event){
				ok(true,'区域选择完毕');
				start();
            }
		});
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}util/rangeTest.js',['{lib}util/range/range.js','{pro}log.js'],f);
});
  