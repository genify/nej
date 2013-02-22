var f = function(){
	//定义测试模块
	module("darg");
	//开始单元测试
	test('drag',function(){
		var _box = document.getElementById('id-box');
		var v = NEJ.P('nej.v');
		var _i = 0,_i1 = 0,_i2 = 0;
		stop();
		var checkI = function(){
			var _b0 = _i > 0;
			var _b1 = _i1 > 0;
			var _b2 = _i2 > 0;
			ok(_b0,'dragbegin被触发'+_i+'次');
			ok(_b1,'drag被触发'+_i1+'次');
			ok(_b2,'dragcomplete被触发'+_i2+'次');
			start();
		}
		var dragbegin = function(_event){
			_i++;
		}
		var drag = function(_event){
			var _px = _event['dx'];
			_box.style.left = _px + 'px';
			_i1++;
		}
		var dragcomplete = function(_event){
			_i2++;
			checkI();
		}
		v._$addEvent(_box,'dragbegin',dragbegin);
		v._$addEvent(_box,'dragging',drag);
		v._$addEvent(_box,'dragcomplete',dragcomplete);
	});
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}dargTest.js',['{lib}util/gesture/drag.js','{pro}log.js'],f);
});