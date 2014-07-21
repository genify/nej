var f = function(){
    //定义测试模块
    module("base64");
    var p = NEJ.P('nej.u');
    //开始单元测试
    test('base64编码解码', function() {
        var _strList = ['a','null','function','error','return','switch','if','!0',
        'UNdefined','NULL','Function','ERROR','return 1'];
        stop();
        for(var i = 0; i < _strList.length; i++){
            var _str = _strList[i];
            var _str2b64 = p._$str2b64(_str);
            var _b642str = p._$b642str(_str2b64);
            equal(_str,_b642str,'编码，反编码，结果一致');
            start();
        }
    });
    
    test('base64中文编码解码', function() {
        var _strList = ['中文','中文 空格','中文　全角空格'];
        stop();
        for(var i = 0; i < _strList.length; i++){
            var _str = _strList[i];
            var _str2b64 = p._$str2b64(_str);
            var _b642str = p._$b642str(_str2b64);
            equal(_str,_b642str,'中文编码，反编码，结果一致');
            start();
        }
    });
    
    test('base64带特殊符号编码解码', function() {
        var _strList = [',:"\\[]{}'];
        stop();
        for(var i = 0; i < _strList.length; i++){
            var _str = _strList[i];
            var _str2b64 = p._$str2b64(_str);
            var _b642str = p._$b642str(_str2b64);
            equal(_str,_b642str,'带特殊符号编码，反编码，结果一致');
            start();
        }
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}base64.test.js',
    ['{lib}util/encode/base64.js'],f);
});
  