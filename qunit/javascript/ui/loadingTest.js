var f = function(){
    //定义测试模块
    module("ui-loading");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');
        
    //开始单元测试
    test('loading',function(){
        expect(0);
        var _loading = _p._$$Loading._$allocate({
            parent:'loading-box'
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}loadingTest.js',['{lib}ui/loading/loading.js','{pro}log.js'],f);
});