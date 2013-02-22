var f = function(){
    //定义测试模块
    module("module.pager");
    
	var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
	
	test('module.pager test',function(){
		expect(0);
        _e._$parseTemplate('jst-list');
		var _lmgp = _p._$$ListModulePG._$allocate({
     		item:'jst-list',
            parent:'list-box',
            pager:{parent:'pager-box'},
     		cache:{
     			key:'name',
                klass:_p._$$CacheListCustom
     		}
		});
	});
    //开始单元测试
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}module.pager.test.js',
    ['{lib}util/list/module.pager.js','{pro}util/cache.list.custom.js','{pro}log.js'],f);
});
  