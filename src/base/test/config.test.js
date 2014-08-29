window.NEJ_CONF = {
    'p_frame':['http://nei.netease.com/html/nej_proxy_frame.html'],
    'p_flash':['http://nei.netease.com/proxy/crossdomain.xml']
}
var f = function(){
    //定义测试模块
    module("config");
    var _c = NEJ.P('nej.c');


    //开始单元测试
    test('NEJ配置文件测试', function() {
        var _uri = _c._$getFrameProxy('http://nei.netease.com');
        equal(_uri,'http://nei.netease.com/html/nej_proxy_frame.html','代理文件地址');
        var _flash = _c._$getFlashProxy('http://nei.netease.com');
        equal(_flash,'http://nei.netease.com/proxy/crossdomain.xml','http://nei.netease.com/proxy/crossdomain.xml');
        equal(_c._$get('portrait'),'/res/portrait/','NEJ各文件配置portrait');
        equal(_c._$get('ajax.swf'),'/res/nej_proxy_flash.swf','NEJ各文件配置ajax');
        equal(_c._$get('chart.swf'),'/res/nej_flex_chart.swf','NEJ各文件配置chart');
        equal(_c._$get('audio.swf'),'/res/nej_player_audio.swf','NEJ各文件配置audio');
        equal(_c._$get('video.swf '),'/res/nej_player_video.swf','NEJ各文件配置video');
        equal(_c._$get('clipboard.swf'),'/res/nej_clipboard.swf','NEJ各文件配置clipboard');
        equal(_c._$get('upload.image.swf'),'/res/nej_upload_image.swf','NEJ各文件配置upload');
        equal(_c._$get('storage.swf'),'/res/nej_storage.swf','NEJ各文件配置storage');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}config.test.js',
    ['{lib}base/config.js'],f);
});
