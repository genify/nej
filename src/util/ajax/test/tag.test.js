NEJ.define([
    'util/ajax/tag'
],function(_t){
    module('tag');
    var _j = NEJ.P('nej.j');
    test('loadScript',function(){
        expect(1);
        stop();
        _j._$loadScript('../rest.js',{
             onload:function(){
                ok(true, '载入成功的回调方法');
                start();
                 // 载入成功的回调方法
             },
             onerror:function(_error){
                start();
                 // 抛出异常回调
             }
         });
    });

    test('queueScript',function(){
        expect(1);
        stop();
        _j._$queueScript(['../xdr.js','../dwr.js'],{
             onload:function(){
                ok(true, '载入成功的回调方法');
                    start();
                 // 载入成功的回调方法
             },
             onerror:function(_error){
                start();
                 // 抛出异常回调
             }
         });
    });

    test('loadStyle',function(){
        expect(1);
        stop();
        _j._$loadStyle('./x.css',{
             onload:function(){
                ok(true, '载入成功的回调方法');
                    start();
                 // 载入成功的回调方法
             },
             onerror:function(_error){
                start();
                 // 抛出异常回调
             }
         });
    });

    test('queueStyle',function(){
        expect(1);
        stop();
        _j._$queueStyle(['./x.css','./xx.css'],{
             onload:function(){
                ok(true, '载入成功的回调方法');
                    start();
                 // 载入成功的回调方法
             },
             onerror:function(_error){
                start();
                 // 抛出异常回调
             }
         });
    });

    // test('loadHtml',function(){
    //     return;
    //     expect(1);
    //     stop();
    //     _j._$loadHtml('./message.test.html',{
    //          onload:function(){
    //             ok(true, '载入成功的回调方法');
    //                 start();
    //              // 载入成功的回调方法
    //          },
    //          onerror:function(_error){
    //             start();
    //              // 抛出异常回调
    //          }
    //      });
    // });

    test('loadText',function(){
        expect(1);
        stop();
        _j._$loadText('./xxx.txt',{
             onload:function(){
                ok(true, '载入成功的回调方法');
                    start();
                 // 载入成功的回调方法
             },
             onerror:function(_error){
                ok(true, '载入失败的回调方法');
                start();
                 // 抛出异常回调
             }
         });
    });
});