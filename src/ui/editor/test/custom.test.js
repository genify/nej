var f = function(){
    //定义测试模块
    module("custom",{
        setup:function(){
            this._e = nej.e;
            this._ui = nej.ui;
            this._v = nej.v;
        }
    });
    //开始单元测试
    test('生成一个富文本编辑器',function(){
        expect(0);
        var _getcnt = this._e._$get('getcnt');
        var _parent = this._e._$get('editor-parent');
        var _insert = this._e._$get('insert');
        var _istiframe = this._e._$get('insertIframe');
        window._custom = this._ui._$$CustomEditor._$allocate({
            parent:_parent,
            clazz:'mycustom'
        });
        this._v._$addEvent(_getcnt,'click',function(){
            alert(_custom.__editor.__copt.area._$getContent({noId:true}));
        }._$bind(this));
        this._v._$addEvent(_insert,'click',function(){
            window._custom.__editor.__copt.area._$execCommand('inserthtml','<img style="max-width:520px;" src="https://www.baidu.com/img/baidu_jgylogo3.gif?v=33154426.gif" id="1" />')
        }._$bind(this));
        this._v._$addEvent(_istiframe,'click',function(){
            window._custom.__editor.__copt.area._$execCommand('inserthtml','<div>789</div>')
        }._$bind(this));
    });
}
module('依赖模块');

test('define',function(){expect(0);
    define('{pro}custom.test.js',[
        '../custom.js',
        'base/element'
        ],f);
});
// test('define',function(){expect(0);
//     define('{pro}src/ui/customTest.js',[
//         'base/platform',
//         '../mywidget/{platform}hack.js',
//         '../../..////../src/ui/editor/custom.js',
//         'base/element',
//         '{pro}log.js'
//         ],f);
// });
