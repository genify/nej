var f = function(){
    //定义测试模块
    module("rangeSelect");
	
	
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
    
    var _html_seed = _e._$addHtmlTemplate('{list 1..31 as x}\
       <div class="item">${x}</div>\
    {/list}');
	
	//开始测试
    test('rangeSelect test',function(){
        stop();
		var _box  = _e._$get('box');
        _box.innerHTML = _e._$getHtmlTemplate(_html_seed);
		var _box2 = _e._$get('box2');
		var _range = _p._$$Range._$allocate({
            body:_box2,
            onbeforechange:function(_event){
            },
            onafterchange:function(_event){
            }
        });
		_p._$$RangeSelector._$allocate({
			parent:box,
			range:_range,
			item:'item',
			select:'select',
			onchange:function(_event){
			}
		});
    });
    //开始单元测试
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}rangeSelectTest.js',
    ['{lib}util/selector/selector.range.js','{lib}util/template/tpl.js','{pro}log.js'],f);
});
  