NEJ.define(['util/counter/counter'],function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('counter',function(){
        expect(0);
        _e._$counter('input-id-0',{
            onchange:function(_event){
             // 自定义提示内容
             _event.value = '还可输入input'+_event.delta+'字';
            }
        });
        _e._$counter('input-id-1',{
            onchange:function(_event){
             // 自定义提示内容
             _event.value = '还可输入input'+_event.delta+'字';
            }
        });

        _e._$counter('textarea-id-0',{
            onchange:function(_event){
             // 自定义提示内容
             _event.value = '还可输入textarea'+_event.delta+'字';
            }
        });

        _e._$counter('textarea-id-1',{
            onchange:function(_event){
             // 自定义提示内容
             _event.value = '还可输入textarea'+_event.delta+'字';
            }
        });
    });
});