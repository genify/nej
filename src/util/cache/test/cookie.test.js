NEJ.define(['util/cache/cookie'],function(_j){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('cookie',function(){
        expect(1);
        _j._$cookie('name',{value:'abc'});
        equal(_j._$cookie('name'),'abc','set cookie 成功');
    });

    test('cookie',function(){
        expect(1);
        _j._$cookie('name','');
        _j._$cookie('name',{expires:-1});
        equal(_j._$cookie('name'),'','delete cookie 成功');
    });

     test('cookie',function(){
        expect(1);
        var _cookie = _j._$cookie('name2',{
               value:'abc',
               path:'/',
               domain:'nei.hz.netease.com',
               expires:1
           });
        equal(_j._$cookie('name2'),'abc','name2 set cookie 成功');
    });
});