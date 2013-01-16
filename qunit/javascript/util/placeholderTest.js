var f = function(){
    //定义测试模块
    module("placeholder");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
    
	test('placeholder',function(){
		_e._$placeholder('placeholder1','zw');
		_e._$placeholder('placeholder2','zw');
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}placeholderTest.js',
    ['{lib}util/placeholder/placeholder.js','{pro}log.js'],f);
});
  