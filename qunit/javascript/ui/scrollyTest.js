var f = function(){
    //定义测试模块
    module("scrolly");
	
	var _  = NEJ.P,
	    _p = _('nej.ui');
	
    //开始单元测试
    test('scrolly',function(){
    	expect(0);
		var _sly = _p._$$ScrollerY._$allocate({
			parent:'scroll-y-container',
			onscroll:function(){
				
			},
			onscrollend:function(){
                
            },
			onbounce:function(_event){
                
            },
			onbouncend:function(_event){
				
			},
			onbouncestart:function(_event){
				
			},
			onrelease:function(){
				
			}
		});
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}scrollyTest.js',['{lib}ui/scroller/scroller.y.js','{pro}log.js'],f);
});