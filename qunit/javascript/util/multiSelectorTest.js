var f = function(){
    //定义测试模块
    module("multiSelector");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
	 var _html_seed = _e._$addHtmlTemplate('{list 1..31 as x}\
       <div class="item">${x}</div>\
    {/list}');
    
    test('multiSelector test',function(){
        expect(0);
		_e._$get('box').innerHTML = _e._$getHtmlTemplate(_html_seed);
		var _ms = _p._$$MultiSelector._$allocate({
			parent:'box',
			item:'item',
			select:'select'
		});
		
    });
    //开始单元测试
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}multiSelectorTest.js',
    ['{lib}util/selector/selector.js','{pro}log.js'],f);
});
  