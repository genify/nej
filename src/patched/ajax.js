/**
 * ------------------------------------------
 * AJAX相关平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _h = _('nej.h'),
        _p = _('nej.ut.j');
    /**
     * 取XHR对象
     * @return {XMLHttpRequest} XHR对象
     */
    _h.__getXMLHttpRequest = function(){
        return new XMLHttpRequest();
    };
    /**
     * 根据模式返回代理实例，模式说明
     * 0 - 自动模式，高版本使用HTML5的CORS协议，低版本采用Frame代理方式
     * 1 - 高版本使用HTML5的CORS协议，普通请求低版本采用Flash代理方式
     * 2 - 全部使用Frame代理方式
     * 3 - 全部使用Flash代理方式
     * @param  {Number}  模式
     * @param  {Boolean} 是否文件上传
     * @param  {Object}  构造配置参数
     * @return {nej.ut.j._$$Proxy} 代理实例
     */
    _h.__getProxyByMode = function(_mode,_upload,_options){
        var _map = !!_upload 
                 ? {2:_p._$$UploadProxy}
                 : {2:_p._$$FrameProxy,3:_p._$$FlashProxy};
        return (_map[_mode]||_p._$$XHRProxy)._$allocate(_options);
    };
};
NEJ.define('{lib}patched/ajax.js',
      ['{lib}base/platform.js'
      ,'{lib}base/constant.js'
      ,'{lib}util/ajax/proxy/xhr.js'
      ,'{lib}util/ajax/proxy/flash.js'
      ,'{lib}util/ajax/proxy/frame.js'
      ,'{lib}util/ajax/proxy/upload.js'],f);