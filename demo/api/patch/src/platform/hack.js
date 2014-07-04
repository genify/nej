NEJ.define(['{lib}base/platform.js'],
function(){
    var _  = NEJ.P,
        _h = _('nej.h');
    // common api for w3c or es
    _h.__doSomething = function(){};
    console.log('from common hack file');
});