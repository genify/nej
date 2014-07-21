var f = function(){
    //定义测试模块
    module("suggest",{
        setup:function(){
            this._e = nej.e;
            this._ui = nej.ui;
        }
    });
    
    //开始单元测试
    test('生成一个suggest', function() {
        expect(0);
        var _input = this._e._$get('suggest-input');
        var _onchage = function(_value){
            _suggest._$setList(['0','1','2','3','4','5','6','7','8','9']);
        };
        var _onselect = function(_value,_options){
            console.log(_options.type);
        };
        var _suggest = this._ui._$$Suggest._$allocate({
            input:_input,
            onchange:_onchage._$bind(this),
            onselect:_onselect._$bind(this)
        });
        
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}suggest.test.js',
    ['{lib}ui/suggest/suggest.js','{lib}base/element.js'],f);
});
  