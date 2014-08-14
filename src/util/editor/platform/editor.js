/**
 * ------------------------------------------
 * 富文本编辑器接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/element.js'
],function(_e,_p,_o,_f,_r){
    var __empty    = /(?:<(p|div)>(?:\&nbsp\;|<br\/?>)<\/\1>|<br\/?>|\&nbsp\;|\s)+$/gi, // empty content
        __reg_cls0 = /(?:class|lang)="(mso)?[^"]*"/gi,
        __reg_cls1 = /(?:class|lang)='(mso)?[^']*'/gi,
        __reg_cls2 = /(?:class|lang)=(mso)?[^>\s]*/gi,// IE7/8 hack
        __reg_ccm  = /(?:<!--)[^>]*(?:-->)/gi,
        __reg_st0  = /(?:<[^>]* style)="([^"]*)"/i,
        __reg_st1  = /(?:<[^>]* style)='([^']*)'/i,
        __reg_st2  = /(?:<[^>]* style)=([^>\s]*)/i,
        __reg_bgc  = /(?:background-color:|text-align:|color:)([^;]*)(;)*/gi;//clear class,lang
    /**
     * 取节点所在的窗体对象
     * @param  {Node} _node 节点
     * @return {Window}     窗体
     */
    _p.__getWindow = function(_node){
        var _document = _p.__getDocument(_node);
        return _document.defaultView||_document.parentWindow||_document.window||_document;
    };
    /**
     * 取节点关联的文档对象
     * @param  {Node} _node 节点
     * @return {Document}   文档对象
     */
    _p.__getDocument = function(_node){
        return _node.ownerDocument||_node;
    };
    /**
     * 取选择区对象
     * @param  {Window} _window 窗体对象
     * @return {DOMSelection}   选择区对象
     */
    _p.__getSelection = function(_window){
        if (!!_window.getSelection)
            return _window.getSelection();
        var _document = _window.document;
        if (!!_document.getSelection)
            return _document.getSelection();
        if (!!_document.selection)
            return _document.selection;
        return null;
    };
    /**
     * 取选择区范围操作对象
     * @param  {Window} _window 窗体对象
     * @return {Range}          范围操作对象
     */
    _p.__getRange = function(_window){
        _window = _p.__getWindow(_window);
        var _selection = _p.__getSelection(_window);
        if (!_selection)
            return null;
        if (!!_selection.getRangeAt)
            return _selection.getRangeAt(0);
        if (!!_selection.createRange)
            return _selection.createRange();
        return null;
    };
    /**
     * 获取选中内容的文本
     * @return {String} 文本内容
     */
    _p.__getSelectText = function(_document){
        var _range = this.__getRange(_document);
        if (!_range) return '';
        return _range.toString()||_range.cloneContents().textContent||_range.commonAncestorContainer.data;
    };
    /**
     * 获取选中内容的html
     * @param  {Object} _document
     * @return {String} 选中内容的html
     */
    _p.__getSelectHtml = function(_document){
        var _range = this.__getRange(_document);
        if (!_range) return '';
        var _ntmp = _e._$create('div');
        _ntmp.appendChild(_range.cloneContents());
        return _ntmp.innerHTML;
    };
    /**
     * 获取选中内容的父节点
     * @param  {Object} _document
     * @return {Node|String} 选中内容的父节点
     */
    _p.__getSelectNode = (function(){
        var _checkNodeType = function(_node){
            if (_node.nodeType == 1){
                return _node;
            }else{
                _node = _node.parentNode;
                return _checkNodeType(_node);
            }
        };
        return function(_document){
            var _range = this.__getRange(_document),
                _node = _range.commonAncestorContainer||_range.parentElement();
            if (!_range || !_node) return '';
            return _checkNodeType(_node);
        };
    })();
    /**
     * 保存当前选择状态
     * @param  {Node} _node 节点
     * @return {Range}      范围
     */
    _p.__saveRange = function(_node){
        // do nothing
    };
    /**
     * 聚焦至选中区域
     * @param  {Node} _node 节点
     * @return {Void}
     */
    _p.__focusRange = function(_node){
        _node.focus();
    };
    /**
     * 清除选择状态
     * @param  {Node} _node 节点
     * @return {Void}
     */
    _p.__clearRange = function(_node){
        // do nothing
    };
    /**
     * 移动光标至节点的指定位置
     * @param  {Node}   _node     节点
     * @param  {Number} _position 位置，0-末尾、1-起始
     * @return {Void}
     */
    _p.__moveCursorPosition = (function(){
        var _fmap = [function(_node){return _node.childNodes.length;}
                    ,function(){return 0;}];
        return function(_node,_position){
            var _func = _fmap[_position];
            if (!_func) return;
            _p.__getSelection(
            _p.__getWindow(_node))
              .collapse(_node,_func(_node));
        };
    })();
    /**
     * 执行编辑命令
     * @param  {Node}   _document 文档对象
     * @param  {String} _command  命令名称
     * @param  {String} _value    命令值
     * @return {Void}
     */
    _p.__execCommand = function(_document,_command,_value){
        if(_command == 'inserthtml'){
            this.__insertHtml(_document,_value);
            return;
        }
        _document.execCommand(_command,!1,_value);
    };

    /**
     * 插入html命令处理
     * @param {Object} _document 文档对象
     * @param {Object} _html
     */
    _p.__insertHtml = function(_document,_html){
        if (!document.selection){
            _document.execCommand('inserthtml',!1,_html);
            return;
        }
        var _range = _document.selection.createRange();
        if (!!_range.pasteHTML){_range.pasteHTML(_html);return;}
        _document.execCommand('delete',!1,null);
        _document.selection.createRange().pasteHTML(_html);
    };

    /**
     * 内容初步过滤
     * @param {Object} _html
     */
    _p.__filterContent = function(_html){
        var _html = (_html||'').replace(__empty,'').replace(__reg_cls0,'').replace(__reg_cls1,'').replace(__reg_cls2,'').replace(__reg_ccm,'');
        _html = !_p.__filterContentPath?_html:_p.__filterContentPath(_html);
        return _html;
    };

    /**
     * 过滤除了background-color以外的所有样式
     * @param  {[type]} _html [description]
     * @return {[type]}       [description]
     */
    _p.__filterContentStyle = (function(){
        var _regMap = { 0:/(?:<[^>]* style)="([^"]*)"/gi,
                        1:/(?:<[^>]* style)='([^']*)'/gi,
                        2:/(?:<[^>]* style)=([^>\s]*)/gi};
        var _doFilter = function(_reg,_html){
            _html = _html.replace(_regMap[_reg],function(_a,_b,_c){
                var _prefix = _a.split('style')[0];
                if(_b.match(__reg_bgc)!=null){
                    var _str0 = '';
                    var _bgc = _b.replace(__reg_bgc,function(_str,_sstr,_index){
                        return _str0 += _str;
                    }._$bind(this));

                    return _prefix + ' style="' + _str0 + '"';
                }else{
                    return _prefix;
                }
            }._$bind(this));
            return _html;
        };
        return function(_html){
            if(__reg_st0.test(_html)){
                _html = _doFilter(0,_html);
            }else if(__reg_st1.test(_html)){
                __reg_st1.lastIndex = -1;
                _html = _doFilter(1,_html);
            }else{
                _html = _doFilter(2,_html);
            }
            return _html;
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.h'),_p);
    }

    return _p;
});