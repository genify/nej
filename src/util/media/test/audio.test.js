var f = function(){
    //定义测试模块
    module("audio");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
    
    test('audio',function(){
        expect(0);
		var _mda = _p._$$MediaAudio._$allocate({
			preload:false,
			url:'http://www.zhlongyin.com/UploadFiles/xrxz/2011/5/201105051307513619.mp3',
			onstatechange:function(_event){
			}
		});
		_mda = _p._$$MediaAudio._$recycle(_mda);
		_mda = _p._$$MediaAudio._$allocate({
            preload:false,
            url:'http://www.zhlongyin.com/UploadFiles/xrxz/2011/5/201105051307513619.mp3',
            onstatechange:function(_event){
            }
        });
		_mda = _p._$$MediaAudio._$recycle(_mda);
        _mda = _p._$$MediaAudio._$allocate({
            preload:false,
            url:'http://www.zhlongyin.com/UploadFiles/xrxz/2011/5/201105051307513619.mp3',
            onstatechange:function(_event){
            }
        });
		_mda._$play();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}audio.test.js',
    ['{lib}util/media/audio.js'],f);
});
  