var f = function(){
    //定义测试模块
    module("cycler");
    
	var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
	
	test('cycler test',function(){
		_p._$$Cycler._$allocate(
		{
			list:['http://t1.gstatic.com/images?q=tbn:ANd9GcQrxfh6Z30dfii0p6XxH6wwuZ42dYTagoI24tybY2STiEpSPXvRzA',
			'http://t1.gstatic.com/images?q=tbn:ANd9GcQrxfh6Z30dfii0p6XxH6wwuZ42dYTagoI24tybY2STiEpSPXvRzA',
			'http://t1.gstatic.com/images?q=tbn:ANd9GcQrxfh6Z30dfii0p6XxH6wwuZ42dYTagoI24tybY2STiEpSPXvRzA'],
			nbox:'nbox',
			pbox:'pbox',
			event:'click',
			interval:5,
	        onchange:function(_index){
	            ok(true,'切换到'+_index+'页');
	            start();
	        }
		});
	});
    //开始单元测试
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}cyclerTest.js',
    ['{lib}util/cycler/cycler.js','{pro}log.js'],f);
});
  