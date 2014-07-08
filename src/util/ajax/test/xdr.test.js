var f = function(){
    //定义测试模块
    module("xdr",{
        setup:function(){
            this._p = NEJ.P('nej.p');
            this._e = NEJ.P('nej.e');
            this._j = NEJ.P('nej.j');
        },
        teardown:function(){
            
        }
    });
    
    //开始单元测试
    test('正常的xdr', function() {
        expect(0);
        stop();
        var _url = 'http://123.163.com:3000/xhr/getLog';
		var _obj = {};
        this._j._$request(_url,{
                type:'json',
                method:'post',
                data:_obj,
                timeout:1000,
                onload:function(_data){
                    if(!!_data)
                        ok(true,'请求正常返回，返回值是' + _data.name);
                    start();
                },
                onerror:function(_error){
                    start();
                }}
            );
    });
	
//	test('设置过滤器的xdr', function() {
//        stop();
//		this._j._$filter(function(_event){
//			if(_event.type == 'onerror'){
//				// 如果过滤掉，测试无法完成
//				if(_event.result.data == 404)
//				    _event.stopped = false;
//			}
//		});
//        this._j._$request('http://123.163.com:3003/xhr/xxx',{
//                type:'json',
//                method:'POST',
//                data:{name:'cheng-lin'},
//                timeout:3000,
//                onload:function(_data){
//                    if(!!_data)
//                        ok(true,'请求正常返回，返回值是' + _data.name);
//                    start();
//                },
//                onerror:function(_error){
//                    start();
//                }}
//            );
//    });
//	
//	test('中途中断请求',function(){
//		stop();
//        var _reqID = this._j._$request('http://123.163.com:3003/xhr/xxx',{
//               type:'json',
//               method:'POST',
//               data:{name:'cheng-lin'},
//               timeout:60000,
//               onload:function(_data){
//				start();
//               },
//               onerror:function(_error){
//				start();
//               }}
//           );
//       // 1秒后中断掉这个请求
//       window.setTimeout(function(){
//           this._j._$abort(_reqID);
//       }._$bind(this),1000);
//	});
//	
//	test('upload表单,高级浏览器',function(){
//		var _upload = this._e._$get('upload');
//		this._j._$upload(_upload,{mode:0,nocookie:false,
//			onuploading:function(_data){
//				if(!!_data.total&&_data.progress){
//	                ok(true,'打印出一个进度来'+_data.progress)
//				}
//			},onload:function(_url){
//	            start();
//	        }
//		});
//	});
//	
	test('upload表单,低版本浏览器',function(){
		stop();
        var _upload = this._e._$get('upload');
		var _progress = this._e._$get('progress');
        this._j._$upload(_upload,{mode:0,nocookie:true,
		onuploading:function(_data){
            if(!!_data.total&&_data.progress){
				_progress.value = _data.progress;
                ok(true,'打印出一个进度来'+_data.progress)
            }
        },
		onload:function(_url){
			ok(true,_url.url);
			start();
		}});
    });
	
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}xdr.test.js',
    ['{lib}util/ajax/xdr.js'],f);
});
  