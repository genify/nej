var f = function(){
    //定义测试模块
    module("connect");
    var p = NEJ.P('nej.j');
    
    //开始单元测试
    test('建立websocket连接', function() {
        p._$connect('ws://127.0.0.1:88/test',{
            onopen:function(){
                ok(true,'连接打开回调函数');
            },
            onerror:function(){
                ok(true,'连接失败回调函数');
            },
            onclose:function(){
                ok(true,'连接关闭回调函数');
            },
            onmessage:function(_event){
                ok(true,'收到消息回调函数'+_event.data);
            }
        });
    });
    
    test('建立eventsource连接', function() {
        p._$connect('http://localhost/data.es',{
            onopen:function(){
                ok(true,'连接打开回调函数');
            },
            onerror:function(){
                ok(true,'连接失败回调函数');
            },
            onclose:function(){
                ok(true,'连接关闭回调函数');
            },
            onmessage:function(_event){
                ok(true,'收到消息回调函数'+_event.data);
            }
        });
    });
    
    test('通过长连接发送消息', function() {
        p._$connect('http://localhost/data.es',{
            onopen:function(){
                ok(true,'连接打开回调函数');
            },
            onerror:function(){
                ok(true,'连接失败回调函数');
            },
            onclose:function(){
                ok(true,'连接关闭回调函数');
            },
            onmessage:function(_event){
                ok(true,'收到消息回调函数'+_event.data);
            }
        });
        try{
            p._$sendDataByCNT('http://localhost/data.es','你好！');
        }catch(e){
            alert(e);
        }
        p._$closeConnection('http://localhost/data.es');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}connectTest.js',
    ['{lib}util/ajax/connect.js','{pro}log.js'],f);
});
