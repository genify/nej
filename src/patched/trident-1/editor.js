var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident1) return;
    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi;
    
    /**
     * 验证trident1下内容是否来自Word
     * @param  {String} _html 内容
     * @return {Boolean}      FF下内容是否来自Word
     */
    var __isFromWord = function(_html){
        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0;
    };
    
    /**
     * trident1清除word过来的冗余内容
     * @param  {String} _html 内容
     * @return {String} 过滤后的内容
     */
    _h.__filterWordContent = function(_html){
        if(!__isFromWord(_html))
            return _html;
        return _html.replace(__reg_nwrd,'');
    };
};
NEJ.define('{lib}patched/trident-1/editor.js',
      ['{lib}patched/com/editor.td.js'],f);