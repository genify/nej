var f = function(){
    //定义测试模块
    module("ui-mp3");
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui');
        
    //开始单元测试
    test('mp3',function(){
    	expect(0);
        var _mp3 = _p._$$MP3Player._$allocate({
            parent:'box',
            mode:2,
            autostart:false,
            list:[]
        });
        // var _mp3 = _p._$$MP3Player._$allocate({
        //     parent:'box',
        //     mode:2,
        //     autostart:true,
        //     list:['../../../qunit/res/毕业纪念册 - 豆瓣FM.mp3',
        //           '../../../qunit/res/海阔天空 - 豆瓣FM.mp3',
        //           '../../../qunit/res/开始懂了 - 豆瓣FM.mp3']
        // });
        // // 2秒后开始播放
        // setTimeout(function(){
        //     _mp3._$play();
        // }._$bind(this),2000);
        // 5秒后切换歌曲列表
        setTimeout(function(){
            _mp3._$refreshList({
                mode:1,
                list:['../../../qunit/res/开始懂了 - 豆瓣FM.mp3']
            });
        }._$bind(this),3000);

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
    define('{pro}ui/mp3Test.js',['{lib}ui/audio/mp3.js','{pro}log.js'],f);
});