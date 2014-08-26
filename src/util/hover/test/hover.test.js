NEJ.define([
    'base/element',
    'util/hover/hover'
],function(_e,_t){
	//开始单元测试
    test('元素hover测试', function() {
        expect(0);
        var _list = _e._$getChildren(_e._$get('box'));
        for (var i = _list.length-1; i >=0; i--){
        	var _i = _list[i];
        	_t._$hover(_i,'js-hover');
        }
    });
});
