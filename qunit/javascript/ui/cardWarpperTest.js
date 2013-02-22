var f = function(){
    //定义测试模块
    module("ui-cardWarpper");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui'),
        _v = _('nej.v');
        
    //开始单元测试
    test('cardWarpper',function(){
        expect(0);
        var _myCard = _p._$$MyCard._$allocate({
            parent:'cardWarpper-box'
        });
    });
    
    test('cardWarpper-attach-top-left',function(){
        stop();
        var _node = 'cardWarpper-box';
        var _options = {
            delta: {
                top: 10,
                left: 10
            },
            align: 'top left',
            fitable: true,
            parent:document.body
        }
        _p._$$MyCard._$attach(_node,_options);
        _v._$dispatchEvent(_node,'click');
        ok(true,'top:10,left:10');
        start();
    });
    
    test('cardWarpper-attach-top-right',function(){
        stop();
        var _node = 'cardWarpper-box';
        var _options = {
            delta: {
                top: 10,
                right: 10
            },
            align: 'top right',
            fitable: true,
            parent:document.body
        }
        _p._$$MyCard._$attach(_node,_options);
        _v._$dispatchEvent(_node,'click');
        ok(true,'top:10,right:10');
        start();
    });
    
    test('cardWarpper-attach-bottom-left',function(){
        stop();
        var _node = 'cardWarpper-box';
        var _options = {
            delta: {
                bottm: 10,
                left: 10
            },
            align: 'bottom left',
            fitable: true,
            parent:document.body
        }
        _p._$$MyCard._$attach(_node,_options);
        _v._$dispatchEvent(_node,'click');
        ok(true,'bottom:10,left:10');
        start();
    });
    
    test('cardWarpper-attach-bottom-right',function(){
        stop();
        var _node = 'cardWarpper-box';
        var _options = {
            delta: {
                bottm: 10,
                right: 10
            },
            align: 'bottom right',
            fitable: true,
            parent:document.body
        }
        _p._$$MyCard._$attach(_node,_options);
        _v._$dispatchEvent(_node,'click');
        ok(true,'bottom:10,right:10');
        start();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}uiCardWarpperTest.js',['{pro}ui/mycard.js','{pro}log.js'],f);
});