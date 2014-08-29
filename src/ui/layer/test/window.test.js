var f = function(){
    //定义测试模块
    module("ui-window");

    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');

    //开始单元测试
    test('window',function(){
        stop();
        var _window = _p._$$Window._$allocate({
            parent:document.body,
            title:'弹出框标题',
            align:'left middle',
            draggable:true,
            onclose:function(){
                ok(true,'成功关闭窗口');
                start();
            }
        });
        _window._$show();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}window.test.js',['ui/layer/window'],f);
});