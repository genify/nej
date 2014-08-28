NEJ.define(['util/clipboard/clipboard'],function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('clipboard',function(){
        expect(0);
        _e._$bindCopyAction('copyBtn','text to clipboard');
    });
});