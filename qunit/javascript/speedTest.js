var f = function(){
    //定义测试模块
    module('util');
    var _util = NEJ.P('nej.u');
    //开始单元测试
    test('speed',function(){
        for(var i = 10; i >0 ;i--)
            equal(1,1,'equal');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}speedTest.js',
          ['{pro}log.js'],f);
});


