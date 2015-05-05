NEJ.define(['lib/base/event','{lib}util/ajax/message.js'],function(_v,_j){
    _v._$addEvent('sendMsg','click',function(_event){
        _j._$postMessage('_top',{data:'{"name":"nihao"}'});
    });
});
