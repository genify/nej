/**
 * ------------------------------------------
 * API增强实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _h = _('nej.h');
    /*
     * 判断是否有内置的样式操作接口
     * @return {Boolean} 是否有内置的样式操作接口
     */
    var __hasClassMethod = (function(){
        var _test = !!document.body.classList;
        return function(){
            return _test;
        };
    })();
    /*
     * 取匹配类名的正则表达式
     * @param  {String} _class 样式列表
     * @return {RegExp}        正则表达式
     */
    var __getClassRegExp = (function(){
        var _reg = /\s+/g;
        return function(_class){
            _class = (_class||'').trim();
            return !_class ? null
                           : new RegExp('(\\s|^)(?:'+_class.
                             replace(_reg,'|')+')(?=\\s|$)','g');
        };
    })();
    /**
     * 替换节点的样式类名称，多个样式用空格分隔
     * @param  {String|Node} _element 要操作的节点ID或者节点对象
     * @param  {String}      _del     要删除的样式类名称
     * @param  {String}      _add     要新增的样式类名称
     * @return {Void}
     */
    _h.__replaceClassName =  
    _h.__replaceClassName._$aop(function(_event){
        if (__hasClassMethod()) return;
        _event.stopped = !0;
        var _args = _event.args,
            _element = _e._$get(_args[0]);
        if (!_element||
           (!_args[1]&&!_args[2])) return;
        var _class = _element.className||'';
        // replace class
        var _add = ' '+(_args[2]||''),
            _del = __getClassRegExp((_args[1]||'')+_add);
        !!_del&&(_class=_class.replace(_del,'$1'));
        _element.className = (_class+_add).replace(/\s+/g,' ').trim();
    });
    /**
     * 新增样式类，多个样式用空格分开
     * @param  {String|Node} _element 要操作的节点ID或者节点对象
     * @param  {String}      _add     要新增的样式类名称
     * @return {Void}
     */
    _h.__addClassName = 
    _h.__addClassName._$aop(function(_event){
        if (__hasClassMethod()) return;
        _event.stopped = !0;
        var _args = _event.args;
        _h.__replaceClassName(_args[0],'',_args[1]);
    });
    /**
     * 删除样式类，多个样式用空格分开
     * @param  {String|Node} _element 要操作的节点ID或者节点对象
     * @param  {String}      _del     要删除的样式类名称
     * @return {Void}
     */
    _h.__delClassName = 
    _h.__delClassName._$aop(function(_event){
        if (__hasClassMethod()) return;
        _event.stopped = !0;
        var _args = _event.args;
        _h.__replaceClassName(_args[0],_args[1],'');
    });
    /**
     * 检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含
     * @param  {String|Node} _element 节点ID或者对象
     * @param  {String}      _class   样式串
     * @return {Boolean}              是否含指定样式
     */
    _h.__hasClassName = 
    _h.__hasClassName._$aop(function(_event){
        if (__hasClassMethod()) return;
        _event.stopped = !0;
        var _args = _event.args,
            _element = _e._$get(_args[0]);
        if (!_element){
            _event.value = !1;
            return;
        }
        var _reg = __getClassRegExp(_args[1]);
        _event.value = !_reg?!1:_reg.test(
                        _element.className||'');
    });
};
define('{lib}patched/com/api.js',
      ['{lib}patched/api.js'],f);