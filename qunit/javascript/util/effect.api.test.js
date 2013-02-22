var f = function() {
	//定义测试模块
    module("effect api test");
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
    test('effect api test',function(){
    	expect(0);
    	var _box = _e._$get('box');
    	var _button = _e._$getByClassName(document.body,'button');
    	var _fdo = function(){
	    	_e._$fadeOut(_box,{
	    		onstop:function(_event){
	    			_fdi(_box);
	    		},
	    		onplaystate:function(_event){
	    		}
	    	})
    	};
    	var _fdi = function(){
	    	_e._$fadeIn(_box,{
	    		onstop:function(_event){
	    			_fdo(_box);
	    		},
	    		onplaystate:function(_event){
	    		}
	    	})
    	};
    	var _moveTo = function(){
    		_e._$moveTo(_box,{top:500,left:600},{duration:2,
                onstop:function(_event){
                },
                onplaystate:function(_event){
                }
            });
    	};
        var _toggle = function(){
            _e._$toggle(_box,'height',100);
        };
    	_v._$addEvent(_button[0],'click',_fdo);
    	_v._$addEvent(_button[1],'click',_fdi);
    	_v._$addEvent(_button[2],'click',_moveTo);
        _v._$addEvent(_button[3],'click',_toggle);
    });
};
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}effect.api.test.js',['{lib}util/effect/effect.api.js'],f);
});
