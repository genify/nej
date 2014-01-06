var f = function(){
    var _  = NEJ.P,
        _u = _('nej.u'),
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
    /**
     * 插入html命令处理
     * @param {Object} _document 文档对象
     * @param {Object} _html
     */
    _h.__insertHtml = 
    _h.__insertHtml._$aop(function(_event){
        // inserthtml for ie11
        if (_p._$KERNEL.release>='7.0'){
            _event.stopped = !0;
            var _args = _event.args,
                _doc = _args[0],
                _win = _h.__getWindow(_doc),
                _range = _h.__getRange(_win);
            var _node = _doc.createElement('div'),
                _last;
            _node.innerHTML = _args[1];
            // insert content
            _range.deleteContents();
            _u._$reverseEach(
                _node.childNodes,
                function(_elm){
                    _range.insertNode(_elm);
                    if (!_last) _last = _elm;
                }
            );
            // set focus
            var _selection = _h.__getSelection(_win);
            _selection.collapseToEnd();
            _win.focus();
        }
    });
};
NEJ.define(
    '{lib}patched/trident-1/editor.js',[
    '{lib}patched/com/editor.td.js'
],f);