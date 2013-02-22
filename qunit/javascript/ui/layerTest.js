var f = function(){
    //定义测试模块
    module("layer");
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');
        
    //开始单元测试
    test('layer',function(){
		stop();
        var _ly = _p._$$MyLayerCard._$allocate({
			parent:document.body,
            destroyable:false,
            oncontentready:function(_html){
                ok(true,'设置卡片内容成功');
				start();
            }
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}layerTest.js',['{pro}ui/mylayercard.js','{pro}log.js'],f);
});