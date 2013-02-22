var f = function(){
    //定义测试模块
    module("sorter");
    var p = NEJ.P('nej.ut'),
	    e = NEJ.P('nej.e'),
        u = NEJ.P('nej.u');
    
    //开始单元测试
    test('生成排序控件', function() {
        expect(0);
        stop();
        var _selector = p._$$MultiSelector._$allocate({
            parent:'selector'
        });
        var _sorter = p._$$Sorter._$allocate({
            selector:_selector,
            holder:'holder',
            mover:'mover',
			onbeforesort:function(_options){
			},
			onaftersort:function(_options){
                var _list = _options.list,
                    _p    = e._$get('selector');
                // 刷新父亲节点
                _p.innerHTML = '';
                u._$forEach(_list,function(_item){
                    _p.appendChild(_item);
                });
			},
			onsort:function(_options){
			}
        });
        start();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}sorterTest.js',
    ['{lib}util/selector/selector.js','{lib}util/sorter/sorter.js','{pro}log.js'],f);
});
