var f = function(){
    //定义测试模块
    module("ui-loadmore");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');
        
    //开始单元测试
    test('loadmore',function(){
        stop();
        var _loadmore = _p._$$LoadMore._$allocate({
            parent:'loadmore-box',
            loadstyle:'load-style',
            onloadmore:function(){
                ok(true,'触发加载数据');
                start();
            }
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}loadmoreTest.js',['{lib}ui/loadmore/loadmore.js','{pro}log.js'],f);
});