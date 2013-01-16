/**
 * 过滤webkit的富文本内容
 * 目前不做word内容的过滤，内容不多
 */
var f = function(){
     var _  = NEJ.P,
        _p = _('nej.p'),
        _e = _('nej.e'),
        _h = _('nej.h');
    if(_p._$NOT_PATCH.webkit) return;
    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi;
    
    /**
     * 验证webkit下内容是否来自Word
     * @param  {String} _html 内容
     * @return {Boolean}      FF下内容是否来自Word
     */
    var __isFromWord = function(_html){
        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0
    };
    
    /**
     * webkit清除word过来的冗余内容
     * @param  {String} _html 内容
     * @return {String} 过滤后的内容
     */
    _h.__filterWordContent = function(_html){
        if(!__isFromWord(_html))
            return _html;
        return _html.replace(__reg_nwrd,'');
    };
};
define('{lib}patched/webkit/editor.js',
      ['{lib}patched/editor.js'],f);