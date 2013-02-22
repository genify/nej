var f = function(){
    module("tab");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
		
    test('tab',function(){
        stop(2);
		var _tb = _p._$$Tab._$allocate({
			list:_e._$getChildren(_e._$get('box')),
			index:1,
			onchange:function(_event){
				ok(true,'上一次页面是:'+_event.last);
				ok(true,'当前页面是:'+_event.index);
				start(_event.index);
			}
		});
		_tb._$go(2);
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}tab.js',['{lib}util/tab/tab.js','{pro}log.js'],f);
});

  