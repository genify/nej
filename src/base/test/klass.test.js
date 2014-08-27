var f = function(_k){
    //定义测试模块
    module('global');

    //开始单元测试
    test('NEJ.C',function(){
        var _f = _k._$klass();
        var _num = 0;
        _f.__static = function(){
            return 'static';
        };
        _f.prototype.__init = function(){
            _num  = 10;
        };
        var _f2 = _k._$klass();
        //_fn2==_f2.prototype
        var _fn2 = _f2._$extend(_f);
        _fn2.__init = function(){
            this.__super();
            _num--;
        }
        var _xf = new _f();
        equal(typeof(_f),'function','返回一个函数对象');
        equal(typeof(_f._$bind),'function','返回的对象有_$bind方法,继承自Function');
        equal(typeof(_f._$bind2),'function','返回的对象有_$bind2方法,继承自Function');
        var _x2f = new _f2();
        equal(_num,9,'父类__init后，子类__init会被调用');
        equal(_f2.__static(),'static','默认继承了静态方法，如不继承传入false参数');
    });

    test('_$bind接口',function(){
        var _f = _k._$klass();
        _f.prototype.__init = function(){

        };
        var _f2 = _k._$klass();
        var _obj = {num:3};
        var _fn2 = _f2._$extend(_f);
        _fn2.__print = function(_obj,_obj2){
            return arguments[0]+arguments[1];
        };
        _fn2.__init = function(){
            this.__super();
            this.num = 33;
            var _fun = this.__print._$bind(this,'obj');
            var _fun2 = this.__print._$bind2(this,'obj');
            equal(_fun('aaa'),'objaaa','测试_$bind方法,参数的顺序调用');
            equal(_fun2('bbb'),'bbbobj','测试_$bind2方法,参数的倒序调用');
        };
        var _f22 = new _f2();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}global.test.js',['{lib}base/klass.js'],f);
});

