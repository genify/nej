var f = function(){
    //定义测试模块
    module("Request");
    
    var _  = NEJ.P,
        _j = _('nej.j'),
		_v = _('nej.v');
    
    test('xdr0',function(){
        stop();
		var _url = 'http://123.163.com:3000/xhr/getLog';
		_i = 0;
		var _requestId = _j._$request(_url,{
			sync:true,
			type:'json',
			data:'hello',
			query:'a='+_i,
			method:'post',
            timeout:3000,
			mode:_i,
            onload:function(_data){
				ok(true,'成功返回数据');
				start();
			},
            onerror:function(_error){
                ok(false,_i + '出异常，或者超时了' + _error.message);
				start();
            },
			onbeforerequest:function(_data){
                // ok(true,'请求前的处理onbeforerequest');
            }
		});
    });

    test('xdr1',function(){
        stop();
		var _url = 'http://123.163.com:3000/xhr/getLog';
		_i = 1;
		var _requestId = _j._$request(_url,{
			sync:true,
			type:'json',
			data:'hello',
			query:'a='+_i,
			method:'post',
            timeout:3000,
			mode:_i,
            onload:function(_data){
				ok(true,'成功返回数据');
				start();
			},
            onerror:function(_error){
                ok(false,_i + '出异常，或者超时了' + _error.message);
				start();
            },
			onbeforerequest:function(_data){
                // ok(true,'请求前的处理onbeforerequest');
            }
		});
    });

    test('xdr2',function(){
        stop();
		var _url = 'http://123.163.com:3000/xhr/getLog';
		_i = 2;
		var _requestId = _j._$request(_url,{
			sync:true,
			type:'json',
			data:'hello',
			query:'a='+_i,
			method:'post',
            timeout:3000,
			mode:_i,
            onload:function(_data){
				ok(true,'成功返回数据');
				start();
			},
            onerror:function(_error){
                ok(false,_i + '出异常，或者超时了' + _error.message);
				start();
            },
			onbeforerequest:function(_data){
                // ok(true,'请求前的处理onbeforerequest');
            }
		});
    });

    test('xdr3',function(){
        stop();
		var _url = 'http://123.163.com:3000/xhr/getLog';
		_i = 3;
		var _requestId = _j._$request(_url,{
			sync:true,
			type:'json',
			data:'hello',
			query:'a='+_i,
			method:'post',
            timeout:3000,
			mode:_i,
            onload:function(_data){
				ok(true,'成功返回数据');
				start();
			},
            onerror:function(_error){
                ok(false,_i + '出异常，或者超时了' + _error.message);
				start();
            },
			onbeforerequest:function(_data){
                // ok(true,'请求前的处理onbeforerequest');
            }
		});
    });
	
	
//	test('message',function(){
//		stop();
//		_v._$addEvent(window,'message',function(_event){
//			equal(_event.data,'你好！','消息成功返回,异常为nej_proxy_frame.html页面抛出');
//		})
//		_j._$postMessage('message',{
//			data:'你好',
//			origin:'*'
//		});
//	});
	
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}loadTest.js',
    ['{lib}util/ajax/xdr.js','{lib}util/ajax/message.js','{pro}log.js'],f);
});
