var f = function(){
    //定义测试模块
    module("config");
    var _c = NEJ.P('nej.c');

    //开始单元测试
    test('NEJ配置文件测试', function() {
        var _uri = _c._$getFrameProxy('nei.netease.com');
        equal(typeof(_uri),'string','代理文件地址');
        var _flash = _c._$getFlashProxy();
        equal(typeof(_flash),'string','Flash跨域Ajax配置文件');
        equal(typeof(_c._$get('portrait')),'string','NEJ各文件配置portrait');
        equal(typeof(_c._$get('ajax.swf')),'string','NEJ各文件配置ajax');
        equal(typeof(_c._$get('chart.swf')),'string','NEJ各文件配置chart');
        equal(typeof(_c._$get('audio.swf')),'string','NEJ各文件配置audio');
        equal(typeof(_c._$get('video.swf ')),'string','NEJ各文件配置video');
        equal(typeof(_c._$get('clipboard.swf')),'string','NEJ各文件配置clipboard');
        equal(typeof(_c._$get('upload.image.swf')),'string','NEJ各文件配置upload');
        equal(typeof(_c._$get('storage.swf')),'string','NEJ各文件配置storage');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}config.test.js',
    ['{lib}base/config.js'],f);
});
