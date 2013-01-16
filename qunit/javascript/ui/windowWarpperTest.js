var f = function(){
    //定义测试模块
    module("ui-windowWarpper");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui'),
        _v = _('nej.v');
        
    //开始单元测试
    test('windowWarpper',function(){
        stop();
        var _myCard = _p._$$MyWindow._$allocate({
            parent:document.body,
            title:'窗口标题',
            draggable:false,
            mask:true,
            onclose:function(){
                ok(true,'成功关闭浮层');
                start();
            }
        });
    });
    
//    test('windowWarpper-2',function(){
//        stop();
//        var _myCard = _p._$$MyWindow._$allocate({
//            parent:document.body,
//            title:'窗口标题2',
//            draggable:true,
//            mask:true,
//            onclose:function(){
//                ok(true,'成功关闭浮层');
//                start();
//            }
//        });
//    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}uiWindowWarpperTest.js',['{pro}ui/mywindow.js','{pro}log.js'],f);
});