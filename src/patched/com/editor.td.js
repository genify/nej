/**
 * ------------------------------------------
 * 富文本编辑器接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _e = _('nej.e'),
        _h = _('nej.h'),
        _rcache = {};  // range cache
    if (_p._$KERNEL.engine!='trident') return;
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
        if (_args[1]=='styleWithCSS'){
            _event.stopped = !0;
            return;
        }
        _h.__focusRange(_args[0].body);
        if (_args[1]=='hiliteColor')
            _args[1] = 'backColor';
    });
    /**
     * 保存当前选择状态
     * @param  {Node} _node 节点
     * @return {Void}
     */
    _h.__saveRange = 
    _h.__saveRange._$aop(function(_event){
        if (!!document.selection){
            _event.stopped = !0;
            var _node = _event.args[0],
                _doc = _h.__getDocument(_node),
                _id = _e._$id(_doc);
            _rcache[_id] = _doc.selection.createRange();
        }
    });
    /**
     * 聚焦至选中区域
     * @param  {Node} _node 节点
     * @return {Void}
     */
    _h.__focusRange = 
    _h.__focusRange._$aop(null,function(_event){
        var _id = _e._$id(_h.
                  __getDocument(
                  _event.args[0])),
            _range = _rcache[_id];
        if (!!_range){
            _range.select();
            delete _rcache[_id];
        }
    });
    /**
     * 清除选择状态
     * @param  {Node} _node 节点
     * @return {Void}
     */
    _h.__clearRange = 
    _h.__clearRange._$aop(null,function(_event){
        var _id = _e._$id(_h.
                  __getDocument(
                  _event.args[0]));
        delete _rcache[_id];
    });
};
NEJ.define('{lib}patched/com/editor.td.js',
      ['{lib}patched/editor.js'],f);