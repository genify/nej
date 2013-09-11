/**
 * ------------------------------------------
 * Trident引擎(ie6-ie9)编辑器适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident) return;
    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi,
        __reg_cxml = /<\?xml[^>]*>/gi;
    
    /**
     * 移动光标至节点的指定位置
     * @param  {Node}   _node     节点
     * @param  {Number} _position 位置，0-末尾、1-起始
     * @return {Void}
     */
    _h.__moveCursorPosition = (function(){
        var _fmap = [function(_node){return _node.innerText.length;}
                    ,function(){return 0;}];
        return _h.__moveCursorPosition._$aop(
               function(_event){
                   var _args = _event.args,
                       _range = _h.__getRange(
                                _h.__getWindow(_args[0]));
                   if (!!_range.move){
                       _event.stopped = !0;
                       var _func = _fmap[_args[1]];
                       if (!_func) return;
                       _range.move('character',_func(_args[0]));
                       _range.select();
                   }
               });
    })();
    
    /**
     * 验证trident下内容是否来自Word
     * @param  {String} _html 内容
     * @return {Boolean}      trident下内容是否来自Word
     */
    var __isFromWord = function(_html){
        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0;
    };
    
    /**
     * trident清除word过来的冗余内容
     * @param  {String} _html 内容
     * @return {String} 过滤后的内容
     */
    _h.__filterWordContent = function(_html){
        if(!__isFromWord(_html))
            return _html;
        return _html.replace(__reg_nwrd,'').replace(__reg_cxml,'');
    };
};
NEJ.define('{lib}patched/trident/editor.js',
      ['{lib}patched/com/editor.td.js'],f);