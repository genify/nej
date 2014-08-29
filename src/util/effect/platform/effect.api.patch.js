NEJ.define([
    'base/element'
],function(_e,_h,_o,_f,_r){
    // ie8-
    NEJ.patch('TR<=4.0',function(){
        _h.__formatTo = function(_to){
            return _to * 100;
        };

        _h.__formatNumber = function(_node){
            var _filter = _e._$getStyle(_node,'filter');
            // 没设置透明度默认为100
            if(_filter === ''){
                _e._$setStyle(_node,'filter','alpha(opacity=100)');
                _number = 100;
            }else{
                _number = parseFloat(_filter.split('=')[1])||0;
            }
            return _number;
        };
    });

    return _h;
});