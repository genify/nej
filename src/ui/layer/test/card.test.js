var f = function(){
    //定义测试模块
    module("ui-card");

    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');

    //开始单元测试
    test('card',function(){
        stop();
        var _card = _p._$$Card._$allocate({
            parent:'card-box',
            top:10,
            left:10,
            destroyable:true,
            content:'<div>请点击一下页面，完成卡片的回收</div>',
            oncontentready:function(_html){
                ok(true,'设置卡片内容成功');
            },
            onbeforerecycle:function(){
                ok(true,'destroyable属性决定回收前是否触发');
                start();
            }
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}card.test.js',['ui/layer/card'],f);
});