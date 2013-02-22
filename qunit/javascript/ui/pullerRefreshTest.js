var f = function(){
    //定义测试模块
    module("ui-pullerRefresh");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');
        
    //开始单元测试
    test('pullerRefresh',function(){
        expect(0);
        var _pullerRefresh = _p._$$PullRefresh._$allocate({
            parent:'pullerRefresh-box'
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}pullerRefreshTest.js',['{lib}ui/pullrefresh/pullrefresh.js','{pro}log.js'],f);
});