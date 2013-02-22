var f = function(){
	//定义测试模块
	module("swipe");
	//开始单元测试
	test('swipe',function(){
		var _box = document.getElementById('id-box');
		stop();
		var _swiping = function(_touch){
			var _t = _touch;
			ok(true,'方向：'+_t.direction+'距离：'+_t.distance);
			start();
		}
		nej.v._$addEvent(_box,'swipe',_swiping);
	});
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}swipeTest.js',['{lib}util/gesture/swipe.js','{pro}log.js'],f);
});