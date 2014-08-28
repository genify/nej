var f = function(){
    //定义测试模块
    module("platform");
    var _p = NEJ.P('nej.p');

    //开始单元测试
    test('NEJ配置文件测试', function() {
    	var _isWindows = _p._$is('desktop');
        equal(_isWindows,true,'判断是否指定平台');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}platform.test.js',
    ['{lib}base/platform.js'],f);
});
