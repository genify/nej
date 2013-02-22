var f = function(){
    //定义测试模块
    module("ui-puller");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');
        
    //开始单元测试
    test('puller',function(){
        expect(0);
        var _puller = _p._$$Puller._$allocate({
            parent:'puller-box',
            onrefresh:function(){}
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}pullerTest.js',['{lib}ui/pullrefresh/puller.js','{pro}log.js'],f);
});