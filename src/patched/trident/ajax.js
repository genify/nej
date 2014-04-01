/**
 * ------------------------------------------
 * Trident引擎(ie7-9)对AJAX增强实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident) return;
    /**
     * 取XHR对象
     * @return {XMLHttpRequest} XHR对象
     */
    _h.__getXMLHttpRequest = (function(){
        // http://blogs.msdn.com/b/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
        var _msxml = ['Msxml2.XMLHTTP.6.0'
                     ,'Msxml2.XMLHTTP.3.0'
                     ,'Msxml2.XMLHTTP.4.0'
                     ,'Msxml2.XMLHTTP.5.0'
                     ,'MSXML2.XMLHTTP'
                     ,'Microsoft.XMLHTTP'];
        var _getXHR = function(){
            for(var i=0,l=_msxml.length;i<l;i++){
                try{
                    return new ActiveXObject(_msxml[i]);
                }catch(e){
                    // ignore exception
                }
            }
            return null;
        };
        return _h.__getXMLHttpRequest._$aop(
               function(_event){
                   if (!!window.XMLHttpRequest) return;
                   _event.stopped = !0;
                   _event.value = _getXHR();
               });
    })();
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
    _h.__getProxyByMode = (function(){
        var _pmap = {0:2,1:3};
        return _h.__getProxyByMode._$aop(
               function(_event){
                   var _args = _event.args,
                       _mode = _args[0]||0;
                   _args[0] = !!_args[1]?2
                            : _pmap[_mode]||_mode;
               });
    })();
};
NEJ.define(
    '{lib}patched/trident/ajax.js',[
    '{lib}patched/ajax.js',
    '{patch}json.js'
],f);