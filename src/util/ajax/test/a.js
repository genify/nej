NEJ.define(['{lib}base/event.js','{lib}util/ajax/message.js'],function(_v,_j){
    _v._$addEvent('openIframe','click',function(){
        var _iframe = document.createElement('iframe');
        _iframe.src = 'http://b.c.com:8000/util/ajax/test/b.html';
        _iframe.id = "loginFrame";
        document.body.appendChild(_iframe);
        _iframe.style.width = '200px';
        _iframe.style.height = '400px';
        _iframe.style.position = 'absolute';
        _iframe.style.border = '1px solid #ccc';
        _iframe.style.zIndex = '9999';
        _iframe.style.top = '100px';
        _iframe.style.left = '50%';
        _iframe.style.marginLeft = '-100px';
    });

    _v._$addEvent(window,'message',function(_event){
        alert(_event.data);
    })
});
