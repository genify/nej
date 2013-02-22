var f = function(){
    //定义测试模块
    module("platform");
    var p = NEJ.P('nej.p');
    
    //开始单元测试
    test('平台信息判断', function() {
        stop();
        ok(true,'是否win系统' + p._$IS.win);
        start();
    });
    
    test('内核信息', function() {
        stop();
        ok(true,'平台:'+p._$IS.win);
        ok(true,' engine: '+p._$KERNEL.engine);
        ok(true,' release: '+p._$KERNEL.release);
        ok(true,' prefix.css: '+p._$KERNEL.prefix.css);
        start();
    });
    
    test('是否需要平台补丁判断信息', function() {
        stop();
        ok(true,'gecko:'+p._$NOT_PATCH.gecko);
        ok(true,'webkit:'+p._$NOT_PATCH.webkit);
        ok(true,'presto:'+p._$NOT_PATCH.presto);
        ok(true,'trident:'+p._$NOT_PATCH.trident);
        ok(true,'trident1:'+p._$NOT_PATCH.trident1);
        ok(true,'trident2:'+p._$NOT_PATCH.trident2);
        start();
    });
    
    test('引擎属性支持信息', function() {
        stop();
        ok(true,'支持touch:'+p._$SUPPORT.touch);
//        ok(true,'支持css3d:'+p._$SUPPORT.css3d);
        start();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}platformTest.js',
    ['{lib}base/platform.js','{pro}log.js'],f);
});
