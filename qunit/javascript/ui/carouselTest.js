var f = function(){
	//定义测试模块
	module("carousel");
	var _  = NEJ.P,
        _v = _('nej.v'),
		_e = _('nej.e'),
		_p = _('nej.ui');
		
		
	//开始单元测试
	test('carouselX',function(){
		stop();
//		_v._$addEvent('carousel-box','touchstart',_v._$stopDefault);
//		_v._$addEvent('carousel-box','touchmove',_v._$stopDefault);
		var _cx = _p._$$CarouselX._$allocate({
			parent:_e._$get('carousel-box'),
			mode:1,
			buffer:10,
			current:2,
			onaddcard:function(_index){
				var _img = _e._$create('img');
				_img.draggable = false;
				_img.src = 'http://www.baidu.com/img/baidu_sylogo1.gif';
				_cx._$appendItem(_index,_img);
			},
			onscrollstart:function(_index){
				ok(true,'onscrollstart')
			},
			onscroll:function(_index){
				ok(true,'onscroll')
			},
			onbouncerelease:function(_index){
				ok(true,'onbouncerelease')
			}
		});
			setTimeout(function(){
				start();
			},10000);
		
	});
	
	//开始单元测试
	test('carouselY',function(){
		expect(0);
	});
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}carouselTest.js',['{lib}ui/carousel/carousel.x.js','{lib}ui/carousel/carousel.y.js'],f);
});