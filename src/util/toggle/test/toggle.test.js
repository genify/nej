NEJ.define(['util/toggle/toggle'],function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('toggle',function(){
        _e._$toggle('click-bar',{element:'toggle-node',clazz:'cxx'});
        _v._$dispatchEvent('click-bar','click');
        equal(_e._$get('toggle-node').className.indexOf('cxx') >= 0,true,'toggle')

        // // 同时自定义切换样式和节点
        // _e._$toggle('click-bar',{
        //     clazz:'js-show',
        //     element:'toggle-node',
        //     ontoggle:function(_event){
        //         // _event.clazz   切换的样式名称
        //         // _event.target  触发切换事件的节点
        //         // _event.toggled 是否增加了切换样式
        //         debugger;
        //         // TODO
        //     }
        // });
    });
});