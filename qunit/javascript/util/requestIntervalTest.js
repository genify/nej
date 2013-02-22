var f = function(){
    module("requestInterval");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
        
    test('requestInterval',function(){
        expect(0);
		var _id1 = requestInterval(function(_options){
		},1000);
		var _id2 = requestInterval(function(_options){
        },1000);	
		cancelInterval(_id1);	
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}requestInterval.js',['{lib}util/timer/interval.js','{pro}log.js'],f);
});

  