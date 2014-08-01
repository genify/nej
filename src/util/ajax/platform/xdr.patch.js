/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './xdr.js'
],function(_h,_p,_o,_f,_r){
    // for ie9-
    NEJ.patch('TR<=5.0',function(){
        /**
         * 根据模式返回代理实例，模式说明
         * 0 - 自动模式，高版本使用HTML5的CORS协议，低版本采用Frame代理方式
         * 1 - 高版本使用HTML5的CORS协议，普通请求低版本采用Flash代理方式
         * 2 - 全部使用Frame代理方式
         * 3 - 全部使用Flash代理方式
         * @param  {Number}  模式
         * @param  {Boolean} 是否文件上传
         * @param  {Object}  构造配置参数
         * @return {_$$Proxy} 代理实例
         */
        _h.__getProxyByMode = (function(){
            var _pmap = {0:2,1:3};
            return _h.__getProxyByMode._$aop(function(_event){
               var _args = _event.args,
                   _mode = _args[0]||0;
               _args[0] = !!_args[1] ? 2 :
                          _pmap[_mode]||_mode;
            });
        })();
    });
    
    return _h;
});
