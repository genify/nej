var f = function(){
    //定义测试模块
    module("custom",{
        setup:function(){
            this._e = nej.e;
            this._ui = nej.ui;
            this._v = nej.v;
            this._dd = NEJ.P('dd.widget')
        }
    });
    //开始单元测试
    // test('生成一个富文本编辑器',function(){
    //     expect(0);
    //     var _getcnt = this._e._$get('getcnt');
    //     var _parent = this._e._$get('editor-parent');
    //     var _custom = this._ui._$$CustomEditor._$allocate({
    //         parent:_parent,
    //         clazz:'mycustom'
    //     });
    //     this._v._$addEvent(_getcnt,'click',function(){
    //         var x = _custom.__editor.__copt.area._$getContent();
    //         alert(_custom.__editor.__copt.area._$getSelectText());
    //     }._$bind(this));
    // });
    test('生成一个富文本编辑器',function(){
        expect(0);
        var _getcnt = this._e._$get('getcnt');
        var _parent = this._e._$get('editor-parent');
        var _custom = this._dd._$$Editor._$allocate({
            parent:_parent,
            clazz:'mycustom'
        });
        // this._v._$addEvent(_getcnt,'click',function(){
        //     var x = _custom.__editor.__copt.area._$getContent();
        //     alert(_custom.__editor.__copt.area._$getSelectText());
        // }._$bind(this));
    });
}
module('依赖模块');

test('define',function(){expect(0);
    define('{pro}src/ui/customTest.js',[
        '{lib}widget/A/src/a.js',
        '../../..////../src/ui/editor/custom.js',
        '{lib}/base/element.js',
        '{pro}ui/myeditor.js',
        '{pro}log.js'
        ],f);
});
// test('define',function(){expect(0);
//     define('{pro}src/ui/customTest.js',[
//         '{lib}base/platform.js',
//         '../mywidget/{platform}hack.js',
//         '../../..////../src/ui/editor/custom.js',
//         '{lib}/base/element.js',
//         '{pro}log.js'
//         ],f);
// });
