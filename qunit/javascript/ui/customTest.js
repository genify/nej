var f = function(){
    //定义测试模块
    module("custom",{
        setup:function(){
            this._e = nej.e;
            this._ui = nej.ui;
        }
    });
    //开始单元测试
    test('生成一个富文本编辑器',function(){
        expect(0);
        var _parent = this._e._$get('editor-parent');
        var _custom = this._ui._$$CustomEditor._$allocate({
            parent:_parent,
            clazz:'mycustom'
        });
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}customTest.js',['{lib}ui/editor/custom.js','{lib}base/element.js','{pro}log.js'],f);
});