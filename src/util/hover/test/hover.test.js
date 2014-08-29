NEJ.define([
    'base/element',
    'util/hover/hover'
],function(_e,_t){
    var _v = NEJ.P('nej.v');
	//开始单元测试
    test('元素hover测试', function() {
        expect(10);
        var _list = _e._$getChildren(_e._$get('box'));
        for (var i = _list.length-1; i >=0; i--){
        	var _i = _list[i];
        	_t._$hover(_i,'js-hover');
            _v._$dispatchEvent(_list[i],'mouseenter');
            equal(_list[i].className.indexOf('js-hover')>-1,true,'样式加上去了');
        }
    });
});
