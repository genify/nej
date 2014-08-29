NEJ.define(['util/file/save'],function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('save',function(){
        expect(1);
        stop();
        _e._$bindSaveAsAction('save-box',{
            name:'xxx',
            url:function(){
                ok('save ok');
                start();
                return 'xxx'
            }
        });
    });
});