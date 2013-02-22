var f = function(){
    //定义测试模块
    module("pinch");
    //开始单元测试
    test('pinch',function(){
        var _box = document.getElementById('id-box'),_bw;
        stop();
        var _pinchstart = function(_touch){
            var _t = _touch;
		    _bw = _box.offsetWidth;
			start();
        }
		var _pinch = function(_touch){
            var _t = _touch;
			var _w = _bw * _t.scale;
			_box.style.width = _w + "px";
            start();
        }
		var _pinchend = function(_touch){
            var _t = _touch;
            start();
        }
        nej.v._$addEvent(_box,'pinchstart',_pinchstart);
		nej.v._$addEvent(_box,'pinch',_pinch);
		nej.v._$addEvent(_box,'pinchend',_pinchend);
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}pinchTest.js',['{lib}util/gesture/pinch.js','{pro}log.js'],f);
});