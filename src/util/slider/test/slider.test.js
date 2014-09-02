var f = function(){
    //定义测试模块
    module("slider");

    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');

    test('sliderX',function(){
        expect(0);
		var _sd = _p._$$SliderX._$allocate({
			range:{x:[0,10]},
			slide:'slide',
			track:'track',
			onchange:function(_obj){
				_e._$style(_e._$get('slide'),{left:_obj.x.value});
			}
		});
    });

	test('sliderY',function(){
        expect(0);
        var _sd = _p._$$SliderY._$allocate({
            range:{y:[0,10]},
            slide:'slide1',
            track:'track1',
            onchange:function(_obj){
                // _e._$style(_e._$get('slide'),{'top':_obj.y.value});
            }
        });
    });

	test('sliderXY',function(){
        expect(0);
        var _sd = _p._$$SliderXY._$allocate({
            range:{x:[0,10],y:[0,10]},
            slide:'slide2',
            track:'track2',
            onchange:function(_obj){
                _e._$style(_e._$get('slide'),{left:_obj.x.value});
            }
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}slider.test.js',
    ['{lib}util/slider/slider.x.js',
     '{lib}util/slider/slider.y.js',
     '{lib}util/slider/slider.xy.js'],f);
});
