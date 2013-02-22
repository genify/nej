var f = function(){
    //定义测试模块
    module("Load");
    
    var _  = NEJ.P,
        _p = _('nej.ut.j'),
		_j = _('nej.j');
    
    test('load HTML资源',function(){
        stop();
        var _htmlLoad = _p._$$HtmlLoader._$allocate({timeout:30000,
              onloaded:function(){
                ok(true,'载入HTML资源成功');
                start();
              }});
        _htmlLoad._$load('../../../html/util/formTest.html');
    });
	
	test('load HTML资源，通过api',function(){
        stop();
		_j._$loadHtml('../../../html/util/formTest.html',{
              onloaded:function(){
                ok(true,'载入HTML资源成功');
                start();
              }});
    });
    
    test('load script资源',function(){
        stop();
        var _scriptLoad = _p._$$ScriptLoader._$allocate({
              onloaded:function(){
                ok(true,'载入script资源成功');
                start();
              }});
        _scriptLoad._$load('../../../javascript/log.js');
    });
	
	 test('load script资源，通过api',function(){
        stop();
        _j._$loadScript('../../../javascript/log.js',{
              onloaded:function(){
                ok(true,'载入script资源成功');
                start();
              }});
    });
	
    test('load style资源',function(){
        stop();
        var _styleLoad = _p._$$StyleLoader._$allocate({
              onloaded:function(){
                ok(true,'载入style资源成功');
                start();
              }});
        _styleLoad._$load('../../../base/qunit.css');
    });
	
	 test('load style资源，通过api',function(){
        stop();
        _j._$loadStyle('../../../base/qunit.css',{
              onloaded:function(){
                ok(true,'载入style资源成功');
                start();
              }});
    });
	
	test('载入队列资源',function(){
		stop();
		var _list = ['../../../html/util/formTest.html','../../../html/util/cacheTest.html']
        var _styleLoad = _p._$$HtmlLoader._$allocate({
              onloaded:function(){
                ok(true,'载入html资源队列成功');
                start();
              }});
        _styleLoad._$queue(_list);
	});
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}loadTest.js',
    ['{lib}util/ajax/tag.js','{lib}util/ajax/loader/html.js','{lib}util/ajax/loader/script.js'
    ,'{lib}util/ajax/loader/style.js','{pro}log.js'],f);
});
  