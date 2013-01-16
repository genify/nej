var f = function(){
    //定义测试模块
    module("waterfallTest");
    
	var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
	
	test('waterfallTest',function(){
		expect(0);
        _e._$parseTemplate('template-box');
        var _wf = _p._$$ListModuleWF._$allocate({
            limit:9,
            parent:'list-box',
            more:'more-btn',
            item:'jst-list',
            cache:{
                klass:_p._$$CacheListCustom
            }
        });
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}waterfallTest.js',
    ['{lib}util/list/module.waterfall.js','{pro}util/cache.list.custom.js','{pro}log.js'],f);
});
  