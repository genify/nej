var f = function(){
    //定义测试模块
    module("rest");
    var j = NEJ.P('nej.j');
    url = "http://123.163.com/webmail/dwr/call/plaincall/DownloadBean.getDownloadUrlByBrandAndModel.dwr";
    
    //开始单元测试
    test('get方式', function() {
        stop();
        var opt = {param:{brand:'nokia',model:'n97'}
              ,data:'111111111'
              ,method:"get"
              ,onload:function(_data){
                    ok(true,"get方式，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"get方式，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('post方式',function(){
        stop();
        var opt = {param:{brand:'nokia',model:'n97'}
              ,data:'123'
              ,method:"post"
              ,onload:function(_data){
                    ok(true,"post方式，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"post方式，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('post方式,data大数字',function(){
        stop();
        var opt = {param:{brand:'nokia',model:'n97'}
              ,data:{nameaaa:99999999999999999999999999999999}
              ,method:"post"
              ,onload:function(_data){
                    ok(true,"post方式,data大数字，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"post方式,data大数字，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('get方式,参数大数字',function(){
        stop();
        var opt = {param:{brand:'nokia',model:'99999999999999999999999999999999'}
              ,data:'123'
              ,method:"get"
              ,onload:function(_data){
                    ok(true,"get方式,参数大数字，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"get方式,参数大数字，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('get方式,禁止超时监测',function(){
        stop();
        var opt = {param:{brand:'nokia',model:'99999999999999999999999999999999'}
              ,data:'123'
              ,method:"get"
              ,time:0
              ,onload:function(_data){
                    ok(true,"get禁止超时监测，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"get禁止超时监测，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('post方式,禁止超时监测',function(){
        stop();
        var opt = {param:{brand:'nokia',model:'99999999999999999999999999999999'}
              ,data:'123'
              ,method:"post"
              ,time:0
              ,onload:function(_data){
                    ok(true,"post禁止超时监测，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"post禁止超时监测，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('get,10秒超时,需要去掉代理测试',function(){
        stop();
        var opt = {param:{brand:'nokia',model:'99999999999999999999999999999999'}
              ,data:'123'
              ,method:"get"
              ,time:10000
              ,onload:function(_data){
                    ok(true,"get10秒超时，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"get10秒超时，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('post,10秒超时,需要去掉代理测试',function(){
        stop();
        var opt = {param:{brand:'nokia',model:'99999999999999999999999999999999'}
              ,data:'123'
              ,method:"post"
              ,time:10000
              ,onload:function(_data){
                    ok(true,"post10秒超时，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"post10秒超时，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('get,function关键字',function(){
        stop();//用关键字funcition
        var opt = {param:{function1:'functiont:start()'}
              ,data:'123'
              ,method:"get"
              ,onload:function(_data){
                    ok(true,"get,function关键字，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"get,function关键字，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('post,function关键字',function(){
        stop();//用关键字funcition
        var opt = {param:{function1:'functiont:start()'}
              ,data:'123'
              ,method:"post"
              ,onload:function(_data){
                    ok(true,"post,function关键字，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"post,function关键字，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
    
    test('REST异常过滤接口',function(){
        stop();//用关键字funcition
        j._$addRESTErrorFilter(function(_error){
            //stopped 把onerror回调阻止掉了
            _error.stopped = true;
            ok(true,'错误回调被阻止了');
            start();
        });
        var opt = {param:{function1:'functiont:start()'}
              ,data:'123'
              ,method:"post"
              ,onload:function(_data){
                    ok(true,"post,function关键字，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"post,function关键字，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST('xxx',opt);
    });
    
    test('REST异常过滤接口',function(){
        stop();//用关键字funcition
        var _filter = function(_error){
            _error.stopped = true;
            ok(true, '错误回调被阻止了');
            start();
        }
        j._$addRESTErrorFilter(_filter);
        j._$delRESTErrorFilter(_filter);
        var opt = {param:{function1:'functiont:start()'}
              ,data:'123'
              ,method:"post"
              ,onload:function(_data){
                    ok(true,"post,function关键字，成功返回数据"+_data);
                  start();
              },onerror:function(_error){
                  ok(true,"post,function关键字，出错了"+_error.message||_error);
                  start();
              }}
        j._$requestByREST(url,opt);
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}restTest.js',
    ['{lib}util/ajax/tag.js','{lib}util/ajax/rest.js','{pro}log.js'],f);
});
