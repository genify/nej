var f = function(){
    //定义测试模块
    module("audio");
    //开始单元测试
    test('audio',function(){
        expect(0);
        var _audio = nej.ui._$$AudioPlayer._$allocate({
            parent:document.getElementById('id-box'),
            title:'Track01',
            url:'http://www.zhlongyin.com/UploadFiles/xrxz/2011/5/201105051307513619.mp3',
			onstatechange:function(_event){
			}
        });
        setTimeout(function(){
            _audio._$play();
        },500);
//        _audio._$pause();
//        _audio._$stop();
//        _audio._$play();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}audio.test.js',['{lib}ui/audio/audio.js'],f);
});