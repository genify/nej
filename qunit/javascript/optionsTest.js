var f = function(){
    //定义测试模块
    module("options",{
        setup:function(){
            this._p = NEJ.P('nej.p');
            this._e = NEJ.P('nej.e');
        },
        teardown:function(){
            
        }
    });
    //开始单元测试
    test('options',function(){
        var _pageBox = this._e._$getPageBox();
        ok(true,'获取页面盒信息');
    });
};
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}optionsTest.js',['{lib}base/element.js','{pro}log.js'],f);
});