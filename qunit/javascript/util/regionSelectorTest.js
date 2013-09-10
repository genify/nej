var f = function(){
    //定义测试模块
    module("regionSelector");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
    
    test('regionSelector test',function(){
        expect(0);
        var _rsr = _p._$$RegionSelector._$allocate({
			province:'a',
			city:'b',
			area:'c',
			data:{province:'浙江省',city:'杭州市',area:'滨江区'},
			onchange:function(_type){
			}
		});
		_rsr._$setRegion({province:'浙江省',city:'杭州市',area:'下城区'})
    });
    //开始单元测试
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}regionSelectorTest.js',
    ['{lib}util/data/region/zh.js','{lib}util/region/region.zh.js','{pro}log.js'],f);
});
  