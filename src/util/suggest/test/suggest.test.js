var f = function(){
    module("suggest");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
		_p = _('nej.ut');
    test('suggest',function(){
		stop();
		var _ipt = _e._$get('suggest-input');
		var _card0 = _e._$get('card0');
		var _sg = _p._$$Suggest._$allocate({
			input:_ipt,
			body:'card0',
			selected:'xuanzhong',
			onchange:function(_value){
				var _item = '';
				for(var i = 1; i < 10;i++){
				    _item += '<p>'+i+'</p>';
				}
				_card0.innerHTML = _item;
				_sg._$setList(_e._$getChildren(_card0));
			},
			onselect:function(_value){
				ok(true,'选择了一个值'+_value);
				start();
			}
		});
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}suggest.test.js',['{lib}util/suggest/suggest.js'],f);
});

  