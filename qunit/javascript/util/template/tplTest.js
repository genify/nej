var f = function(){
    //定义测试模块
    module("tpl");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
		_p = _('nej.ut');
    
    test('jst',function(){
        _e._$parseTemplate('jst-box');
		var _content = _e._$getHtmlTemplate('jst-box',{name:'jack'}).trim();
		equal(_content,'<div>jack</div>','解析结果与预期相同');
    });
	
	
	test('txt',function(){
        _e._$parseTemplate('txt-box');
        var _content = _e._$getTextTemplate('txt-box').trim();
        equal(_content,'<div>pure text</div>','解析结果与预期相同');
    });
	
	test('ntp',function(){
        _e._$parseTemplate('ntp-box');
        var _content = _e._$getNodeTemplate('ntp-box',{name:'sean'});
        equal(_content.innerText,'ntp','解析结果与预期相同');
    });
	
	test('js',function(){
        _e._$parseTemplate('js-box');
		ok(true,'会load一个js文件');
    });
	
	test('css',function(){
        _e._$parseTemplate('css-box');
		ok(true,'会load一个css文件');
    });
	
	test('html',function(){
        _e._$parseTemplate('html-box');
		ok(true,'会load一个html文件');
    });
	
	test('res',function(){
        _e._$parseTemplate('res-box');
		ok(true,'加载纯文本文件');
    });
	
	test('item',function(){
		_e._$getItemTemplate([{name:'jack'},{name:'sean'}],_p._$$MyItem,{parent:'item-box'});
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}tplTest.js',
    ['{lib}util/template/tpl.js','{pro}util/template/myItem.js','{pro}log.js'],f);
});
  