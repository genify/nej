var f = function(){
    //定义测试模块
    module("dwr");
    var j = NEJ.P('nej.j');
    var _phone = Math.random();
    
    //开始单元测试
    test('j._$requestByDWR', function() {
        stop();
        j._$requestByDWR('LogBean.loga',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:true,param:{},onload:function(data){
                             ok(true,"方法名错误，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"方法名错误，401错误,地址未找到                       "+error.message);
                             start();
                         }});
    });
    
    test('异常过滤器',function(){
        stop();
        j._$setFilter(function(_error){
            if(_error.message == 401)
                return true;
        });
        j._$requestByDWR('LogBean.logab',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:true,param:{},onload:function(data){
                             ok(true,"设置了过滤器，过滤401错误，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"设置了过滤器，过滤401错误                       "+error.message);
                             start();
                         }});
    });
    
    test('参数为空',function(){
        stop();
        j._$requestByDWR('LogBean.logbb',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:true,param:{},onload:function(data){
                             ok(true,"参数为空，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"参数为空                       "+error.message);
                             start();
                         }});
    });
    
    test('script参数为false',function(){
        stop();
        j._$requestByDWR('LogBean.log',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:{},onload:function(data){
                             ok(true,"script参数为false，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"script参数为false                      "+error.message);
                             start();
                         }});
    });
    
    test('参数数量不正确',function(){
        stop();
        j._$requestByDWR('LogBean.log',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:{logType:"logType"},onload:function(data){
                             ok(true,"参数数量不正确 ，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"参数数量不正确                       "+error.message);
                             start();
                         }});
    });
    
    test('参数格式不正确',function(){
        stop();
        j._$requestByDWR('LogBean.log',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:{logType:"logType",action:false,value:"value",username:"username"
                         ,account:"account",ip:"ip",fuid:"fuid"},onload:function(data){
                             ok(true,"参数格式不正确 ，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"参数格式不正确                       "+error.message);
                             start();
                         }});
    });
    
    test('正常的调用',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],onload:function(data){
                             ok(true,"正常的调用，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"正常的调用                       "+error.message);
                             start();
                         }});
    });
    
    test('正常的调用,设置batchId',function(){
        stop();
        j._$setBatchId('batchId-12345');
        //request will use betchId
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],onload:function(data){
                             ok(true,"正常的调用，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"正常的调用                       "+error.message);
                             start();
                         }});
    });
    
    test('批处理正常的调用',function(){
        stop();
        j._$beginBatch();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],onload:function(data){
                             ok(true,"正常的调用，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"正常的调用                       "+error.message);
                             start();
                         }});
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n98"],onload:function(data){
                             ok(true,"正常的调用，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"正常的调用                       "+error.message);
                             start();
                         }});
        j._$endBatch();
    });
    
    test('正常的调用，在地址后面带参数',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         query:'test=true',
                         script:false,param:["nokia","n97"],onload:function(data){
                             ok(true,"正常的调用，在地址后面带参数，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"正常的调用，在地址后面带参数                       "+error.message);
                             start();
                         }});
    });
    
    test('正常的调用，在地址后面带错误参数',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         query:'a=123&b=',
                         script:false,param:["nokia","n97"],onload:function(data){
                             ok(true,"正常的调用，在地址后面带错误参数，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"正常的调用，在地址后面带错误参数                       "+error.message);
                             start();
                         }});
    });
    
    test('参数列表不传',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,onload:function(data){
                             ok(true,"参数列表不传，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"参数列表不传                       "+error.message);
                             start();
                         }});
    });
    
    test('用xmpp代理',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         param:["nokia","n97"],
                         script:false,proxy:'xmpp',onload:function(data){
                             ok(true,"用xmpp代理，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"用xmpp代理                       "+error.message);
                             start();
                         }});
    });
    
    test('用同步的方式',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],sync:true,
                         onload:function(data){
                             ok(true,"用同步的方式，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"用同步的方式                      "+error.message);
                             start();
                         }});
    });
    
    test('用异步的方式',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],sync:false,
                         onload:function(data){
                             ok(true,"用异步的方式，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"用异步的方式                      "+error.message);
                             start();
                         }});
    });
    
    test('用异步的方式,get方式',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],sync:false,method:'get',
                         onload:function(data){
                             ok(true,"用异步的方式，get方式，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"用异步的方式 ，get方式                     "+error.message);
                             start();
                         }});
    });
    
    test('用同步的方式，get方式，空的头信息',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],headers:[],sync:false,method:'get',
                         onload:function(data){
                             ok(true,"用同步的方式，get方式，空的头信息，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"用同步的方式，get方式，空的头信息                      "+error.message);
                             start();
                         }});
    });
    
    test('用同步的方式，post方式',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],sync:false,
                         onload:function(data){
                             ok(true,"用同步的方式，post方式，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"用同步的方式，post方式                      "+error.message);
                             start();
                         }});
    });
    
    test('用异步的方式，post方式，空的头信息',function(){
        stop();
        j._$requestByDWR('DownloadBean.getDownloadUrlByBrandAndModel',
                        {path:'http://123.163.com/webmail/dwr/call/plaincall/',
                         script:false,param:["nokia","n97"],headers:[],sync:false,
                         onload:function(data){
                             ok(true,"用异步的方式，post方式，空的头信息，dwr本身成功");
                             start();
                         },onerror:function(error){
                             ok(true,"用异步的方式，post方式，空的头信息                      "+error.message);
                             start();
                         }});
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}dwrTest.js',
    ['{lib}util/ajax/tag.js','{lib}util/ajax/dwr.js','{pro}log.js'],f);
});
