/**
 * 过滤webkit的富文本内容
 */
var f = function(){
     var _  = NEJ.P,
        _p = _('nej.p'),
        _e = _('nej.e'),
        _h = _('nej.h');
    if(_p._$NOT_PATCH.gecko) return;
    
    /**
     * 基本内容过滤
     */
    var __ffpth = location.href.replace(/\/[^\/]*$/,'/'),// firefox relative path
        __ffurl = /(href|src)\s*=\s*("|')(?!\w+:|\/)/gi, // firefox relative path
        __empty = /(?:<(p|div)>(?:\&nbsp\;|<br\/?>)<\/\1>|<br\/?>|\&nbsp\;|\s)+$/gi; // empty content
    /**
     * word内容过滤
     */
    var // below for clear format
        __reg_flnh = /\f/g,//换页符
        __reg_flns = /\n|\r/g,//换行符或回车符
        __reg_fzag = /<(style|script).*?>.*?<\/\1>/gi,//style和script标签
        __reg_ftag = /<\/?(?:meta|link|!--\[.+?\]--|[\w]+:[\w]+).*?>/gi,
        __reg_fimg = /<img(\n|\r|\s|[^>])*?src="data:image\/png;base64[^>]*?>/gi;//FF需要干掉base64的图片数据
    
    /**
     * 验证gecko下内容是否来自Word
     * @param  {String} _html 内容
     * @return {Boolean}      gecko下内容是否来自Word
     */
    var __isFromWord = function(_html){
        return (_html||'').indexOf('<w:WordDocument>')>=0;
    };
    
    /**
     * gecko清除word过来的冗余内容
     * @param  {String} _html 内容
     * @return {String} 过滤后的内容
     */
    _h.__filterWordContent = function(_html){
        if(!__isFromWord(_html))
            return _html;
        return _html.replace(__reg_flns,'\f')
                    .replace(__reg_ftag,'')
                    .replace(__reg_fzag,'')
                    .replace(__reg_flnh,'\n')
                    .replace(__reg_fimg,'')
                    .replace(__empty,'');
    };
    
    /**
     * gecko特殊过滤
     * @param {Object} _html
     */
    _h.__filterContentPath = function(_html){
        _html = _html.replace(__reg_fimg,'');//过滤掉源数据是base64内容的图片
        return _html.replace(__ffurl,'$1=$2'+__ffpth);
    };
};
NEJ.define('{lib}patched/gecko/editor.js',
      ['{lib}patched/editor.js'],f);