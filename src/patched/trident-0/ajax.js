/**
 * ------------------------------------------
 * Trident引擎(ie6)对AJAX增强实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident0) return;
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
};
define('{lib}patched/trident-0/ajax.js',
      ['{lib}patched/ajax.js'],f);