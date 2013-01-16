var f = function(){
	//定义测试模块
	module('event');
	var p = NEJ.P('nej.p');
	var e = NEJ.P('nej.e');
	var v = NEJ.P('nej.v');
	//开始单元测试
	/**test('event',function(){
		var _node = e._$get('js-node');
		var _num = 0,_ele,_ele2,_pageX,_pageY;
		var _dispatch = function(_node){
			QUnit.triggerEvent(_node,'mouseover')
		}
		var _f = function(e){
			_num = 10;
			_ele = v._$getElement(e);
			//带过滤器
			_ele2 = v._$getElement(e,function(_element){
				return _element.id != 'js-node';
			});
		};
		v._$addEvent(_node,'mouseover',_f);
		_dispatch(_node);
		equal(_ele.id,'js-node','获取触发事件的节点');
		notEqual(_ele2.id,'js-node','获取触发事件的节点,过滤接口是id不能为js-node');
		equal(_num,10,'事件添加成功，并且触发了');
		_num = 0;
		v._$delEvent(_node,'mouseover',_f);
		_dispatch(_node);
		equal(_num,0,'事件已经被删除了，所以值不变');
		v._$addEvent(_node,'mouseover',_f);
		v._$clearEvent(_node,'mouseover');
		v._$clearEvent(_node);
		_dispatch(_node);
		equal(_num,0,'所有事件已经被清理了，所以值不变');
		v._$addEvent(_node,'mouseover',_f);
		v._$clearEvent(_node,'click');
		_dispatch(_node);
		notEqual(_num,0,'清理的类型不对，所以值变了');
		v._$clearEvent(_node);
		v._$addEvent(_node,'mouseover',_f);
		v._$clearEvent(_node,'function');
		_dispatch(_node);
		notEqual(_num,0,'清理的类型用关键字试试');
		v._$clearEvent(_node);
		_num = 0;
		v._$addEvent(_node,'mouseover',_f);
		_dispatch(_node.children[0]);
		equal(_num,10,'事件冒泡了');
		v._$clearEvent(_node);
		_num = 0;
		var _f = function(e){
			v._$stop(e);
			_num = 10;
			_ele = v._$getElement(e);
			_ele2 = v._$getElement(e,function(_element){
				return _element.id != 'js-node';
			});
		};
		var _f2 = function(e){
			v._$stop(e);
			if(e.type == 'click'){
				_pageX = v._$pageX(e);
				_pageY = v._$pageY(e);
				equal(_pageX,undefined,'结果是事件触发的pageX');
				equal(_pageY,undefined,'结果是事件触发的pageY');
			}
			_num = 20;
			_ele = v._$getElement(e);
			_ele2 = v._$getElement(e,function(_element){
				return _element.id != 'js-node';
			});
		};
		v._$addEvent(_node,'mouseover',_f);
		v._$addEvent(_node.children[0],'mouseover',_f2);
		_dispatch(_node.children[0]);
		equal(_num,20,'阻止掉事件冒泡');
		_num = 0;
		v._$clearEvent(_node);
		v._$clearEvent(_node.children[0]);
		v._$addEvent(_node,'mouseover',_f,true);
		//是否捕获阶段
		v._$addEvent(_node.children[0],'mouseover',_f2,true);
		_dispatch(_node.children[0]);
		equal(_num,10,'阻止掉事件捕获');
	});
	
	asyncTest("检测事件触发点", function(){
		var _pageX,_pageY;
		var _f2 = function(_e){
			if(_e.type == 'click'){
				_pageX = v._$pageX(_e);
				_pageY = v._$pageY(_e);
				equal(typeof _pageX,'number','结果是事件触发的pageX'+_pageX);
				equal(typeof _pageY,'number','结果是事件触发的pageY'+_pageY);
				start();
			}
		};
		var _node = e._$get('js-node');
		v._$addEvent(_node,'click',_f2);
	});
	
	module('event常规测试');
	
	test('null',function(){
		var _node = e._$get('js-node');
		var _f = function(){};
		v._$addEvent(_node,'click',_f);
		v._$delEvent(null,'click',_f);
	});
	
	test('input event',function(){
		stop();
		var _input = e._$get('js-input');
		v._$addEvent(_input,'input',function(_event){
			ok(true,'input text 成功触发input 事件');
			start();
		});
		v._$dispatchEvent(_input,'input');
		stop();
		var _textarea = e._$get('js-textarea');
		v._$addEvent(_textarea,'input',function(_event){
			ok(true,'textarea 成功触发input 事件');
			start();
		});
		v._$dispatchEvent(_textarea,'input');
	});
	
	test('load event',function(){
		stop();
		var _iframe = e._$get('js-iframe');
		v._$addEvent(_iframe,'load',function(_event){
			ok(true,'ifram load事件成功触发');
			start();
		});
		_iframe.src = 'http://www.baidu.com';
	});
	
	test('transitionend event',function(){
		stop();
		var _node = e._$get('js-node');
		v._$addEvent(_node,'transitionend',function(_event){
			ok(true,'transitionend 事件成功触发');
			start();
		});
		e._$css3d(_node,'rotate',{x:2,y:1,z:0,a:'-75deg'});
	});*/
	
	if(p._$IS.desktop){
		test('mouse event',function(){
			stop();
			var _box = e._$get('js-box');
			v._$addEvent(_box,'touchstart',function(_event){
				ok(true,'mousedown 成功触发');
			});
			v._$addEvent(_box,'touchmove',function(_event){
				ok(true,'mousemove 成功触发');
			});
			v._$addEvent(_box,'touchend',function(_event){
				ok(true,'mouseup 成功触发');
				start();
			});
		});
	}else{
		test('touch event',function(){
			stop();
			var _box = e._$get('js-box');
			v._$addEvent(_box,'touchstart',function(_event){
				ok(true,'touchstart 成功触发');
			});
			v._$addEvent(_box,'touchmove',function(_event){
				ok(true,'touchmove 成功触发');
			});
			v._$addEvent(_box,'touchend',function(_event){
				ok(true,'touchend 成功触发');
				start();
			});
		});
	}
	
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}elementTest.js',
    ['{lib}base/element.js','{pro}log.js'],f);
});