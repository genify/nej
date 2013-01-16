var f = function(){
	//定义测试模块
	module("tap");
	//开始单元测试
	test('tap，测试4个事件，请双击',function(){
		var _box = document.getElementById('id-box');
		stop();
		var _cbf = function(_event){
			ok(true,'触发tap事件'+'tpye='+_event.type);
			start();
		}
		stop();
		var _cbf2 = function(_event){
			ok(true,'触发taphold事件'+'tpye='+_event.type);
			start();
		}
//		stop();
//		var _cbf3 = function(_event){
//			ok(true,'触发doubletap事件'+'tpye='+_event.type);
//			start();
//		}
		stop();
		var _cbf4 = function(_event){
			ok(true,'触发tapcancel事件'+'tpye='+_event.type);
			start();
		}
		nej.v._$addEvent(_box,'tap',_cbf);
		nej.v._$addEvent(_box,'taphold',_cbf2);
//		nej.v._$addEvent(_box,'doubletap',_cbf3);
		nej.v._$addEvent(_box,'tapcancel',_cbf4);
	});
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}tapTest.js',['{lib}util/gesture/tap.js','{pro}log.js'],f);
});