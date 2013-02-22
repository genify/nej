var f = function(){
	//定义测试模块
	module("arrow");
	var _  = NEJ.P,
		_e = _('nej.e');
		
		
	//开始单元测试
	test('arrowX',function(){
		expect(0);
		var _arrowX = nej.ui._$$ArrowsX._$allocate({
			parent:_e._$get('arrow-box'),
			direction:1
		})
	});
	
	//开始单元测试
	test('arrowY',function(){
		expect(0);
		var _arrowY = nej.ui._$$ArrowsY._$allocate({
			parent:_e._$get('arrow-box'),
			direction:-1
		})
	});
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}arrowTest.js',['{lib}ui/arrows/arrows.x.js','{lib}ui/arrows/arrows.y.js'],f);
});