var f = function(){
    //定义测试模块
    module("ui-mp3");
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');

    //开始单元测试
    test('mp3',function(){
    	expect(0);
        // var _mp3 = _p._$$MP3Player._$allocate({
        //     parent:'box',
        //     list:[]
        // });

        // _mp3 = _p._$$MP3Player._$recycle(_mp3);
        var _mp3 = _p._$$MP3Player._$allocate({
            parent:'box',
            mode:1,
            list:['http://www.zhlongyin.com/UploadFiles/xrxz/2011/5/201105051307513619.mp3',
                  'http://www.zhlongyin.com/UploadFiles/xrxz/2012/2/201202201555569985.mp3']
        });
        // setTimeout(function(){
        //     _mp3._$refreshList({
        //         list:[]
        //     });
        // }._$bind(this),5000);
        // 2秒后开始播放
        // setTimeout(function(){
        //     _mp3._$play();
        // }._$bind(this),2000);
        // 5秒后切换歌曲列表
        // setTimeout(function(){
        //     _mp3._$refreshList({
        //         list:['../../../qunit/res/海阔天空 - 豆瓣FM.mp3',
        //               '../../../qunit/res/开始懂了 - 豆瓣FM.mp3']
        //     });
        // }._$bind(this),3000);
        // setTimeout(function(){
        //     _mp3._$play();
        // },5000)
        // setTimeout(function(){
        //     _p._$$MP3Player._$recycle(_mp3);
        // }._$bind(this),10000);

        // setTimeout(function(){
        //     var _mp3 = _p._$$MP3Player._$allocate({
        //     parent:'box',
        //     mode:0,
        //     list:['../../../qunit/res/开始懂了 - 豆瓣FM.mp3']
        // });
        // }._$bind(this),15000);
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}mp3.test.js',['ui/audio/mp3'],f);
});