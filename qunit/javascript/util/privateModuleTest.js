var f = function(){
    //定义测试模块
    module("privateModule");
    var _  = NEJ.P,
    	_e = _('nej.e'),
        _p = _('nej.ut'),
        _j = _('nej.j');

	test('private module show',function(){
        expect(2);
        stop();
        var _dispatcher = _p._$$Dispatcher._$getInstance();
        // _dispatcher._$rule([
        //     {'/m/a':'/m/','/m/c':'/m/d'},  // <---- 此处两条规则匹配与顺序无关
        //     {'/m/b':/^\/m\/b.*$/i},
        //     {'404':'/m/a'}                 // <---- 模块不存在时定向到/m/a模块
        // ]);
        _dispatcher._$rule('title',{
            '/m/root':'root',
            '/m/root/c':'c',
            '/?/c1':'c1',
            '/?/c2':'c2',
            '/?/c3':'c3'
        });
        _e._$parseTemplate('template-box');
        window.dispatcher = _dispatcher;
	    _dispatcher._$active();
        setTimeout(function(){
            location.href = '#/m/root/c';
            setTimeout(function(){
                notEqual(_e._$getStyle(_e._$get('c1'),'display'),'none');
                notEqual(_e._$getStyle(_e._$get('c2'),'display'),'none');
                start();
            },1000);
        },1000);
	});

    test('private module hidden',function(){
        expect(2);
        stop();
        setTimeout(function(){
            dispatcher._$hide('/?/c1');
            dispatcher._$hide('/?/c2');
            var _cache = dbg.dumpFRG();
            var _chlidren = _e._$getChildren(_cache);
            equal('c1',_chlidren[0].id);
            equal('c2',_chlidren[1].id);
            start();
        },1000);
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}dispatcher2Test.js',
    ['{lib}util/dispatcher/dispatcher.2.js','','{pro}log.js'],f);
});
  