var f = function(){
    //定义测试模块
    module("customEvent");
    
    //开始单元测试
    test('自定义事件',function(){
        var p = NEJ.P('nej.ut');
        var _box = document.getElementById('id-box');
        var _i = 0;
        var f = function(){_i++;}
        var ce = nej.ut._$$CustomEvent._$allocate({
            element: _box,
            event: 'increase',
            onint: function(){
            },
            ondispatch: f
        });
        nej.v._$addEvent(_box,'increase',f)
        _box.onincrease();
        equal(_i,2,'_i被加了两次');
    });
    
    test('自定义事件,回收，重新创建',function(){
        var p = NEJ.P('nej.ut');
        var _box = document.getElementById('id-box');
        var _i = 0;
        var f = function(){_i++;}
        var ce = nej.ut._$$CustomEvent._$allocate({
            element: _box,
            event: 'increase',
            onint: function(){
            },
            ondispatch: f
        });
        _box.onincrease();
        equal(_i,1,'_i被加了一次');
        ce = nej.ut._$$CustomEvent._$recycle(ce);
        var f2 = function(){_i--;}
        ce = nej.ut._$$CustomEvent._$allocate({
            element: _box,
            event: 'increase2',
            onint: function(){
            },
            ondispatch: f2
        });
        _box.onincrease2();
        equal(_i,0,'_i被减了一次');
    });
    
    test('删除自定义的事件',function(){
        expect(0);
    });
    
//        test('自定义事件,',function(){
//            var p = NEJ.P('nej.ut');
//            var _box = document.getElementById('id-box');
//            var _i = 0;
//            var ce = nej.ut._$$CustomEvent._$allocate({element:_box
//            ,event:'increase3'
//            ,onint:function(){}
//            ,ondispatch:function(){}
//            });
//            var f = function(){_i++};
//            nej.v._$addEvent(_box,'increase3',f);
//            _box.onincrease3();
//            equal(_i,1,'_i被加了一次');
//            ce = nej.ut._$$CustomEvent._$recycle(ce);
//            nej.v._$delEvent(_box,'increase3',f);
//            try{
//                _box.onincrease3();
//                ok(true,"i的值是"+_i);
//            }catch(e){
//                ok(true,'事件已经被删除');                                
//            }
//        });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}customEventTest.js',['{lib}util/event/event.js','{pro}log.js'],f);
});
  