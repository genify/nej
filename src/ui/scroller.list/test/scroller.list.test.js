var f = function(){
    //定义测试模块
    module("ui-scrollList");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui'),
		_t = _('nej.ut');
        
    //开始单元测试
//    test('scrollList',function(){
//        stop();
//        var _scrollList = _p._$$ListScroller._$allocate({
//            parent:'scrollList-box',
//            onscroll:function(_offset){
//                ok(true,'onscroll');
//            },
//            onbounce:function(_event){
//                ok(true,'onbounce');
//            },
//            onbouncestart:function(){
//                ok(true,'onbouncestart');
//            },
//            onlistupdate:function(_node){
//                ok(true,'onlistupdate');
//                start();
//            },
//            onbeforeclear:function(_box){
//                ok(true,'onbeforeclear');
//            }
//        });
//        _scrollList._$bindPuller(_p._$$PullRefresh._$allocate({
//            onrefresh:function(){
//                var _list = '';
//                for(var _i = 20; _i > 0; _i--){
//                    _list += '<div>' + _i + '</div>'
//                }
//                _scrollList._$addLast(_list);
//            }
//        }));
//    });
	
	test('profile',function(){
        stop();
		var _sp = _t._$$ScrollPerf._$allocate({
            level:1,
            offset:10,
            viewport:'scrollList-box'
        });
        var _scrollList = _p._$$ListScroller._$allocate({
            parent:'scrollList-box',
            onscroll:function(_offset){
                ok(true,'onscroll');
				_sp._$performance(_scrollList._$getScrollTop());
            },
            onbounce:function(_event){
                ok(true,'onbounce');
            },
            onbouncestart:function(){
                ok(true,'onbouncestart');
            },
            onlistupdate:function(_node){
                ok(true,'onlistupdate');
                start();
            },
            onbeforeclear:function(_box){
                ok(true,'onbeforeclear');
            }
        });
        _scrollList._$bindPuller(_p._$$PullRefresh._$allocate({
            onrefresh:function(){
                var _list = '';
                for(var _i = 40; _i > 0; _i--){
                    _list += '<p class="js-perf">' + _i + '</p>'
                }
                _scrollList._$addLast(_list);
            }
        }));
    });
	
//	test('profile image',function(){
//        stop();
//        var _sp = _t._$$ScrollPerf._$allocate({
//            level:1,
//            offset:10,
//            viewport:'scrollList-box'
//        });
//        var _scrollList = _p._$$ListScroller._$allocate({
//            parent:'scrollList-box',
//            onscroll:function(_offset){
//                ok(true,'onscroll');
//                _sp._$performance(_scrollList._$getScrollTop());
//            },
//            onbounce:function(_event){
//                ok(true,'onbounce');
//            },
//            onbouncestart:function(){
//                ok(true,'onbouncestart');
//            },
//            onlistupdate:function(_node){
//                ok(true,'onlistupdate');
//                start();
//            },
//            onbeforeclear:function(_box){
//                ok(true,'onbeforeclear');
//            }
//        });
//        _scrollList._$bindPuller(_p._$$PullRefresh._$allocate({
//            onrefresh:function(){
//                var _list = '';
//                for(var _i = 40; _i > 0; _i--){
//                    _list += '<p class="js-perf">' + _i + '</p>'
//                }
//                _scrollList._$addLast(_list);
//            }
//        }));
//    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}scroller.list.test.js',
    ['{lib}util/profile/profile.js',
     '{lib}ui/scroller.list/scroller.list.js',
     '{lib}ui/pullrefresh/pullrefresh.js'],f);
});