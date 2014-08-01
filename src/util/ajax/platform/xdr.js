/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '../proxy/xhr.js',
    '../proxy/flash.js',
    '../proxy/frame.js',
    '../proxy/upload.js'
],function(_t0,_t1,_t2,_t3,_p,_o,_f,_r){
    /**
     * 根据模式返回代理实例，模式说明
     * 0 - 自动模式，高版本使用HTML5的CORS协议，低版本采用Frame代理方式
     * 1 - 高版本使用HTML5的CORS协议，普通请求低版本采用Flash代理方式
     * 2 - 全部使用Frame代理方式
     * 3 - 全部使用Flash代理方式
     * @param  {Number}   模式
     * @param  {Boolean}  是否文件上传
     * @param  {Object}   构造配置参数
     * @return {_$$Proxy} 代理实例
     */
    _p.__getProxyByMode = function(_mode,_upload,_options){
        var _map = !!_upload 
                 ? {2:_t3._$$UploadProxy}
                 : {2:_t2._$$FrameProxy,3:_t1._$$FlashProxy};
        return (_map[_mode]||_t0._$$XHRProxy)._$allocate(_options);
    };
    
    return _p;
});
