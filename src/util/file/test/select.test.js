var f = function(){
	module("selectTest");
    
	var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _i = _('nej.ui.cmd');

	test('selectTest',function(){
		stop();
		 _e._$file('select-box',{
		 	multiple:false,
		 	onchange:function(_event){
		 		ok(true,'文件ID为'+_event.id);
		 		ok(true,'表单ID为'+_event.form.id);
		 		start();
			}
		});
	});

	test('selectTest multiple',function(){
		stop();
		 _e._$file('select-box2',{
		 	multiple:true,
		 	onchange:function(_event){
		 		ok(true,'文件ID为'+_event.id);
		 		ok(true,'表单ID为'+_event.form.id);
		 		start();
			}
		});
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}select.test.js',['{lib}util/file/select.js'],f);
});

  