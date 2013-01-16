var f = function(){
    //定义测试模块
    module("animation");
    
    //开始单元测试
    test('正常的测试弹性动画', function() {
        stop();
        var _bounce;
        var _box = document.getElementById('id-bounce0');
        var options = {
            from: {
                offset: 100,
                velocity: 100
            },
            acceleration:100,
            onupdate: function(offset){
                _box.style.left = offset.offset + 'px';
                ok(true,"成功调用"+offset.offset);
            },
            onstop: function(){
                _bounce = nej.ut._$$AnimBounce._$recycle(_bounce);
                start();
            }
        }
        _bounce  = nej.ut._$$AnimBounce._$allocate(options);
        _bounce._$play();
    });
    test('正常的减速动画', function() {
        stop();
        var _decelerate;
        var _box = document.getElementById('id-bounce1');
        var options = {
            from:{
                offset: 100,
                velocity: 10
            },
            onupdate: function(offset){
                ok(true,"成功调用"+offset.offset);
                _box.style.left = offset.offset + 'px';
            },
            onstop: function(){
                _decelerate = nej.ut._$$AnimDecelerate._$recycle(_decelerate);
                start();
            }
        }
        _decelerate  = nej.ut._$$AnimDecelerate._$allocate(options);
        _decelerate._$play();
    });
    
    test('正常的先快后慢动画', function() {
        stop();
        var _easeout;
        var _box = document.getElementById('id-bounce2');
        var options = {
            from: {
                offset: 100,
                velocity: 10
            },
            to: {
                offset:200
            },
            duration:1000,
            onupdate: function(offset){
                ok(true,"成功调用"+offset.offset);
                _box.style.left = offset.offset + 'px';
            },
            onstop: function(){
                _easeout = nej.ut._$$AnimEaseOut._$recycle(_easeout);
                start();
            }
        }
        _easeout  = nej.ut._$$AnimEaseOut._$allocate(options);
        _easeout._$play();
    });
    
    test('正常的线性动画', function() {
        stop();
        var _linear;
        var _box = document.getElementById('id-bounce3');
        var options = {
            from: {
                offset: 100,
                velocity: 10
            },
            to: {
                offset:200
            },
            duration:1000,
            onupdate: function(offset){
                ok(true,"成功调用"+offset.offset);
                _box.style.left = offset.offset + 'px';
            },
            onstop: function(){
                _linear = nej.ut._$$AnimLinear._$recycle(_linear);
                start();
            }
        }
        _linear  = nej.ut._$$AnimLinear._$allocate(options);
        _linear._$play();
    });
    
    test('正常的先慢后快动画', function() {
        stop();
        var _easein;
        var _box = document.getElementById('id-bounce4');
        var options = {
            from:{
                offset: 100,
                velocity: 10
            },
            to: {
                offset:200
            },
            duration:1000,
            onupdate: function(offset){
                ok(true,"成功调用"+offset.offset);
                _box.style.left = offset.offset + 'px';
            },
            onstop: function(){
                _easein = nej.ut._$$AnimEaseIn._$recycle(_easein);
                start();
            }
        }
        _easein  = nej.ut._$$AnimEaseIn._$allocate(options);
        _easein._$play();
    });
    
    test('先慢后快再慢动画实现文件', function() {
        stop();
        var _easeinout;
        var _box = document.getElementById('id-bounce5');
        var options = {
            from:{
                offset: 100,
                velocity: 10
            },
            to: {
                offset:200
            },
            duration:1000,
            onupdate: function(offset){
                ok(true,"成功调用"+offset.offset);
                _box.style.left = offset.offset + 'px';
            },
            onstop: function(){
                _easeinout = nej.ut._$$AnimEaseInOut._$recycle(_easeinout);
                start();
            }
        }
        _easeinout  = nej.ut._$$AnimEaseInOut._$allocate(options);
        _easeinout._$play();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}animationTest.js',
    ['{lib}util/animation/bounce.js','{lib}util/animation/linear.js','{lib}util/animation/decelerate.js',
    '{lib}util/animation/easeout.js','{lib}util/animation/easein.js','{lib}util/animation/easeinout.js','{pro}log.js'],f);
});
  