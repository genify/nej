var f = function(){
    //定义测试模块
    module("pager");
    var p = NEJ.P('nej.ui'),
        v = NEJ.P('nej.v'),
		t = NEJ.P('nej.ut'),
		e = NEJ.P('nej.e');
    //开始单元测试
    
    test('实例化一个翻页器，并测试放回的页码是否一致', function() {
        var _parent = document.getElementById('pagerCnt');
        var _setIndex = 1;
        var _onchangeHandle = function(_obj){
            var _index = _obj.index;
            equal(_index,_setIndex,'设置的页码数一致');
        };
        stop();
        var _pager = p._$$Pager._$allocate({
            parent:_parent,
            onchange: _onchangeHandle,
            total: 10,
            index:1
        });
        for(var i = 2 ; i < 11 ; i++){
            _setIndex = i;
            _pager._$setIndex(_setIndex);
        }
        start();
    });
	
    test('关联一个翻页器',function(){
        stop();
        var _parent = document.getElementById('pagerCnt2');
        var _setIndex = 1,_setIndex2 = 1;
        var _onchangeHandle = function(_obj){
            var _index = _obj.index;
            if(_index == 1)//初始化页不用测试
                return;
            var _pnt1 = document.getElementById('pagerCnt2');
            var _pnt2 = document.getElementById('pagerCnt3');
            if(_index == 10){
                equal(_pnt2.children.length,0,'解绑后翻页器从页面回收');
                return;
            }
            var _children1 = _pnt1.children[0].children;
            var _children2 = _pnt2.children[0].children;
            var i = _index;
            if(_children1[i].className.match('js-selected') == null)
                return;
            if(i == _children1.length - 2)
                notEqual(_children1[i].className,_children2[i].className,'解绑后联动翻页器的表现形式不一致')
            else
                equal(_children1[i].className,_children2[i].className,'联动翻页器的表现形式一致，但最后触发一次翻页器的回调');
        };
        var _pager = p._$$Pager._$allocate({
            parent:_parent,
            onchange: _onchangeHandle,
            total: 10,
            index:1
        });
        var _parent2 = document.getElementById('pagerCnt3');
        var _onchangeHandle2 = function(_index2){
            _setIndex2 = _index2;
        };
        _pager._$bind(_parent2);
        for(var i = 2 ; i < 11 ; i++){
            _setIndex = i;
            //最后一个解绑
            if(i == 10)
                _pager._$unbind();
            _pager._$setIndex(_setIndex);
        }
        start();
    });
	
	test('util page.simple',function(){
		var _page = e._$get('page');
		var _ps = t._$$SimplePage._$allocate({
			list:e._$getByClassName(_page,'zpgi'),
			event:'click',
			pbtn:e._$getByClassName(_page,'zprv')[0],
			nbtn:e._$getByClassName(_page,'znxt')[0],
			sbtn:e._$getByClassName(_page,'sbtn')[0],
			ebtn:e._$getByClassName(_page,'ebtn')[0],
			index:90,
			total:100,
			onchange:function(_obj){
				ok(true,'last page is :' + _obj.last + ' index page is:' + _obj.index + 'total:' + _obj.total)
			}
		});
	});
	
	test('util page',function(){
		stop();
		var _box = e._$get('pagebox');
		var _pg = e._$page(_box,{
            event:'click',
            index:9,
            total:10,
            onchange:function(_obj){
                ok(true,'last page is :' + _obj.last + ' index page is:' + _obj.index + 'total:' + _obj.total)
                start();
			}
		});
		_pg._$setIndex(10);
		_pg._$setTotal(20);
		_pg._$updatePage(5,10);
    });
	
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}pagerTest.js',
    ['{lib}ui/pager/pager.js','{lib}util/page/page.simple.js'
	,'{lib}util/page/page.js','{pro}log.js'],f);
});
  