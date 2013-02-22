var f = function(){
	window.noclear = true;
	var _  = NEJ.P,
	    _e = _('nej.e'),
	    _u = _('nej.u'),
	    _v = _('nej.v');
	// 枚举几种测试的标签
	var _nodeList  = [' div',' p','span',' a',' input'];
	/** 
	// 此伪类可以大致枚举出各种情况
	var _action0   = [' not', ' matches', ' nth-child', ' nth-last-child',
			         ' nth-of-type', ' nth-last-of-type'];*/
	// 此伪类可以直接使用
	var _action    = [':first-child', ':last-child', ':last-of-type', 
				     ':first-of-type', ':only-child', ':only-of-type',
				     ':checked', ':enabled',':disabled', ':empty', ':focus',
				      ':target'];
 	// 操作符，这里用title为3做例子:[title = 3]
    var _operator  = [' = ',' |= ',' ~= ',' ^= ',' $= ',' *= '];
    // 连接符
    var _connector = [' ',' > ',' + ',' ~ '];
    //  伪类:not-child
    var _nth_child = [':nth-child(2n+1)',':nth-child(odd)',':nth-child(2n+0)',
    				  ':nth-child(even)',':nth-child(5n+3)',':nth-child(-n+6)',
    			 	  ':nth-child( +3n - 2 )',':nth-child(+ 2n)'];
    //  伪类:nth-last-child
    var _nth_last_child = [':nth-last-child(2n+1)',':nth-last-child(odd)',
    			 		   ':nth-last-child(even)'];

    //  伪类:nth-of-type
    var _nth_of_type = [':nth-of-type(2n+1)',':nth-of-type(2n)',
    					':nth-of-type( +3n - 2 )',':nth-of-type(-n+6)',
    					':nth-of-type(odd)',':nth-of-type(even)'];

    //  伪类:nth-last-of-type
    var _nth_last_of_type = [':nth-last-of-type(even)',
    					     ':nth-last-of-type(odd)',
    				 		 ':nth-last-of-type(2n+0)',
    				 		 ':nth-last-of-type(2n+1)',
    						 ':nth-last-of-type(5n+3)'];
   	//  伪类:not
    var _not = [':not(.class1)'];
    //  伪类:matches
    var _matches = [':matches(.class2,.class3)'];

    var _action0 = _nth_child.concat(_nth_last_child).concat(_nth_of_type).
    			   concat(_nth_last_of_type).concat(_not).concat(_matches);

	//定义测试模块
	module('query');
	//开始单元测试
	test('query',function(){
		var _context = _e._$get('context');
		var _nodeMap = [];
		for(var i = 0; i < _nodeList.length ;i++){
			_nodeMap.push(_nodeList[i].trim());
		}
		// 创建测试节点
		var __doCreateDom = function(_parent){
			var __createDom = function(_i,_parent){
					_i++;
					if(_i == _nodeMap.length){
						return;
					}
					for(var k = 0; k < 4; k++){
						var _node = _e._$create(_nodeMap[_i],'class' + _i,_parent);
						_node.alt = _nodeMap[_i];
						_node.title = _nodeMap[_i];
						__createDom(_i,_node);
					}
				};
			__createDom(-1,_context);
		};
		// 最后一层的合并数据
		var __findOne = function(_list,_a0) {
		    	var _array = [];
		    	for(var i = _list.length-1; i >= 0;i--){
		    		var _l = [];
		    		if(typeof _a0 != 'string')
		    			_a0 = _a0.join('');
		    		_l.push(_a0);
		    		if(typeof _list[i] != 'string')
		    			_list[i] = _list[i].join('');
		    		_l = _l.concat(_list[i]);
		    		_array.push(_l);
		    	}
		    	return _array;
		    };
		// 生成排列组合实现
		var __doFind = function(_list,_loop,_handle) {
		    _loop--;
	    	var _array = [];
	    	var _saveList = _list.concat([]);
    		if(_loop != 0){
    			for(var i = _list.length-1; i >= 0; i--){
					_list = _saveList.concat([]);
			    	var _a0 = _list[i];
			    	_list.splice(i,1);
			    	var _arrayMerge = __findOne(__doFind(_list,_loop),_a0);
			    	_array = _array.concat(_arrayMerge);
			    	if(!!_handle)
			    		_handle(_arrayMerge);
			    }
			    return _array;
    		}else{
    			return _list;
			}
		    return _array;
	    };

		// 创建排列组合的测试数据
		var __createTestArray = function(_length,_obj) {
			var _list = [];
			var _opArray = [];
			if(_length < 3){
				_list = _nodeList.concat(_action0).concat(_action);
			}else{
				_list = _nodeList.concat(_action0).concat(_action).concat(_connector);
			}
			if(!!_obj){
				for(var i = 0 ; i < _operator.length ; i++){
					_opArray.push('[' + _obj.pre + _operator [i] + _obj.suf + ']');
				}
				_list = _list.concat(_opArray);
			}
			return __doFind(_list,_length);
		};
		__doCreateDom();
		stop();
		// 生成数据后开始测试
		var __doTest = function(_normalList) {
			var _error = 0;
			for(var i = 0; i < _normalList.length-1; i++){
				var _key = _normalList[i];
				if(typeof _key != 'string')
					_key = _key.join('');
				try{
					window._result2 = nej.e._$g(_key,_context);
					// window._result  = nej.e._$all(_key,_context);
					if(!!window._result2){
						equal(1,1,_key+'长度'+window._result2.length);
						// if(window._result.length != window._result2.length){
						// 	_error++;
						// 	equal(1,1,_key+'原生匹配到'+window._result.length+'扩展匹配到'+window._result2.length);
						// }
					}
				}catch(e){
					alert(e.message+"传入的key为："+_key);
				}
			}
			return _error;
		};
		// 拼接两个规则
		var _doConnect = function(_list,_join){
			if(!!_join){
				var _f = function(_data){
					var _array = [];
					for(var i = _connector.length; i--; ){
						var _c = _connector[i];
						for(var k = _data.length ; k--; ){
							_array.push(_data[k].join(_c));
						}
					}
					__doTestByGroup(_array,100,'排列2进行组合');
				};
			}
			var _list = __doFind(_list,2,_f);
			if(!!_join)
				return;
			var _array= [];
			for(var i = _connector.length; i--; ){
				var _c = _connector[i];
				for(var k = _list.length ; k--; ){
					_array.push(_list[k].join(_c));
				}
			}
			return _array;
		};
		// 分组测试
		var __doTestByGroup = function(_list,_group,_title){
			var _l = Math.ceil(_list.length/_group);
			var _start = 1;
			for(var i = 0 ; i < 1 ; i++){
				var _end = (i+1) * _group;
				var _array = _list.slice(_start,_end);
				_start = _end;
				__doTest(_array)
				// alert('title:'+_title+' 第'+i+'组'+'error' + __doTest(_array));
			}
		};

		// 随机取几个测试数据
		var __getRandom = function(_list,_l){
			var _array = [];
			var _end = _list.length;
			for(var i = 0; i < _l; i++){
				var _index = _u._$randNumber(0,_end);
				_array.push(_list[_index]);
			}
			return _array;
		};
		var _f = function(){
			/**
			 * 排列组合1
			 */
			/* 单个测试50个 */
			var _normalList1 = __createTestArray(1,{pre:'title',suf:'td'});
			// alert('组合1，错误个数:'+__doTest(_normalList1));
			// __doTest(_normalList1)
			/* 用连接符拼接2450*4个 */
			var _normalList11 = _doConnect(_normalList1);
			__doTestByGroup(_normalList11,100,'排列组合1');
			// /**
			//  *  排列组合2
			//  *  两两组合，2450个
			//  */
			// var _normalList2 = __createTestArray(2,{pre:'title',suf:'td'});
			// _u._$forEach(_normalList2,function(_key,_index){
			// 	if(typeof _key != 'string'){
			// 		_normalList2[_index] = _key.join('');
			// 	}
			// });
			// __doTestByGroup(_normalList2,100,'组合2');
			// /**
			//  * 排列组合3
			//  * 148824的数据需要切割。100个一组 
			//  */
			// var _normalList3 = __createTestArray(3,{pre:'title',suf:'td'});
			// _u._$forEach(_normalList3,function(_key,_index){
			// 	if(typeof _key != 'string'){
			// 		_normalList3[_index] = _key.join('');
			// 	}
			// });
			// __doTestByGroup(_normalList3,100,'组合3');
			// /**
			//  * 最后测组合2
			//  * 6000050的数据
			//  * 随机取1W数据
			//  */
			// var _normalList2 = __getRandom(_normalList2,240);
			// var _normalList22 = _doConnect(_normalList2,true);
			alert('test finish');
			// __doTestByGroup(_normalList22,100,'排列组合2');
		}
		
		setTimeout(_f,10000);
	});
}
module('依赖模块');
test('define',function(){expect(0);
	define('{pro}queryTest.js',['{lib}util/query/query.js','{pro}log.js'],f);
});