var f = function(){
	//定义测试模块
	module("form");
	var p = NEJ.P('nej.ut'),
		v = NEJ.P('nej.v'),
		e = NEJ.P('nej.e');
	
	//开始单元测试
	test('验证完整的form表单,', function() {
		var _check = e._$get('check');
		var _form = p._$$WebForm._$allocate({
			form:'form',
			message:{
				'email100':'两次email地址不一致',
				'emailt100':'两次email地址不一致',
				'email2-5':'email地址太长'
			},
			oncheck:function(_event){
//				if(_event.target.name=="emailt"){
//				   _event.value = 100;
//				}
			},
            oninvalid:function(_event){
//				_event.value = '<span>'+_event.code+'</span>'
//              if (_event.target.name=='address'&&_event.code==-1){
//                   _event.value = '必须输入密码！';
//              }
            },
            onvalid:function(_event){
//				if (_event.target.name == 'emailt') {
//				}
            }
		});
		v._$addEvent(_check,'click',function(){
			_form._$checkValidity();
		});
		setTimeout(function(){
			v._$dispatchEvent(_check,'click');
		},2000);
		ok(true,'没有异常中断');
	});
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}formTest.js',
	['{lib}util/form/form.js','{pro}log.js'],f);
});
