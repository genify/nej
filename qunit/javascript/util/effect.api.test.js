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
                delay:1,
                duration:5,
                opacity:0.01,
	    		onstop:function(_event){
                    console.log('stop')
	    			_fdi(_box);
	    		},
	    		onplaystate:function(_event){
                    console.log(_event.opacity)
	    		}
	    	})
    	};
    	var _fdi = function(){
	    	_e._$fadeIn(_box,{
                delay:1,
                duration:2,
	    		onstop:function(_event){
                    console.log('stop')
	    			_fdo(_box);
	    		},
	    		onplaystate:function(_event){
	    		}
	    	})
    	};
    	var _moveTo = function(){
    		_e._$moveTo(_box,{top:300,left:500},{
                duration:[3,1],
                onstop:function(_event){
                    alert('moveTo stop')
                },
                onplaystate:function(_event){
                    console.log('moveTo state')
                }
            });
    	};
        var _toggle = function(){
            _e._$toggleEffect(_box,'height',{value:100,
                duration:1,
                onstop:function(_event){
                },
                onplaystate:function(_event){

                }
            });
        };
        var _silde = function(){
            // _e._$silde(_box,'left:+=300',{
            //     timing:'ease-out',
            //     delay:0,
            //     duration:2,
            //     onstop:function(_event){
            //         // console.log(_event.left);
            //     },
            //     onplaystate:function(_event){
            //         // console.log(_event.left);
            //     }
            // });
            _e._$slide('box2','left:-=300',{
                timing:'ease-out',
                delay:0,
                duration:5,
                onstop:function(_event){
                },
                onplaystate:function(_event){
                }
            })
        }
        var _nochange = function(){
            _e._$silde('box2','bottom:-=300',{
                timing:'ease-out',
                delay:0,
                duration:5,
                onstop:function(_event){
                },
                onplaystate:function(_event){
                }
            })
        };
        var _fadeStop = function(){
            _e._$fadeStop('box');
        }
    	_v._$addEvent(_button[0],'click',_fdo);
    	_v._$addEvent(_button[1],'click',_fdi);
    	_v._$addEvent(_button[2],'click',_moveTo);
        _v._$addEvent(_button[3],'click',_toggle);
        _v._$addEvent(_button[4],'click',_silde);
        _v._$addEvent(_button[5],'click',_nochange);
        _v._$addEvent(_button[6],'click',_fadeStop);
    });
};
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}effect.api.test.js',['{lib}util/effect/effect.api.js'],f);
});
