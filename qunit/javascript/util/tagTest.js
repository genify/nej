var f = function(){
    //定义测试模块
    module("tag");
    var j = NEJ.P('nej.j');
    //开始单元测试
	test('j._$loadHtml',function(){
		stop();
        j._$loadHtml('errorurl.html',{
            onerror:function(_message){
                _state = 'onerror';
                start();
            },
            onloaded:function(_empty){
                _state = 'onloaded';
				if(!!_empty)
                    ok(true,'一个错误的地址找不到，触发onload');
                start();
            },
            onloadeding:function(){
                _state = 'onloadeding';
            }
        });
	});
//	
//    test('j._$loadHtml()', function() {
//        var _state = 'start';
//        stop();
//        j._$loadHtml('',{
//            onerror:function(){
//                _state = 'onerror';
//                start();
//            },
//            onloaded:function(_empty){
//                ok(true,'url为空时正常流程');
//                _state = 'onloaded';
//                start();
//            },
//            onloadeding:function(){
//                _state = 'onloadeding';
//                start();
//            }
//        });
//        stop();
//        j._$loadHtml('/qunit/html/empty.html',{
//            onerror:function(){
//                _state = 'onerror';
//                start();
//            },
//            onloaded:function(){
//                _state = 'onloaded';
//                ok(true,'url地址正确触发onloaded');
//                start();
//            },
//            onloadeding:function(){
//                _state = 'onloadeding';
//            }
//        });
//        stop();
//        j._$loadHtml('http://baidu.com',{
//            onerror:function(){
//                _state = 'onerror';
//            },
//            onloaded:function(){
//                _state = 'onloaded';
//                ok(true,'url地址正确触发onloaded');
//                start();
//            },
//            onloadeding:function(){
//                _state = 'onloadeding';
//            }
//        });
//    });
//    test('loadScript',function(){
//        stop();
//        j._$loadScript('',{
//            async:true,
//            timeout:5000,
//             version:'version-001',
//             charset:'utf-8',
//            onerror:function(_error){
//                //地址为空只触发错误回调
//                ok(true,'地址为空，加载脚本出错error code: '+_error.code + 'error Message: '+ _error.message);
//                start();
//            },
//            onloaded:function(){
//                ok(true,'载入脚本后的回调');
//                start();
//            },
//            onloading:function(){
//                ok(true,'加载中的回调');
//            }
//        });
//    });
//    
//    test('loadScript',function(){
//        stop();
//        j._$loadScript('http://127.0.0.1:8000/qunit/res/forTagTest.js',{
//            async:true,
//            timeout:5000,
//             version:'version-001',
//             charset:'utf-8',
//            onerror:function(_error){
//                ok(true,'正确地址,加载脚本出错');
//                start();
//            },
//            onloaded:function(){
//                ok(true,'正确地址，载入脚本后的回调');
//                start();
//            },
//            onloading:function(){
//                ok(true,'正确地址，加载中的回调');
//            }
//        });
//    });
//    
//    test('queueScript',function(){
//        stop();
//        j._$queueScript(['/qunit/res/forTagTest.js','/qunit/res/forTagTest2.js'],{
//            async:true,
//            timeout:5000,
//             version:'version-001',
//             charset:'utf-8',
//            onerror:function(_error){
//                ok(true,'正确地址,加载脚本出错');
//                start();
//            },
//            onloaded:function(){
//                ok(true,'正确地址，载入脚本后的回调');
//                start();
//            },
//            onloading:function(){
//                ok(true,'正确地址，加载中的回调');
//            }
//        });
//    });
//    
//    test('loadStyle',function(){
//        stop();
//        j._$loadStyle('/qunit/res/forLoadCss.css',{
//            timeout:5000,
//            version:'version-001',
//            onerror:function(){
//                ok(true,'正确地址,加载样式出错');
//                start();
//            },
//            onloaded:function(){
//                ok(true,'正确地址,加载样式完成');
//                start();
//            },
//            onloading:function(){
//                ok(true,'正确地址,加载样式中');
//            }
//        });
//    });
//    
//    test('queueStyle',function(){
//        stop();
//        j._$queueStyle(['/qunit/res/forLoadCss.css','/qunit/res/forLoadCss2.css'],{
//            timeout:5000,
//            version:'version-001',
//            onerror:function(){
//                ok(true,'正确地址,加载样式出错');
//                start();
//            },
//            onloaded:function(){
//                ok(true,'正确地址,加载样式完成');
//                start();
//            },
//            onloading:function(){
//                ok(true,'正确地址,加载样式中');
//            }
//        });
//    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}tagTest.js',
          ['{lib}util/ajax/tag.js','{pro}log.js'],f);
});
