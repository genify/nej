var f = function(){
    //定义测试模块
    module("cache&&cookie&&storage");
    var c = NEJ.P('nej.ut'),
	    j = NEJ.P('nej.j');
	    
    //开始单元测试
//    test('setEvent', function() {
//        stop();
//        var _i = 0;
//        var _f = function(){
//            _i =1;
//        }
//        var _obj = new c._$$Cache();
//        _obj._$setEvent('clickxxx',_f);
//        _obj._$dispatchEvent('clickxxx');
//        equal(_i,1,'clickxxx方法被成功调用');
//        start();
//    });
//    
//    test('setEvent,带参数的回调', function() {
//        stop();
//        var _i = 0;
//        var _f = function(_num){
//            _i = _num;
//        }
//        var _obj = new c._$$Cache();
//        _obj._$setEvent('click',_f);
//        _obj._$dispatchEvent('click',5);
//        equal(_i,5,'方法被成功调用,并且设置的值正确');
//        start();
//    });
//    
//    test('batEvent,批量设置事件', function() {
//        stop();
//        var _i = 0;
//        var _f0 = function(_num){
//            _i = _num;
//        }
//        var _f1 = function(){
//            
//        };
//        var _obj = new c._$$Cache();
//        _obj._$batEvent(
//            {
//                f0:_f0._$bind(this),
//                f1:_f1._$bind(this)
//            }
//        );
//        _obj._$dispatchEvent('f0',50);
//        equal(_i,50,'方法被成功调用,并且设置的值正确');
//        start();
//    });
//    
//    test('hasEvent,检查是否有某类事件', function() {
//        stop();
//        var _i = 0;
//        var _f0 = function(_num){
//            _i = _num;
//        }
//        var _obj = new c._$$Cache();
//        _obj._$setEvent('f0',_f0);
//        equal(_obj._$hasEvent('f0'),true,'检查有f0这个事件');
//        start();
//    });
//    
//    test('clearEvent,检查是否有某类事件', function() {
//        stop();
//        var _i = 0;
//        var _f0 = function(_num){
//            _i = _num;
//        }
//        var _obj = new c._$$Cache();
//        _obj._$setEvent('f0',_f0);
//        _obj._$clearEvent('f0')
//        equal(_obj._$hasEvent('f0'),false,'f0被清除了');
//        start();
//    });
//    
//    test('api,在API中分配控件实例，如果指定ID已存在当前控件的实例则直接返回', function() {
//        stop();
//        var _obj = new c._$$Cache();
//        var _id= 'widget0';
//        var _cache = nej.ut._$api(_id,c._$$Cache,{});
//        equal(typeof(_cache),'object','分配一个实例控件');
//        var _flag = nej.ut._$api(_id,c._$$Cache);
//        equal(typeof(_flag),'object','第3个参数未传，只检查是否有实例存在，有直接放回');
//        var _flag2 = nej.ut._$api('widget1',c._$$Cache);
//        equal(_flag2,undefined,'第3个参数未传，只检查是否有实例存在，有直接放回');
//        start();
//    });
//    
//    test('setEvent,带参数的回调,type为oncachechange', function() {
//        stop();
//        var _i = 0;
//        var _f = function(_num){
//            _i = _num;
//        }
//        var _obj = new c._$$Cache();
//        _obj._$setEvent('oncachechange',_f);
//        _obj._$dispatchEvent('oncachechange',10);
//        equal(_i,10,'oncachechange方法被成功调用,并且设置的值正确');
//        start();
//    });
//    
//    test('cookie value',function(){
//        var j = NEJ.P('nej.j');
//        var _cookie = j._$cookie("name",{value:'chenglin'});
//        equal(j._$cookie('name'),'chenglin','cookie设置成功');
//    });
//    
//    test('cookie value expires',function(){
//        var j = NEJ.P('nej.j');
//        var _cookie = j._$cookie("name1",{value:'chenglin1',expires:1});
//        stop();
//        setTimeout(function(){
//            equal(j._$cookie('name1'),'chenglin1','cookie设置成功，时间过期');start()},500);
//    });
//	
//	test('cookie value expires delete cookie',function(){
//        var j = NEJ.P('nej.j');
//		var _cookie = j._$cookie("namedd",{value:'chenglin123',expires:1});
//        var _cookie = j._$cookie("namedd",{expires:-1});
//        stop();
//        setTimeout(function(){
//            equal(j._$cookie('namedd'),'','cookie 被删除');start()},500);
//    });
//    
//    test('cookie value path expires x',function(){
//        var j = NEJ.P('nej.j');
//        var _cookie = j._$cookie("name2",{value:'chenglin2',path:'/',expires:1});
//        stop();
//        setTimeout(function(){
//            equal(j._$cookie('name2'),'chenglin2','cookie设置成功，时间过期');start()},500);
//    });
//    
//    test('cookie value path domain expires',function(){
//        var j = NEJ.P('nej.j');
//        var _cookie = j._$cookie("name3",{value:'chenglin3',path:'/',domain:'www.baidu.com',expires:1});
//        stop();
//		setTimeout(function(){
//            notEqual(j._$cookie('name3'),'chenglin3','cookie设置成功，时间过期,domain不是同域名，设置cookie失败');start()},500);
//    });
//    
//    test('_$setDataInStorage',function(){
//        var j = NEJ.P('nej.j');
//        j._$setDataInStorage('name','jack');
//        equal(j._$getDataInStorage('name'),'jack','本地存储localstorage');
//    });
//    
//    test('localstorage然后删除',function(){
//        var j = NEJ.P('nej.j');
//        j._$setDataInStorage('name','jack');
//        j._$delDataInStorage('name');
//        equal(j._$getDataInStorage('name'),null,'本地存储localstorage,然后删除');
//    });
//    
//    test('localstorage，删除后用默认数据',function(){
//        var j = NEJ.P('nej.j');
//        j._$setDataInStorage('name','jack');
//        j._$delDataInStorage('name');
//        equal(j._$getDataInStorage('name'),null,'本地存储localstorage,然后删除');
//        equal(j._$getDataInStorageWithDefault('name','default'),'default','本地存储localstorage,然后删除,数据不存在用默认数据')
//    });
//    
//    test('localstorage清除所有数据',function(){
//        var j = NEJ.P('nej.j');
//        j._$setDataInStorage('name','jack');
//        j._$setDataInStorage('name1','jack1');
//        j._$clearDataInStorage();
//        equal(j._$getDataInStorage('name'),null,'本地存储localstorage,清除所有数据');
//        equal(j._$getDataInStorage('name1'),null,'本地存储localstorage,清除所有数据');
//    });
//	
//	 test('localstorage克隆一份数据',function(){
//        var j = NEJ.P('nej.j');
//        j._$setDataInStorage('name','jack');
//        j._$setDataInStorage('name1','jack1');
//        var _result = j._$cloneDataInStorage({name:'',name1:''});
//		equal(_result['name'],'jack','成功复制数据');
//    });
//	
//	test('cache request',function(){
//		stop();
//		var _cc = c._$$CacheCustom._$allocate({
//			ondataload: function(_ropt){
//				ok(true,'最终的数据处理');
//                start();
//			},
//			dodataload:function(_ropt){
//                j._$request('http://123.163.com:3000/xhr/getLog',{
//	                    type:'json',
//	                    method:'POST',
//	                    data:{name:'cheng-lin'},
//	                    timeout:1000,
//	                    onload:_ropt.onload._$bind(this),
//	                    onerror:function(_data){
//                        
//                        }
//                    }
//                );
//            }
//		})
//		_cc._$getData('a','b');
//		_cc._$getData('a','c');
//		_cc._$getData('a','b');
//	});
	
	test('cache list request',function(){
		stop();
		var _cc = c._$$CacheListCustom._$allocate({
			id:'a',
			onlistload:function(_ropt){
				ok(true,'获取列表数据的回调');
				start();
			},
			onitemload:function(_ropt){
                ok(true,'获取项数据的回调');
				start();
            },
			onitemupdate:function(_item,_key){
				ok(true,'更新项数据的回调');
				start();
			},
			onitemdelete:function(_item,_key){
				ok(true,'删项数据的回调');
				start();
			},
			onitemadd:function(_item,_key){
				ok(true,'增加项数据的回调');
				start();
			}
		});
		_cc._$getList({key:'abc',data:{},offset:0,limit:10})
		_cc._$getList({key:'abc',data:{},offset:0,limit:10})
		_cc._$getItem({id:'abc',key:'123',data:{}})
		_cc._$addItem({
			key: '123',
			item: {},
			push: false
		});
		_cc._$updateItem({
			key:'123',
			item:{}
		});
		_cc._$deleteItem({
			key:'123',
			id:'abc'
		});
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}cache.test.js',['{pro}cache.custom.js',
    	  '{pro}cache.list.custom.js',
    	  '{lib}util/ajax/xdr.js',
    	  '{lib}util/cache/cache.js',
    	  '{lib}util/cache/cookie.js',
    	  '{lib}util/cache/storage.js'],f);
});
  