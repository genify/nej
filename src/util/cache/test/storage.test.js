NEJ.define(['util/cache/storage','util/encode/json'],function(_t){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('storage',function(){
        expect(1);
        _t._$setDataInStorage('a','b');
        equal(_t._$getDataInStorage('a'),'b','storage --set，get成功');
    });
    test('storage',function(){
        expect(1);
        equal(_t._$getDataInStorageWithDefault('ccc','ccc'),'ccc','有默认数据')
    });
    test('storage',function(){
        expect(1);
        _t._$delDataInStorage('a','b');
        equal(_t._$getDataInStorage('a'),undefined,'storage --set，get成功');
    });
});