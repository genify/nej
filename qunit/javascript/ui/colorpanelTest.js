var f = function(){
	//定义测试模块
	module("colorpanel");
	var _  = NEJ.P,
		_e = _('nej.e'),
		_p = _('nej.ui');
		
		
	//开始单元测试
	// test('colorpanel',function(){
	// 	stop();
	// 	var _cp = _p._$$ColorPanel._$allocate({
	// 		parent:'colorpanel-box',
	// 		onchange:function(_color){
	// 			ok(true,'设置的颜色为：' + _color);
	// 			start();
	// 		}
	// 	});
	// });
	
	test('colorpick',function(){
		stop();
        var _cp = _p._$$ColorPick._$allocate({
			parent:'colorpanel-box2',
            onchange:function(_color){
                // ok(true,'设置的颜色为：' + _color);
            },
			onselect:function(_color){
				// ok(true,'最后设置的颜色为：' + _color);
				start();
			}
        });
		_cp._$setColor('#00ff00');
	});
	
	
	
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}colorpanelTest.js',['{lib}ui/colorpick/colorpick.js'],f);
});