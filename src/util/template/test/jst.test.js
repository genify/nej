NEJ.define([
    'util/template/jst'
],function(_t){
    var _e = NEJ.P('nej.e');
    var _html;
    test('getHtmlTemplateSeed',function(){
        var _seed = _t._$getHtmlTemplateSeed();
        equal(typeof(_seed),'number','seed是数字');
        equal(_seed>0,true,'seed长度大于0');
    });

    test('addHtmlTemplate',function(){
        _html = _t._$addHtmlTemplate('<div id="${name}">name</div>');
        equal(typeof(_html),'string','返回id是字符串');
        equal(_html.length>0,true,'返回id长度大于0');
    });

    test('getHtmlTemplate',function(){
        _html = _t._$addHtmlTemplate('<div id="${name}">name</div>');
        var _htmltmp = _t._$getHtmlTemplate(_html);
        equal(_htmltmp,'<div id="">name</div>','成功根据id获取html');
    });

    test('renderHtmlTemplate',function(){
        _t._$renderHtmlTemplate('item-box',_html,{name:'cheng-lin'});
        equal(_e._$getChildren(_e._$get('item-box'))[0].id,'cheng-lin','成功渲染了模版');
    });

    test('registJSTExt',function(){
        _t._$registJSTExt({
            freplace:function(_str){
                return (_str||'').replace(/-/,'');
            }
        })
        _html = _t._$addHtmlTemplate('<div id="${name|freplace}">name</div>');
        _t._$renderHtmlTemplate('item-box',_html,{name:'cheng-lin'});
         equal(_e._$getChildren(_e._$get('item-box'))[0].id,'chenglin','注册的方法截掉了中间的-');
    });

});