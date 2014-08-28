var f = function(){
    //定义测试模块
    module("constant");
    var _p =    NEJ.P('nej.g');

    //开始单元测试
    test('测试静态变量', function() {
        equal(typeof(_p._$CODE_NOTASGN),'number','需要指定的参数未指定');
        equal(typeof(_p._$CODE_NOTSPOT),'number','不支持操作');
        equal(typeof(_p._$CODE_TIMEOUT),'number','操作超时');
        equal(typeof(_p._$CODE_ERREVAL),'number','字符串作为脚本执行异常');
        equal(typeof(_p._$CODE_ERRCABK),'number','回调执行异常');
        equal(typeof(_p._$CODE_ERRSERV),'number','服务器返回异常');
        equal(typeof(_p._$CODE_ERRABRT),'number','异常终止的错误码');
        equal(_p._$HEAD_CT,'Content-Type','请求头content-type统一名称');
        equal(_p._$HEAD_CT_PLAN,'text/plain','文本请求头content-type值');
        equal(_p._$HEAD_CT_FILE,'multipart/form-data','文件请求头content-type值');
        equal(_p._$HEAD_CT_FORM,'application/x-www-form-urlencoded','表单请求头content-type值');
        equal(_p._$BLANK_IMAGE,'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==','空图片BASE64编码地址');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}constant.test.js',
    ['{lib}base/constant.js'],f);
});
