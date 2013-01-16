var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.presto) return;
    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi,
        __opspc = '';
    /**
     * 执行编辑命令
     * @param  {Node}   _document 文档对象
     * @param  {String} _command  命令名称
     * @param  {String} _value    命令值
     * @return {Void}
     */
    _h.__execCommand = 
    _h.__execCommand._$aop(function(_event){
        var _args = _event.args;
        if (_args[1]=='hiliteColor')
            _args[1] = 'backColor';
    });
    
    /**
     * 验证presto下内容是否来自Word
     * @param  {String} _html 内容
     * @return {Boolean}      presto下内容是否来自Word
     */
    var __isFromWord = function(_html){
        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0
    };
    
    /**
     * presto清除word过来的冗余内容
     * @param  {String} _html 内容
     * @return {String} 过滤后的内容
     */
    _h.__filterWordContent = function(_html){
        if(!__isFromWord(_html))
            return _html;
        return _html.replace(__reg_nwrd,'');
    };
    
    /**
     * presto特殊过滤
     * @param {Object} _html
     */
    _h.__filterContentPath = function(_html){
        return _html.replace(__opspc,'&nbsp;');
    }
};
define('{lib}patched/presto/editor.js',
      ['{lib}patched/editor.js'],f);