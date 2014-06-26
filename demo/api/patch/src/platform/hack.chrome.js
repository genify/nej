NEJ.define(['./hack.js'],
function(){
    // variable declaration
    var _  = NEJ.P,
        _p = _('nej.p');
    if (_p._$NOT_PATCH.webkit) return;
    console.log('from chrome dep file');
});



