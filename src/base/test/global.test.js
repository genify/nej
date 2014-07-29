var f = function(){
    //定义测试模块
    module('global');

    //开始单元测试
    test('Function prototype',function(){
        equal(typeof(Function.prototype._$bind),'function','函数对象加入了_$bind方法');
        equal(typeof(Function.prototype._$bind2),'function','函数对象加入了_$bind2方法');
    });

    test('window.MWF', function() {
        deepEqual(NEJ.O,{},'只读空对象实例');
        deepEqual(NEJ.R,[],'只读空数组实例');
        notEqual(NEJ.F,function(){return !1;},'空函数实例每个都不equal');
        notDeepEqual(NEJ.F,function(){return !1;},'空函数实例每个都不DeepEqual');
    });
	test('NEJ.X after window.MWF',function(){
            var _obj ={},_obj2 = {};
            _obj.num = 2;
            NEJ.X(_obj2,_obj,function(_num){
                if(_num == 3)
                    return false;
            });
            equal(_obj.num,_obj2.num,'拷贝对象属性');
            var _obj = {},_obj2 = {};
            _obj.num1 = 3;
            _obj.num2 = 4;
            NEJ.X(_obj2,_obj,function(_num){
                if(_num == 3)
                    return true;
            });
            notEqual(_obj.num1,_obj2.num1,'拷贝对象通过过滤接口属性');
            equal(_obj.num2,_obj2.num2,'拷贝对象通过过滤接口属性');
        });
    test('NEJ.EX after window.MWF',function(){
        /**
         * 以下代码从_obj2取_obj中对应的属性值
         * 拷贝结束后_obj->{num:1,num1:aa}
         */
        var _obj ={},_obj2 = {};
        _obj.num = 1;
        _obj.num1 = 'aa';
        _obj2.num = 2;
        NEJ.EX(_obj,_obj2);
        equal(_obj.num,_obj2.num,'拷贝对象属性');
        var _obj = {},_obj2 = {};
        _obj.num = '3';
        _obj2.num = '4';
        NEJ.EX(_obj,_obj2);
        equal(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性');
        _obj.num = 'aaa';
        _obj2.num = 'null';
        NEJ.EX(_obj,_obj2);
        equal(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性,测试字符串null');
        _obj.num = 'aaa';
        _obj2.num = null;
        NEJ.EX(_obj,_obj2);
        notEqual(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性,测试null');
        _obj.num = 'aaa';
        _obj2.num = undefined;
        NEJ.EX(_obj,_obj2);
        notEqual(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性,测试undefined');
        _obj.num = 'aaa';
        _obj2.num = 'undefined';
        NEJ.EX(_obj,_obj2);
        equal(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性,测试字符串undefined');
        _obj.num = 'aaa';
        _obj2.num = Number.NaN;
        NEJ.EX(_obj,_obj2);
        notEqual(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性,测试Number.NaN值');
        _obj.num = 'aaa';
        _obj2.num = Number.MAX_VALUE;
        NEJ.EX(_obj,_obj2);
        equal(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性,测试Number.MAX_VALUE值');
        _obj.num = 'aaa';
        _obj2.num = Number.MIN_VALUE;
        NEJ.EX(_obj,_obj2);
        equal(_obj.num,_obj2.num,'拷贝对象通过过滤接口属性,测试Number.MIN_VALUE');
    });

    test('NEJ.P',function(){
        equal(NEJ.P('a.b.c'),a.b.c,'字符串a.b.c生成命名空间');
        equal(NEJ.P('window.a.b.c'),window.a.b.c,'字符串window.a.b.c生成命名空间');
        deepEqual(NEJ.P('0.2.3'),{},'字符串0.2.3不能生成正确命名空间');
        deepEqual(NEJ.P('function.for'),{},'关键字不能生成正确命名空间');
    });

    test('NEJ.C',function(){
        var _f = NEJ.C();
        var _num = 0;
        _f.__static = function(){
            return 'static';
        };
        _f.prototype.__init = function(){
            _num  = 10;
        };
        var _f2 = NEJ.C();
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
        var _f = NEJ.C();
        _f.prototype.__init = function(){

        };
        var _f2 = NEJ.C();
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

    test('trim接口',function(){
        equal('  dfdf @$#%^  dfdf  '.trim(),'dfdf @$#%^  dfdf','测试trim接口前后去空格');
        equal('  function  '.trim(),'function','关键字');
        equal('  function(){return 0;}  '.trim(),'function(){return 0;}','函数');
        equal('  \\\*function()\*\\{return 0;}  '.trim(),'\\\*function()\*\\{return 0;}','转义字符');
        equal('  &lt;  '.trim(),'&lt;','转义字符');
    });

    test('aop增强接口',function(){
        var _obj = {a:0};
        var _f = function(){
            _obj.a = 1;
            return 'aop增强操作1';
        };
        var _f2 = function(_event){
            _obj.a = 2;
            _event.value = 'aop增强操作2';
        };
        var _f3 = function(_event){
            _obj.a = 3;
            _event.value = 'aop增强操作3';
        }
        var _f = _f._$aop(_f2,_f3);
        var _value = _f();
        equal(_obj.a,3,'aop增强操作');
        equal(_value,'aop增强操作3','aop增强操作返回值是某个增强操作的返回值');
    });

    test('aop增强接口,stopped',function(){
        var _obj = {a:0};
        var _f = function(){
            _obj.a = 1;
            return 'aop增强操作';
        };
        var _f2 = function(_event){
            _event.stopped = true;
            _obj.a = 2;
            _event.value = 'aop增强操作2';
        };
        var _f3 = function(_event){
            _obj.a = 3;
            _event.value = 'aop增强操作3';
        }
        var _f = _f._$aop(_f2,_f3);
        _f();
        equal(_obj.a,2,'aop增强操作');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}global.test.js',['{lib}base/global.js'],f);
});

