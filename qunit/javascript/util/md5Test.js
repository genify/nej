var f = function(){
    //定义测试模块
    module("md5");
    var p = NEJ.P('nej.u');
    var _numberList = ['中文中文','0','2','100','123'];
	
    //开始单元测试
	test('hmacsha12hex 结果可与md5.node.test.js运行的结果比较',function(){
		var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$hmacsha12hex(_key,_num);
			ok(true,'结果:'+_str2hex);
            start(i);
        }
	});
	
	test('hmacsha12b64 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$hmacsha12b64(_key,_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('hmacsha12str 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$hmacsha12str(_key,_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('hmacmd52hex 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$hmacmd52hex(_key,_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('hmacmd52b64 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$hmacmd52b64(_key,_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('hmacmd52str 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$hmacmd52str(_key,_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('sha12hex 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$sha12hex(_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('sha12b64 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$sha12b64(_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('sha12str 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$sha12str(_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('md52hex 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$md52hex(_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('md52b64 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$md52b64(_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('md52str 结果可与md5.node.test.js运行的结果比较',function(){
        
        var _key = '123';
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$md52str(_num);
            ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
	
	test('str2hex 结果可与md5.node.test.js运行的结果比较', function() {
        
        stop(4);
        for(var i = 0; i < _numberList.length; i++){
            var _num = _numberList[i];
            var _str2hex = p._$str2hex(_num);
			ok(true,'结果:'+_str2hex);
            start(i);
        }
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}md5Test.js',
    ['{lib}util/encode/sha.md5.js','{pro}log.js'],f);
});
