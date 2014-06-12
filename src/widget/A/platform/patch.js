var f = function() {
	NEJ.patch('TR<6',['{lib}base/event.js'],function(){
		console.log('exec ie6-9 patch');
	});
	NEJ.patch('4<TR<5',['{lib}base/event.js',
		'{lib}base/element.js'],function(){
		console.log('exec ie78 patch');
	});
};
define(['../platform/h.js','{lib}base/platform.js'],f);