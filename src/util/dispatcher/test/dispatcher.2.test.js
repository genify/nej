var f = function(){
    //定义测试模块
    module("dispatcher2");
    var _  = NEJ.P,
        _p = _('nej.ut'),
        _j = _('nej.j');

	test('dispatcher2 single function',function(){
        stop();
        var _dispatcher = _p._$$Dispatcher._$allocate();
        // _dispatcher._$rule([
        //     {'/m/a':'/m/','/m/c':'/m/d'},  // <---- 此处两条规则匹配与顺序无关
        //     {'/m/b':/^\/m\/b.*$/i},
        //     {'404':'/m/a'}                 // <---- 模块不存在时定向到/m/a模块
        // ]);
        _dispatcher._$rule('title',{
            '/m/root/':'root',
            '/m/root/a':'a',
            '/m/root/b':'b',
            '/m/root/c':'c',
            '/m/root/c/?/c1':'c1',
            '/m/root/c/?/c2':'c2',
            '/m/root/c/?/c3':'c3'
        });
        _dispatcher._$rule('rewrite',{
            
        });
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}dispatcher.2.test.js',
    ['{lib}util/dispatcher/dispatcher.2.js'],f);
});
  